from rest_framework import status
from rest_framework.test import APITestCase

from apps.users.models import Membership, User


class UserRegistrationTests(APITestCase):
    def test_user_cannot_register_two_organisations_with_same_email(self):
        payload = {
            'organisation_name': 'First Org',
            'email': 'founder@example.com',
            'first_name': 'Found',
            'last_name': 'Er',
        }
        first_response = self.client.post('/api/v1/organisations/register-org/', payload, format='json')
        self.assertEqual(first_response.status_code, status.HTTP_201_CREATED)

        second_payload = {
            'organisation_name': 'Second Org',
            'email': 'founder@example.com',
            'first_name': 'Found',
            'last_name': 'Er',
        }
        second_response = self.client.post('/api/v1/organisations/register-org/', second_payload, format='json')
        self.assertEqual(second_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(second_response.data['detail'], 'A user with this email already exists.')

        user = User.objects.get(email='founder@example.com')
        self.assertEqual(Membership.objects.filter(user=user).count(), 1)

    def test_register_org_creates_admin_membership_and_verification_state(self):
        payload = {
            'organisation_name': 'School Council',
            'email': 'admin@example.com',
            'first_name': 'School',
            'last_name': 'Admin',
        }
        response = self.client.post('/api/v1/organisations/register-org/', payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['verification_sent'])

        user = User.objects.get(email='admin@example.com')
        membership = Membership.objects.get(user=user)
        self.assertEqual(membership.role, 'admin')
        self.assertFalse(user.is_verified)
