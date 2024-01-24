import googlemaps
from datetime import datetime
from django.conf import settings
import os
import requests
import json

geocode_key = os.environ['GEOCODE_KEY']

def geocode(query, search_type):

    zipcodes_file_path = os.path.join(settings.BASE_DIR, 'static/weather/res/ziplatlong.txt')
    if search_type == 'zip':
        with open (zipcodes_file_path, 'r') as f:
            for line in f:
                if query in line:
                    lat = line.split(',')[1].strip()
                    long = line.split(',')[2].strip()
                    print(lat, long)
                    return lat, long
                    
    else:
        query = query.replace(' ', '+')
        geocode_url = f"https://api.geocod.io/v1.7/geocode?q={query}&api_key={geocode_key}"
        print(geocode_url)
        coordinates = requests.get(geocode_url).json()
        lat = coordinates['results'][0]['location']['lat']
        long = coordinates['results'][0]['location']['lng']
        print(lat, long)
        return lat, long


        

