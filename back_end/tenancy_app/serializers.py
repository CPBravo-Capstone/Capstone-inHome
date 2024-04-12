from rest_framework import serializers
from .models import Tenancy

class TenancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenancy
        fields = '__all__'