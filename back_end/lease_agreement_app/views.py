from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import LeaseAgreement
from .serializers import LeaseAgreementSerializer  
from rest_framework import status

class LeaseAgreementList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'landlord':
            lease_agreements = LeaseAgreement.objects.filter(apartment__property__landlord=request.user)
            serializer = LeaseAgreementSerializer(lease_agreements, many=True)
            return Response(serializer.data)
        elif request.user.role == 'tenant':
            lease_agreements = LeaseAgreement.objects.filter(tenant=request.user)
            serializer = LeaseAgreementSerializer(lease_agreements, many=True)
            return Response(serializer.data)
        return Response({"detail": "You do not have permission to view lease agreements."}, status=status.HTTP_403_FORBIDDEN)

    def post(self, request):
        if request.user.role == 'landlord':
            serializer = LeaseAgreementSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Only landlords can create lease agreements."}, status=status.HTTP_403_FORBIDDEN)

class LeaseAgreementDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return LeaseAgreement.objects.get(pk=pk)
        except LeaseAgreement.DoesNotExist:
            return Response({"detail": "Lease agreement not found."}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        lease_agreement = self.get_object(pk)
        if request.user == lease_agreement.tenant or (request.user.role == 'landlord' and lease_agreement.apartment.property.landlord == request.user):
            serializer = LeaseAgreementSerializer(lease_agreement)
            return Response(serializer.data)
        return Response({"detail": "You do not have permission to view this lease agreement."}, status=status.HTTP_403_FORBIDDEN)

    def put(self, request, pk):
        lease_agreement = self.get_object(pk)
        if request.user.role == 'landlord' and lease_agreement.apartment.property.landlord == request.user:
            serializer = LeaseAgreementSerializer(lease_agreement, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        elif request.user == lease_agreement.tenant:
            # Assume tenants can only update certain fields, like 'tenant_signature'
            serializer = LeaseAgreementSerializer(lease_agreement, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "You do not have permission to edit this lease agreement."}, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk):
        lease_agreement = self.get_object(pk)
        if request.user.role == 'landlord' and lease_agreement.apartment.property.landlord == request.user:
            lease_agreement.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Only the landlord of this apartment can delete the lease agreement."}, status=status.HTTP_403_FORBIDDEN)
