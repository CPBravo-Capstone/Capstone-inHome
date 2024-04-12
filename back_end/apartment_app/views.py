from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Apartment
from .serializers import ApartmentSerializer 
from rest_framework import status

class ApartmentList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'landlord':
            apartments = Apartment.objects.filter(property__landlord=request.user)
            serializer = ApartmentSerializer(apartments, many=True)
            return Response(serializer.data)
        return Response({"detail": "You do not have permission to view apartments."}, status=status.HTTP_403_FORBIDDEN)

    def post(self, request):
        if request.user.role == 'landlord':
            serializer = ApartmentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Only landlords can create apartments."}, status=status.HTTP_403_FORBIDDEN)

class ApartmentDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Apartment.objects.get(pk=pk)
        except Apartment.DoesNotExist:
            return Response({"detail": "Apartment not found."}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        apartment = self.get_object(pk)
        if request.user.role in ['landlord', 'tenant'] and (apartment.property.landlord == request.user or apartment.tenant == request.user):
            serializer = ApartmentSerializer(apartment)
            return Response(serializer.data)
        return Response({"detail": "You do not have permission to view this apartment."}, status=status.HTTP_403_FORBIDDEN)

    def put(self, request, pk):
        apartment = self.get_object(pk)
        if request.user.role == 'landlord' and apartment.property.landlord == request.user:
            serializer = ApartmentSerializer(apartment, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Only the landlord of this apartment can update it."}, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk):
        apartment = self.get_object(pk)
        if request.user.role == 'landlord' and apartment.property.landlord == request.user:
            apartment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Only the landlord of this apartment can delete it."}, status=status.HTTP_403_FORBIDDEN)
