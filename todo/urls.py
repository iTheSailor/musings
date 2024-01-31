from django.urls import path, include, reverse

from . import views

urlpatterns = [
    path('', views.todo, name='todo'),
    path('add/', views.AddView.as_view(), name='add'),
    # path('addTodo/', views.submitTodo, name='addTodo'),
    path('deleteTodo/<int:todo_id>/', views.deleteTodo, name='deleteTodo'),
    path('editTodo/<int:todo_id>/', views.editTodo, name='editTodo'),
    path('saveEdit/<int:todo_id>/', views.saveEdit, name='saveEdit'),
    path('completeTodo/<int:todo_id>/', views.completeTodo, name='completeTodo'),
]