from django.db import models
from django.contrib.auth.models import AbstractUser
from utils.manager import manager

# This is the organisation at level 1
class Organisation(models.Model):
    name = models.CharField(max_length = 50)
    description = models.CharField(max_length = 100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

# This is at level 2 where we deal with a user and their relationship with an organisation
# For user we used abstract user coz we will be using django built in user fields plus these
class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=50, blank=True, null=True)
    bio = models.CharField(max_length = 150, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = manager()

    def __str__(self):
        return self.email

ROLE_CHOICES =(
    ('admin','Admin'),
    ('candidate','Candidate'),
    ('participant','Participant'),
    ('official','Official'),
)

class Membership(models.Model):
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name='memberships')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    currently_active = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.email} - {self.organisation.name} ({self.role})"

    #ensure a user can only have one role per organisation, but can have different roles in different organisations
    class Meta:
        unique_together = ('organisation', 'user')

    

# election has been brought to this app to avoid circular imports.
class Election(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    date_time_occuring = models.DateTimeField()
    date_time_ending = models.DateTimeField()
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name='elections')
    winner = models.ForeignKey('elections.Candidate', on_delete=models.SET_NULL, related_name='won_elections', blank=True, null=True)
    smart_contract_address = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class PermissionRecord(models.Model):
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE, related_name='permissions')
    codename = models.CharField(max_length=50)
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='permissions', blank=True, null=True)
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.membership.user.email} - {self.codename} for {self.election.name}"
    
    class Meta:
        unique_together = ('membership', 'codename', 'election')

class Log(models.Model):
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE, related_name='logs')
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='logs', blank=True, null=True)
    codename = models.CharField(max_length=50)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.membership.user.email} performed {self.codename} on {self.election.name} at {self.timestamp}"


# One-time codes for passwordless email login. The raw code is never stored —
# only a salted hash (see services/otp_service.py).
class EmailOTP(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otps')
    code_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    attempts = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"OTP for {self.user.email} ({'used' if self.is_used else 'active'})"
