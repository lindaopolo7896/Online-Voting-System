from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from apps.users.models import Election, Log, Organisation, Permission, PermissionRecord, User, Membership
from services.permission_service import assign_election_bulk_permissions_to_membership, assign_org_bulk_permissions_to_membership, revoke_org_bulk_permissions_from_membership, revoke_election_bulk_permissions_from_membership, get_all_permissions_for_membership
from .serializers import ElectionSerializer, LogSerializer, OrganisationSerializer, PermissionRecordSerializer, PermissionSerializer, UserSerializer, MembershipSerializer, UserMembershipCreateSerializer
from .permissions import HasPermission, DenyAll
from services.membership_service import get_user_active_membership, get_user_active_organisation





class OrganisationViewSet(ModelViewSet):
    queryset = Organisation.objects.all()
    serializer_class = OrganisationSerializer
    permission_classes = [HasPermission]

    ACTION_PERMISSION_MAP = {
        'create': 'add.organisation',
        'list': 'view.organisation',
        'retrieve': 'view.organisation',
        'update': 'update.organisation',
        'partial_update': 'update.organisation',
        'destroy': 'delete.organisation',
    }

    #in this case we want to fetch organisations a person is a member of
    def get_queryset(self):
        user = self.request.user
        
        return Organisation.objects.filter(memberships__user=user)

