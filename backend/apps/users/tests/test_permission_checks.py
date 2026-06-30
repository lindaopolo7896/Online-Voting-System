from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from apps.users.models import Membership, Organisation, PermissionRecord, User
from services.permission_service import (
    assign_org_default_permissions_to_membership,
    check_membership_permission,
)


class PermissionCheckUnitTests(TestCase):
    def setUp(self):
        self.organisation = Organisation.objects.create(name='Permissions Org')
        self.user = User.objects.create_user(email='permission-unit@example.com', password='password123')
        self.membership = Membership.objects.create(
            organisation=self.organisation,
            user=self.user,
            role='member',
            currently_active=True,
            is_active=True,
        )

    def test_permission_check_uses_exact_codename_no_legacy_alias(self):
        PermissionRecord.objects.create(
            membership=self.membership,
            codename='add.membership',
            election=None,
        )
        self.assertFalse(check_membership_permission(self.membership, 'org.members.manage'))


class PermissionCheckApiTests(APITestCase):
    def _create_user_with_membership(self, *, email, role):
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
        self.organisation = Organisation.objects.create(name='School')
        self.admin_user, self.admin_membership = self._create_user_with_membership(
            email='admin-perm@example.com',
            role='admin',
        )
        self.official_user, self.official_membership = self._create_user_with_membership(
            email='official-perm@example.com',
            role='official',
        )
        self.member_user, self.member_membership = self._create_user_with_membership(
            email='member-perm@example.com',
            role='member',
        )

    def test_official_can_manage_memberships(self):
        self.client.force_authenticate(user=self.official_user)
        payload = {
            'first_name': 'New',
            'last_name': 'User',
            'email': 'created-by-official@example.com',
            'password': 'password123',
            'organisation_id': self.organisation.id,
            'role': 'member',
            'is_active': True,
        }
        response = self.client.post('/api/v1/memberships/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_member_cannot_manage_memberships(self):
        self.client.force_authenticate(user=self.member_user)
        payload = {
            'first_name': 'Blocked',
            'last_name': 'User',
            'email': 'blocked-user@example.com',
            'password': 'password123',
            'organisation_id': self.organisation.id,
            'role': 'member',
            'is_active': True,
        }
        response = self.client.post('/api/v1/memberships/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_only_admin_can_manage_permission_records(self):
        self.client.force_authenticate(user=self.official_user)
        official_response = self.client.post(
            '/api/v1/permission-records/bulk-assign/',
            {
                'type': 'organisation',
                'membership_id': self.member_membership.id,
                'permissions': ['org.members.manage'],
            },
            format='json',
        )
        self.assertEqual(official_response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin_user)
        admin_response = self.client.post(
            '/api/v1/permission-records/bulk-assign/',
            {
                'type': 'organisation',
                'membership_id': self.member_membership.id,
                'permissions': ['org.members.manage'],
            },
            format='json',
        )
        self.assertEqual(admin_response.status_code, status.HTTP_200_OK)
        self.assertTrue(
            PermissionRecord.objects.filter(
                membership=self.member_membership,
                codename='org.members.manage',
                election__isnull=True,
            ).exists()
        )
