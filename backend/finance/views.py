from django.shortcuts import render
from django.http import JsonResponse
from .models import UserWatchlist
import requests
import os

API_KEY = os.environ.get('ALPHA_VANTAGE_KEY')

# Create your views here.
def get_stock(request):
    symbol = request.GET.get('symbol')
    url = f'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol={symbol}&interval=5min&apikey={API_KEY}'
    response = requests.get(url)
    data = response.json()
    return JsonResponse(data)