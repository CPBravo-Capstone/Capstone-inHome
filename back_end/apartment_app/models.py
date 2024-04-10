from django.db import models
from property_app.models import Property

# Create your models here.
class Apartment(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name="apartments")
    unit_number = models.CharField(max_length=10)
    bedroom = models.IntegerField()
    bathroom = models.IntegerField()
    monthly_fee = models.DecimalField(max_digits=8, decimal_places=2)
    lease_length = models.IntegerField()

    class Meta:
        unique_together = ('property', 'unit_number',)

    def __str__(self):
        return f"Apartment {self.property} with {self.bedroom} bedroom(s) and {self.bathroom} bathroom(s)"