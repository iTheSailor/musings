from django.urls import path
from . import views

urlpatterns = [
    path('weather', views.WeatherView.as_view(), name='weather'),
    path('weather/saved', views.UserLocationView.as_view(), name='weatherSaved'),
    path('sudoku/play', views.GenerateSudokuView.as_view(), name='sudoku'),
    # path('sudoku/updateTime', views.UpdateSudokuTimeView.as_view(), name='sudokuTimer'),
    path('sudoku/updateTime', views.GenerateSudokuView.update_sudoku_time, name='sudokuTimer'),
    path('login', views.LoginView.as_view(), name='login'),
    path('signup', views.SignupView.as_view(), name='signup'),
]

