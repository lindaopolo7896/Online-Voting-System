from rest_framework import serializers

from apps.elections.models import Position, Participant, Candidate
from apps.users.models import Organisation, Election, Membership
from api.v1.users.serializers import OrganisationSerializer, ElectionSerializer, MembershipSerializer


class PositionSerializer(serializers.ModelSerializer):
    organisation = OrganisationSerializer(read_only=True)
    organisation_id = serializers.PrimaryKeyRelatedField(
        source='organisation', queryset=Organisation.objects.all(), write_only=True
    )
    election = ElectionSerializer(read_only=True)
    election_id = serializers.PrimaryKeyRelatedField(
        source='election', queryset=Election.objects.all(), write_only=True
    )

    class Meta:
        model = Position
        fields = [
            'id',
            'name',
            'description',
            'organisation',
            'organisation_id',
            'election',
            'election_id',
            'status',
        ]
        read_only_fields = ['id']


class ParticipantSerializer(serializers.ModelSerializer):
    membership = MembershipSerializer(read_only=True)
    membership_id = serializers.PrimaryKeyRelatedField(
        source='membership', queryset=Membership.objects.all(), write_only=True
    )
    election = ElectionSerializer(read_only=True)
    election_id = serializers.PrimaryKeyRelatedField(
        source='election', queryset=Election.objects.all(), write_only=True
    )

    class Meta:
        model = Participant
        fields = [
            'id',
            'membership',
            'membership_id',
            'election',
            'election_id',
            'has_voted',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class CandidateSerializer(serializers.ModelSerializer):
    membership = MembershipSerializer(read_only=True)
    membership_id = serializers.PrimaryKeyRelatedField(
        source='membership', queryset=Membership.objects.all(), write_only=True
    )
    election = ElectionSerializer(read_only=True)
    election_id = serializers.PrimaryKeyRelatedField(
        source='election', queryset=Election.objects.all(), write_only=True
    )
    position = PositionSerializer(read_only=True)
    position_id = serializers.PrimaryKeyRelatedField(
        source='position', queryset=Position.objects.all(), write_only=True
    )

    class Meta:
        model = Candidate
        fields = [
            'id',
            'membership',
            'membership_id',
            'election',
            'election_id',
            'position',
            'position_id',
            'manifesto',
            'slogan',
            'campaign_photos',
            'status',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']
