permissions = [
    "add.organisation",
    "view.organisation",
    "update.organisation",
    "delete.organisation",

    "add.user",
    "view.user",
    "update.user",
    "delete.user",

    "add.membership",
    "view.membership",
    "update.membership",
    "delete.membership",

    "view.permission", # to see what permissions a membership has
    "update.permission", #either assign or revoke permissions, we can use update for both

    "add.permission_record",
    "view.permission_record",
    "update.permission_record",
    "delete.permission_record",

    "view.log",
    "delete.log",

    "add.position",
    "view.position",
    "update.position",
    "delete.position",

    "add.participant",
    "view.participant",
    "update.participant",
    "delete.participant",

    "add.candidate",
    "view.candidate",
    "update.candidate",
    "delete.candidate",

    "add.vote",
    "view.vote",
    "update.vote",
    "delete.vote",

    "add.voting_link",
    "view.voting_link",
    "update.voting_link",
    "delete.voting_link",
]

#role based defaults
default_permissions = {
    "admin": permissions, # admin gets all permissions
    "candidate": [
        "view.organisation",
        "view.user",
        "view.membership",
        "view.permission",
        "view.permission_record",
        "view.position",
        "view.candidate",
    ],
    "participant": [
        "view.organisation",
        "view.user",
        "view.membership",
        "view.permission",
        "view.permission_record",
        "view.position",
        "add.vote", # participant can vote
        "view.vote", # participant can view their own vote
    ],
    "official": [
        "view.organisation",
        "view.user",
        "view.membership",
        "view.permission",
        "view.permission_record",
        "add.position", # official can create positions
        "update.position", # official can update positions
        "delete.position", # official can delete positions
    ],
}