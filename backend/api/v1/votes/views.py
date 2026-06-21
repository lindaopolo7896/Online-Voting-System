from django.db import transaction
from rest_framework import status
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response


from apps.votes.models import Vote, VotingLink
from apps.elections.models import Participant
from .serializers import VoteSerializer, VotingLinkSerializer
from api.v1.users.permissions import HasPermission
from services.blockchain_service import anchor_vote
from services.voting_link_service import resolve_voting_link

class VoteViewSet(ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [HasPermission]
    filterset_fields = ['election_id', 'position_id', 'voted_for_id']

    ACTION_PERMISSION_MAP = {
        'list': 'view.vote',
        'retrieve': 'view.vote',
        'create': 'add.vote',
        'update': 'update.vote',
        'partial_update': 'update.vote',
        'destroy': 'delete.vote',
        'my_votes': 'view.vote',
        'by_election': 'view.vote',
        'by_candidate': 'view.vote',
    }

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        participant = serializer.validated_data.get('participant_id')
        voting_token = serializer.validated_data.get('voting_token')
        election = serializer.validated_data.get('election')
        link = None

        if participant is None and voting_token:
            link = resolve_voting_link(voting_token, election_id=election.id, require_active=True)
            if link is None:
                return Response({'detail': 'Invalid or expired voting link.'}, status=status.HTTP_400_BAD_REQUEST)
            participant = link.participant

        with transaction.atomic():
            if participant is None:
                return Response({'detail': 'participant_id or voting_token is required.'}, status=status.HTTP_400_BAD_REQUEST)
            participant = Participant.objects.select_for_update().get(id=participant.id)
            if participant.election_id != election.id:
                return Response(
                    {'detail': 'Participant does not belong to the selected election.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if participant.has_voted:
                return Response(
                    {'detail': 'This participant has already voted.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            vote = serializer.save()
            vote.vote_cast_tx_hash = anchor_vote(vote)
            vote.save(update_fields=['vote_cast_tx_hash'])
            participant.has_voted = True
            participant.save(update_fields=['has_voted'])
            if link is not None and not link.is_used:
                link.is_used = True
                link.save(update_fields=['is_used'])

        response_payload = self.get_serializer(vote).data
        response_payload['detail'] = 'Success! Your vote was anchored to the block.'
        headers = self.get_success_headers(response_payload)
        return Response(response_payload, status=status.HTTP_201_CREATED, headers=headers)
    #to get all votes for a specific election
    @action(detail=False, methods=['post'], url_path='by-election')
    def by_election(self, request):
        election_id = request.data.get('election_id')
        if not election_id:
            return Response({'detail': 'election_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        votes = Vote.objects.filter(election_id=election_id)
        serializer = self.get_serializer(votes, many=True)
        return Response(serializer.data)
    
    #to get all votes for a specific candidate
    @action(detail=False, methods=['post'], url_path='by-candidate')
    def by_candidate(self, request):
        candidate_id = request.data.get('candidate_id')
        if not candidate_id:
            return Response({'detail': 'candidate_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        votes = Vote.objects.filter(voted_for_id=candidate_id)
        serializer = self.get_serializer(votes, many=True)
        return Response(serializer.data)


class VotingLinkViewSet(ModelViewSet):
    queryset = VotingLink.objects.all()
    serializer_class = VotingLinkSerializer
    permission_classes = [HasPermission]
    filterset_fields = ['election_id', 'participant_id', 'generated_by_id', 'is_used', 'expires_at']


    ACTION_PERMISSION_MAP = {
        'list': 'view.voting_link',
        'retrieve': 'view.voting_link',
        'create': 'add.voting_link',
        'update': 'update.voting_link',
        'partial_update': 'update.voting_link',
        'destroy': 'delete.voting_link',
        'my_links': 'view.voting_link',
    }


    @action(detail=False, methods=['get'], url_path='my-links')
    def my_links(self, request):
        user = request.user
        links = VotingLink.objects.filter(participant__membership__user=user)
        serializer = self.get_serializer(links, many=True)
        return Response(serializer.data)
    

