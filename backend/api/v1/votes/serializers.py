from rest_framework import serializers
from apps.votes.models import Vote, VotingLink
from apps.users.models import Election, Membership
from api.v1.elections.serializers import ParticipantSerializer, CandidateSerializer
from api.v1.users.serializers import ElectionSerializer, MembershipSerializer


class VoteSerializer(serializers.ModelSerializer):
    election = ElectionSerializer(read_only=True)
    election_id = serializers.PrimaryKeyRelatedField(
        source='election', queryset=Election.objects.all(), write_only=True
    )
    participant = ParticipantSerializer(read_only=True)
    participant_id = serializers.PrimaryKeyRelatedField(
        source='participant', queryset=Participant.objects.all(), write_only=True
    )
    votes_for = CandidateSerializer(read_only=True)
    votes_for_id = serializers.PrimaryKeyRelatedField(
        source='votes_for', queryset=Candidate.objects.all(), write_only=True
    )

    class Meta:
        model = Vote
        fields = [
            'id',
            'election',
            'election_id',
            'participant',
            'participant_id',
            'votes_for',
            'votes_for_id',
            'timestamp',
        ]
        read_only_fields = ['id', 'timestamp']


class VotingLinkSerializer(serializers.ModelSerializer):
    election = ElectionSerializer(read_only=True)
    election_id = serializers.PrimaryKeyRelatedField(
        source='election', queryset=Election.objects.all(), write_only=True
    )
    participant = ParticipantSerializer(read_only=True)
    participant_id = serializers.PrimaryKeyRelatedField(
        source='participant', queryset=Participant.objects.all(), write_only=True
    )
    generated_by = MembershipSerializer(read_only=True)
    generated_by_id = serializers.PrimaryKeyRelatedField(
        source='generated_by', queryset=Membership.objects.all(), write_only=True, required=False, allow_null=True
    )

    class Meta:
        model = VotingLink
        fields = [
            'id',
            'election',
            'election_id',
            'participant',
            'participant_id',
            'link',
            'generated_by',
            'generated_by_id',
            'created_at',
            'expires_at',
            'is_used',
        ]
        read_only_fields = ['id', 'created_at']
