from django.shortcuts import render, redirect
from . import forecast
from . import models
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse

# Create your views here.

def index(request):
    if request.user.is_authenticated:
        # print(request.user)
        user = request.user
        user_locations = models.UserLocation.objects.filter(user=user)
        context = {'locations': user_locations}
        return render(request, 'forecast/index.html', context)
    else:
        return render(request, 'forecast/index.html')

def weather(request):
    location = request.GET.get('address')
    data = forecast.location(location)
    weather_raw = data['weather']
    address = data['address']
    weather = transform_weather_data(weather_raw)
    supplement_data = data['supplement']
    transformed_supplement = {}
    if supplement_data:
        for date, forecasts in supplement_data['supplement'].items():
            detailed_forecasts = [{'detailedForecast': period['detailedForecast'], 
                                'isDaytime': period['isDaytime']} for period in forecasts]
            transformed_supplement[date] = detailed_forecasts
    geodata = data['geodata']
    # print(geodata)
    if request.user.is_authenticated:
        user_locations_with_id = models.UserLocation.objects.filter(user=request.user).values('address', 'id', 'nickname')
        context = { 'weather': weather, 
                    'address': address, 
                    'supplement': transformed_supplement, 
                    'geodata': geodata, 
                    'user_locations': [location['address'] for location in user_locations_with_id],
                    'location_ids': {location['address']: location['id'] for location in user_locations_with_id},
                    'nicknames': {location['address']: location['nickname'] for location in user_locations_with_id}
                    }
    else:
        context = { 'weather': weather, 
                    'address': address, 
                    'supplement': transformed_supplement, 
                    'geodata': geodata
                    }
    return render(request, 'forecast/weather.html', context)

def transform_weather_data(weather_data):
    transformed_data = []
    for i in range(len(weather_data['date'])):  
        day_data = {}
        for key, values in weather_data.items():
            day_data[key] = values[i]  
        transformed_data.append(day_data)
    return transformed_data


def addLocation(request):
    # print(request)
    user = request.user
    address = request.GET.get('address')
    # print(address)
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')
    user_location = models.UserLocation(user=user, address=address, lat=lat, lon=lon)
    user_location.save()
    return HttpResponse('')


def deleteLocation(request):
    location_id = request.GET.get('location_id')
    models.UserLocation.objects.get(id=location_id).delete()
    return redirect('forecast:index')

def deleteLocationWeatherView(request):
    location_id = request.GET.get('location_id')
    # print(location_id)
    models.UserLocation.objects.get(id=location_id).delete()
    return HttpResponse('')

@csrf_exempt
def changeNick(request):
    if request.method == 'GET':
        location_id = request.GET.get('location_id')
        location = models.UserLocation.objects.get(id=location_id)
        context = {'location': location}
        response = render(request, 'forecast/partials/nick_input.html', context)
        return response
    if request.method == 'POST':
        location_id = request.POST.get('location_id')
        new_nick = request.POST.get('new_nick')
        location = models.UserLocation.objects.get(id=location_id)
        location.nickname = new_nick
        location.save()
        location = models.UserLocation.objects.get(id=location_id)
        context = {'location': location}
        response = render(request, 'forecast/partials/nick.html', context)
    return response

@csrf_exempt
def changeNickCancel(request):
    location_id = request.POST.get('location_id')
    location = models.UserLocation.objects.get(id=location_id)
    context = {'location': location}
    response = render(request, 'forecast/partials/nick.html', context)
    return response