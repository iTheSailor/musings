from django.urls import path
from . import views

app_name = 'forecast'

urlpatterns = [
    path('', views.index, name='index'),
    path('weather', views.weather, name='weather'),
    path('addLocation', views.addLocation, name='addLocation'),
    path('deleteLocation', views.deleteLocation, name='deleteLocation'),
    path('deleteLocationWeatherView', views.deleteLocationWeatherView, name='deleteLocationWeatherView'),
    path('changeNick', views.changeNick, name='changeNick'),
    path('changeNickCancel', views.changeNickCancel, name='changeNickCancel'),
]