from rest_framework import serializers
from apps.users.models import (
    Organisation,
    User,
    Membership,
    Permission,
    PermissionRecord,
    Log,
    Election,
)


class OrganisationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organisation
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    organisation_id = serializers.CharField(write_only=True, required=False)
    role = serializers.CharField(write_only=True, required=False)
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'phone',
            'bio',
            'password',
            'organisation_id',
            'role',
            'is_active',
        ]
        read_only_fields = ['id']
        extra_kwargs = {
            'password': {'write_only': True},
        }


class MembershipSerializer(serializers.ModelSerializer):
    organisation = OrganisationSerializer(read_only=True)
    organisation_id = serializers.PrimaryKeyRelatedField(
        source='organisation', queryset=Organisation.objects.all(), write_only=True
    )
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        source='user', queryset=User.objects.all(), write_only=True
    )

    class Meta:
        model = Membership
        fields = [
            'id',
            'organisation',
            'organisation_id',
            'user',
            'user_id',
            'role',
            'profile_photo',
            'created_at',
            'is_active',
        ]
        read_only_fields = ['id', 'created_at']


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ['id', 'name', 'description']
        read_only_fields = ['id']


class ElectionSerializer(serializers.ModelSerializer):
    organisation = OrganisationSerializer(read_only=True)
    organisation_id = serializers.PrimaryKeyRelatedField(
        source='organisation', queryset=Organisation.objects.all(), write_only=True
    )
    winner = MembershipSerializer(read_only=True)
    winner_id = serializers.PrimaryKeyRelatedField(
        source='winner', queryset=Membership.objects.all(), write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = Election
        fields = [
            'id',
            'name',
            'description',
            'date_time_occuring',
            'date_time_ending',
            'organisation',
            'organisation_id',
            'winner',
            'winner_id',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class PermissionRecordSerializer(serializers.ModelSerializer):
    membership = MembershipSerializer(read_only=True)
    membership_id = serializers.PrimaryKeyRelatedField(
        source='membership', queryset=Membership.objects.all(), write_only=True
    )
    permission = PermissionSerializer(read_only=True)
    permission_id = serializers.PrimaryKeyRelatedField(
        source='permission', queryset=Permission.objects.all(), write_only=True
    )
    election = ElectionSerializer(read_only=True)
    election_id = serializers.PrimaryKeyRelatedField(
        source='election', queryset=Election.objects.all(), write_only=True
    )

    class Meta:
        model = PermissionRecord
        fields = [
            'id',
            'membership',
            'membership_id',
            'permission',
            'permission_id',
            'election',
            'election_id',
            'assigned_at',
        ]
        read_only_fields = ['id', 'assigned_at']


class LogSerializer(serializers.ModelSerializer):
    membership = MembershipSerializer(read_only=True)
    membership_id = serializers.PrimaryKeyRelatedField(
        source='membership', queryset=Membership.objects.all(), write_only=True
    )
    election = ElectionSerializer(read_only=True)
    election_id = serializers.PrimaryKeyRelatedField(
        source='election', queryset=Election.objects.all(), write_only=True
    )
    action = PermissionSerializer(read_only=True)
    action_id = serializers.PrimaryKeyRelatedField(
        source='action', queryset=Permission.objects.all(), write_only=True
    )

    class Meta:
        model = Log
        fields = [
            'id',
            'membership',
            'membership_id',
            'election',
            'election_id',
            'action',
            'action_id',
            'timestamp',
        ]
        read_only_fields = ['id', 'timestamp']
