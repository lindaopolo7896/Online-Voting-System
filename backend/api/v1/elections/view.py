from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.elections.models import Position, Participant, Candidate
from .serializers import PositionSerializer, ParticipantSerializer, CandidateSerializer

class PositionViewSet(ModelViewSet):
    queryset = Position.objects.all()
    serializer_class = PositionSerializer

    #for  a specific position in an election, who are its candidates
    @action(detail=True, methods=['get'])
    def candidates(self, request, pk=None):
        position = self.get_object()
        candidates = Candidate.objects.filter(position=position)
        serializer = CandidateSerializer(candidates, many=True)
        return Response(serializer.data)
    
class ParticipantViewSet(ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer

    # TODO: Upload participants in bulk via CSV or Excel file

class CandidateViewSet(ModelViewSet):
    queryset = Candidate.objects.all()
    serializer_class = CandidateSerializer