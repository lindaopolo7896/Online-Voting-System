from apps.users.models import PermissionRecord, Log


# Codename convention: "<verb>.<resource>", dot-style, used everywhere
# (ACTION_PERMISSION_MAPs, defaults, and PermissionRecord.codename).

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

    # Elections (creation is an org-level act)
    "add.election",
    "view.election",
    "update.election",
    "delete.election",

    # Voting links
    "add.voting_link",
    "view.voting_link",
]

ELECTION_PERMISSIONS = [
    # Election lifecycle
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
    "update.participant",
    "delete.participant",

    # Candidates
    "add.candidate",
    "view.candidate",
    "update.candidate",
    "delete.candidate",
    "approve.candidate",
    "reject.candidate",

    # Voting
    "add.vote",
    "view.vote",
    "update.vote",
    "delete.vote",
    "view.results",

    # Voting links
    "add.voting_link",
    "view.voting_link",
    "update.voting_link",
    "delete.voting_link",
]


# Role-based defaults. Unknown roles fall back to "member".
default_org_permissions = {
    "admin": ORG_PERMISSIONS,
    "official": [
        "view.organisation",
        "view.membership",
        "view.log",
        "add.election",
    ],
    "member": [
        "view.organisation",
        "view.membership",
    ],
}

default_election_permissions = {
    "admin": ELECTION_PERMISSIONS,
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
        "update.participant",
        "delete.participant",
        "view.candidate",
        "approve.candidate",
        "reject.candidate",
        "view.results",
        "add.voting_link",
        "view.voting_link",
        "delete.voting_link",
    ],
    "member": [
        "view.election",
        "view.position",
        "view.participant",
        "view.candidate",
        "add.vote",
        "view.results",
    ],
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