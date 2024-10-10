from django.urls import path
from apartment_app.views import ApartmentList, ApartmentDetail, AllApartments


urlpatterns = [
    path("", ApartmentList.as_view(), name="apartments"),
    path("<int:id>/", ApartmentDetail.as_view(), name="one_apartment"),
    path("all/", AllApartments.as_view(), name="all_apartments"),
]
