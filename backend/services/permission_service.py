from apps.users.models import PermissionRecord, Log


# Codename convention: "<scope>.<capability>", where scope is "org" or "election".

ORG_PERMISSIONS = [
    "org.manage",
    "org.members.manage",
    "org.access.manage",
    "org.elections.manage",
    "org.analytics.view",
]

ELECTION_PERMISSIONS = [
    "election.participants.manage",
    "election.ballot.manage",
    "election.invites.manage",
    "election.votes.view",
    "election.votes.manage",
    "election.vote.cast",
]


# Role-based defaults. Unknown roles fall back to "member".
default_org_permissions = {
    "admin": ORG_PERMISSIONS + ELECTION_PERMISSIONS,
    "official": [
        "org.members.manage",
        "org.elections.manage",
        "org.analytics.view",
    ],
    "member": [],
}


default_election_permissions = {
    "admin": ELECTION_PERMISSIONS,
    "official": [
        "election.participants.manage",
        "election.ballot.manage",
        "election.invites.manage",
        "election.votes.view",
    ],
    "member": ["election.vote.cast"],
}


def get_permissions_for_role(role, scope):
    table = default_election_permissions if scope == "election" else default_org_permissions
    return table.get(role, table["member"])


# --- Default seeding (called when a membership / election role is created) ---

def assign_org_default_permissions_to_membership(membership_id, role):
    for codename in get_permissions_for_role(role, "organisation"):
        PermissionRecord.objects.get_or_create(
            membership_id=membership_id, codename=codename, election=None
        )


def assign_election_default_permissions_to_membership(membership_id, election_id, role):
    for codename in get_permissions_for_role(role, "election"):
        PermissionRecord.objects.get_or_create(
            membership_id=membership_id, codename=codename, election_id=election_id
        )


# --- Bulk assignment (replaces the membership's perms at the given scope) ---

def assign_org_bulk_permissions_to_membership(membership_id, permissions):
    PermissionRecord.objects.filter(
        membership_id=membership_id, election__isnull=True
    ).delete()
    for codename in permissions:
        PermissionRecord.objects.get_or_create(
            membership_id=membership_id, codename=codename, election=None
        )


def assign_election_bulk_permissions_to_membership(membership_id, election_id, permissions):
    PermissionRecord.objects.filter(
        membership_id=membership_id, election_id=election_id
    ).delete()
    for codename in permissions:
        PermissionRecord.objects.get_or_create(
            membership_id=membership_id, codename=codename, election_id=election_id
        )


# --- Bulk revocation ---

def revoke_org_bulk_permissions_from_membership(membership_id, permissions):
    PermissionRecord.objects.filter(
        membership_id=membership_id, codename__in=permissions, election__isnull=True
    ).delete()


def revoke_election_bulk_permissions_from_membership(membership_id, election_id, permissions):
    PermissionRecord.objects.filter(
        membership_id=membership_id, codename__in=permissions, election_id=election_id
    ).delete()


# --- Reads / checks ---

def get_all_permissions_for_membership(membership_id):
    return PermissionRecord.objects.filter(membership_id=membership_id)


def check_membership_permission(membership, codename, election=None):
    qs = membership.permissions.filter(codename=codename)
    if election is not None:
        return qs.filter(election=election).exists() or qs.filter(election__isnull=True).exists()
    return qs.filter(election__isnull=True).exists()


def log(membership, codename, election_id = None):
    Log.objects.create(
        membership=membership,
        election_id=election_id,
        codename=codename,
    )