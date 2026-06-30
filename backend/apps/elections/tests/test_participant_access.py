from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.elections.models import Participant
from apps.users.models import Election, Membership, Organisation, User
from services.permission_service import assign_org_default_permissions_to_membership


class ParticipantAccessTests(APITestCase):
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
        self.org_a = Organisation.objects.create(name='Participants Org A')
        self.org_b = Organisation.objects.create(name='Participants Org B')

        self.admin_a_user, self.admin_a_membership = self._create_user_membership(
            organisation=self.org_a,
            email='admin-a-participants@example.com',
            role='admin',
        )
        self.member_b_user, self.member_b_membership = self._create_user_membership(
            organisation=self.org_b,
            email='member-b-participants@example.com',
            role='member',
        )

        self.election_a = Election.objects.create(
            name='Participants Election A',
            organisation=self.org_a,
            date_time_occuring=now - timedelta(hours=1),
            date_time_ending=now + timedelta(hours=2),
        )
        Participant.objects.create(
            election=self.election_a,
            membership=self.admin_a_membership,
        )

    def test_participants_list_requires_authentication(self):
        response = self.client.get(f'/api/v1/elections/{self.election_a.id}/participants/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_participants_list_is_scoped_by_active_organisation(self):
        self.client.force_authenticate(user=self.member_b_user)
        response = self.client.get(f'/api/v1/elections/{self.election_a.id}/participants/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 0)

    def test_participants_list_returns_data_for_same_organisation(self):
        self.client.force_authenticate(user=self.admin_a_user)
        response = self.client.get(f'/api/v1/elections/{self.election_a.id}/participants/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_participant_create_rejects_non_object_payload(self):
        self.client.force_authenticate(user=self.admin_a_user)
        response = self.client.post(
            f'/api/v1/elections/{self.election_a.id}/participants/',
            data=1,
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Request body must be a JSON object.')
