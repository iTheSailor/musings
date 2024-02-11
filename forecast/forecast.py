import openmeteo_requests
import requests_cache
import pandas as pd
from retry_requests import retry
import requests
from requests.structures import CaseInsensitiveDict
import os

cache_session = requests_cache.CachedSession('.cache', expire_after = 3600)
retry_session = retry(cache_session, retries = 5, backoff_factor = 0.2)
openmeteo = openmeteo_requests.Client(session = retry_session)

def location(search):
	address = search
	url = f"https://api.geoapify.com/v1/geocode/search?text={address}&apiKey={os.environ['GEOCODE_KEY']}"
	headers = CaseInsensitiveDict()
	headers["Accept"] = "application/json"
	resp = requests.get(url, headers=headers)
	print(resp.status_code)
	data = resp.json()
	lat = data["features"][0]["properties"]["lat"]
	lon = data["features"][0]["properties"]["lon"]
	address = data["features"][0]["properties"]["formatted"]
	location = (lat, lon)
	weather = forecast(location)
	data = {"address": address, "weather": weather}
	return data


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
	print(hourly_dataframe)
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
	daily_string = daily_dataframe.to_string()
	hourly_string = hourly_dataframe.to_string()
	print(daily_string, hourly_string)

	# print(daily_dataframe, hourly_dataframe)

	return daily_string, hourly_string
