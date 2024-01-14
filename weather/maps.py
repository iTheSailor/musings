import googlemaps
from datetime import datetime
import os

gmaps = googlemaps.Client(key=os.environ.get('GMAPS_KEY'))

def geocode(address):
    geocode_result = gmaps.geocode(address)
    return geocode_result[0]['geometry']['location']

