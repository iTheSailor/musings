from django.shortcuts import render
from . import forecast

# Create your views here.

def index(request):
    return render(request, 'forecast/index.html')

def weather(request):
    location = request.GET.get('location')
    data = forecast.location(location)
    weather_raw = data['weather']
    address = data['address']
    weather = transform_weather_data(weather_raw)
    print(address)
    context = {'weather': weather, 'address': address}
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