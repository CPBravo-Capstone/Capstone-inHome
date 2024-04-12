from django.db import models
from django.conf import settings
from apartment_app.models import Apartment

# Create your models here.
class Application(models.Model):
    tenant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name="app_appartment")
    full_name = models.CharField(max_length=255)
    bio = models.TextField()
    dob = models.DateField(verbose_name='Date of Birth')
    income = models.DecimalField(max_digits=10, decimal_places=2)
    current_address = models.CharField(max_length=255)
    current_landlord = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=20)
    email = models.EmailField()
    pets = models.BooleanField(default=False)