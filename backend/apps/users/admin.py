from django.contrib import admin
from .models import Organisation, User, Membership, Election, PermissionRecord, Log

class OrganisationAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    search_fields = ('name',)
    list_filter = ('created_at',)

class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_verified', 'is_staff', 'is_active')
    search_fields = ('email', 'first_name', 'last_name')
    list_filter = ('is_verified', 'is_staff', 'is_active')

class MembershipAdmin(admin.ModelAdmin):
    list_display = ('organisation', 'user', 'role', 'currently_active', 'is_active', 'created_at')
    search_fields = ('organisation__name', 'user__email', 'role')
    list_filter = ('role', 'currently_active', 'is_active')

class ElectionAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'date_time_occuring', 'date_time_ending')
    search_fields = ('name', 'description')
    list_filter = ('date_time_occuring', 'date_time_ending')

class PermissionRecordAdmin(admin.ModelAdmin):
    list_display = ('membership', 'codename', 'election', 'assigned_at')
    search_fields = ('membership__user__email', 'codename', 'election__name')
    list_filter = ('codename', 'election')

class LogAdmin(admin.ModelAdmin):
    list_display = ('membership', 'election', 'codename', 'created_at')
    search_fields = ('membership__user__email', 'election__name', 'codename')
    list_filter = ('codename', 'election')
