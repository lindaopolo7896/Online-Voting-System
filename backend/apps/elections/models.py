from django.db import models

class Position(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=100, blank=True, null=True)
    organisation = models.ForeignKey('users.Organisation', on_delete=models.CASCADE, related_name='positions')
    election = models.ForeignKey('users.Election', on_delete=models.CASCADE, related_name='positions')
    status = models.CharField(max_length=20, default='open')  # open, closed

    def __str__(self):
        return f"{self.name} ({self.organisation.name})"

class Participant(models.Model):
    membership = models.ForeignKey('users.Membership', on_delete=models.CASCADE, related_name='participants')
    election = models.ForeignKey('users.Election', on_delete=models.CASCADE, related_name='participants')
    has_voted = models.BooleanField(default=False)
    token = models.ForeignKey('votes.VotingLink', on_delete=models.CASCADE, related_name='participants', blank=True, null=True)  # unique token for voting
    check_in_tx_hash = models.CharField(max_length=100, blank=True, null=True)  # transaction hash for check-in
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.membership.user.email} in {self.election.name}"

class Candidate(models.Model):
    membership = models.ForeignKey('users.Membership', on_delete=models.CASCADE, related_name='candidates')
    election = models.ForeignKey('users.Election', on_delete=models.CASCADE, related_name='candidates')
    position = models.ForeignKey(Position, on_delete=models.CASCADE, related_name='candidates')
    manifesto = models.TextField(blank=True, null=True)
    slogan = models.CharField(max_length=100, blank=True, null=True)
    campaign_photos = models.ImageField(upload_to='campaign_photos/', blank=True, null=True)
    status = models.CharField(max_length=20, default='active')  # active, withdrawn, disqualified
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.membership.user.email} for {self.election.name}"
