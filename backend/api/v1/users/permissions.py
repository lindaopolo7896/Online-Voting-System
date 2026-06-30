from rest_framework.permissions import BasePermission

from services.permission_service import check_membership_permission, log
from services.membership_service import get_user_active_membership

def _request_election_id(request):
    query_election_id = request.query_params.get('election_id')
    if query_election_id not in (None, ''):
        return query_election_id

    data = getattr(request, 'data', None)
    if data is None or not hasattr(data, 'get'):
        return None

    payload_election_id = data.get('election_id')
    if payload_election_id not in (None, ''):
        return payload_election_id

    payload_election = data.get('election')
    if payload_election not in (None, ''):
        return payload_election
    return None


class HasPermission(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user.is_authenticated:
            return False

        active_membership = get_user_active_membership(user.id)
        if not active_membership:
            return False

        action_map = getattr(view, 'ACTION_PERMISSION_MAP', {})
        required_permission = action_map.get(view.action)
        # No mapping for this action -> deny by default.
        if not required_permission:
            return False
        model = getattr(getattr(view, 'queryset', None), 'model', None)

        election_id = view.kwargs.get('election_id')
        # Top-level ElectionViewSet routes use `pk` for election context.
        if election_id is None:
            if model is not None and model.__name__ == 'Election':
                election_id = view.kwargs.get('pk')
        if election_id is None:
            election_id = _request_election_id(request)
        if election_id is None and model is not None and view.kwargs.get('pk') is not None:
            if any(field.name == 'election' for field in model._meta.fields):
                election_id = view.get_queryset().filter(pk=view.kwargs.get('pk')).values_list('election_id', flat=True).first()
        if election_id:
            permission_check =  check_membership_permission(active_membership, required_permission, election_id)
            if permission_check:
                log(active_membership, required_permission, election_id)
        else:
            permission_check =  check_membership_permission(active_membership, required_permission)
            if permission_check:
                log(active_membership, required_permission, election_id)
        
        return permission_check


class DenyAll(BasePermission):
    def has_permission(self, request, view):
        return False