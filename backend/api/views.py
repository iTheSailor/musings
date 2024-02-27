from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from . import forecast
from forecast.models import UserLocation
from django.contrib.auth.models import User

import json

class WeatherView(APIView):
    def get(self, request, format=None):
        search = json.dumps(request.GET)
        search = json.loads(search)
        data = forecast.location(search)
        weather_raw = data['weather']
        current = data['current']
        address = data['address']
        weather = WeatherView.transform_weather_data(weather_raw)
        supplement_data = data['supplement']
        transformed_supplement = {}
        if supplement_data:
            for date, forecasts in supplement_data['supplement'].items():
                detailed_forecasts = [{'detailedForecast': period['detailedForecast'], 
                                    'isDaytime': period['isDaytime']} for period in forecasts]
                transformed_supplement[date] = detailed_forecasts
        geodata = data['geodata']
        # print(geodata)

        result = { 'weather': weather, 
                    'address': address, 
                    'supplemental': transformed_supplement, 
                    'geodata': geodata,
                    'current': current
                    }

        return Response(result)
    
    def post(self, request, format=None):
        user = request.user
        address = request.data['address']
        nickname = request.data['nickname']
        user_location = UserLocation(user=user, address=address, nickname=nickname)
        user_location.save()
        return Response({'status': 'success'})
    
    @staticmethod
    def transform_weather_data(weather_data):
        transformed_data = []
        for i in range(len(weather_data['date'])):  
            day_data = {}
            for key, values in weather_data.items():
                day_data[key] = values[i]  
            transformed_data.append(day_data)
        return transformed_data
    
