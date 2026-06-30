# Voting Backend API Documentation V1.2.1

Short description:
This API manages organisations, elections, participants, candidates, voting links, OTP login, and anonymous vote submission with blockchain-style vote anchoring.

## Base URL
- Local: `http://127.0.0.1:8000`
- API prefix: `/api/v1/`

## Authentication
- Most endpoints require JWT auth.
- Header:
  - `Authorization: Bearer <access_token>`
- Public endpoints:
  - `POST /api/v1/auth/request-otp/`
  - `POST /api/v1/auth/verify-otp/`
  - `POST /api/v1/auth/token/refresh/`

## General response style
- Success: JSON object or list.
- Validation errors: `400` with field error messages.
- Auth/permission errors: `401` or `403`.
- List endpoints with filtering support use exact-match query parameters.

---

## 1) Auth endpoints

### 1.1 Request OTP
Short description:
Sends a one-time login code to email (or silently ignores if account/token is invalid).

- Method: `POST`
- Path: `/api/v1/auth/request-otp/`
- Required permission: `Public (AllowAny)`
- Parameters:
  - Body (JSON):
    - `email` (string, required)
    - `voting_token` (string, optional)
- Response:
  - `200`:
    - `{"detail": "If the email is registered, a login code has been sent."}`

### 1.2 Verify OTP
Short description:
Validates OTP and returns JWT tokens. On first successful verification, the user is marked as email-verified. When `voting_token` is provided, also returns voter eligibility and ballot data.

- Method: `POST`
- Path: `/api/v1/auth/verify-otp/`
- Required permission: `Public (AllowAny)`
- Parameters:
  - Body (JSON):
    - `email` (string, required)
    - `code` (string, required)
    - `voting_token` (string, optional)
- Response:
  - `200`:
    - `access`, `refresh`
    - `user.is_verified`
    - If voting token is supplied and valid:
      - `eligibility`: `{ "eligible": true, "election_id": <id> }`
      - `ballot`: list of `{candidate_id, position_id, position_name, candidate_name, slogan}`
  - `400` examples:
    - `{"detail":"Invalid or expired code."}`
    - `{"detail":"Invalid or expired voting link."}`
    - `{"detail":"You are not eligible to vote: ballot already cast."}`

### 1.3 Refresh JWT
Short description:
Gets a new access token from refresh token.

- Method: `POST`
- Path: `/api/v1/auth/token/refresh/`
- Required permission: `Public (refresh token required)`
- Parameters:
  - Body (JSON):
    - `refresh` (string, required)
- Response:
  - `200`: `{ "access": "<token>" }`

---

## 2) Organisation endpoints

### 2.1 List or create organisations
Short description:
Lists organisations linked to current user, or creates a new organisation.

- Method: `GET`, `POST`
- Path: `/api/v1/organisations/`
- Required permission:
  - `GET`: `Authenticated + scoped membership access`
  - `POST`: `org.manage`
- Parameters:
  - Query (GET filters, optional):
    - `name`
  - POST body:
    - `name` (string, required)
    - `description` (string, optional)
- Response:
  - `GET 200`: list of organisations
  - `POST 201`: created organisation

### 2.2 Retrieve, update, delete organisation
Short description:
Read or modify one organisation record.

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/organisations/{id}/`
- Required permission:
  - `GET`: `Authenticated + scoped membership access`
  - `PUT` / `PATCH`: `org.manage`
  - `DELETE`: `org.manage`
- Parameters:
  - Path: `id` (organisation id)
  - PUT/PATCH body: organisation fields
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

### 2.3 Register organisation (public)
Short description:
Creates a new organisation, creates the first user as unverified, makes that user an admin membership, seeds default org permissions, and sends an OTP verification code to email.

- Method: `POST`
- Path: `/api/v1/organisations/register-org/`
- Required permission: `Public (AllowAny)`
- Parameters:
  - Body:
    - `organisation_name` (string, required) or `name`
    - `organisation_description` (string, optional) or `description`
    - `email` (string, required)
    - `first_name` (string, optional)
    - `last_name` (string, optional)
    - `phone` (string, optional)
    - `bio` (string, optional)
- Response:
  - `201`:
    - `detail`
    - `organisation`
    - `membership`
    - `verification_sent` (`true`)
  - `400` examples:
    - missing required fields
    - existing email

---

## 3) User endpoints

### 3.1 List or create users
Short description:
Lists users in active organisation context; create behavior depends on permission logic.

- Method: `GET`, `POST`
- Path: `/api/v1/users/`
- Required permission:
  - `GET`: `Authenticated + active organisation scope`
  - `POST`: `org.members.manage`
- Parameters:
  - Query (GET filters, optional):
    - `email`, `first_name`, `last_name`, `is_active`
  - POST body:
    - `email`, `first_name`, `last_name`, `phone`, `bio`, `password` and related fields
    - `role` values for organisation memberships: `admin`, `official`, `member`
- Response:
  - `GET 200`: list
  - `POST 201`: created user

### 3.2 Retrieve, update, soft-delete user
Short description:
Reads, updates, or soft-deletes one user. Delete also soft-deletes that user’s memberships.

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/users/{id}/`
- Required permission:
  - `GET`: `Authenticated + active organisation scope`
  - `PUT` / `PATCH`: `org.members.manage`
  - `DELETE`: `org.members.manage`
