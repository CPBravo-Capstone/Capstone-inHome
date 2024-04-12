from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Tenancy
from .serializers import TenancySerializer
from rest_framework import status

class TenancyList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'landlord':
            tenancies = Tenancy.objects.filter(apartment__property__landlord=request.user)
        elif request.user.role == 'tenant':
            tenancies = Tenancy.objects.filter(tenant=request.user)
        else:
            return Response({"detail": "You do not have permission to view tenancies."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TenancySerializer(tenancies, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Assuming only landlords can create tenancy agreements
        if request.user.role == 'landlord':
            serializer = TenancySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Only landlords can create tenancies."}, status=status.HTTP_403_FORBIDDEN)

class TenancyDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Tenancy.objects.get(pk=pk)
        except Tenancy.DoesNotExist:
            return Response({"detail": "Tenancy not found."}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        tenancy = self.get_object(pk)
        if request.user == tenancy.tenant or (request.user.role == 'landlord' and tenancy.apartment.property.landlord == request.user):
            serializer = TenancySerializer(tenancy)
            return Response(serializer.data)
        return Response({"detail": "You do not have permission to view this tenancy."}, status=status.HTTP_403_FORBIDDEN)

    def put(self, request, pk):
        tenancy = self.get_object(pk)
        # Assuming only landlords can update tenancy agreements
        if request.user.role == 'landlord' and tenancy.apartment.property.landlord == request.user:
            serializer = TenancySerializer(tenancy, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "You do not have permission to edit this tenancy."}, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk):
        tenancy = self.get_object(pk)
        # Assuming only landlords can delete tenancy agreements
        if request.user.role == 'landlord' and tenancy.apartment.property.landlord == request.user:
            tenancy.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Only the landlord of this apartment can delete the tenancy agreement."}, status=status.HTTP_403_FORBIDDEN)
