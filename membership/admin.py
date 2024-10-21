from django.contrib import admin

from membership.models import (Committee, Event, EventAttendance, Member, Race,
                               Region)

# Register your models here.

admin.site.register(Member)
admin.site.register(Committee)
admin.site.register(Event)
admin.site.register(EventAttendance)
admin.site.register(Race)
admin.site.register(Region)
