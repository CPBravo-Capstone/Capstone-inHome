from django.shortcuts import render
from django.core.exceptions import ValidationError
from django.contrib.auth import login, logout, authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer, User
import requests
from inHome_proj.settings import env




class Register(APIView):
    def post(self, request):
        data = request.data.copy()
        email = data.get("email")
        password = data.get("password")  
        email_verification_response = self.verify_email_address(email)
        if not email_verification_response.get("isValid"):
            return Response({
                "error": "Invalid email address",
                "details": email_verification_response
            }, status=status.HTTP_400_BAD_REQUEST)

        data['username'] = email
        new_user = User(**data)
        try:
            new_user.full_clean()
            new_user.set_password(password)  
            new_user.save()
            login(request, new_user) 
            token = Token.objects.create(user=new_user)
            return Response({
                "User": new_user.email,
                "token": token.key,
                "role": new_user.role,
                "email-verification api response": email_verification_response
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)

    def verify_email_address(self, email_address):
       
        api_key = env.get('API_KEY')
        params = {
            "emailAddress": email_address,
            "key": api_key
        }
        response = requests.get("https://api.bigdatacloud.net/data/email-verify", params=params)
        
        if response.status_code == 200:
            return response.json()
        else:
            return {"isValid": False, "message": "Failed to verify email address"}

class Log_in(APIView):
   def post(self, request):
        data = request.data
        # print("Login attempt with data:", data)  
        email = data.get("email")
        password = data.get("password")
        user = authenticate(request, username=email, password=password)
        if user:
            # print("User authenticated:", user.username) 
            Token.objects.filter(user=user).delete()
            token = Token.objects.create(user=user)
            login(request, user)
            return Response({"token": token.key}, status=status.HTTP_200_OK)
        else:
            # print("Failed authentication for:", email) 
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class TokenReq(APIView):

    authentication_classes=[TokenAuthentication]
    permission_classes = [IsAuthenticated]

class Log_out(TokenReq):
    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response({"detail": "You've been logged out sucessfully."},status=status.HTTP_204_NO_CONTENT)
    

class Info(TokenReq):
    def get(self, request):
        try:
            user = request.user
            return Response({
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "password": user.password,
                "username": user.username,
                "role":user.role
            }, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response(e, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            user = serializer.save()
            if 'password' in request.data:
                user.set_password(request.data['password'])
                user.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"detail": "User account has been deleted."}, status=status.HTTP_204_NO_CONTENT)