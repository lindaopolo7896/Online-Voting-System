from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action

from apps.votes.models import Vote, VotingLink
from .serializers import VoteSerializer, VotingLinkSerializer

class VoteViewSet(ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer

    #to get all votes of the logged in user
    @action(detail=False, methods=['get'])
    def my_votes(self, request):
        user = request.user
        votes = Vote.objects.filter(participant__user=user)
        serializer = self.get_serializer(votes, many=True)
        return Response(serializer.data)
    
    #to get all votes for a specific election
    @action(detail=False, methods=['post'])
    def by_election(self, request):
        election_id = request.data.get('election_id')
        votes = Vote.objects.filter(election_id=election_id)
        serializer = self.get_serializer(votes, many=True)
        return Response(serializer.data)
    
    #to get all votes for a specific candidate
    @action(detail=False, methods=['post'])
    def by_candidate(self, request):
        candidate_id = request.data.get('candidate_id')
        votes = Vote.objects.filter(voted_for_id=candidate_id)
        serializer = self.get_serializer(votes, many=True)
        return Response(serializer.data)

    #TODO: Implement blockchain integration for vote immutability

class VotingLinkViewSet(ModelViewSet):
    queryset = VotingLink.objects.all()
    serializer_class = VotingLinkSerializer

    @action(detail=False, methods=['get'])
    def my_links(self, request):
        user = request.user
        links = VotingLink.objects.filter(participant__user=user)
        serializer = self.get_serializer(links, many=True)
        return Response(serializer.data)
    
    #TODO: Implement link generation logic and security measures to prevent abuse