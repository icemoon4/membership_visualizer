from django.contrib import admin

from membership.models import (Committee, Event, EventAttendance, Member,
                               MembershipCount, Race, Region)


# Register your models here.
class MemberAdmin(admin.ModelAdmin):
    list_display = ["first_name", "last_name", "membership_type", "membership_status"]
    search_fields = ["first_name", "last_name", "email", "city"]


class RaceAdmin(admin.ModelAdmin):
    list_display = ["label"]
    search_fields = ["label"]


class RegionAdmin(admin.ModelAdmin):
    list_display = ["label"]
    search_fields = ["label"]


class CommitteeAdmin(admin.ModelAdmin):
    list_display = ["committee_name", "status"]
    search_fields = ["committee_name"]


class EventAdmin(admin.ModelAdmin):
    list_display = ["event_name", "event_date", "committee"]
    sortable_by = ["event_name", "event_date"]
    search_fields = ["event_name"]


class EventAttendanceAdmin(admin.ModelAdmin):
    list_display = ["member", "event", "rsvp_status", "status"]
    search_fields = ["event"]


class MembershipCountAdmin(admin.ModelAdmin):
    list_display = ["list_date", "constitutional_members", "members_in_good_standing"]
    sortable_by = ["list_date"]


admin.site.register(Member, MemberAdmin)
admin.site.register(Committee, CommitteeAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(EventAttendance, EventAttendanceAdmin)
admin.site.register(Race, RaceAdmin)
admin.site.register(Region, RegionAdmin)
admin.site.register(MembershipCount, MembershipCountAdmin)
