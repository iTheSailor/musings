from django.shortcuts import render
from django.http import JsonResponse
from .models import UserWatchlist
import requests
import os
from icecream import ic
from collections import OrderedDict
import yfinance as yf

# Create your views here.
def get_stock(request):
    data = {}
    if request.method == 'GET':
        symbol = request.GET.get('symbol')
        stock = yf.Ticker(symbol)
        data = stock.info
    


    return JsonResponse(data)