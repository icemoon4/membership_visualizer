from django.db import models
from simple_history.models import HistoricalRecords

MEMBERSHIP_TYPES = (
    ("one-time", "One-time"),
    ("yearly", "Yearly"),
    ("monthly", "Monthly"),
    ("income-based", "Income-based"),
)
DUES_STATUSES = (
    ("never", "Never"),
    ("2mo_plus_failed", "2 Months Plus Failed"),
    ("lapsed", "Lapsed"),
    ("active", "Active"),
    ("manual", "Manual"),
    ("past_due", "Past Due"),
    ("canceled_by_failure", "Canceled by Failure"),
    ("canceled_by_admin", "Canceled by Admin"),
    ("canceled_by_processor", "Canceled by Processor"),
    ("canceled_by_user", "Canceled by User"),
)
MEMBERSHIP_STATUSES = (
    ("Lapsed", "Lapsed"),
    ("Member", "Member"),
    ("Member in Good Standing", "Member in Good Standing"),
)
MEMBERSHIP_LETTERS = (("L", "L"), ("M", "M"))
UNION_CHOICES = (
    ("Yes, current union member", "Yes, current union member"),
    ("Yes, retired union member", "Yes, retired union member"),
    ("No, not a union member", "No, not a union member"),
    ("No, but former union member", "No, but former union member"),
    ("Currently organizing my workplace", "Currently organizing my workplace"),
)
STUDENT_CHOICES = (
    ("Yes, college student", "Yes, college student"),
    ("Yes, graduate student", "Yes, graduate student"),
    ("Yes, high school student", "Yes, high school student"),
    ("No", "No"),
)
MAILING_PREF_CHOICES = (
    ("Yes", "Yes"),
    ("Membership card only", "Membership card only"),
    ("No", "No"),
)
DISCORD_ROLE_OPTIONS = (
    ("Member", "Member"),
    ("Member in Good Standing", "Member in Good Standing"),
    ("Visiting Member", "Visiting Member"),
)
COMMITTEE_STATUSES = (
    ("active", "Active"),
    ("inactive", "Inactive"),
    ("defunct", "Defunct"),
)
EVENT_ATTENDANCE_CHOICES = (
    ("attended_in_person", "Attended, In-Person"),
    ("attended_virtual", "Attended, Virtual"),
    ("walk_in_in_person", "Walk In, In-Person"),
    ("drop_in_virtual", "Drop In, Virtual"),
    ("canceled", "Canceled"),
    ("no_show", "No Show"),
)
EVENT_RSVP_CHOICES = (
    ("asked", "Asked"),
    ("maybe", "Maybe"),
    ("scheduled_in_person", "Scheduled, In-Person"),
    ("scheduled_virtual", "Scheduled, Virtual"),
    ("scheduled", "Scheduled"),
    ("unavailable", "Unavailable"),
)


