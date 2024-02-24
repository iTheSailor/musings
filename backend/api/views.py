from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from forecast import forecast

class WeatherView(APIView):
    def get(self, request, format=None):
        weather = forecast.location(request.GET.get('search'))
        return Response({'weather': weather})