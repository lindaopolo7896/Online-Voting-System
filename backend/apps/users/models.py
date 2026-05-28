from django.db import models
from django.contrib.auth.models import AbstractUser

# This is the organisation at level 1
class Organisations(models.Model):
    name = models.CharField(max_length = 50)
    description = models.CharField(max_length = 100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

# This is at level 2 where
class Users(AbstractUser):
    phone = models.CharField(max_length=50, blank=True, null=True)
    bio = models.CharField(max_length = 150, blank=True, null=True)

ROLE_CHOICES ={
    ('Admin','admin'),
    ('Canidate','canidate'),
    ('Participant','participant'),
    ('Official','official'),
}
