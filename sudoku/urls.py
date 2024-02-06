from django.urls import path
from . import views

urlpatterns = [
    path('', views.sudoku, name='sudoku'),
    path('puzzle_init', views.puzzle_init, name="puzzle_init"),
    path('load_game', views.load_game, name="load_game"),
    path('save_game', views.save_game, name="save_game"),
    path('generate_puzzle', views.generate_puzzle, name="generate_puzzle"),
    path('submit_solution', views.submit_solution, name='submit_solution'),
    path('update_game_duration', views.update_game_duration, name='update_game_duration'),
    path('give_up/<int:id>', views.give_up, name='give_up'),
    # path('solve/', views.solve, name='solve'),
    # path('check/', views.check, name='check'),
    # path('reset/', views.reset, name='reset'),
]