from datetime import datetime
from django.db import models
from common.member_loader import MemberImporter


class MembershipFile(models.Model):
    """
    Representation of CSV file upload. Once saved, the file will be loaded into the Member table
    """

    file = models.FileField(upload_to="uploads/")
    processed = models.BooleanField()
    processed_date = models.DateField(blank=True, null=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.processed:
            self.upload_members()

    def upload_members(self):
        """
        Uses the MemberImporter to process the CSV file
        """
        name = self.file.name
        if name[-4:] == ".csv":
            importer = MemberImporter(self.file)
            importer.process_file()

            # set processed flag
            self.processed = True
            self.processed_date = datetime.now().date()
            self.save()
