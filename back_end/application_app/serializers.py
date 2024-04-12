from rest_framework import serializers
from .models import Application

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['id', 'tenant', 'apartment', 'status', 'full_name', 'dob', 'income', 'past_address', 'past_landlord', 'phone_number', 'email']
        extra_kwargs = {'tenant': {'read_only': True}}