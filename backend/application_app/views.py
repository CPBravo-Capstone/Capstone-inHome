from django.shortcuts import render
from .serializers import ApplicationSerializer, Application
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
# Create your views here.
class ApplicationList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        applications = Application.objects.filter(tenant=request.user)
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = ApplicationSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(tenant=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
