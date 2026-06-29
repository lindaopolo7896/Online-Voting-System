from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.elections.models import Participant
from apps.users.models import Election, Membership, Organisation, User
from services.permission_service import assign_org_default_permissions_to_membership


class ParticipantApiTests(APITestCase):
    def _create_user_with_membership(self, *, email, role='member'):
        user = User.objects.create_user(email=email, password='password123')
        membership = Membership.objects.create(
            organisation=self.organisation,
            user=user,
            role=role,
            currently_active=True,
            is_active=True,
        )
        assign_org_default_permissions_to_membership(membership.id, role)
        return user, membership

    def setUp(self):
        self.organisation = Organisation.objects.create(name='Election Org')
        now = timezone.now()
        self.election = Election.objects.create(
            name='Union Election',
            organisation=self.organisation,
            date_time_occuring=now,
            date_time_ending=now + timedelta(hours=3),
        )
        self.admin_user, self.admin_membership = self._create_user_with_membership(
            email='admin-election@example.com',
            role='admin',
        )
        self.member_user, self.member_membership = self._create_user_with_membership(
            email='member-election@example.com',
            role='member',
        )

    def test_participant_create_rejects_non_object_payload(self):
        self.client.force_authenticate(user=self.admin_user)
        path = f'/api/v1/elections/{self.election.id}/participants/'
        response = self.client.post(path, data=1, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['detail'], 'Request body must be a JSON object.')

    def test_participant_list_requires_authentication(self):
        path = f'/api/v1/elections/{self.election.id}/participants/'
        response = self.client.get(path)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_participant_list_allows_authenticated_user(self):
        Participant.objects.create(election=self.election, membership=self.member_membership)

        self.client.force_authenticate(user=self.member_user)
        path = f'/api/v1/elections/{self.election.id}/participants/'
        response = self.client.get(path)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        payload = response.data['results'] if isinstance(response.data, dict) else response.data
        self.assertEqual(len(payload), 1)