#we will come back to this as membership is what we are looking at exactly
class UserViewset(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [HasPermission]

    ACTION_PERMISSION_MAP = {
        'create': 'add.membership',
        'list': 'view.membership',
        'retrieve': 'view.membership',
        'update': 'update.membership',
        'partial_update': 'update.membership',
        'destroy': 'delete.membership',
    }

    #we want to scope to the users in the current membership organisation
    def get_queryset(self):
        user = self.request.user
        
        organisation = get_user_active_organisation(user.id)
        
        return User.objects.filter(memberships__organisation=organisation)
    
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
    permission_classes = [HasPermission]
    
    # we want to scope it to the current organisation
    def get_queryset(self):
        user = self.request.user
        organisation = get_user_active_organisation(user.id)

        #only admin can see all memberships, others can only see their own membership in the organisation
        if user.role == 'admin':
            return Membership.objects.filter(organisation=organisation)
        return Membership.objects.filter(organisation=organisation, user=user)
    
    def create(self, request, *args, **kwargs):
        serializer = UserMembershipCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user, created = User.objects.get_or_create(
            email=serializer.validated_data['email'],
            defaults={
                'first_name': serializer.validated_data.get('first_name', ''),
                'last_name': serializer.validated_data.get('last_name', ''),
                'phone': serializer.validated_data.get('phone', ''),
                'bio': serializer.validated_data.get('bio', ''),
                'password': serializer.validated_data.get('password', ''),
            }
        )
        membership = Membership.objects.create(
            user=user,
            organisation=serializer.validated_data['organisation'],
            role=serializer.validated_data['role']
        )
        response_serializer = MembershipSerializer(membership)
        return Response(response_serializer.data, status=201)
    
    def delete(self, request, *args, **kwargs):
        membership = self.get_object()
        membership.is_active = False
        membership.save()
        return Response(status=204)

    ACTION_PERMISSION_MAP = {
        'create': 'add.membership',
        'list': 'view.membership',
        'retrieve': 'view.membership',
        'update': 'update.membership',
        'partial_update': 'update.membership',
        'destroy': 'delete.membership',
        'my_memberships': 'view.membership',
    }


    @action(detail=False, methods=['get'])
    def my_memberships(self, request):
        memberships = Membership.objects.filter(user=request.user)
        serializer = self.get_serializer(memberships, many=True)
        return Response(serializer.data)
    
class PermissionViewset(ModelViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    permission_classes = [DenyAll] #permissions are managed by us, not exposed to be managed by users

class PermissionRecordViewset(ModelViewSet):
    queryset = PermissionRecord.objects.all()
    serializer_class = PermissionRecordSerializer
    permission_classes = [HasPermission]


    ACTION_PERMISSION_MAP = {
        'bulk_assign': 'add.permissionrecord',
        'bulk_unassign': 'delete.permissionrecord',
        'get_membership_permissions': 'view.permissionrecord',
    }
    
    @action(detail=False, methods=['get'])
    def bulk_assign(self, request):
        type = request.data.get('type')
        membership_id = request.data.get('membership_id')
        permissions = request.data.get('permissions')
        election_id = request.data.get('election_id')

        if type == "organisation":
            assign_org_bulk_permissions_to_membership(membership_id, permissions)
        elif type == "election":
            assign_election_bulk_permissions_to_membership(membership_id, permissions, election_id)
        else:            
            return Response({'error': 'Invalid type'}, status=400)

    @action(detail=False, methods=['get'])   
    def bulk_unassign(self, request):
        type = request.data.get('type')
        membership_id = request.data.get('membership_id')
        permissions = request.data.get('permissions')
        election_id = request.data.get('election_id')

        if type == "organisation":
            revoke_org_bulk_permissions_from_membership(membership_id, permissions)
        elif type == "election":
            revoke_election_bulk_permissions_from_membership(membership_id, election_id, permissions)
        else:            
            return Response({'error': 'Invalid type'}, status=400)

    @action(detail=False, methods=['get'])
    def get_membership_permissions(self, request, membership_id):
        permissions = get_all_permissions_for_membership(membership_id)
        serializer = self.get_serializer(permissions, many=True)
        return Response(serializer.data)

class ElectionViewset(ModelViewSet):
    queryset = Election.objects.all()
    serializer_class = ElectionSerializer
    permission_classes = [HasPermission]

    ACTION_PERMISSION_MAP = {
        'create': 'add.election',
        'list': 'view.election',
        'retrieve': 'view.election',
        'update': 'update.election',
        'partial_update': 'update.election',
        'destroy': 'delete.election',
        'positions': 'view.position',
        'participants': 'view.participant',
        'candidates': 'view.candidate',
    }

    def get_queryset(self):
        #we want to return elections that a member is a participant or caidate
        user = self.request.user
        membership = get_user_active_membership(user.id)
        if user.role == 'admin':
            return Election.objects.filter(organisation__memberships=membership).distinct()
        return Election.objects.filter(participants__membership=membership).distinct() | Election.objects.filter(candidates__membership=membership).distinct()
    
    #we get the positions of an election
    @action(detail=True, methods=['get'], url_path='positions')
    def positions(self, request, pk=None):
        election = self.get_object()
        positions = election.positions.all()
        serializer = PositionSerializer(positions, many=True)
        return Response(serializer.data)
    
    #get all the participants of an election
    @action(detail=True, methods=['get'], url_path='participants')
    def participants(self, request, pk=None):
        election = self.get_object()
        participants = election.participants.all()
        serializer = ParticipantSerializer(participants, many=True)
        return Response(serializer.data)
    
    #gets all the candidates of an election
    @action(detail=True, methods=['get'], url_path='candidates')
    def candidates(self, request, pk=None):
        election = self.get_object()
        candidates = election.candidates.all()
        serializer = CandidateSerializer(candidates, many=True)
        return Response(serializer.data)


class LogViewset(ModelViewSet):
    queryset = Log.objects.all()
    serializer_class = LogSerializer


    @action(detail=False, methods=['get'], url_path='membership-logs')
    def membership_logs(self, request):
        logs = Log.objects.filter(membership__user=request.user)
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='election-logs/(?P<election_id>[^/.]+)')
    def membership_logs_by_election(self, request, election_id=None):
        logs = Log.objects.filter(election_id=election_id, membership__user=request.user)
        serializer = self.get_serializer(logs, many=True)
        return Response(serializer.data)
    
