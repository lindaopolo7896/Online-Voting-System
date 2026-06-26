from apps.users.models import Membership

def make_all_other_memberships_inactive(user_id, membership_id):
    Membership.objects.filter(user_id=user_id).exclude(id=membership_id).update(currently_active=False)


def get_user_active_membership(user_id):
    active_memberships = (
        Membership.objects
        .select_related('organisation')
        .filter(
            user_id=user_id,
            currently_active=True,
            is_active=True,
        )
    )
    active_count = active_memberships.count()
    if active_count == 1:
        return active_memberships.first()
    if active_count > 1:
        active_membership = active_memberships.order_by('id').first()
        make_all_other_memberships_inactive(user_id, active_membership.id)
        return active_membership

    fallback_membership = (
        Membership.objects
        .select_related('organisation')
        .filter(user_id=user_id, is_active=True)
        .order_by('id')
        .first()
    )
    if fallback_membership is None:
        return None
    make_all_other_memberships_inactive(user_id, fallback_membership.id)
    if not fallback_membership.currently_active:
        fallback_membership.currently_active = True
        fallback_membership.save(update_fields=['currently_active'])
    return fallback_membership

def get_user_active_organisation(user_id):
    active_membership = get_user_active_membership(user_id)
    if active_membership:
        return active_membership.organisation
    return None



def switch_active_membership(user_id, new_membership_id):
    try:
        new_active_membership = Membership.objects.select_related('organisation').get(
            id=new_membership_id,
            user_id=user_id,
            is_active=True,
        )
        make_all_other_memberships_inactive(user_id, new_active_membership.id)
        new_active_membership.currently_active = True
        new_active_membership.save(update_fields=['currently_active'])
        return new_active_membership
    except Membership.DoesNotExist:
        return None
    
def get_user_memberships(user_id):
    return Membership.objects.filter(user_id=user_id).select_related('organisation')