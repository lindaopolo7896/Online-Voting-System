from datetime import timedelta

from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.users.models import Election, Membership, Organisation, PermissionRecord, User
from services.permission_service import (
    assign_org_default_permissions_to_membership,
    check_membership_permission,
)


class PermissionAliasTests(TestCase):
    def setUp(self):
        self.organisation = Organisation.objects.create(name='Alias Org')
        self.user = User.objects.create_user(email='alias@example.com', password='password123')
        self.membership = Membership.objects.create(
            organisation=self.organisation,
            user=self.user,
            role='member',
            currently_active=True,
            is_active=True,
        )

    def test_org_members_manage_matches_legacy_add_membership_codename(self):
        PermissionRecord.objects.create(
            membership=self.membership,
            codename='add.membership',
            election=None,
        )
        self.assertTrue(check_membership_permission(self.membership, 'org.members.manage'))

    def test_election_vote_cast_matches_legacy_add_vote_codename(self):
        now = timezone.now()
        election = Election.objects.create(
            name='Alias Election',
            date_time_occuring=now,
            date_time_ending=now + timedelta(hours=1),
            organisation=self.organisation,
        )
        PermissionRecord.objects.create(
            membership=self.membership,
            codename='add.vote',
            election=election,
        )
        self.assertTrue(check_membership_permission(self.membership, 'election.vote.cast', election.id))


class OrgAndMembershipPermissionTests(APITestCase):
    def _create_user_with_membership(self, *, email, role, organisation):
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
        self.organisation = Organisation.objects.create(name='Test Org')
        self.official_user, self.official_membership = self._create_user_with_membership(
            email='official@example.com',
            role='official',
            organisation=self.organisation,
        )
        self.member_user, self.member_membership = self._create_user_with_membership(
            email='member@example.com',
            role='member',
            organisation=self.organisation,
        )

    def test_register_org_creates_admin_membership_and_verification_flow_state(self):
        payload = {
            'organisation_name': 'Fresh Org',
            'email': 'founder@example.com',
            'first_name': 'Fresh',
            'last_name': 'Founder',
        }
        response = self.client.post('/api/v1/organisations/register-org/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['verification_sent'])

        created_user = User.objects.get(email='founder@example.com')
        created_membership = Membership.objects.get(user=created_user)

        self.assertFalse(created_user.is_verified)
        self.assertEqual(created_membership.role, 'admin')
        self.assertTrue(
            created_membership.permissions.filter(codename='org.manage', election__isnull=True).exists()
        )

    def test_official_can_create_membership(self):
        self.client.force_authenticate(user=self.official_user)
        payload = {
            'first_name': 'New',
            'last_name': 'Member',
            'email': 'newmember@example.com',
            'password': 'password123',
            'organisation_id': self.organisation.id,
            'role': 'member',
            'is_active': True,
        }
        response = self.client.post('/api/v1/memberships/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            Membership.objects.filter(
                organisation=self.organisation,
                user__email='newmember@example.com',
            ).exists()
        )

    def test_member_cannot_create_membership(self):
        self.client.force_authenticate(user=self.member_user)
        payload = {
            'first_name': 'No',
            'last_name': 'Access',
            'email': 'blocked@example.com',
            'password': 'password123',
            'organisation_id': self.organisation.id,
            'role': 'member',
            'is_active': True,
        }
        response = self.client.post('/api/v1/memberships/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_authenticated_member_can_list_organisations_without_view_permission_codename(self):
        self.client.force_authenticate(user=self.member_user)
        response = self.client.get('/api/v1/organisations/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        payload = response.data['results'] if isinstance(response.data, dict) else response.data
        self.assertEqual(len(payload), 1)
        self.assertEqual(payload[0]['id'], self.organisation.id)
