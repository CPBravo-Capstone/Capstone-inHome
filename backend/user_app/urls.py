from django.urls import path
from user_app.views import Register, Log_in, Log_out, Info


urlpatterns = [
    path("", Info.as_view(), name="info"),
    path("register/", Register.as_view(), name="register"),
    path("login/", Log_in.as_view(), name="login"),
    path("logout/", Log_out.as_view(), name="logout"),
]
