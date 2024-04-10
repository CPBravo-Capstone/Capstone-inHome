from django.db import models
from apartment_app.models import Apartment

# Create your models here.
class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='transactions')
    date = models.DateField()
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPES)
    category = models.CharField(max_length=100)
    vendor_payer = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, null=True)


    def __str__(self):
        return f"{self.date} - {self.transaction_type} - {self.amount}"