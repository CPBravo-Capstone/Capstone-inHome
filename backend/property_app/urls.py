from django.urls import path
from property_app.views import PropertyList, PropertyDetail


urlpatterns = [
    path("", PropertyList.as_view(), name="all_properties"),
    path("<int:id>/", PropertyDetail.as_view(), name="one_property"),
]
