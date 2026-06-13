import secrets

from django.conf import settings
from django.contrib.auth.hashers import check_password, make_password
from django.core.mail import send_mail
from django.utils import timezone
from datetime import timedelta

from apps.users.models import EmailOTP


def _generate_code():
    length = getattr(settings, 'OTP_LENGTH', 6)
    # cryptographically secure, fixed-length, leading zeros preserved
    return ''.join(secrets.choice('0123456789') for _ in range(length))


def issue_otp(user):
    """Invalidate any outstanding codes, mint a fresh one, email it, return the raw code."""
    EmailOTP.objects.filter(user=user, is_used=False).update(is_used=True)

    code = _generate_code()
    ttl = getattr(settings, 'OTP_TTL_MINUTES', 10)
    EmailOTP.objects.create(
        user=user,
        code_hash=make_password(code),
        expires_at=timezone.now() + timedelta(minutes=ttl),
    )
    _send_otp_email(user, code, ttl)
    return code


def _send_otp_email(user, code, ttl):
    send_mail(
        subject='Your login code',
        message=f'Your one-time login code is {code}. It expires in {ttl} minutes.',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        fail_silently=False,
    )


def verify_otp(user, code):
    """Return True and consume the code on success; False otherwise."""
    otp = (
        EmailOTP.objects
        .filter(user=user, is_used=False)
        .order_by('-created_at')
        .first()
    )
    if otp is None:
        return False

    max_attempts = getattr(settings, 'OTP_MAX_ATTEMPTS', 5)
    if otp.expires_at < timezone.now() or otp.attempts >= max_attempts:
        otp.is_used = True
        otp.save(update_fields=['is_used'])
        return False

    if not check_password(code, otp.code_hash):
        otp.attempts += 1
        if otp.attempts >= max_attempts:
            otp.is_used = True
        otp.save(update_fields=['attempts', 'is_used'])
        return False

    otp.is_used = True
    otp.save(update_fields=['is_used'])
    return True
