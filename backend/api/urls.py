from django.urls import path
from . import views

urlpatterns = [
    path('weather', views.WeatherView.as_view(), name='weather'),
    path('weather/<int:pk>', views.WeatherView.as_view(), name='weather'),
    path('login', views.LoginView.as_view(), name='login'),
    path('signup', views.SignupView.as_view(), name='signup'),
]

