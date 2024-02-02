from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path ('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('weather/', include('weather.urls'), name='weather'),
    path('sudoku/', include('sudoku.urls'), name='sudoku'),
    path('todo/', include('todo.urls'), name='todo'),
]