from django.db import models
from django.conf import settings
from apartment_app.models import Apartment

# Create your models here.
class LeaseAgreement(models.Model):
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name="lease_apartment")
    start_date = models.DateField()
    end_date = models.DateField()
    rent = models.IntegerField()
    move_in_fee = models.IntegerField()
    deposit = models.IntegerField()
    full_name = models.CharField(max_length=50)
    lease_terms = models.TextField()
    