- Parameters:
  - Path: `id`
  - PUT/PATCH body: user fields
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

---

## 4) Membership endpoints

### 4.1 List or create memberships
Short description:
Lists memberships in active org scope. Create can onboard a new user + membership together.

- Method: `GET`, `POST`
- Path: `/api/v1/memberships/`
- Required permission:
  - `GET`: `Authenticated + active organisation scope`
  - `POST`: `org.members.manage`
- Parameters:
  - Query (GET filters, optional):
    - `organisation_id`, `user_id`, `role`, `is_active`
  - POST body:
    - `first_name` (string, required)
    - `last_name` (string, required)
    - `email` (string, required)
    - `password` (string, required)
    - `organisation_id` (int, required)
    - `role` (string, required: `admin` | `official` | `member`)
    - `phone`, `bio` (optional)
- Response:
  - `GET 200`: list
  - `POST 201`: membership payload

### 4.2 Retrieve, update, soft-delete membership
Short description:
Read, update, or soft-delete one membership.

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/memberships/{id}/`
- Required permission:
  - `GET`: `Authenticated + active organisation scope`
  - `PUT` / `PATCH`: `org.members.manage`
  - `DELETE`: `org.members.manage`
- Parameters:
  - Path: `id`
  - PUT/PATCH body: membership fields
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

### 4.3 My memberships
Short description:
Returns memberships for current authenticated user.

- Method: `GET`
- Path: `/api/v1/memberships/my-memberships/`
- Required permission: `Authenticated`
- Parameters:
  - None
- Response:
  - `200`: list of memberships

### 4.4 Bulk upload organisation members
Short description:
Uploads a member roster for the active organisation and creates/updates organisation memberships.

- Method: `POST`
- Path: `/api/v1/memberships/bulk-upload/`
- Required permission: `org.members.manage`
- Parameters:
  - Body (multipart/form-data):
    - `file` (required, `.csv` or `.xlsx`)
    - `organisation_id` (optional, must match active organisation if provided)
  - Required columns in file:
    - `email`
  - Optional columns:
    - `first_name`, `last_name`, `phone`, `bio`
    - `role` (`admin` | `official` | `member`, defaults to `member`)
    - `is_active` (`true`/`false`, defaults to `true`)
- Response:
  - `201` or `200`:
    - `organisation_id`
    - `created_users`
    - `created_memberships`
    - `existing_memberships`
    - `updated_memberships`
    - `skipped_rows`

---

## 5) Permission record endpoints

### 5.1 Bulk assign permissions
Short description:
Assigns permissions at organisation or election scope.

- Method: `POST`
- Path: `/api/v1/permission-records/bulk-assign/`
- Required permission: `org.access.manage`
- Parameters:
  - Body:
    - `type` (`"organisation"` or `"election"`)
    - `membership_id` (int)
    - `permissions` (array of codenames)
    - `election_id` (int, required for election type)
- Response:
  - `200`: `{ "detail": "Permissions assigned." }`

### 5.2 Bulk unassign permissions
Short description:
Removes permissions at organisation or election scope.

- Method: `POST`
- Path: `/api/v1/permission-records/bulk-unassign/`
- Required permission: `org.access.manage`
- Parameters:
  - Body:
    - `type`, `membership_id`, `permissions`, `election_id` (same as assign)
- Response:
  - `200`: `{ "detail": "Permissions removed." }`

### 5.3 Get membership permissions
Short description:
Returns all permission records for one membership.

- Method: `GET`
- Path: `/api/v1/permission-records/get-membership-permissions/`
- Required permission: `org.access.manage`
- Parameters:
  - Query:
    - `membership_id` (int, required)
- Response:
  - `200`: list of permission records

---

## 6) Election endpoints (top-level)

### 6.1 List or create elections
Short description:
Lists elections in user scope, or creates a new election.

- Method: `GET`, `POST`
- Path: `/api/v1/elections/`
- Required permission:
  - `GET`: `Authenticated + scoped membership access`
  - `POST`: `org.elections.manage`
- Parameters:
  - Query (GET filters, optional):
    - `organisation_id`, `date_time_occuring`, `date_time_ending`, `winner_id`
  - POST body:
    - `name` (string, required)
    - `description` (string, optional)
    - `date_time_occuring` (datetime, required)
    - `date_time_ending` (datetime, required)
    - `organisation_id` (int, required)
    - `winner_id` (int, optional candidate id)
  - Response election payload includes:
    - `voter_invites_sent_at` (datetime or `null`) — set after invite links are dispatched.
- Response:
  - `GET 200`: list
  - `POST 201`: election object

### 6.2 Retrieve, update, delete election
Short description:
Read or edit one election.

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/elections/{id}/`
- Required permission:
  - `GET`: `Authenticated + scoped membership access`
  - `PUT` / `PATCH`: `org.elections.manage`
  - `DELETE`: `org.elections.manage`