class Member(models.Model):
    """
    Modeled after the membership list from ActionKit
    Includes some extra fields which we can assign manually
    """

    first_name = models.CharField(max_length=255)
    middle_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    do_not_call = models.BooleanField(default=False)
    p2ptext_optout = models.BooleanField(default=False)
    best_phone = models.CharField(blank=True, null=True, max_length=20)
    mobile_phone = models.CharField(blank=True, null=True, max_length=20)
    home_phone = models.CharField(blank=True, null=True, max_length=20)
    work_phone = models.CharField(blank=True, null=True, max_length=20)
    join_date = models.DateField()
    xdate = models.DateField()
    membership_type = models.CharField(
        choices=MEMBERSHIP_TYPES, blank=True, max_length=255
    )
    monthly_dues_status = models.CharField(
        choices=DUES_STATUSES, blank=True, max_length=255
    )
    yearly_dues_status = models.CharField(
        choices=DUES_STATUSES, blank=True, max_length=255
    )
    membership_status = models.CharField(
        choices=MEMBERSHIP_STATUSES, blank=True, max_length=255
    )
    memb_status_letter = models.CharField(
        choices=MEMBERSHIP_LETTERS, blank=True, max_length=2
    )
    union_member = models.CharField(
        choices=UNION_CHOICES, blank=True, null=True, max_length=255
    )
    union_name = models.CharField(max_length=255, blank=True, null=True)
    union_local = models.CharField(max_length=255, blank=True, null=True)
    accommodations = models.TextField(blank=True, null=True)
    race = models.ManyToManyField("Race", blank=True)
    student_yes_no = models.CharField(
        choices=STUDENT_CHOICES, blank=True, null=True, max_length=255
    )
    student_school_name = models.CharField(blank=True, null=True, max_length=255)
    mailing_pref = models.CharField(choices=MAILING_PREF_CHOICES, max_length=255)
    address1 = models.CharField(max_length=255)
    address2 = models.CharField(blank=True, null=True, max_length=255)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=2, default="MA")
    zip = models.CharField(max_length=10)
    country = models.CharField(default="United States", max_length=50)
    actionkit_id = models.IntegerField(primary_key=True)
    dsa_chapter = models.CharField(default="Worcester", max_length=50)
    ydsa_chapter = models.CharField(blank=True, null=True, max_length=255)
    new_member_past_month = models.BooleanField(default=False)
    list_date = (
        models.DateField()
    )  # should correspond to last time the row was updated, excluded from hash
    # Below fields are set manually by Steering Committee, not included in membership csv
    discord_name = models.CharField(blank=True, null=True, max_length=255)
    discord_status = models.CharField(
        choices=DISCORD_ROLE_OPTIONS, blank=True, null=True, max_length=255
    )
    committee = models.ManyToManyField("Committee", blank=True)
    region = models.ManyToManyField("Region", blank=True)
    vaccinated = models.BooleanField(default=False)
    notes = models.TextField(blank=True, null=True)
    do_not_text = models.BooleanField(default=False)
    do_not_email = models.BooleanField(default=False)
    in_chapter = models.BooleanField(
        default=True
    )  # If member is removed from membership list, set to False
    history = HistoricalRecords()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Committee(models.Model):
    """
    Tracks the chapter's committees and who is involved
    """

    committee_name = models.CharField(max_length=255, unique=True)
    agenda_link = models.CharField(max_length=255)
    status = models.CharField(
        choices=COMMITTEE_STATUSES, default="active", max_length=25
    )
    coordinator = models.ForeignKey(
        Member,
        related_name="coordinating_committee",
        blank=True,
        null=True,
        on_delete=models.PROTECT,
    )
    facilitator = models.ForeignKey(
        Member,
        related_name="facilitating_committee",
        blank=True,
        null=True,
        on_delete=models.PROTECT,
    )

    def __str__(self):
        return f"{self.committee_name}"


class Event(models.Model):
    """
    List of events that we host
    """

    event_name = models.CharField(max_length=255)
    event_date = models.DateField()
    committee = models.ForeignKey(
        Committee, blank=True, null=True, on_delete=models.PROTECT
    )

    def __str__(self):
        return f"{self.event_name}"


class EventAttendance(models.Model):
    """
    Tracks who attended which events
    """

    member = models.ForeignKey(Member, on_delete=models.PROTECT)
    event = models.ForeignKey(Event, on_delete=models.PROTECT)
    status = models.CharField(
        choices=EVENT_ATTENDANCE_CHOICES, max_length=100, null=True, blank=True
    )
    rsvp_status = models.CharField(
        choices=EVENT_RSVP_CHOICES, max_length=100, null=True, blank=True
    )


class Race(models.Model):
    """
    Provided by National; static list, but members
    can choose any number of options to which they identify
    """

    label = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"{self.label}"


class Region(models.Model):
    """
    Region within the Worcester Chapter area
    """

    label = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return f"{self.label}"


class MembershipCount(models.Model):
    """
    Count of members after each list upload
    """

    list_date = models.DateField(unique=True)
    notes = models.TextField(blank=True, null=True)
    constitutional_members = models.IntegerField()
    members_in_good_standing = models.IntegerField()
    active_income_based = models.IntegerField()
    active_monthly = models.IntegerField()
    active_yearly = models.IntegerField()
    active_other = models.IntegerField()
    members = models.IntegerField()
    lapsed_expired = models.IntegerField()
    history = HistoricalRecords()

    def __str__(self):
        return self.list_date.strftime("%b %d, %Y")


class MemberOnboarding(models.Model):
    """
    Track prospective members and when they were met with, when they join, etc
    """
    
    member = models.ForeignKey(Member, on_delete=models.SET_NULL, blank=True, null=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    phone = models.CharField(blank=True, null=True, max_length=20)
    outreach_to_us = models.DateField(blank=True, null=True)
    onboarder = models.ForeignKey(Member, on_delete=models.SET_NULL, blank=True, null=True, related_name="member_onboarder")
    last_contacted = models.DateField(blank=True, null=True)
    meeting_scheduled = models.DateField(blank=True, null=True)
    texted = models.BooleanField()
    emailed = models.BooleanField()
    called = models.BooleanField()
    dropped = models.BooleanField()
    responded = models.BooleanField()
    met_with = models.BooleanField()
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name}"
