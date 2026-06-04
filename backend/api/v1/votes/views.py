from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response


from apps.votes.models import Vote, VotingLink
from apps.users.models import Election
from .serializers import VoteSerializer, VotingLinkSerializer
from api.v1.users.permissions import HasPermission, DenyAll

class VoteViewSet(ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [HasPermission]

    ACTION_PERMISSION_MAP = {
        'list': 'view_vote',
        'retrieve': 'view_vote',
        'create': 'add_vote',
        'update': 'change_vote',
        'partial_update': 'change_vote',
        'destroy': 'delete_vote',
        'my_votes': 'view_vote',
        'by_election': 'view_vote',
        'by_candidate': 'view_vote',
    }
    
    #to get all votes for a specific election
    @action(detail=False, methods=['post'], url_path='by-election')
    def by_election(self, request):
        election_id = request.data.get('election_id')
        votes = Vote.objects.filter(election_id=election_id)
        serializer = self.get_serializer(votes, many=True)
        return Response(serializer.data)
    
    #to get all votes for a specific candidate
    @action(detail=False, methods=['post'], url_path='by-candidate')
    def by_candidate(self, request):
        candidate_id = request.data.get('candidate_id')
        votes = Vote.objects.filter(voted_for_id=candidate_id)
        serializer = self.get_serializer(votes, many=True)
        return Response(serializer.data)

    #TODO: Implement blockchain integration for vote immutability

class VotingLinkViewSet(ModelViewSet):
    queryset = VotingLink.objects.all()
    serializer_class = VotingLinkSerializer
    permission_classes = [HasPermission]

    def create_secure_token(self, link_id):
        import hashlib
        import time
        token_string = f"{link_id}-{time.time()}"
        return hashlib.sha256(token_string.encode()).hexdigest()

    ACTION_PERMISSION_MAP = {
        'list': 'view_votinglink',
        'retrieve': 'view_votinglink',
        'create': 'add_votinglink',
        'update': 'change_votinglink',
        'partial_update': 'change_votinglink',
        'destroy': 'delete_votinglink',
        'my_links': 'view_votinglink',
    }

    def generate_secure_link(self, election_id):
        election = Election.objects.get(id=election_id)
        participants = election.participants.get()
        for participant in participants:
            link = VotingLink.objects.create(participant=participant, election=election)
            link.token = self.create_secure_token(link.id)
            link.save()
            email = participant.user.email
            #TODO: Send email with the voting link to the participant


    @action(detail=False, methods=['get'], url_path='my-links')
    def my_links(self, request):
        user = request.user
        links = VotingLink.objects.filter(participant__user=user)
        serializer = self.get_serializer(links, many=True)
        return Response(serializer.data)
    