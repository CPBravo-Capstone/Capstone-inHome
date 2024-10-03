from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Maintenance
from .serializers import MaintenanceSerializer 
from rest_framework import status

class MaintenanceList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'landlord':
            maintenance_requests = Maintenance.objects.filter(apartment__property__landlord=request.user)
        elif request.user.role == 'tenant':
            maintenance_requests = Maintenance.objects.filter(apartment__tenant=request.user)
        else:
            return Response({"detail": "You do not have permission to view maintenance requests."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = MaintenanceSerializer(maintenance_requests, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role == 'tenant':
            serializer = MaintenanceSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(tenant=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Only tenants can create maintenance requests."}, status=status.HTTP_403_FORBIDDEN)

class MaintenanceDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Maintenance.objects.get(pk=pk)
        except Maintenance.DoesNotExist:
            return Response({"detail": "Maintenance request not found."}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        maintenance_request = self.get_object(pk)
        if request.user == maintenance_request.apartment.tenant or (request.user.role == 'landlord' and maintenance_request.apartment.property.landlord == request.user):
            serializer = MaintenanceSerializer(maintenance_request)
            return Response(serializer.data)
        return Response({"detail": "You do not have permission to view this maintenance request."}, status=status.HTTP_403_FORBIDDEN)

    def put(self, request, pk):
        maintenance_request = self.get_object(pk)
        if request.user.role == 'landlord' and maintenance_request.apartment.property.landlord == request.user:
            serializer = MaintenanceSerializer(maintenance_request, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request.user == maintenance_request.apartment.tenant:
            # Tenants may only be allowed to update certain fields, like 'description'
            serializer = MaintenanceSerializer(maintenance_request, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "You do not have permission to edit this maintenance request."}, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk):
        maintenance_request = self.get_object(pk)
        if request.user == maintenance_request.apartment.tenant:
            maintenance_request.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Only the requesting tenant can delete the maintenance request."}, status=status.HTTP_403_FORBIDDEN)
