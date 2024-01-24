from django.urls import path
from . import views

urlpatterns = [
    path('', views.sudoku, name='sudoku'),
    # path('solve/', views.solve, name='solve'),
    # path('check/', views.check, name='check'),
    # path('reset/', views.reset, name='reset'),
]