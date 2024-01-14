import requests

def get_weather(lat, long):
    get_weather = requests.get(f'https://api.weather.gov/points/{lat},{long}')
    weather_json = get_weather.json()
    forecast_url = weather_json['properties']['forecast']
    forecast = requests.get(forecast_url).json()
    forecast = forecast['properties']['periods']
    weather_by_date = {}
    for period in forecast:
        date_str = period['startTime'].split('T')[0]
        if date_str not in weather_by_date:
            weather_by_date[date_str] = []
        weather_by_date[date_str].append(period)
    return weather_by_date