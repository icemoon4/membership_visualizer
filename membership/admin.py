from django.contrib import admin

from membership.models import (Committee, Event, EventAttendance, Member,
                               MembershipCount, Race, Region)


# Register your models here.
class MemberAdmin(admin.ModelAdmin):
    list_display = ["first_name", "last_name", "membership_type", "membership_status"]


class RaceAdmin(admin.ModelAdmin):
    list_display = ["label"]


class RegionAdmin(admin.ModelAdmin):
    list_display = ["label"]


class CommitteeAdmin(admin.ModelAdmin):
    list_display = ["committee_name", "status"]


class EventAdmin(admin.ModelAdmin):
    list_display = ["event_name", "event_date", "committee"]


class EventAttendanceAdmin(admin.ModelAdmin):
    list_display = ["member", "event", "rsvp_status", "status"]


class MembershipCountAdmin(admin.ModelAdmin):
    list_display = ["list_date", "constitutional_members", "members_in_good_standing"]


admin.site.register(Member, MemberAdmin)
admin.site.register(Committee, CommitteeAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(EventAttendance, EventAttendanceAdmin)
admin.site.register(Race, RaceAdmin)
admin.site.register(Region, RegionAdmin)
admin.site.register(MembershipCount, MembershipCountAdmin)
