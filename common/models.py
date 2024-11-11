import csv
from datetime import datetime
from io import StringIO

from django.db import models, transaction

from membership.models import Race
from membership.serializers import MemberSerializer


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
        print(name)
        if name[-4:] == ".csv":
            csv_file = self.file.read().decode("utf-8")
            csv_data = csv.DictReader(StringIO(csv_file), delimiter=",")
            for row in csv_data:
                print(row)
                if not row.get("do_not_call"):
                    row["do_not_call"] = False
                if not row.get("p2ptext_optout"):
                    row["p2ptext_optout"] = False

                race = [v.strip() for v in row.get("race", "").split(",")]
                race_pks = []
                for r in race:
                    print(r)
                    if r:
                        r_obj, _ = Race.objects.get_or_create(label=r)
                        if r_obj:
                            race_pks.append(r_obj.pk)
                row["race"] = race_pks
                serializer = MemberSerializer(data=row)
                try:
                    with transaction.atomic():
                        serializer.is_valid(raise_exception=True)  # rollback on error
                        serializer.save()
                        self.processed = True
                        self.processed_date = datetime.now().date()
                        self.save()
                except Exception as e:
                    print(e)
