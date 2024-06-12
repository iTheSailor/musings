from django.urls import path
from . import views

urlpatterns = [
    path('get_stock', views.get_stock, name='get_stock'),
]