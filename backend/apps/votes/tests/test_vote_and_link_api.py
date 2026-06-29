from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.elections.models import Candidate, Participant, Position
from apps.users.models import Election, Membership, Organisation, User
from apps.votes.models import Vote, VotingLink
from services.permission_service import assign_org_default_permissions_to_membership


class VoteAndVotingLinkApiTests(APITestCase):
    def _create_user_with_membership(self, *, organisation, email, role='member'):
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
        self.org_a = Organisation.objects.create(name='Org A')
        self.org_b = Organisation.objects.create(name='Org B')

        self.admin_a_user, self.admin_a_membership = self._create_user_with_membership(
            organisation=self.org_a,
            email='admin-a@example.com',
            role='admin',
        )
        self.admin_b_user, self.admin_b_membership = self._create_user_with_membership(
            organisation=self.org_b,
            email='admin-b@example.com',
            role='admin',
        )

        self.election_a = Election.objects.create(
            name='Election A',
            organisation=self.org_a,
            date_time_occuring=now - timedelta(hours=1),
            date_time_ending=now + timedelta(hours=2),
        )
        self.position_a = Position.objects.create(
            name='President',
            organisation=self.org_a,
            election=self.election_a,
        )
        self.candidate_a = Candidate.objects.create(
            membership=self.admin_a_membership,
            election=self.election_a,
            position=self.position_a,
            status='active',
        )

        self.voter_user, self.voter_membership = self._create_user_with_membership(
            organisation=self.org_a,
            email='voter-a@example.com',
            role='member',
        )
        self.participant_a = Participant.objects.create(
            membership=self.voter_membership,
            election=self.election_a,
            has_voted=False,
        )

        Vote.objects.create(
            election=self.election_a,
            position=self.position_a,
            voted_for=self.candidate_a,
            vote_cast_tx_hash='0xtesthash',
        )
        self.voting_link_a = VotingLink.objects.create(
            election=self.election_a,
            participant=self.participant_a,
            token='http://localhost:3000/vote?token=abc123',
            generated_by=self.admin_a_membership,
            expires_at=now + timedelta(hours=6),
            is_used=False,
        )

    def test_votes_list_is_scoped_to_active_organisation(self):
        self.client.force_authenticate(user=self.admin_b_user)
        response = self.client.get('/api/v1/votes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)
        self.assertEqual(len(response.data['results']), 0)

    def test_voting_links_list_is_scoped_to_active_organisation(self):
        self.client.force_authenticate(user=self.admin_b_user)
        response = self.client.get('/api/v1/voting-links/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)
        self.assertEqual(len(response.data['results']), 0)

    def test_my_links_returns_links_for_authenticated_user(self):
        self.client.force_authenticate(user=self.voter_user)
        response = self.client.get('/api/v1/voting-links/my-links/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.voting_link_a.id)

    def test_admin_can_cast_vote_with_participant_id(self):
        second_voter_user, second_voter_membership = self._create_user_with_membership(
            organisation=self.org_a,
            email='voter-b@example.com',
            role='member',
        )
        participant = Participant.objects.create(
            membership=second_voter_membership,
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
        self.assertTrue(response.data['vote_cast_tx_hash'].startswith('0x'))