- Parameters:
  - Path: `id`
  - PUT/PATCH body: election fields
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

### 6.3 Election detail lists
Short description:
Read election-linked resources from top-level election route.

- Method: `GET`
- Paths:
  - `/api/v1/elections/{id}/election-positions/`
  - `/api/v1/elections/{id}/election-participants/`
  - `/api/v1/elections/{id}/election-candidates/`
- Required permission:
  - `/election-positions/`: `Authenticated + scoped membership access`
  - `/election-participants/`: `Authenticated + scoped membership access`
  - `/election-candidates/`: `Authenticated + scoped membership access`
- Parameters:
  - Path: `id`
- Response:
  - `200`: list of requested resource

### 6.4 Deploy election contract
Short description:
Creates and stores a development smart contract address for election.

- Method: `POST`
- Path: `/api/v1/elections/{id}/deploy-contract/`
- Required permission: `org.elections.manage`
- Parameters:
  - Path: `id`
- Response:
  - `200`:
    - `election_id`
    - `smart_contract_address`
    - `already_deployed` (boolean)

### 6.5 Send voter invites
Short description:
Generates or refreshes voting links for all election participants and sends invitation emails. This also marks the election as invite-dispatched (`voter_invites_sent_at`) so scheduled start-time dispatch does not run again for that election.

- Method: `POST`
- Path: `/api/v1/elections/{id}/send-voter-invites/`
- Required permission: `election.invites.manage`
- Parameters:
  - Path: `id`
- Response:
  - `200`:
    - `sent_count`
    - `links_created`
    - `links_refreshed`
    - `errors` (list)
    - `already_dispatched` (boolean)

### 6.6 Enroll all organisation members as participants
Short description:
Adds all active organisation memberships to the election as participants and seeds default election permissions for each membership. Candidates are included by default.

- Method: `POST`
- Path: `/api/v1/elections/{id}/enroll-all-members/`
- Required permission: `election.participants.manage`
- Parameters:
  - Path: `id`
  - Body (optional):
    - `roles` (array of `admin` | `official` | `member`) to enroll only selected organisation roles
- Response:
  - `200`:
    - `election_id`
    - `memberships_processed`
    - `created_participants`
    - `existing_participants`
    - `note`
  - `400`:
    - invalid `roles` format or values

---

## 7) Election-scoped nested resources

Base path:
- `/api/v1/elections/{election_id}/`

### 7.1 Positions (nested)
Short description:
CRUD positions for a specific election context.

- Method: `GET`, `POST`
- Path: `/api/v1/elections/{election_id}/positions/`
- Required permission:
  - `GET`: `Authenticated + scoped election access`
  - `POST`: `election.ballot.manage`
- Parameters:
  - Path: `election_id`
  - Query (GET filters, optional):
    - `organisation_id`, `election_id`, `status`, `name`
  - POST body:
    - `name` (string, required)
    - `description` (string, optional)
    - `organisation_id` (int, required)
    - `election_id` (int, required)
    - `status` (string, optional)
