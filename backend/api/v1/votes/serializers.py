from rest_framework import serializers
from apps.votes.models import Vote, VotingLink
from apps.elections.models import Participant, Candidate, Position
from apps.users.models import Election, Membership
from api.v1.elections.serializers import ParticipantSerializer, CandidateSerializer, PositionSerializer
from api.v1.users.serializers import ElectionSerializer, MembershipSerializer


class VoteSerializer(serializers.ModelSerializer):
    election = ElectionSerializer(read_only=True)
    election_id = serializers.PrimaryKeyRelatedField(
        source='election', queryset=Election.objects.all(), write_only=True
    )
    position = PositionSerializer(read_only=True)
    position_id = serializers.PrimaryKeyRelatedField(
        source='position', queryset=Position.objects.all(), write_only=True
    )
    participant_id = serializers.PrimaryKeyRelatedField(
        queryset=Participant.objects.all(), write_only=True, required=False
    )
    voting_token = serializers.CharField(write_only=True, required=False, allow_blank=True)
    voted_for = CandidateSerializer(read_only=True)
    voted_for_id = serializers.PrimaryKeyRelatedField(
        source='voted_for', queryset=Candidate.objects.all(), write_only=True
    )

    class Meta:
        model = Vote
        fields = [
            'id',
            'election',
            'election_id',
            'position',
            'position_id',
            'participant_id',
            'voting_token',
            'voted_for',
            'voted_for_id',
            'vote_cast_tx_hash',
            'timestamp',
        ]
        read_only_fields = ['id', 'vote_cast_tx_hash', 'timestamp']

    def validate(self, attrs):
        election = attrs.get('election')
        position = attrs.get('position')
        participant = attrs.get('participant_id')
        voting_token = str(attrs.get('voting_token') or '').strip()
        voted_for = attrs.get('voted_for')

        if self.instance is None and participant is None and not voting_token:
            raise serializers.ValidationError('Provide either participant_id or voting_token.')

        if position and election and position.election_id != election.id:
            raise serializers.ValidationError('Position must belong to the selected election.')
        if participant and election and participant.election_id != election.id:
            raise serializers.ValidationError('Participant must belong to the selected election.')
        if voted_for and election and voted_for.election_id != election.id:
            raise serializers.ValidationError('Candidate must belong to the selected election.')
        if voted_for and position and voted_for.position_id != position.id:
            raise serializers.ValidationError('Candidate must belong to the selected position.')
        if participant and participant.has_voted:
            raise serializers.ValidationError('This participant has already voted.')

        return attrs

    def create(self, validated_data):
        validated_data.pop('participant_id', None)
        validated_data.pop('voting_token', None)
        return super().create(validated_data)


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
            'token',
            'generated_by',
            'generated_by_id',
            'created_at',
            'expires_at',
            'is_used',
        ]
        read_only_fields = ['id', 'created_at']
