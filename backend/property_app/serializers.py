from rest_framework import serializers
from .models import Property

class PropertySerializer(serializers.ModelSerializer):
    landlord = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Property
        fields = ['id', 'street', 'city', 'state', 'zip', 'vacant', 'landlord']
        read_only_fields = ['id', 'landlord']

    def create(self, validated_data):
        validated_data['landlord'] = self.context['request'].user
        return super().create(validated_data)

    def validate(self, data):
        if data.get('state') and len(data['state']) != 2:
            raise serializers.ValidationError({"state": "State must be a two-letter code."})
        return data

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['landlord'] = instance.landlord.email
        return representation