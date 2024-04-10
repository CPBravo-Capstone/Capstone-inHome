from django.db import models
from user_app.models import User

# Create your models here.
class Property(models.Model):
    street = models.CharField(max_length=100)
    apt = models.CharField(max_length=10)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip = models.CharField(max_length=10)
    vacant = models.BooleanField(default=True)
    landlord = models.ForeignKey(User, on_delete = models.CASCADE, related_name='owned_properties')
    # tenant = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='rentals')

def __str__(self):
        return f"{self.street}, {self.apt} - {self.city}"