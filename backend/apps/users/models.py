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
    winner = models.ForeignKey(Membership, on_delete=models.SET_NULL, related_name='won_elections', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


#Next up we have permissions table, one to define the permissions and the other to relate a user to a permission
class Permission(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.name

class PermissionRecord(models.Model):
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE, related_name='permissions')
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='permissions')
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='permissions', blank=True, null=True)
    assigned_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.membership.user.email} - {self.permission.name} for {self.election.name}"

class Log(models.Model):
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE, related_name='logs')
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='logs', blank=True, null=True)
    action = models.ForeignKey(Permission, on_delete=models.CASCADE, related_name='logs')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.membership.user.email} performed {self.action.name} on {self.election.name} at {self.timestamp}"
