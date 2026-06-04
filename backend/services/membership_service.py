from apps.users.models import User, Membership

def make_all_other_memberships_inactive(user_id, membership_id):
    memberships = Membership.objects.filter(user_id=user_id).exclude(id=membership_id)
    for membership in memberships:
        membership.currently_active = False
        membership.save()


def get_user_active_membership(user_id):
    try:
        active_membership = Membership.objects.get(user_id=user_id, currently_active=True)
        return active_membership
    except Membership.DoesNotExist:
        return None
    except Membership.MultipleObjectsReturned:
        active_membership = Membership.objects.filter(user_id=user_id, currently_active=True).first()
        make_all_other_memberships_inactive(user_id, active_membership.id)
        return active_membership

def get_user_active_organisation(user_id):
    active_membership = get_user_active_membership(user_id)
    if active_membership:
        return active_membership.organisation
    return None