- Response:
  - `GET 200`, `POST 201`

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/elections/{election_id}/positions/{id}/`
- Required permission:
  - `GET`: `Authenticated + scoped election access`
  - `PUT` / `PATCH`: `election.ballot.manage`
  - `DELETE`: `election.ballot.manage`
- Parameters:
  - Path: `election_id`, `id`
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

### 7.2 Participants (nested)
Short description:
CRUD participants and run bulk participant onboarding from CSV/XLSX.

- Method: `GET`, `POST`
- Path: `/api/v1/elections/{election_id}/participants/`
- Required permission:
  - `GET`: `Authenticated + scoped election access`
  - `POST`: `election.participants.manage`
- Parameters:
  - Path: `election_id`
  - Query (GET filters, optional):
    - `membership_id`, `election_id`, `has_voted`
  - POST body:
    - `membership_id` (int, required)
    - `has_voted` (bool, optional)
- Response:
  - `GET 200`, `POST 201`

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/elections/{election_id}/participants/{id}/`
- Required permission:
  - `GET`: `Authenticated + scoped election access`
  - `PUT` / `PATCH`: `election.participants.manage`
  - `DELETE`: `election.participants.manage`
- Parameters:
  - Path: `election_id`, `id`
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

#### Bulk upload participants
Short description:
Uploads a roster for an election. Every valid row becomes a participant in the target election.

- Method: `POST`
- Path: `/api/v1/elections/{election_id}/participants/bulk-upload/`
- Required permission: `election.participants.manage`
- Parameters:
  - Path: `election_id`
  - Body (multipart/form-data):
    - `file` (required, `.csv` or `.xlsx`)
  - Required columns in file:
    - `email`
  - Optional columns:
    - `first_name`, `last_name`, `phone`, `bio`
    - `role` (`admin` | `official` | `member`, defaults to `member`) for organisation membership role only
- Response:
  - `201` or `200`:
    - `created_users`
    - `created_memberships`
    - `created_participants`
    - `existing_participants`
    - `skipped_rows`

#### Send invitations (nested)
Short description:
Generates/refreshes voting links and emails for participants in this election. Like the top-level invite endpoint, it marks `voter_invites_sent_at` when dispatch occurs.

- Method: `POST`
- Path: `/api/v1/elections/{election_id}/participants/send-invitations/`
- Required permission: `election.invites.manage`
- Parameters:
  - Path: `election_id`
- Response:
  - `200`: same summary fields as top-level invite endpoint, including `already_dispatched`

#### Convert participant to candidate
Short description:
Creates a candidate in this election from the selected participant membership.

- Method: `POST`
- Path: `/api/v1/elections/{election_id}/participants/{id}/convert-to-candidate/`
- Required permission: `election.ballot.manage`
- Parameters:
  - Path: `election_id`, `id` (participant id)
  - Body:
    - `position_id` (int, required, must belong to same election)
    - `manifesto` (string, optional)
    - `slogan` (string, optional)
    - `status` (string, optional, defaults to `active`)
    - `campaign_photos` (file, optional)
- Response:
  - `201`: created candidate payload
  - `400` examples:
    - missing `position_id`
    - position not in election
    - already a candidate for the same position

### 7.3 Candidates (nested)
Short description:
CRUD candidates for a specific election context.

- Method: `GET`, `POST`
- Path: `/api/v1/elections/{election_id}/candidates/`
- Required permission:
  - `GET`: `Authenticated + scoped election access`
  - `POST`: `election.ballot.manage`
- Parameters:
  - Path: `election_id`
  - Query (GET filters, optional):
    - `membership_id`, `election_id`, `position_id`, `status`
  - POST body:
    - `membership_id` (int, required)
    - `election_id` (int, required)
    - `position_id` (int, required)
    - `manifesto`, `slogan`, `campaign_photos`, `status` (optional)
- Response:
  - `GET 200`, `POST 201`

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/elections/{election_id}/candidates/{id}/`
- Required permission:
  - `GET`: `Authenticated + scoped election access`
  - `PUT` / `PATCH`: `election.ballot.manage`
  - `DELETE`: `election.ballot.manage`
- Parameters:
  - Path: `election_id`, `id`
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

---

## 8) Vote endpoints

### 8.1 List or cast vote
Short description:
Lists votes, or submits a vote and anchors it to the blockchain-style hash record.

- Method: `GET`, `POST`
- Path: `/api/v1/votes/`
- Required permission:
  - `GET`: `election.votes.view`
  - `POST`: `election.vote.cast`
- Parameters:
  - Query (GET filters, optional):
    - `election_id`, `position_id`, `voted_for_id`
  - POST body:
    - `election_id` (int, required)
    - `position_id` (int, required)
    - `voted_for_id` (int, required)
    - one of:
      - `participant_id` (int), or
      - `voting_token` (string)
- Response:
  - `GET 200`: vote list
  - `POST 201`:
    - vote object with `vote_cast_tx_hash`
    - `detail`: `"Success! Your vote was anchored to the block."`
  - `400` examples:
    - invalid token
    - voter already voted
    - election mismatch

### 8.2 Retrieve/update/delete vote
Short description:
Read or modify one vote record.

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/votes/{id}/`
- Required permission:
  - `GET`: `election.votes.view`
  - `PUT` / `PATCH`: `election.votes.manage`
  - `DELETE`: `election.votes.manage`
