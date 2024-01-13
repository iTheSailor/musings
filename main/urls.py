from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path ('', views.index),
    path('weather/', include('weather_app.urls')),
]