from rest_framework import serializers
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    class Meta:
        model = Property
        fields = '__all__'  
        read_only_fields = ('landlord',) 

    def create(self, validated_data):
        return Property.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.street = validated_data.get('street', instance.street)
        instance.city = validated_data.get('city', instance.city)
        instance.state = validated_data.get('state', instance.state)
        instance.zip = validated_data.get('zip', instance.zip)
        instance.vacant = validated_data.get('vacant', instance.vacant)
        instance.save()
        return instance
