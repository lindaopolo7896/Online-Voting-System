# Voting Backend API Documentation

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

---

## 1) Auth endpoints

### 1.1 Request OTP
Short description:
Sends a one-time login code to email (or silently ignores if account/token is invalid).

- Method: `POST`
- Path: `/api/v1/auth/request-otp/`
- Parameters:
  - Body (JSON):
    - `email` (string, required)
    - `voting_token` (string, optional)
- Response:
  - `200`:
    - `{"detail": "If the email is registered, a login code has been sent."}`

### 1.2 Verify OTP
Short description:
Validates OTP and returns JWT tokens. When `voting_token` is provided, also returns voter eligibility and ballot data.

- Method: `POST`
- Path: `/api/v1/auth/verify-otp/`
- Parameters:
  - Body (JSON):
    - `email` (string, required)
    - `code` (string, required)
    - `voting_token` (string, optional)
- Response:
  - `200`:
    - `access`, `refresh`
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
- Parameters:
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
- Parameters:
  - Path: `id` (organisation id)
  - PUT/PATCH body: organisation fields
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

---

## 3) User endpoints

### 3.1 List or create users
Short description:
Lists users in active organisation context; create behavior depends on permission logic.

- Method: `GET`, `POST`
- Path: `/api/v1/users/`
- Parameters:
  - POST body:
    - `email`, `first_name`, `last_name`, `phone`, `bio`, `password` and related fields
- Response:
  - `GET 200`: list
  - `POST 201`: created user

### 3.2 Retrieve, update, soft-delete user
Short description:
Reads, updates, or soft-deletes one user. Delete also soft-deletes that user’s memberships.

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/users/{id}/`
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
- Parameters:
  - POST body:
    - `first_name` (string, required)
    - `last_name` (string, required)
    - `email` (string, required)
    - `password` (string, required)
    - `organisation_id` (int, required)
    - `role` (string, required)
    - `phone`, `bio` (optional)
- Response:
  - `GET 200`: list
  - `POST 201`: membership payload

### 4.2 Retrieve, update, soft-delete membership
Short description:
Read, update, or soft-delete one membership.

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/memberships/{id}/`
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
- Parameters:
  - None
- Response:
  - `200`: list of memberships

---

## 5) Permission record endpoints

### 5.1 Bulk assign permissions
Short description:
Assigns permissions at organisation or election scope.

- Method: `POST`
- Path: `/api/v1/permission-records/bulk-assign/`
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
- Parameters:
  - POST body:
    - `name` (string, required)
    - `description` (string, optional)
    - `date_time_occuring` (datetime, required)
    - `date_time_ending` (datetime, required)
    - `organisation_id` (int, required)
    - `winner_id` (int, optional candidate id)
- Response:
  - `GET 200`: list
  - `POST 201`: election object

### 6.2 Retrieve, update, delete election
Short description:
Read or edit one election.

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/elections/{id}/`
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
  - `/api/v1/elections/{id}/positions/`
  - `/api/v1/elections/{id}/participants/`
  - `/api/v1/elections/{id}/candidates/`
- Parameters:
  - Path: `id`
- Response:
  - `200`: list of requested resource

### 6.4 Deploy election contract
Short description:
Creates and stores a development smart contract address for election.

- Method: `POST`
- Path: `/api/v1/elections/{id}/deploy-contract/`
- Parameters:
  - Path: `id`
- Response:
  - `200`:
    - `election_id`
    - `smart_contract_address`
    - `already_deployed` (boolean)

### 6.5 Send voter invites
Short description:
Generates or refreshes voting links for all election participants and sends invitation emails.

- Method: `POST`
- Path: `/api/v1/elections/{id}/send-voter-invites/`
- Parameters:
  - Path: `id`
- Response:
  - `200`:
    - `sent_count`
    - `links_created`
    - `links_refreshed`
    - `errors` (list)

---

## 7) Election-scoped nested resources

Base path:
- `/api/v1/elections/{election_id}/`

### 7.1 Positions (nested)
Short description:
CRUD positions for a specific election context.

- Method: `GET`, `POST`
- Path: `/api/v1/elections/{election_id}/positions/`
- Parameters:
  - Path: `election_id`
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
- Parameters:
  - Path: `election_id`, `id`
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

### 7.2 Participants (nested)
Short description:
CRUD participants and run bulk participant onboarding from CSV/XLSX.

- Method: `GET`, `POST`
- Path: `/api/v1/elections/{election_id}/participants/`
- Parameters:
  - Path: `election_id`
  - POST body:
    - `membership_id` (int, required)
    - `has_voted` (bool, optional)
- Response:
  - `GET 200`, `POST 201`

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/elections/{election_id}/participants/{id}/`
- Parameters:
  - Path: `election_id`, `id`
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

#### Bulk upload participants
Short description:
Uploads roster file and creates users/memberships/participants.

- Method: `POST`
- Path: `/api/v1/elections/{election_id}/participants/bulk-upload/`
- Parameters:
  - Path: `election_id`
  - Body (multipart/form-data):
    - `file` (required, `.csv` or `.xlsx`)
  - Required columns in file:
    - `email`
  - Optional columns:
    - `first_name`, `last_name`, `role`, `phone`, `bio`
- Response:
  - `201` or `200`:
    - `created_users`
    - `created_memberships`
    - `created_participants`
    - `existing_participants`
    - `skipped_rows`

#### Send invitations (nested)
Short description:
Generates/refreshes voting links and emails for participants in this election.

- Method: `POST`
- Path: `/api/v1/elections/{election_id}/participants/send-invitations/`
- Parameters:
  - Path: `election_id`
- Response:
  - `200`: same summary fields as top-level invite endpoint

### 7.3 Candidates (nested)
Short description:
CRUD candidates for a specific election context.

- Method: `GET`, `POST`
- Path: `/api/v1/elections/{election_id}/candidates/`
- Parameters:
  - Path: `election_id`
  - POST body:
    - `membership_id` (int, required)
    - `election_id` (int, required)
    - `position_id` (int, required)
    - `manifesto`, `slogan`, `campaign_photos`, `status` (optional)
- Response:
  - `GET 200`, `POST 201`

- Method: `GET`, `PUT`, `PATCH`, `DELETE`
- Path: `/api/v1/elections/{election_id}/candidates/{id}/`
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
- Parameters:
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
- Parameters:
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
- Parameters:
  - Path: `id`
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

### 9.3 My voting links
Short description:
Returns voting links tied to current user through participant membership.

- Method: `GET`
- Path: `/api/v1/voting-links/my-links/`
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
- Parameters:
  - Path: `id`
- Response:
  - `GET 200`, `PUT/PATCH 200`, `DELETE 204`

### 10.3 Membership logs
Short description:
Returns logs for current user’s memberships.

- Method: `GET`
- Path: `/api/v1/logs/membership-logs/`
- Parameters:
  - None
- Response:
  - `200`: list of logs

### 10.4 Membership logs by election
Short description:
Returns logs for current user by election id.

- Method: `GET`
- Path: `/api/v1/logs/election-logs/{election_id}/`
- Parameters:
  - Path: `election_id`
- Response:
  - `200`: list of logs

