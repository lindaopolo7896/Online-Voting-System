from datetime import timedelta

from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.elections.models import Participant
from apps.users.models import Election, Membership, Organisation, User
from services.membership_service import get_user_active_membership, switch_active_membership
from services.permission_service import assign_org_default_permissions_to_membership


class MultiTenancyTests(APITestCase):
    def setUp(self):
        self.org_admin = Organisation.objects.create(name='Admin Org')
        self.org_member = Organisation.objects.create(name='Member Org')

        self.user = User.objects.create_user(email='multi@example.com', password='password123')
        self.admin_membership = Membership.objects.create(
            organisation=self.org_admin,
            user=self.user,
            role='admin',
            currently_active=True,
            is_active=True,
        )
        self.member_membership = Membership.objects.create(
            organisation=self.org_member,
            user=self.user,
            role='member',
            currently_active=False,
            is_active=True,
        )
        assign_org_default_permissions_to_membership(self.admin_membership.id, self.admin_membership.role)
        assign_org_default_permissions_to_membership(self.member_membership.id, self.member_membership.role)

        now = timezone.now()
        self.admin_election = Election.objects.create(
            name='Admin Org Election',
            organisation=self.org_admin,
            date_time_occuring=now - timedelta(hours=1),
            date_time_ending=now + timedelta(hours=2),
        )
        self.member_election = Election.objects.create(
            name='Member Org Election',
            organisation=self.org_member,
            date_time_occuring=now - timedelta(hours=1),
            date_time_ending=now + timedelta(hours=2),
        )
        Participant.objects.create(
            election=self.member_election,
            membership=self.member_membership,
        )

    def test_user_can_exist_in_two_organisations_with_different_roles(self):
        self.assertEqual(
            set(
                Membership.objects.filter(user=self.user).values_list('role', flat=True)
            ),
            {'admin', 'member'},
        )

    def test_switch_membership_endpoint_allows_switch_to_other_organisation(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            f'/api/v1/memberships/{self.member_membership.id}/switch-membership/',
            {},
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.member_membership.id)

        self.admin_membership.refresh_from_db()
        self.member_membership.refresh_from_db()
        self.assertFalse(self.admin_membership.currently_active)
        self.assertTrue(self.member_membership.currently_active)

    def test_election_listing_follows_active_membership_context(self):
        self.client.force_authenticate(user=self.user)

        first_response = self.client.get('/api/v1/elections/')
        self.assertEqual(first_response.status_code, status.HTTP_200_OK)
        first_ids = {item['id'] for item in first_response.data['results']}
        self.assertEqual(first_ids, {self.admin_election.id})

        switch_active_membership(self.user.id, self.member_membership.id)
        second_response = self.client.get('/api/v1/elections/')
        self.assertEqual(second_response.status_code, status.HTTP_200_OK)
        second_ids = {item['id'] for item in second_response.data['results']}
        self.assertEqual(second_ids, {self.member_election.id})

    def test_membership_service_switch_updates_currently_active_membership(self):
        switched = switch_active_membership(self.user.id, self.member_membership.id)
        self.assertIsNotNone(switched)
        self.assertEqual(switched.id, self.member_membership.id)
        self.assertEqual(get_user_active_membership(self.user.id).id, self.member_membership.id)
