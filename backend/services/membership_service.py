from apps.users.models import Membership

def make_all_other_memberships_inactive(user_id, membership_id):
    memberships = Membership.objects.filter(user_id=user_id).exclude(id=membership_id)
    for membership in memberships:
        membership.currently_active = False
        membership.save()


def get_user_active_membership(user_id):
    try:
        return Membership.objects.select_related('organisation').get(
            user_id=user_id,
            currently_active=True,
        )
    except Membership.DoesNotExist:
        return None
    except Membership.MultipleObjectsReturned:
        active_membership = (
            Membership.objects
            .select_related('organisation')
            .filter(user_id=user_id, currently_active=True)
            .first()
        )
        if active_membership is None:
            return None
        make_all_other_memberships_inactive(user_id, active_membership.id)
        return active_membership

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
        )
        make_all_other_memberships_inactive(user_id, new_active_membership.id)
        new_active_membership.currently_active = True
        new_active_membership.save(update_fields=['currently_active'])
        return new_active_membership
    except Membership.DoesNotExist:
        return None
    
def get_user_memberships(user_id):
    return Membership.objects.filter(user_id=user_id).select_related('organisation')