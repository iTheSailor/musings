from django.urls import path, include
from . import views


urlpatterns = [
    path('', views.weather, name='weather'),
    path('weatherAtLocation', views.weather_at_location, name='weatherAtLocation'),
]