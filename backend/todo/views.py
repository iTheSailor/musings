from django.shortcuts import render, redirect
from django.urls import reverse
from .models import TodoItem
from django.views.generic import FormView
from .forms import TodoItemForm

# Create your views here.

def todo (request):
    todos = TodoItem.objects.filter(completed=False)
    print(todos)
    donetodos = TodoItem.objects.filter(completed=True)
    context = {'todos': todos, 'donetodos': donetodos}
    return render(request, 'todo/todo.html', context)

class AddView (FormView):
    template_name = 'todo/partials/add.html'
    form_class = TodoItemForm
    def get_success_url(self):
        print('success')
        print(self.request.POST)
        form = TodoItemForm(self.request.POST)
        if form.is_valid():
            form.save()
            return reverse('todo')
        else:
            return reverse('add')


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