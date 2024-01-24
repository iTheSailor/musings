from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path ('', views.index),
    path('weather/', include('weather.urls'), name='weather'),
    path('sudoku/', include('sudoku.urls'), name='sudoku'),
    path('todo/', include('todo.urls'), name='todo'),
]