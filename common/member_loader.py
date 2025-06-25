import csv
from datetime import datetime
from io import StringIO

from django.db import models, transaction

from membership.models import UNION_CHOICES, Member, MembershipCount, Race
from membership.serializers import MemberSerializer


def validate_and_get_file_rows(file):
    """
    checks file is valid and reads as csv
    :param file: File object
    :return: list of dict rows
    """
    # utf-8-sig removes invalid chars if saved from excel
    encoding_format = "utf-8-sig"

    reader = file.read().decode(encoding_format)

    file_data = csv.DictReader(StringIO(reader), delimiter=",")
    return file_data


def clean_bool(value) -> bool:
    """
    Accepts a String or a Null and converts to a Bool
    """
    if not value:
        value = False
    if isinstance(value, str):
        value = True if value.lower() == "true" else False

    return value


def clean_m2m_list(value: str, model: models.Model) -> list:
    """
    This just cleans a list for M2M fields where the obj uses the label field.
    In my case that's all of them. Yay :)
    """
    value = [v.strip() for v in value.split(",")]
    model_pks = []
    for v in value:
        if v:
            v_obj, _ = model.objects.get_or_create(label=v)
            if v_obj:
                model_pks.append(v_obj.pk)

    return model_pks


class MemberImporter:
    """
    Processes data from a member CSV file
    """

    def __init__(self, file=None, list_date: datetime = None):
        self._file = file
        self.list_date = None
        if list_date:
            self.list_date = list_date
        self.bool_fields = (
            "do_not_call",
            "p2ptext_optout",
            "new_member_past_month",
        )
        self.m2m_fields = ("race",)
        # start counters
        self.constitutional = self.migs = self.members = 0
        self.income_based = self.monthly = self.yearly = self.other = self.lapsed = 0

        # latest upload date, prevents loading in old data
        latest_list_date = Member.objects.order_by("-list_date").first()
        if latest_list_date:
            latest_list_date = latest_list_date.list_date

        self.latest_list_date = latest_list_date

    def read_csv(self):
        """
        Returns a list (rows) of dicts (cells) from the CSV file object
        :return: list
        """
        return validate_and_get_file_rows(self._file)

    def update_headers(self, rows: list):
        """
        older membership lists were structured differently. Convert the keys to the new format
        """
        updated_headers = {
            "ak_id": "actionkit_id",
            "address_line_1": "address1",
            "address_line_2": "address2",
            "mail_preference": "mailing_pref",
            "memb_status": "memb_status_letter",
            "billing_address1": "address1",
            "billing_address_line_1": "address1",
            "billing_address_line_2": "address2",
            "billing_address2": "address2",
            "billing_city": "city",
            "billing_state": "state",
            "billing_zip": "zip",
            "chapter": "dsa_chapter",
            "monthly_status": "monthly_dues_status",
            "annual_recurring_dues_status": "yearly_dues_status",
        }
        deleted_columns = [
            "DSA_ID",
            "suffix",
            "prefix",
            "Family_first_name",
            "Family_last_name",
            "Organization",
            "Mailing_Address_Line_1",
            "Mailing_Address_Line_2",
            "Mailing_City",
            "Mailing_State",
            "Mailing_Zip",
        ]
        updated_csv = []

        for row in rows:
            new_row = {}
            for key in row.keys():
                if key not in deleted_columns:
                    val = row[key]
                    key = updated_headers.get(key.lower(), key).lower()
                    if key == "membership_status":
                        val = (
                            val.capitalize()
                            .replace("good standing", "Good Standing")
                            .replace("Expired", "Lapsed")
                        )
                    if key == "membership_type":
                        val = val.replace("annual", "yearly")
                    if key in ("join_date", "xdate"):
                        val = val[:10]

                    new_row[key] = val
            if new_row:
                new_row["list_date"] = self.list_date
                updated_csv.append(new_row)

        return updated_csv

    def update_counts(self, data: dict):
        """
        Checks membership status and type to calculate various membership metrics
        """
        memb_status = data.get("membership_status", "").lower()
        memb_type = data.get("membership_type", "").lower()
        monthly_status = data.get("monthly_dues_status", "").lower()
        yearly_status = data.get("yearly_dues_status", "").lower()

        if memb_status in ("member", "member in good standing"):
            self.constitutional += 1
        if memb_status == "member in good standing":
            self.migs += 1

        if monthly_status == "active":
            if memb_type == "income-based":
                self.income_based += 1
            elif memb_type == "monthly":
                self.monthly += 1
        elif yearly_status == "active":
            self.yearly += 1
        elif memb_status == "member in good standing":  # not yearly or monthly
            self.other += 1

        if memb_status == "member":
            self.members += 1
        elif memb_status in ("lapsed", "expired"):
            self.lapsed += 1

    def clean_and_deserialize_data(self, rows: list):
        """
        Given the list of dicts, processes each row and creates or updates a Member from it
        :return: list of actionkit ids which were included in the membership list
        """
        ids = []
        for row in rows:
            # Clean data
            for bool_field in self.bool_fields:
                row[bool_field] = clean_bool(row.get(bool_field))
            for m2m_field in self.m2m_fields:
                row[m2m_field] = clean_m2m_list(row.get(m2m_field, ""), Race)

            row["mailing_pref"] = row.get("mailing_pref", "").capitalize()
            if not row.get("state"):
                row["state"] = "MA"

            # Old "choices" data was not cleaned very well
            union = row.get("union_member")
            if union.lower() == "no":
                row["union_member"] = "No, not a union member"
            elif union.lower() == "yes":
                row["union_member"] = "Yes, current union member"
            elif (union, union) not in UNION_CHOICES:
                row["union_member"] = None

            if not row.get("mailing_pref"):
                row["mailing_pref"] = "Yes"

            if row.get("membership_type") == "annual":
                row["membership_type"] = "yearly"

            if not row.get("membership_type"):
                row["membership_type"] = "unknown"
            if not row.get("monthly_dues_status"):
                row["monthly_dues_status"] = "unknown"
            if not row.get("yearly_dues_status"):
                row["yearly_dues_status"] = "unknown"

            if not row.get("list_date"):
                row["list_date"] = self.list_date

            # Initialize serializer
            ak_id = row.get("actionkit_id")
            email = row.get("email")

            existing = Member.objects.filter(actionkit_id=ak_id).first()
            if existing:
                serializer = MemberSerializer(existing, data=row)
            else:
                existing = Member.objects.filter(
                    email=email
                ).first()  # from older lists, ak id may be different. for some reason
                if existing:
                    serializer = MemberSerializer(existing, data=row)
                else:
                    serializer = MemberSerializer(data=row)

            # Deserialize
            try:
                with transaction.atomic():
                    serializer.is_valid(raise_exception=True)  # rollback on error
                    if not self.list_date:
                        self.list_date = serializer.validated_data.get("list_date")
                    if (
                        self.latest_list_date
                        and self.list_date <= self.latest_list_date
                    ):
                        raise Exception("List Date must be newer than the latest list")
                    serializer.save()
                    ids.append(ak_id)
            except Exception as e:
                raise Exception(e)

            # Update audit counts
            self.update_counts(serializer.validated_data)

        return ids

    def process_file(self):
        """
        Insertion point from the MembershipFile save() method
        Deletes any members which are in the DB but were not in the most recent membership list
        """
        rows = self.read_csv()
        # list format change: 4/25/2022
        # modern list format: 9/29/2023
        if (
            self.list_date and self.list_date < datetime(2023, 9, 29).date()
        ):  # the date lists were converted to new format
            rows = self.update_headers(rows)
        delete_ids = self.clean_and_deserialize_data(rows)

        # process deletions
        members_to_delete = Member.objects.exclude(actionkit_id__in=delete_ids)
        members_to_delete.delete()

        # create MembershipCount
        self.log_counts()

    def log_counts(self):
        """
        Creates an instance of MembershipCount based on the totals from the CSV
        """
        existing_count = MembershipCount.objects.filter(
            list_date=self.list_date
        ).first()
        if not existing_count:
            mc = MembershipCount(
                list_date=self.list_date,
                constitutional_members=self.constitutional,
                members_in_good_standing=self.migs,
                active_income_based=self.income_based,
                active_monthly=self.monthly,
                active_yearly=self.yearly,
                active_other=self.other,
                members=self.members,
                lapsed_expired=self.lapsed,
            )
            mc.save()
