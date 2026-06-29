from django.contrib import admin
from .models import Vote, VotingLink

class VoteAdmin(admin.ModelAdmin):
    list_display = ('election', 'position', 'voted_for', 'vote_cast_tx_hash', 'timestamp')
    search_fields = ('election__name', 'position__name', 'voted_for__membership__user__email')

class VotingLinkAdmin(admin.ModelAdmin):
    list_display = ('election', 'participant', 'token', 'generated_by', 'created_at', 'expires_at', 'is_used')
    search_fields = ('election__name', 'participant__membership__user__email', 'token')