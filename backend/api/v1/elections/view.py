from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.elections.models import Position, Participant, Candidate
from backend.api.v1.users.permissions import HasPermission
from backend.apps.users.models import Membership, User
from .serializers import PositionSerializer, ParticipantSerializer, CandidateSerializer

class PositionViewSet(ModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer
    permission_classes = [HasPermission]

    ACTION_PERMISSION_MAP = {
        'list': 'view_position',
        'retrieve': 'view_position',
        'create': 'add_position',
        'update': 'change_position',
        'partial_update': 'change_position',
        'destroy': 'delete_position',
    }

    #scope to current election
    def get_queryset(self):
        election_id = self.kwargs.get('election_id')
        return Position.objects.filter(election_id=election_id)

    
class ParticipantViewSet(ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer
    permission_classes = [HasPermission]

    ACTION_PERMISSION_MAP = {
        'list': 'view_participant', 
        'retrieve': 'view_participant',
        'create': 'add_participant',
        'update': 'change_participant',
        'partial_update': 'change_participant',
        'destroy': 'delete_participant',
    }

    def get_queryset(self):
        election_id = self.kwargs.get('election_id')
        return Participant.objects.filter(election_id=election_id)

    def create(self, request, *args, **kwargs):
        election_id = self.kwargs.get('election_id')
        participant_data = request.data
        participant_data['election_id'] = election_id
        for participant in participant_data:
            participant['election_id'] = election_id
            user, created = User.objects.get_or_create(email=participant['email'], defaults={
                'first_name': participant.get('first_name', ''),
                'last_name': participant.get('last_name', ''),
                'password': User.objects.make_random_password(),
            })
            membership, created = Membership.objects.get_or_create(user=user, organisation_id=request.data.get('organisation_id'), defaults={
                'role': participant.get('role', 'participant'),
                'currently_active': True,
            })
            participant['membership'] = membership.id
        serializer = self.get_serializer(data=participant_data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    # TODO: Upload participants in bulk via CSV or Excel file, participant_data

class CandidateViewSet(ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer
    permission_classes = [HasPermission]

    ACTION_PERMISSION_MAP = {
        'list': 'view_candidate',
        'retrieve': 'view_candidate',
        'create': 'add_candidate',
        'update': 'change_candidate',
        'partial_update': 'change_candidate',
        'destroy': 'delete_candidate',
    }

    def get_queryset(self):
        election_id = self.kwargs.get('election_id')
        return Candidate.objects.filter(election_id=election_id)