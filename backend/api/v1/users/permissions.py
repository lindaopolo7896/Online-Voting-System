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

        required_permission  = view.ACTION_PERMISSION_MAP.get(view.action)
        if required_permission is 'DenyAll':
            return False
        if required_permission is 'AllowAll':
            return True
        if not required_permission:
            return False

        election_id = view.kwargs.get('election_id')
        if election_id:
            return check_membership_permission(active_membership, required_permission, election_id)
        return check_membership_permission(active_membership, required_permission)


class DenyAll(BasePermission):
    def has_permission(self, request, view):
        return False