from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response

from apps.users.models import Election, Log, Organisation, Permission, PermissionRecord, User, Membership
from .serializers import ElectionSerializer, LogSerializer, OrganisationSerializer, PermissionRecordSerializer, PermissionSerializer, UserSerializer, MembershipSerializer


class OrganisationViewSet(ModelViewSet):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer

    @action(detail=False, methods=['get'])
    def my_organisations(self, request):
        organisations = Organisation.objects.filter(memberships__user=request.user)
        serializer = self.get_serializer(organisations, many=True)
        return Response(serializer.data)

class UserViewset(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    #when a user is created we create a membership as well
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        user.set_password(request.data['password'])
        user.save()

        if not request.data.get('organisation_id') or not request.data.get('role'):
            return Response({'error': 'Organisation and role are required to create a user.'}, status=400)
        
        Membership.objects.create(
            user=user,
            organisation_id=request.data['organisation_id'],
            role=request.data['role']
        )

        return Response(serializer.data)
    
    #when we delete we make sure its a soft delete for the user and all their memberships
    def delete(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = False
        user.save()

        memberships = user.memberships.all()
        for membership in memberships:
            membership.is_active = False
            membership.save()
        return Response(status=204)


class MembershipViewset(ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer

    @action(detail=False, methods=['get'])
    def my_memberships(self, request):
        memberships = Membership.objects.filter(user=request.user)
        serializer = self.get_serializer(memberships, many=True)
        return Response(serializer.data)
    
class PermissionViewset(ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer

class PermissionRecordViewset(ModelViewSet):
    queryset = PermissionRecord.objects.all()
    serializer_class = PermissionRecordSerializer

    @action(detail=False, methods=['get'])
    def my_permissions(self, request):
        permissions = PermissionRecord.objects.filter(membership__user=request.user)
        serializer = self.get_serializer(permissions, many=True)
        return Response(serializer.data)
    
    #TODO
    # @action(detail=False, methods=['get'])
    # def bulk_assign(self, request):


class ElectionViewset(ModelViewSet):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer

    @action(detail=False, methods=['get'])
    def my_elections(self, request):
        elections = Election.objects.filter(organisation__memberships__user=request.user)
        serializer = self.get_serializer(elections, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def positions(self, request, pk=None):
        election = self.get_object()
        positions = election.positions.all()
        serializer = PositionSerializer(positions, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def participants(self, request, pk=None):
        election = self.get_object()
        participants = election.participants.all()
        serializer = ParticipantSerializer(participants, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def candidates(self, request, pk=None):
        election = self.get_object()
        candidates = election.candidates.all()
        serializer = CandidateSerializer(candidates, many=True)
        return Response(serializer.data)


class LogViewset(ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer

    @action(detail=False, methods=['get'])
    def my_logs(self, request):
        logs = Log.objects.filter(membership__user=request.user)
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)
