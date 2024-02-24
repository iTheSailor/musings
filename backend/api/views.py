from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from . import forecast
import json

class WeatherView(APIView):
    def get(self, request, format=None):
        data = json.dumps(request.GET)
        data = json.loads(data)
        result = forecast.location(data)
        return Response(result)