from rest_framework import serializers
from simple_history.utils import bulk_update_with_history

from membership.models import Member, MembershipCount


class MemberSerializer(serializers.ModelSerializer):
    """
    Serializer to handle weekly member CSV's
    """

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
            "mobile_phone",
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

    def _process_m2m_data(self, instance: Member, m2m_data: list):
        for item in m2m_data:
            instance.race.add(item)
        return instance

    def create(self, validated_data: dict):
        race = validated_data.pop("race")
        instance = Member.objects.create(**validated_data)

        return self._process_m2m_data(instance, race)

    def update(self, instance: Member, validated_data: dict):
        race = validated_data.pop("race")
        members = Member.objects.filter(actionkit_id=validated_data.get("actionkit_id"))
        members.update(**validated_data)
        members.first().save()  # there's only one record, doing this so it saves the history

        return self._process_m2m_data(instance, race)

      
class MembershipCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = MembershipCount  # Specify the model to serialize
        fields = '__all__'  # Serialize all fields in MembershipCount
