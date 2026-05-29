from django.db import models
from apps.users.models import Organisation, Membership, Election

class Position(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=100, blank=True, null=True)
    organisation = models.ForeignKey(Organisation, on_delete=models.CASCADE, related_name='positions')
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='positions')
    status = models.CharField(max_length=20, default='open')  # open, closed

class Participant(models.Model):
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE, related_name='participants')
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='participants')
    created_at = models.DateTimeField(auto_now_add=True)

class Candidate(models.Model):
    membership = models.ForeignKey(Membership, on_delete=models.CASCADE, related_name='candidates')
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='candidates')
    position = models.ForeignKey(Position, on_delete=models.CASCADE, related_name='candidates')
    manifesto = models.TextField(blank=True, null=True)
    slogan = models.CharField(max_length=100, blank=True, null=True)
    campaign_photos = models.ImageField(upload_to='campaign_photos/', blank=True, null=True)
    status = models.CharField(max_length=20, default='active')  # active, withdrawn, disqualified
    created_at = models.DateTimeField(auto_now_add=True)


