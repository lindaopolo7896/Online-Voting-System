from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.elections.models import Candidate, Participant, Position
from apps.users.models import Election, Membership, Organisation, User
from apps.votes.models import Vote, VotingLink
from services.permission_service import (
    assign_election_default_permissions_to_membership,
    assign_org_default_permissions_to_membership,
)


class VoteFlowAndScopeTests(APITestCase):
    def _create_user_membership(self, *, organisation, email, role):
        user = User.objects.create_user(email=email, password='password123')
        membership = Membership.objects.create(
            organisation=organisation,
            user=user,
            role=role,
            currently_active=True,
            is_active=True,
        )
        assign_org_default_permissions_to_membership(membership.id, role)
        return user, membership

    def setUp(self):
        now = timezone.now()
        self.org_a = Organisation.objects.create(name='Votes Org A')
        self.org_b = Organisation.objects.create(name='Votes Org B')

        self.admin_a_user, self.admin_a_membership = self._create_user_membership(
            organisation=self.org_a,
            email='admin-a-votes@example.com',
            role='admin',
        )
        self.admin_b_user, self.admin_b_membership = self._create_user_membership(
            organisation=self.org_b,
            email='admin-b-votes@example.com',
            role='admin',
        )

        self.election_a = Election.objects.create(
            name='Votes Election A',
            organisation=self.org_a,
            date_time_occuring=now - timedelta(hours=1),
            date_time_ending=now + timedelta(hours=3),
        )
        self.position_a = Position.objects.create(
            name='Chairperson',
            organisation=self.org_a,
            election=self.election_a,
        )
        self.candidate_a = Candidate.objects.create(
            membership=self.admin_a_membership,
            election=self.election_a,
            position=self.position_a,
            status='active',
        )

        self.member_a_user, self.member_a_membership = self._create_user_membership(
            organisation=self.org_a,
            email='member-a-votes@example.com',
            role='member',
        )
        self.participant_a = Participant.objects.create(
            membership=self.member_a_membership,
            election=self.election_a,
            has_voted=False,
        )
        assign_election_default_permissions_to_membership(
            self.member_a_membership.id,
            self.election_a.id,
            self.member_a_membership.role,
        )

        Vote.objects.create(
            election=self.election_a,
            position=self.position_a,
            voted_for=self.candidate_a,
            vote_cast_tx_hash='0xexistinghash',
        )
        self.voting_link_a = VotingLink.objects.create(
            election=self.election_a,
            participant=self.participant_a,
            token='http://localhost:3000/vote?token=test-token-1',
            generated_by=self.admin_a_membership,
            expires_at=now + timedelta(hours=4),
            is_used=False,
        )

    def test_votes_list_is_scoped_to_active_organisation(self):
        self.client.force_authenticate(user=self.admin_b_user)
        response = self.client.get('/api/v1/votes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)

    def test_voting_links_list_is_scoped_to_active_organisation(self):
        self.client.force_authenticate(user=self.admin_b_user)
        response = self.client.get('/api/v1/voting-links/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)

    def test_my_links_requires_authentication(self):
        response = self.client.get('/api/v1/voting-links/my-links/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_my_links_returns_only_current_users_links(self):
        self.client.force_authenticate(user=self.member_a_user)
        response = self.client.get('/api/v1/voting-links/my-links/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.voting_link_a.id)

    def test_admin_can_cast_vote_with_participant_id(self):
        new_member_user, new_member_membership = self._create_user_membership(
            organisation=self.org_a,
            email='new-voter-votes@example.com',
            role='member',
        )
        participant = Participant.objects.create(
            membership=new_member_membership,
            election=self.election_a,
            has_voted=False,
        )

        self.client.force_authenticate(user=self.admin_a_user)
        payload = {
            'election_id': self.election_a.id,
            'position_id': self.position_a.id,
            'voted_for_id': self.candidate_a.id,
            'participant_id': participant.id,
        }
        response = self.client.post('/api/v1/votes/', payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        participant.refresh_from_db()
        self.assertTrue(participant.has_voted)
        self.assertTrue(str(response.data['vote_cast_tx_hash']).startswith('0x'))

    def test_member_with_vote_permission_can_cast_vote(self):
        self.client.force_authenticate(user=self.member_a_user)
        payload = {
            'election_id': self.election_a.id,
            'position_id': self.position_a.id,
            'voted_for_id': self.candidate_a.id,
            'participant_id': self.participant_a.id,
        }
        response = self.client.post('/api/v1/votes/', payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.participant_a.refresh_from_db()
        self.assertTrue(self.participant_a.has_voted)
