# Voting Backend

This is a Django REST backend for election management and secret-ballot voting.
It handles:
- organisation and membership management
- election setup
- participant import from CSV/XLSX
- OTP-based voter verification
- anonymous vote storage with a blockchain-style anchor hash

## Tech stack
- Python 3.13
- Django + Django REST Framework
- JWT auth (`djangorestframework-simplejwt`)
- SQLite (default)
- `openpyxl` for Excel uploads

## Quick start

1) Install dependencies
- `uv sync `

2) Run migrations
- `uv run --project python manage.py migrate`

3) (Optional) Create superuser
- `uv run python manage.py createsuperuser`

4) Run the server
- `uv run python manage.py runserver`

Server URL:
- `http://127.0.0.1:8000`

## Environment variables

Add a `.env` file in `backend/` if needed.

Common settings:
- `SECRET_KEY`
- `DEBUG`
- `ALLOWED_HOSTS`
- `JWT_ACCESS_MINUTES`
- `JWT_REFRESH_DAYS`
- `EMAIL_BACKEND`
- `EMAIL_HOST`
- `EMAIL_PORT`
- `EMAIL_USE_TLS`
- `EMAIL_HOST_USER`
- `EMAIL_HOST_PASSWORD`
- `DEFAULT_FROM_EMAIL`
- `OTP_LENGTH`
- `OTP_TTL_MINUTES`
- `OTP_MAX_ATTEMPTS`
- `BLOCKCHAIN_SALT`
- `VOTING_LINK_BASE_URL`
- `VOTING_LINK_TTL_HOURS`

## Main voting flow

1. Create organisation and election.
2. Upload roster:
   - `POST /api/v1/elections/{election_id}/participants/bulk-upload/`
3. Deploy election contract address (dev stub):
   - `POST /api/v1/elections/{id}/deploy-contract/`
4. Send invite links:
   - `POST /api/v1/elections/{id}/send-voter-invites/`
5. Voter OTP:
   - `POST /api/v1/auth/request-otp/`
   - `POST /api/v1/auth/verify-otp/`
6. Cast vote:
   - `POST /api/v1/votes/`

## API reference

Full endpoint documentation is in:
- `api.md`

## CSV/XLSX participant import format

Required column:
- `email`

Optional columns:
- `first_name`
- `last_name`
- `role`
- `phone`
- `bio`

## Notes

- This project keeps ballot secrecy by not storing voter identity on vote records.
- `Participant.has_voted` is used for eligibility/one-vote enforcement.
- Vote anchoring currently uses a lightweight hash-chain approach suitable for dev/school use.