from django.db import models
from property_app.models import Property
from user_app.models import User

# Create your models here.
class Apartment(models.Model):
    unit_number = models.CharField(max_length=10)
    bedroom = models.IntegerField()
    bathroom = models.IntegerField()
    monthly_rent = models.DecimalField(max_digits=8, decimal_places=2)
    lease_length = models.IntegerField()
    tenant = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='rentals')
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="apartments")

    
    class Meta:
        unique_together = ('property', 'unit_number',)

    def __str__(self):
        return f"Apartment {self.property} with {self.bedroom} bedroom(s) and {self.bathroom} bathroom(s)"
    