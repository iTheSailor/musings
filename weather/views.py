from django.shortcuts import render
import os
from . import forecast, maps
import requests
from datetime import datetime

# Create your views here.

def weather(request):
    context={
        'gmaps_key': os.environ['GMAPS_KEY'],
    }
    return render(request, 'weather/weather.html', context)

def weather_at_location(request):
    search_type = request.GET.get('searchType', 'address')
    if search_type == 'zip':
        zip = request.GET['zip']
        lat, long = maps.geocode(zip, search_type)
        address = zip
    else:
        address = request.GET['address']
        location = maps.geocode(address, search_type)
        long = location['lng']
        lat = location['lat']
    _forecast = forecast.get_weather(lat, long)
    organized_forecast = {datetime.strptime(date, '%Y-%m-%d'): periods for date, periods in _forecast.items()}
    context = {
        'gmaps_key': os.environ['GMAPS_KEY'],
        'forecast': organized_forecast,
        'address': address,
    }
    return render(request, 'weather/partials/weather_at_location.html', context)
