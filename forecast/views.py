from django.shortcuts import render, redirect
from . import forecast
from . import models
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

# Create your views here.

def index(request):
    if request.user.is_authenticated:
        print(request.user)
        user = request.user
        user_locations = models.UserLocation.objects.filter(user=user)
        context = {'locations': user_locations}
        return render(request, 'forecast/index.html', context)
    return render(request, 'forecast/index.html')

def weather(request):
    location = request.GET.get('address')
    data = forecast.location(location)
    weather_raw = data['weather']
    address = data['address']
    weather = transform_weather_data(weather_raw)
    supplement_data = data['supplement']
    transformed_supplement = {}
    for date, forecasts in supplement_data['supplement'].items():
        detailed_forecasts = [{'detailedForecast': period['detailedForecast'], 
                               'isDaytime': period['isDaytime']} for period in forecasts]
        transformed_supplement[date] = detailed_forecasts
    geodata = data['geodata']
    print(geodata)
    context = {'weather': weather, 'address': address, 'supplement': transformed_supplement, 'geodata': geodata}
    return render(request, 'forecast/weather.html', context)

def transform_weather_data(weather_data):
    # Assuming weather_data is your daily_dict with the structure shown above
    transformed_data = []
    for i in range(len(weather_data['date'])):  # Assuming 'date' key exists and has a list of values
        day_data = {}
        for key, values in weather_data.items():
            day_data[key] = values[i]  # Assign each value by key for the day
        transformed_data.append(day_data)
    return transformed_data

@csrf_exempt
def addLocation(request):
    user = request.user
    address = request.GET.get('address')
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')
    models.UserLocation.objects.create(user=user, address=address, lat=lat, lon=lon)
    return JsonResponse({'status': 'success'})

@csrf_exempt
def deleteLocation(request):
    location_id = request.GET.get('location_id')
    models.UserLocation.objects.get(id=location_id).delete()
    return redirect('forecast:index')