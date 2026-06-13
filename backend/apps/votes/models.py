from django.db import models

class Vote(models.Model):
    election = models.ForeignKey('users.Election', on_delete=models.CASCADE, related_name='votes')
    position = models.ForeignKey('elections.Position', on_delete=models.CASCADE, related_name='votes')
    voted_for = models.ForeignKey('elections.Candidate', on_delete=models.CASCADE, related_name='votes')
    vote_cast_tx_hash = models.CharField(max_length=100, blank=True, null=True)  # simple hash-chain anchor for school project
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Vote in {self.position.name} for {self.voted_for.membership.user.email} in {self.election.name}"

class VotingLink(models.Model):
    election = models.ForeignKey('users.Election', on_delete=models.CASCADE, related_name='voting_links')
    participant = models.ForeignKey('elections.Participant', on_delete=models.CASCADE, related_name='voting_links')
    token = models.URLField(unique=True)
    generated_by = models.ForeignKey('users.Membership', on_delete=models.SET_NULL, related_name='generated_links', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)

    def __str__(self):
        return f"Voting link for {self.participant.membership.user.email} in {self.election.name}"