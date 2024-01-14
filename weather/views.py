from django.shortcuts import render
import os
from . import maps
import requests

# Create your views here.

def weather(request):
    context={
        'gmaps_key': os.environ['GMAPS_KEY'],
    }
    return render(request, 'weather/weather.html', context)

def weather_at_location(request):
    address = request.GET['address']
    location = maps.geocode(address)
    
    long = location['lng']
    lat = location['lat']
    #  get weather from https://api.weather.gov/points/{latitude},{longitude}
    get_weather = requests.get(f'https://api.weather.gov/points/{lat},{long}')
    weather_json = get_weather.json()
    forecast_url = weather_json['properties']['forecast']
    forecast = requests.get(forecast_url).json()
    
    context = {
        'gmaps_key': os.environ['GMAPS_KEY'],
        'forecast': forecast,
    }
    return render(request, 'weather/partials/weather_at_location.html', context)

