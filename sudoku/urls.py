from django.urls import path
from . import views

urlpatterns = [
    path('', views.sudoku, name='sudoku'),
    path('puzzle_init', views.puzzle_init, name="puzzle_init"),
    path('generate_puzzle', views.generate_puzzle, name="generate_puzzle"),
    path('submit_solution', views.submit_solution, name='submit_solution'),
    # path('solve/', views.solve, name='solve'),
    # path('check/', views.check, name='check'),
    # path('reset/', views.reset, name='reset'),
]