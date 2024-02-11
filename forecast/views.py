from django.shortcuts import render
from . import forecast

# Create your views here.

def index(request):
    return render(request, 'forecast/index.html')

def weather(request):
    location = request.GET.get('location')
    data = forecast.location(location)
    weather = data['weather']
    address = data['address']
    context = {'weather': weather, 'address': address}
    return render(request, 'forecast/weather.html', context)

