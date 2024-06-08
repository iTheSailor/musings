from django.urls import path
from . import views
from rest_framework import routers


urlpatterns = [
    path('weather', views.WeatherView.as_view(), name='weather'),
    path('weather/saved', views.UserLocationView.as_view(), name='weatherSaved'),

    path('sudoku/play', views.create_sudoku_game, name='sudoku'),
    path('sudoku/updateTime', views.GenerateSudokuView.as_view(), name='sudokuTimer'),
    path('sudoku/checkSolution', views.check_sudoku_solution, name='sudokuSolution'),
    path('sudoku/giveUp', views.give_up, name='sudokuGiveUp'),
    path('sudoku/savedGames', views.get_user_games, name='savedGames'),
    path('sudoku/deleteGame', views.delete_game, name='deleteGame'),
    path('sudoku/saveGame', views.save_game, name='saveGame'),

    path('todo/', views.TodoView.as_view(), name='todo'),
    # path('todo/delete', views.delete_todo_item, name='deleteTodo'),

    path('portfolio/', views.PortfolioItemView, name='portfolio'),
    path('portfolio/create', views.PortfolioItemCreate, name='portfolioCreate'),
    path('portfolio/update/<int:id>', views.PortfolioItemEdit, name='portfolioUpdate'),
    path('portfolio/delete/<int:id>', views.PortfolioItemDelete, name='portfolioDelete'),

    path('login', views.LoginView.as_view(), name='login'),
    path('signup', views.SignupView.as_view(), name='signup'),
]

router = routers.DefaultRouter()
router.register(r'images', views.ImageModelViewSet, basename='images')

urlpatterns += router.urls
