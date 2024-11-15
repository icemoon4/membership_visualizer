import csv
from datetime import datetime
from io import StringIO

from django.db import models, transaction

from membership.models import Race, Member
from membership.serializers import MemberSerializer


def clean_bool(value) -> bool:
    if not value:
        value = False
    if isinstance(value, str):
        value = True if value.lower() == "true" else False
    
    return value


def clean_m2m_list(value: str, model: models.Model) -> list:
    """This just cleans a list for M2M fields where the obj uses the label field. In my case that's all of them. Yay :)"""
    value = [v.strip() for v in value.split(",")]
    model_pks = []
    for v in value:
        if v:
            v_obj, _ = model.objects.get_or_create(label=v)
            if v_obj:
                model_pks.append(v_obj.pk)
    
    return model_pks


# Create your models here.
class MembershipFile(models.Model):
    file = models.FileField(upload_to="uploads/")
    processed = models.BooleanField()
    processed_date = models.DateField(blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.processed:
            self.upload_members()

    def upload_members(self):
        name = self.file.name
        if name[-4:] == ".csv":
            csv_file = self.file.read().decode("utf-8")
            csv_data = csv.DictReader(StringIO(csv_file), delimiter=",")
            ids = []
            for row in csv_data:
                print(row)
                ak_id = row.get("actionkit_id")
                # Clean some of the data before processing
                row["do_not_call"] = clean_bool(row.get("do_not_call"))
                row["p2ptext_optout"] = clean_bool(row.get("p2ptext_optout"))
                row["race"] = clean_m2m_list(row.get("race", ""), Race)
                
                existing = Member.objects.filter(actionkit_id=ak_id).first()
                print(existing)
                if existing:
                    serializer = MemberSerializer(existing, data=row)
                else:
                    serializer = MemberSerializer(data=row)
                try:
                    with transaction.atomic():
                        serializer.is_valid(raise_exception=True)  # rollback on error
                        serializer.save()
                        ids.append(ak_id)
                except Exception as e:
                    print(e)
            
            # process deletions
            members_to_delete = Member.objects.exclude(actionkit_id__in=ids)
            members_to_delete.delete()
            self.processed = True
            self.processed_date = datetime.now().date()
            self.save()
