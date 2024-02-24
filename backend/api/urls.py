from django.urls import path
from . import views

urlpatterns = [
    path('weather', views.WeatherView.as_view(), name='weather'),
]

