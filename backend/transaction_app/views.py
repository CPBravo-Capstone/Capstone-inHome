from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from .serializers import TransactionSerializer  
from rest_framework import status

class TransactionList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role == 'landlord':
            transactions = Transaction.objects.filter(apartment__property__landlord=request.user)
        elif request.user.role == 'tenant':
            transactions = Transaction.objects.filter(apartment__tenant=request.user)
        else:
            return Response({"detail": "You do not have permission to view transactions."}, status=status.HTTP_403_FORBIDDEN)
        
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role == 'landlord':
            serializer = TransactionSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "Only landlords can create transactions."}, status=status.HTTP_403_FORBIDDEN)

class TransactionDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Transaction.objects.get(pk=pk)
        except Transaction.DoesNotExist:
            return Response({"detail": "Transaction not found."}, status=status.HTTP_404_NOT_FOUND)

    def get(self, request, pk):
        transaction = self.get_object(pk)
        if request.user == transaction.apartment.tenant or (request.user.role == 'landlord' and transaction.apartment.property.landlord == request.user):
            serializer = TransactionSerializer(transaction)
            return Response(serializer.data)
        return Response({"detail": "You do not have permission to view this transaction."}, status=status.HTTP_403_FORBIDDEN)

    def put(self, request, pk):
        transaction = self.get_object(pk)
        if request.user.role == 'landlord' and transaction.apartment.property.landlord == request.user:
            serializer = TransactionSerializer(transaction, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"detail": "You do not have permission to edit this transaction."}, status=status.HTTP_403_FORBIDDEN)

    def delete(self, request, pk):
        transaction = self.get_object(pk)
        if request.user.role == 'landlord' and transaction.apartment.property.landlord == request.user:
            transaction.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response({"detail": "Only the landlord of this apartment can delete the transaction."}, status=status.HTTP_403_FORBIDDEN)