- Parameters:
  - Path: `id`
  - PUT/PATCH body: vote fields
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

### 8.3 Votes by election
Short description:
Returns all votes for an election.

- Method: `POST`
- Path: `/api/v1/votes/by-election/`
- Required permission: `election.votes.view`
- Parameters:
  - Body:
    - `election_id` (int, required)
- Response:
  - `200`: list of votes

### 8.4 Votes by candidate
Short description:
Returns all votes for a candidate.

- Method: `POST`
- Path: `/api/v1/votes/by-candidate/`
- Required permission: `election.votes.view`
- Parameters:
  - Body:
    - `candidate_id` (int, required)
- Response:
  - `200`: list of votes

---

## 9) Voting link endpoints

### 9.1 List or create voting links
Short description:
Manage voting link records directly.

- Method: `GET`, `POST`
- Path: `/api/v1/voting-links/`
- Required permission:
  - `GET`: `election.invites.manage`
  - `POST`: `election.invites.manage`
- Parameters:
  - Query (GET filters, optional):
    - `election_id`, `participant_id`, `generated_by_id`, `is_used`, `expires_at`
  - POST body:
    - `election_id` (int, required)
    - `participant_id` (int, required)
    - `token` (string, required URL)
    - `generated_by_id` (int, optional)
    - `expires_at` (datetime, required)
    - `is_used` (bool, optional)
- Response:
  - `GET 200`, `POST 201`

### 9.2 Retrieve/update/delete voting link
Short description:
Read or modify one voting link.

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/voting-links/{id}/`
- Required permission:
  - `GET`: `election.invites.manage`
  - `PUT` / `PATCH`: `election.invites.manage`
  - `DELETE`: `election.invites.manage`
- Parameters:
  - Path: `id`
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

### 9.3 My voting links
Short description:
Returns voting links tied to current user through participant membership.

- Method: `GET`
- Path: `/api/v1/voting-links/my-links/`
- Required permission: `Authenticated`
- Parameters:
  - None
- Response:
  - `200`: list of voting links

---

## 10) Log endpoints

### 10.1 List/create logs
Short description:
Manage audit log records.

- Method: `GET`, `POST`
- Path: `/api/v1/logs/`
- Required permission: `No ACTION_PERMISSION_MAP entry (currently denied by HasPermission / returns 403).`
- Parameters:
  - POST body:
    - `membership_id` (int, required)
    - `election_id` (int, optional)
    - `codename` (string, required)
- Response:
  - `GET 200`, `POST 201`

### 10.2 Retrieve/update/delete log
Short description:
Read or modify one log record.

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/logs/{id}/`
- Required permission: `No ACTION_PERMISSION_MAP entry (currently denied by HasPermission / returns 403).`
- Parameters:
  - Path: `id`
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

### 10.3 Membership logs
Short description:
Returns logs for current user’s memberships.

- Method: `GET`
- Path: `/api/v1/logs/membership-logs/`
- Required permission: `org.analytics.view`
- Parameters:
  - None
- Response:
  - `200`: list of logs

### 10.4 Membership logs by election
Short description:
Returns logs for current user by election id.

- Method: `GET`
- Path: `/api/v1/logs/election-logs/{election_id}/`
- Required permission: `org.analytics.view`
- Parameters:
  - Path: `election_id`
- Response:
  - `200`: list of logs

---

## 11) Scheduled operations

### 11.1 Auto-send voter invites at election start
Short description:
Runs the start-time dispatch flow for elections whose `date_time_occuring` has passed and that have not yet dispatched invites (`voter_invites_sent_at` is `null`).

- Command:
  - `python manage.py dispatch_scheduled_voter_invites`
- Scheduling:
  - Run this command on an interval (for example, every minute via cron).

