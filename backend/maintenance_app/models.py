from django.db import models
from apartment_app.models import Apartment

# Create your models here.
class Maintenance(models.Model):
    apartment = models.ForeignKey(Apartment, related_name='maintenances', on_delete=models.CASCADE)
    date = models.DateField()
    description = models.TextField()
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    is_resolved = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.date} - {self.apartment} - {'Resolved' if self.is_resolved else 'Pending'}"