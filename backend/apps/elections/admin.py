from django.contrib import admin
from .models import Position, Participant, Candidate

class PositionAdmin(admin.ModelAdmin):
    list_display = ('name', 'organisation', 'election', 'status')
    search_fields = ('name', 'organisation__name', 'election__name')
    list_filter = ('status','organisation', 'election')

class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('membership', 'election', 'has_voted', 'token', 'check_in_tx_hash', 'created_at')
    search_fields = ('membership__user__email', 'election__name', 'token__token')
    list_filter = ('has_voted', 'election')

class CandidateAdmin(admin.ModelAdmin):
    list_display = ('membership', 'election', 'position', 'status', 'created_at')
    search_fields = ('membership__user__email', 'election__name', 'position__name')
    list_filter = ('status', 'election', 'position')
    