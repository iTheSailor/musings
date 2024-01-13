from django.shortcuts import render
import os

# Create your views here.

def weather(request):
    context={
        'gmaps_key': os.environ['GMAPS_KEY'],
    }
    return render(request, 'weather_app/weather.html', context)

