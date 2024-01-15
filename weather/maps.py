import googlemaps
from datetime import datetime
from django.conf import settings
import os

gmaps = googlemaps.Client(key=os.environ.get('GMAPS_KEY'))

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
        geocode_result = gmaps.geocode(query)
        print(geocode_result)
        return geocode_result[0]['geometry']['location']

