from django.urls import path
from . import views

urlpatterns = [
    path('weather', views.WeatherView.as_view(), name='weather'),
    path('weather/saved', views.UserLocationView.as_view(), name='weatherSaved'),
    # path('sudoku/play', views.GenerateSudokuView.as_view(), name='sudoku'),
    path('sudoku/play', views.create_sudoku_game, name='sudoku'),
    # path('sudoku/updateTime', views.UpdateSudokuTimeView.as_view(), name='sudokuTimer'),
    path('sudoku/updateTime', views.GenerateSudokuView.as_view(), name='sudokuTimer'),
    path('sudoku/checkSolution', views.check_sudoku_solution, name='sudokuSolution'),
    path('sudoku/savedGames', views.get_user_games, name='savedGames'),
    path('sudoku/deleteGame', views.delete_game, name='deleteGame'),
    path('sudoku/saveGame', views.save_game, name='saveGame'),
    path('login', views.LoginView.as_view(), name='login'),
    path('signup', views.SignupView.as_view(), name='signup'),
]

