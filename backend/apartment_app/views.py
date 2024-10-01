from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Apartment
from .serializers import ApartmentSerializer
from rest_framework import status


class ApartmentList(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        property_id = request.query_params.get('propertyId')
        if property_id:
            apartments = Apartment.objects.filter(property_id=property_id, property__landlord=request.user)
        else:
            apartments = Apartment.objects.filter(property__landlord=request.user)
        serializer = ApartmentSerializer(apartments, many=True)
        return Response(serializer.data)

    def post(self, request):
        # if request.user.role == 'landlord':
        serializer = ApartmentSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # return Response({"detail": "Only landlords can create apartments."}, status=status.HTTP_403_FORBIDDEN)


class ApartmentDetail(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self, id):
        try:
            return Apartment.objects.get(id=id)
        except Apartment.DoesNotExist:
            return Response({"detail": "Apartment not found."}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, id):
        apartment = self.get_object(id)
        if request.user.role in ['landlord', 'tenant'] and (apartment.property.landlord == request.user or apartment.tenant == request.user):
            serializer = ApartmentSerializer(apartment)
            return Response(serializer.data)
        return Response({"detail": "You do not have permission to view this apartment."}, status=status.HTTP_403_FORBIDDEN)

    def put(self, request, id):
        apartment = self.get_object(id)
        if request.user.role == 'landlord' and apartment.property.landlord == request.user:
            serializer = ApartmentSerializer(apartment, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Only the landlord of this apartment can update it."}, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, id):
        apartment = self.get_object(id)
        if request.user.role == 'landlord' and apartment.property.landlord == request.user:
            apartment.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Only the landlord of this apartment can delete it."}, status=status.HTTP_403_FORBIDDEN)

class AllApartments(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
 
        queryset = Apartment.objects.all()
        # if 'vacant' in request.query_params:
        #     queryset = queryset.filter(vacant=request.query_params['vacant'])
        serializer = ApartmentSerializer(queryset, many=True)
        # print(serializer.data)
        return Response(serializer.data)