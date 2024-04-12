from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Property
from .serializers import PropertySerializer
from rest_framework import status
# Create your views here.

class PropertyList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'landlord':
            properties = Property.objects.filter(landlord=request.user)
            serializer = PropertySerializer(properties, many=True)
            return Response(serializer.data)
        return Response({"detail": "Only landlords can view properties."}, status=status.HTTP_403_FORBIDDEN)

    def post(self, request):
        if request.user.role == 'landlord':
            serializer = PropertySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(landlord=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Only landlords can create properties."}, status=status.HTTP_403_FORBIDDEN)
    
class PropertyDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return Property.objects.get(pk=pk)

    def get(self, request, pk):
        property = self.get_object(pk)
        if request.user == property.landlord:
            serializer = PropertySerializer(property)
            return Response(serializer.data)
        return Response({"detail": "You don't have permission to view this property."}, status=status.HTTP_403_FORBIDDEN)

    def put(self, request, pk):
        property = self.get_object(pk)
        if request.user == property.landlord:
            serializer = PropertySerializer(property, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "You don't have permission to edit this property."}, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk):
        property = self.get_object(pk)
        if request.user == property.landlord:
            property.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "You don't have permission to delete this property."}, status=status.HTTP_403_FORBIDDEN)
