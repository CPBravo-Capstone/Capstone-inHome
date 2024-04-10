from django.db import models
from user_app.models import User
from property_app.models import Property
# Create your models here.
class Tenancy(models.Model):
    tenant = models.ForeignKey(User, related_name='tenancies', on_delete=models.CASCADE)
    apartment = models.ForeignKey(Property, related_name='apartment_tenancies', on_delete=models.CASCADE)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        end_date = self.end_date.strftime('%Y-%m-%d') if self.end_date else 'current'
        return f"{self.tenant.get_full_name()} - {self.apartment} ({self.start_date} to {end_date})"