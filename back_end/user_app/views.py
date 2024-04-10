from django.shortcuts import render
from django.core.exceptions import ValidationError
from django.contrib.auth import login, logout, authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_204_NO_CONTENT,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from .models import User

# Create your views here.
class Sign_up(APIView):
    def post(self, request):
        data = request.data.copy()
        data['username'] = request.data.get("username", request.data.get("email"))
        new_user = User(**data)
        try:
            new_user.full_clean()
            new_user.set_password(data.get("password"))
            new_user.save()
            login(request, new_user)
            token = Token.objects.create(user = new_user)
            return Response({"User":new_user.email, "token":token.key}, status=HTTP_201_CREATED)
        except ValidationError as e:
            return Response(e, status=HTTP_400_BAD_REQUEST)

class Log_in(APIView):
    def post(self, request):
        data = request.data
        user = authenticate(username=data.get("email"), password=data.get("password"))
        if user:
            Token.objects.filter(user=user).delete()  # Invalidate the old token
            token = Token.objects.create(user=user)  # Create a new token
            return Response({"token": token.key}, status=HTTP_200_OK)
        return Response("Invalid credentials", status=HTTP_400_BAD_REQUEST)


        # data = request.data.copy()
        # data['username'] = request.data.get("username", request.data.get("email"))
        # user = authenticate(username=data.get("username"), password=data.get("password"))
        # if user:
        #     login(request, user)
        #     token, created = Token.objects.get_or_create(user = user)
        #     return Response({"User":user.email, "token":token.key}, status=HTTP_200_OK)
        # return Response("No user matching credentials", status=HTTP_400_BAD_REQUEST)

class TokenReq(APIView):

    authentication_classes=[TokenAuthentication]
    permission_classes = [IsAuthenticated]

class Log_out(TokenReq):
    def post(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response(status=HTTP_204_NO_CONTENT)
    

class Info(TokenReq):
    def get(self, request):
        try:
            user = request.user
            return Response({
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email
            }, status=HTTP_200_OK)
        except ValidationError as e:
            return Response(e, status=HTTP_400_BAD_REQUEST)

        # try:
        #     data = request.data.copy()
        #     ruser = request.user
        #     ruser.email = data.get("email", ruser.email)
        #     ruser.full_clean()
        #     ruser.save()
        #     return Response({f"first_name: {ruser.first_name}, last_name: {ruser.last_name}, email:{ruser.email}"},status=HTTP_200_OK)
        # except ValidationError as e:
        #     return Response(e, status=HTTP_400_BAD_REQUEST)
