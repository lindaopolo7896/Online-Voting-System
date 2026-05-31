from apps.users.models import PermissionRecord

ORG_PERMISSIONS = [
    # Organisation
    "add.organisation",
    "view.organisation",
    "update.organisation",
    "delete.organisation",

    # Members
    "add.membership",
    "view.membership",
    "update.membership",
    "delete.membership",

    # Permission assignments
    "assign.permission",
    "view.permission",
    "unassign.permission",

    # Audit logs
    "view.log",
    "delete.log",

    # Elections
    "add.election",
]

ELECTION_PERMISSIONS = [
    # Elections
    "view.election",
    "update.election",
    "delete.election",
    "start.election",
    "close.election",
    "publish.results",

    # Positions
    "add.position",
    "view.position",
    "update.position",
    "delete.position",

    # Participants
    "add.participant",
    "view.participant",
    "delete.participant",

    # Candidates
    "approve.candidate",
    "view.candidate",
    "reject.candidate"

    # Voting
    "add.vote",
    "view.vote",
    "view.results",

    # Voting links
    "create.voting_link",
    "revoke.voting_link",
]


#role based defaults
default_org_permissions = {
    "admin": ORG_PERMISSIONS, # admin gets all permissions
    "others": [
        "view.organisation",
        "view.membership",
    ],
    "official": [
        "view.organisation",
        "view.membership",
        "view.log",
        "add.election",
    ],
}

default_election_permissions = {
    "admin": ELECTION_PERMISSIONS, # admin gets all permissions
    "others": [
        "view.election",
        "view.position",
        "view.participant",
        "view.candidate",
        "add.vote",
        "view.results"
    ],
    "official": [
        "view.election",
        "start.election",
        "close.election",
        "publish.results",
        "add.position",
        "view.position",
        "update.position",
        "delete.position",
        "add.participant",
        "view.participant",
        "delete.participant",
        "approve.candidate",
        "view.candidate",
        "reject.candidate",
        "add.vote",
        "view.results"
        "create.voting_link",
        "revoke.voting_link",
    ],
}

# What im looking for, assign perm by default role, then assign perms, then unassign perms

def get_permissions_for_role(role, type):
    if type == "election":
        return default_election_permissions.get(role, [])
    else:
        return default_org_permissions.get(role, [])

def assign_org_default_permissions_to_membership(membership, role):
    permissions = get_permissions_for_role(role, "organisation")
    for perm in permissions:
        if not membership.permissions.filter(codename=perm).exists():
            permission_record = PermissionRecord.objects.create(
                membership=membership,
                codename=perm,
            )
            permission_record.save()

def assign_election_default_permissions_to_membership(membership, role):
    permissions = get_permissions_for_role(role, "election")
    for perm in permissions:
        if not membership.permissions.filter(codename=perm).exists():
            permission_record = PermissionRecord.objects.create(
                membership=membership,
                codename=perm,
            )
            permission_record.save()

#assigning org level perms
def assign_org_bulk_permisions_to_membership(membership, permissions):
    #clear out everything for clean start, then assign new ones
    old_perms = PermissionRecord.objects.filter(membership=membership)
    for old_perm in old_perms:
        old_perm.delete()

    for perm in permissions:
        if not membership.permissions.filter(codename=perm).exists():
            permission_record = PermissionRecord.objects.create(
                membership=membership,
                codename=perm,
            )
            permission_record.save()


#assigning election specific perms   
def assign_election_bulk_permissions_to_membership(membership, election, permissions):
    #clear out everything for clean start, then assign new ones
    old_perms = PermissionRecord.objects.filter(membership=membership, election=election)
    for old_perm in old_perms:
        old_perm.delete()

    for perm in permissions:
        if not membership.permissions.filter(codename=perm, election=election).exists():
            permission_record = PermissionRecord.objects.create(
                membership=membership,
                codename=perm,
                election=election
            )
            permission_record.save()

#removing organisation specific perms   
def revoke_org_bulk_permissions_from_membership(membership, permissions):
    for perm in permissions:
        old_perm = PermissionRecord.objects.filter(membership=membership, codename=perm)
        if old_perm:
            old_perm.delete()

#removing election specific perms   
def revoke_election_bulk_permissions_from_membership(membership, election, permissions):
    for perm in permissions:
        old_perm = PermissionRecord.objects.filter(membership=membership, codename=perm, election=election)
        if old_perm:
            old_perm.delete()

#verifying perms
def check_membership_permission(membership, codename, election=None):
    if election:
        return membership.permissions.filter(codename=codename, election=election).exists()
    else:
        return membership.permissions.filter(codename=codename, election__isnull=True).exists()