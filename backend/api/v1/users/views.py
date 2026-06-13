from django.db import transaction
from rest_framework.permissions import AllowAny
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from apps.users.models import Election, Log, Organisation, PermissionRecord, User, Membership, ROLE_CHOICES
from apps.elections.models import Participant
from services.permission_service import assign_election_bulk_permissions_to_membership, assign_org_bulk_permissions_to_membership, revoke_org_bulk_permissions_from_membership, revoke_election_bulk_permissions_from_membership, get_all_permissions_for_membership, assign_org_default_permissions_to_membership, assign_election_default_permissions_to_membership
from .serializers import ElectionSerializer, LogSerializer, OrganisationSerializer, PermissionRecordSerializer, UserSerializer, MembershipSerializer, UserMembershipCreateSerializer
from .permissions import HasPermission, DenyAll
from services.membership_service import get_user_active_membership, get_user_active_organisation
from services.blockchain_service import deploy_election_contract
from services.voting_link_service import create_or_refresh_voting_link, send_voting_invitation_email
from api.v1.elections.serializers import PositionSerializer, ParticipantSerializer, CandidateSerializer





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

    def get_permissions(self):
        if self.action == 'register_org':
            return [AllowAny()]
        return super().get_permissions()

    #in this case we want to fetch organisations a person is a member of
    def get_queryset(self):
        user = self.request.user
        
        return Organisation.objects.filter(memberships__user=user)

    @action(detail=False, methods=['post'], url_path='register-org')
    def register_org(self, request):
        organisation_name = str(request.data.get('organisation_name') or request.data.get('name') or '').strip()
        organisation_description = str(request.data.get('organisation_description') or request.data.get('description') or '').strip()
        email = str(request.data.get('email') or '').strip().lower()
        password = str(request.data.get('password') or '')
        first_name = str(request.data.get('first_name') or '').strip()
        last_name = str(request.data.get('last_name') or '').strip()
        phone = str(request.data.get('phone') or '').strip()
        bio = str(request.data.get('bio') or '').strip()

        if not organisation_name:
            return Response({'detail': 'organisation_name is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not email:
            return Response({'detail': 'email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if not password:
            return Response({'detail': 'password is required.'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({'detail': 'A user with this email already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            organisation = Organisation.objects.create(
                name=organisation_name,
                description=organisation_description or None,
            )
            user = User.objects.create_user(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
                phone=phone or None,
                bio=bio or None,
            )
            membership = Membership.objects.create(
                organisation=organisation,
                user=user,
                role='admin',
                currently_active=True,
                is_active=True,
            )
            assign_org_default_permissions_to_membership(membership.id, membership.role)

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                'detail': 'Organisation registered successfully.',
                'organisation': OrganisationSerializer(organisation).data,
                'membership': MembershipSerializer(membership).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )

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
    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        user.is_active = False
        user.save(update_fields=['is_active'])

        memberships = user.memberships.all()
        for membership in memberships:
            membership.is_active = False
            membership.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)


class MembershipViewset(ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [HasPermission]
    
    # we want to scope it to the current organisation
    def get_queryset(self):
        user = self.request.user
        organisation = get_user_active_organisation(user.id)
        active_membership = get_user_active_membership(user.id)

        #only admin can see all memberships, others can only see their own membership in the organisation
        if active_membership and active_membership.role == 'admin':
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
            }
        )
        if created:
            user.set_password(serializer.validated_data.get('password', ''))
            user.save(update_fields=['password'])
        membership = Membership.objects.create(
            user=user,
            organisation=serializer.validated_data['organisation'],
            role=serializer.validated_data['role']
        )
        response_serializer = MembershipSerializer(membership)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    def destroy(self, request, *args, **kwargs):
        membership = self.get_object()
        membership.is_active = False
        membership.save(update_fields=['is_active'])
        return Response(status=status.HTTP_204_NO_CONTENT)

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
    
class PermissionRecordViewset(ModelViewSet):
    queryset = PermissionRecord.objects.all()
    serializer_class = PermissionRecordSerializer
    permission_classes = [HasPermission]


    ACTION_PERMISSION_MAP = {
        'bulk_assign': 'assign.permission',
        'bulk_unassign': 'unassign.permission',
        'get_membership_permissions': 'view.permission',
    }
    
    @action(detail=False, methods=['post'])
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
        return Response({'detail': 'Permissions assigned.'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'])   
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
        return Response({'detail': 'Permissions removed.'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def get_membership_permissions(self, request):
        membership_id = request.query_params.get('membership_id')
        if not membership_id:
            return Response({'detail': 'membership_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
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
        'deploy_contract': 'update.election',
        'send_voter_invites': 'add.voting_link',
        'enroll_all_members': 'add.participant',
    }

    def get_queryset(self):
        #we want to return elections that a member is a participant or caidate
        user = self.request.user
        membership = get_user_active_membership(user.id)
        if membership and membership.role == 'admin':
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

    @action(detail=True, methods=['post'], url_path='deploy-contract')
    def deploy_contract(self, request, pk=None):
        election = self.get_object()
        already_deployed = bool(election.smart_contract_address)
        if not already_deployed:
            election.smart_contract_address = deploy_election_contract(election)
            election.save(update_fields=['smart_contract_address'])
        return Response(
            {
                'election_id': election.id,
                'smart_contract_address': election.smart_contract_address,
                'already_deployed': already_deployed,
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['post'], url_path='enroll-all-members')
    def enroll_all_members(self, request, pk=None):
        election = self.get_object()
        roles = request.data.get('roles')
        allowed_roles = {role for role, _ in ROLE_CHOICES}

        memberships = Membership.objects.filter(
            organisation=election.organisation,
            is_active=True,
        )

        if roles is not None:
            if not isinstance(roles, list):
                return Response({'detail': 'roles must be a list.'}, status=status.HTTP_400_BAD_REQUEST)
            invalid_roles = [role for role in roles if role not in allowed_roles]
            if invalid_roles:
                return Response(
                    {'detail': f'Invalid roles: {invalid_roles}'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            memberships = memberships.filter(role__in=roles)

        created_participants = 0
        existing_participants = 0

        with transaction.atomic():
            for membership in memberships:
                _, created = Participant.objects.get_or_create(
                    election=election,
                    membership=membership,
                )
                if created:
                    created_participants += 1
                else:
                    existing_participants += 1
                assign_election_default_permissions_to_membership(
                    membership.id,
                    election.id,
                    membership.role,
                )

        return Response(
            {
                'election_id': election.id,
                'memberships_processed': memberships.count(),
                'created_participants': created_participants,
                'existing_participants': existing_participants,
                'note': 'Candidates are included by default as long as they are active organisation members.',
            },
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['post'], url_path='send-voter-invites')
    def send_voter_invites(self, request, pk=None):
        election = self.get_object()
        generated_by = get_user_active_membership(request.user.id)
        participants = (
            Participant.objects
            .select_related('membership__user')
            .filter(election=election)
        )
        sent_count = 0
        links_created = 0
        links_refreshed = 0
        errors = []

        for participant in participants:
            try:
                voting_link, created = create_or_refresh_voting_link(
                    election=election,
                    participant=participant,
                    generated_by=generated_by,
                )
                send_voting_invitation_email(
                    participant=participant,
                    election=election,
                    voting_link=voting_link,
                )
                sent_count += 1
                if created:
                    links_created += 1
                else:
                    links_refreshed += 1
            except Exception as exc:
                errors.append(
                    {
                        'participant_id': participant.id,
                        'email': participant.membership.user.email,
                        'reason': str(exc),
                    }
                )

        return Response(
            {
                'sent_count': sent_count,
                'links_created': links_created,
                'links_refreshed': links_refreshed,
                'errors': errors,
            },
            status=status.HTTP_200_OK,
        )


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
    
