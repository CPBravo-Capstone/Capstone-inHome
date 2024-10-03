from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Property
from .serializers import PropertySerializer
from rest_framework import status
import requests
from inHome_proj.settings import env

# Create your views here.

class PropertyList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        properties = Property.objects.filter(landlord=request.user)
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)

    def post(self, request):
        validated_data, address_components, response_json = self.validate_address(request.data)
        if not validated_data:
            return Response({"detail": "Invalid address provided."}, status=status.HTTP_400_BAD_REQUEST)

        request.data.update(address_components)

        serializer = PropertySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(landlord=request.user)
            return Response(response_json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def validate_address(self, data):
        auth_id = env.get("API_AUTH_ID")
        auth_token = env.get("API_AUTH_TOKEN")
        smarty_url = 'https://us-street.api.smarty.com/street-address'
        params = {
            'auth-id': auth_id,
            'auth-token': auth_token,
            'street': data.get("street"),
            'city': data.get("city"),
            'state': data.get("state"),
            'zipcode': data.get("zip"),
            'candidates': 1 
        }

        response = requests.get(smarty_url, params=params)
        if response.status_code == 200 and response.json():
            best_candidate = response.json()[0]
            address_parsed = {
                "street": best_candidate['delivery_line_1'],
                "city": best_candidate['components']['city_name'],
                "state": best_candidate['components']['state_abbreviation'],
                "zip": best_candidate['components']['zipcode']
            }
            return True, address_parsed, response.json()[0]
        return False, {}


    
class PropertyDetail(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, id):
        return Property.objects.get(id=id)

    def get(self, request, id):
        property = self.get_object(id)
        if request.user == property.landlord:
            serializer = PropertySerializer(property)
            return Response(serializer.data)
        return Response({"detail": "You don't have permission to view this property."}, status=status.HTTP_403_FORBIDDEN)

    def put(self, request, id):
        property = self.get_object(id)
        if request.user == property.landlord:
            serializer = PropertySerializer(property, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "You don't have permission to edit this property."}, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, id):
        property = self.get_object(id)
        if request.user == property.landlord:
            property.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "You don't have permission to delete this property."}, status=status.HTTP_403_FORBIDDEN)


