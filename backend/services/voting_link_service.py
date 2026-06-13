import secrets
from datetime import timedelta
from urllib.parse import parse_qs, urlparse

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from apps.votes.models import VotingLink


def _extract_raw_token(token_or_url):
    value = str(token_or_url or '').strip()
    if not value:
        return ''

    parsed = urlparse(value)
    if parsed.scheme and parsed.netloc:
        return parse_qs(parsed.query).get('token', [''])[0]
    return value


def _build_voting_url(raw_token):
    base = getattr(settings, 'VOTING_LINK_BASE_URL', 'http://localhost:3000/vote').strip()
    separator = '&' if '?' in base else '?'
    return f"{base}{separator}token={raw_token}"


def create_or_refresh_voting_link(election, participant, generated_by=None):
    raw_token = secrets.token_urlsafe(24)
    link_url = _build_voting_url(raw_token)
    ttl_hours = int(getattr(settings, 'VOTING_LINK_TTL_HOURS', 24))
    expires_at = timezone.now() + timedelta(hours=ttl_hours)

    voting_link, created = VotingLink.objects.update_or_create(
        election=election,
        participant=participant,
        defaults={
            'token': link_url,
            'generated_by': generated_by,
            'expires_at': expires_at,
            'is_used': False,
        },
    )

    participant.token = voting_link
    participant.save(update_fields=['token'])
    return voting_link, created


def send_voting_invitation_email(participant, election, voting_link):
    send_mail(
        subject=f"Voting invitation for {election.name}",
        message=(
            f"You have been invited to vote in '{election.name}'.\n\n"
            f"Open your voting link: {voting_link.token}\n\n"
            "After opening the link, request your OTP code from the app and "
            "use it to access your ballot."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[participant.membership.user.email],
        fail_silently=False,
    )


def resolve_voting_link(token_or_url, election_id=None, require_active=False):
    value = str(token_or_url or '').strip()
    if not value:
        return None

    query = VotingLink.objects.select_related('participant__membership__user', 'election')
    if election_id is not None:
        query = query.filter(election_id=election_id)
    if require_active:
        query = query.filter(is_used=False, expires_at__gt=timezone.now())

    direct = query.filter(token=value).first()
    if direct is not None:
        return direct

    raw_token = _extract_raw_token(value)
    if not raw_token:
        return None
    return query.filter(token__contains=f"token={raw_token}").first()
