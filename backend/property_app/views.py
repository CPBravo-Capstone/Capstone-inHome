from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Property
from .serializers import PropertySerializer
from rest_framework import status
import requests
import os
import logging

logger = logging.getLogger(__name__)

class PropertyList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    

    def get(self, request):
        properties = Property.objects.filter(landlord=request.user)
        serializer = PropertySerializer(properties, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            # Log the incoming request data
            logger.info(f"Received POST request data: {request.data}")

            # Create and validate the serializer
            serializer = PropertySerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                logger.error(f"Serializer errors: {serializer.errors}")
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception("An error occurred while processing the property creation request")
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # def validate_address(self, data):
    #     try:
    #         auth_id = os.getenv("API_AUTH_ID")
    #         auth_token = os.getenv("API_AUTH_TOKEN")
    #         smarty_url = 'https://us-street.api.smarty.com/street-address'
    #         params = {
    #             'auth-id': auth_id,
    #             'auth-token': auth_token,
    #             'street': data.get("street"),
    #             'city': data.get("city"),
    #             'state': data.get("state"),
    #             'zipcode': data.get("zip"),
    #             'candidates': 1 
    #         }

    #         logger.info(f"Sending request to Smarty API with params: {params}")
    #         response = requests.get(smarty_url, params=params)
    #         logger.info(f"Received response from Smarty API: {response.status_code}")

    #         if response.status_code == 200 and response.json():
    #             best_candidate = response.json()[0]
    #             address_parsed = {
    #                 "street": best_candidate['delivery_line_1'],
    #                 "city": best_candidate['components']['city_name'],
    #                 "state": best_candidate['components']['state_abbreviation'],
    #                 "zip": best_candidate['components']['zipcode']
    #             }
    #             logger.info(f"Address parsed successfully: {address_parsed}")
    #             return True, address_parsed, response.json()[0]
    #         else:
    #             logger.error(f"Failed to validate address. Response: {response.text}")
    #             return False, {}, {}
    #     except Exception as e:
    #         logger.exception("An error occurred during address validation")
    #         return False, {}, {}

    
class PropertyDetail(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, id):
        return Property.objects.get(id=id)

    def get(self, request, id):
        property = self.get_object(id)
        if request.user == property.landlord:
            serializer = PropertySerializer(property, context={'request': request})
            return Response(serializer.data)
        return Response({"detail": "You don't have permission to view this property."}, status=status.HTTP_403_FORBIDDEN)

    def put(self, request, id):
        property = self.get_object(id)
        if request.user == property.landlord:
            serializer = PropertySerializer(property, data=request.data, context={'request': request})
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
