from django.db import models
from apps.users.models import Election, Membership
from apps.elections.models import Candidate, Participant

class Vote(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='votes')
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='votes')
    votes_for = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='votes')
    timestamp = models.DateTimeField(auto_now_add=True)

class VotingLink(models.Model):
    election = models.ForeignKey(Election, on_delete=models.CASCADE, related_name='voting_links')
    participant = models.ForeignKey(Participant, on_delete=models.CASCADE, related_name='voting_links')
    link = models.URLField(unique=True)
    generated_by = models.ForeignKey(Membership, on_delete=models.SET_NULL, related_name='generated_links', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)