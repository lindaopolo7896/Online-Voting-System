from rest_framework.permissions import BasePermission

from services.permission_service import check_membership_permission
from services.membership_service import get_user_active_membership

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

        election_id = view.kwargs.get('election_id')
        # Top-level ElectionViewSet routes use `pk` for election context.
        if election_id is None:
            model = getattr(getattr(view, 'queryset', None), 'model', None)
            if model is not None and model.__name__ == 'Election':
                election_id = view.kwargs.get('pk')
        if election_id:
            return check_membership_permission(active_membership, required_permission, election_id)
        return check_membership_permission(active_membership, required_permission)


class DenyAll(BasePermission):
    def has_permission(self, request, view):
        return False