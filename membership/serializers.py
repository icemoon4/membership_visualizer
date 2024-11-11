from datetime import datetime

from rest_framework import serializers

from membership.models import Member


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = (
            "first_name",
            "middle_name",
            "last_name",
            "email",
            "do_not_call",
            "p2ptext_optout",
            "best_phone",
            "home_phone",
            "work_phone",
            "join_date",
            "xdate",
            "membership_type",
            "monthly_dues_status",
            "yearly_dues_status",
            "membership_status",
            "memb_status_letter",
            "union_member",
            "union_name",
            "union_local",
            "accommodations",
            "race",
            "student_yes_no",
            "student_school_name",
            "mailing_pref",
            "address1",
            "address2",
            "city",
            "state",
            "zip",
            "country",
            "actionkit_id",
            "dsa_chapter",
            "ydsa_chapter",
            "new_member_past_month",
            "list_date",
        )

    def create(self, validated_data):
        m2m_data = validated_data.pop("race")
        instance = Member.objects.create(**validated_data)

        for item in m2m_data:
            instance.race.add(item)
        return instance

    def bool_str_validator(self, value):
        if not value:
            value = False  # if False, empty str, or None
        if isinstance(value, str):
            value = True if value == "TRUE" else False

        return value

    # def date_str_validator(self, value):
    #     print(value)
    #     if isinstance(value, str):
    #         value = datetime.strptime(value, "%-m/%-d/%Y")

    #     return value

    def validate_do_not_call(self, value):
        return self.bool_str_validator(value)

    def validate_p2ptext_optout(self, value):
        return self.bool_str_validator(value)

    def update(self, instance, validated_data):
        # todo: implement this
        return instance


# {'best_phone': [ErrorDetail(string='This field may not be blank.', code='blank')]}
# {'home_phone': [ErrorDetail(string='Ensure this field has no more than 10 characters.', code='max_length')]}
# {'monthly_dues_status': [ErrorDetail(string='"manual" is not a valid choice.', code='invalid_choice')]}
