import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry
import requests
from requests.structures import CaseInsensitiveDict
import os
import json

cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)

def location(search):
	# print(search)
	address = search
	url = f"https://api.geoapify.com/v1/geocode/search?text={address}&limit=1&format=json&apiKey={os.environ['GEOCODE_KEY']}"
	# print(url)
	headers = CaseInsensitiveDict()
	headers["Accept"] = "application/json"
	resp = requests.get(url, headers=headers)
	# print(resp.status_code)
	data = resp.json()
	result = data['results'][0]  # Access the first result

	lon = result['lon']
	lat = result['lat']
	_address = result['formatted']
	country_code = result.get('country_code', '').lower()
	geodata= {
		"lat": lat,
		"lon": lon
	}
	supplement = None
	if country_code == "us":
		location = (lat, lon)
		supplement = supplemental(location)
	location = (lat, lon)

	weather = forecast(location)
	data = {"address": _address, "weather": weather, "supplement": supplement, "geodata": geodata}
	return data

def supplemental(search):
    lat = search[0]
    long = search[1]
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

    weather_bundle = {
        'supplement': weather_by_date,
    }


    return weather_bundle


def forecast(search):
	lattitude = search[0]
	longitude = search[1]
	params={
		"latitude": lattitude,
		"longitude": longitude,
		"hourly": "is_day",
		"daily": ["weather_code", "temperature_2m_max", "temperature_2m_min", "apparent_temperature_max", "apparent_temperature_min", "sunrise", "sunset", "precipitation_sum", "precipitation_hours", "precipitation_probability_max"],
		"forecast_hours": 6,
		"temperature_unit": "fahrenheit",
		"wind_speed_unit": "mph",
		"precipitation_unit": "inch",
		"timezone": "auto"
	}
	url = "https://api.open-meteo.com/v1/forecast"	
	responses = openmeteo.weather_api(url, params=params)
	response = responses[0]
	hourly = response.Hourly()
	hourly_is_day = hourly.Variables(0).ValuesAsNumpy()

	hourly_data = {"date": pd.date_range(
		start = pd.to_datetime(hourly.Time(), unit = "s"),
		end = pd.to_datetime(hourly.TimeEnd(), unit = "s"),
		freq = pd.Timedelta(seconds = hourly.Interval()),
		inclusive = "left"
	)}
	hourly_data["is_day"] = hourly_is_day
	hourly_dataframe = pd.DataFrame(data = hourly_data)
	daily = response.Daily()
	daily_weather_code = daily.Variables(0).ValuesAsNumpy()
	daily_temperature_2m_max = daily.Variables(1).ValuesAsNumpy()
	daily_temperature_2m_min = daily.Variables(2).ValuesAsNumpy()
	daily_apparent_temperature_max = daily.Variables(3).ValuesAsNumpy()
	daily_apparent_temperature_min = daily.Variables(4).ValuesAsNumpy()
	daily_sunrise = daily.Variables(5).ValuesAsNumpy()
	daily_sunset = daily.Variables(6).ValuesAsNumpy()
	daily_precipitation_sum = daily.Variables(7).ValuesAsNumpy()
	daily_precipitation_hours = daily.Variables(8).ValuesAsNumpy()
	daily_precipitation_probability_max = daily.Variables(9).ValuesAsNumpy()

	daily_data = {"date": pd.date_range(
		start = pd.to_datetime(daily.Time(), unit = "s"),
		end = pd.to_datetime(daily.TimeEnd(), unit = "s"),
		freq = pd.Timedelta(seconds = daily.Interval()),
		inclusive = "left"
	)}
	daily_data["weather_code"] = daily_weather_code
	daily_data["temperature_2m_max"] = daily_temperature_2m_max
	daily_data["temperature_2m_min"] = daily_temperature_2m_min
	daily_data["apparent_temperature_max"] = daily_apparent_temperature_max
	daily_data["apparent_temperature_min"] = daily_apparent_temperature_min
	daily_data["sunrise"] = daily_sunrise
	daily_data["sunset"] = daily_sunset
	daily_data["precipitation_sum"] = daily_precipitation_sum
	daily_data["precipitation_hours"] = daily_precipitation_hours
	daily_data["precipitation_probability_max"] = daily_precipitation_probability_max


	daily_dataframe = pd.DataFrame(data = daily_data)
	daily_string = daily_dataframe
	hourly_string = hourly_dataframe
	daily_dict = daily_dataframe.to_dict()
	hourly_dict = hourly_dataframe.to_dict()

	# print(daily_dataframe, hourly_dataframe)

	return daily_dict