from django.shortcuts import render
import os
from . import forecast, maps
import requests
from datetime import datetime
from .models import SavedLocation
from django.http import JsonResponse

# Create your views here.

def weather(request):
    if request.user.is_authenticated:
        saved_locations = SavedLocation.objects.filter(user=request.user)
        context = {
            'saved_locations': saved_locations
        }
        return render(request, 'weather/weather.html', context)
    return render(request, 'weather/weather.html')

def weather_at_location(request):
    search_type = request.GET.get('searchType', 'address')
    if search_type == 'zip':
        zip = request.GET['zip']
        lat, long = maps.geocode(zip, search_type)
        address = zip
    else:
        address = request.GET['address']
        location = maps.geocode(address, search_type)
        long = location[1]
        lat = location[0]
    _forecast = forecast.get_weather(lat, long).get('forecast')
    _hourly = forecast.get_weather(lat, long).get('hourly')
    organized_forecast = {datetime.strptime(date, '%Y-%m-%d'): periods for date, periods in _forecast.items()}
    context = {
        'gmaps_key': os.environ['GMAPS_KEY'],
        'forecast': organized_forecast,
        'hourly': _hourly,
        'address': address,
    }
    return render(request, 'weather/partials/weather_at_location.html', context)


def save_location(request):
    try:
        user = request.user
        search_type = request.GET.get('searchType', 'address')
        if search_type == 'zip':
            location = request.GET['zip']
            lat, long = maps.geocode(location, search_type)
        else:
            location = request.GET['address']
            lat, long = maps.geocode(location, search_type)
        SavedLocation.objects.create(user=user, location=location, latitude=lat, longitude=long)
        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})
    
