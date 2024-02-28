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
        user_id = request.data['user']
        user = User.objects.get(id=user_id)
        address = request.data['address']
        nickname = request.data['nickname']
        user_location = UserLocation(user=user, address=address, nickname=nickname )
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
    
class UserLocationView(APIView):
    def get(self, request, format=None):
        user_id = request.GET['user']
        user = User.objects.get(id=user_id)
        user_locations = UserLocation.objects.filter(user=user)
        locations = []
        for location in user_locations:
            locations.append({
                'id': location.id,
                'address': location.address,
                'nickname': location.nickname,
                'lat': location.lat,
                'lon': location.lon
            })
        return Response({'locations': locations})
    
    def delete(self, request, format=None):
        location_id = request.data['location_id']
        location = UserLocation.objects.get(id=location_id)
        location.delete()
        return Response({'status': 'success'})
    
    def put(self, request, format=None):
        location_id = request.data['location_id']
        nickname = request.data['nickname']
        location = UserLocation.objects.get(id=location_id)
        location.nickname = nickname
        location.save()
        return Response({'status': 'success'})
    

class LoginView(APIView):
    def post(self, request, format=None):
        username = request.data['username']
        password = request.data['password']
        user = User.objects.get(username=username)
        if user.check_password(password):
            return Response({'status': 'success', 'username': username, 'user_id': user.id})
        else:
            return Response({'status': 'failure'})
        

class SignupView(APIView):
    def post(self, request, format=None):
        username = request.data['username']
        password = request.data['password']
        email = request.data['email']
        user = User.objects.create_user(username, email, password)
        user.save()
        return Response({'status': 'success', 'username': username})
