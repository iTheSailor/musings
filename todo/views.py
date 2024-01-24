from django.shortcuts import render, redirect
from .models import TodoItem

# Create your views here.

def todo (request):
    todos = TodoItem.objects.filter(completed=False)
    donetodos = TodoItem.objects.filter(completed=True)
    context = {'todos': todos, 'donetodos': donetodos}
    return render(request, 'todo/todo.html', context)

def add (request):
    return render(request, 'todo/partials/add.html')

def addTodo (request):
    data = request.POST
    title = data['title']
    details = data['details']
    duedate = data['date']
    TodoItem.objects.create(title=title, details=details, duedate=duedate)
    return redirect('todo')

def deleteTodo (request, todo_id):
    TodoItem.objects.get(id=todo_id).delete()
    return redirect('todo')

def editTodo (request, todo_id):
    todo = TodoItem.objects.get(id=todo_id)
    context = {'todo': todo}
    return render(request, 'todo/partials/edit.html', context)

def saveEdit (request, todo_id):
    todo = TodoItem.objects.get(id=todo_id)
    data = request.POST
    title = data['title']
    details = data['details']
    duedate = data['date']
    todo.title = title
    todo.details = details
    todo.duedate = duedate
    todo.save()
    return redirect('todo')

def completeTodo (request, todo_id):
    todo = TodoItem.objects.get(id=todo_id)
    todo.completed = True
    todo.save()
    return redirect('todo')