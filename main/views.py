from django.shortcuts import render
from .forms import LoginForm, RegisterForm, LogoutForm
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.views.generic import FormView



import os

# Create your views here.

def index(request):



    return render(request, 'main/landing.html')

def login_view(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            data = form.cleaned_data
            user = authenticate(username=data['username'], password=data['password'])
            if user is not None:
                login(request, user)
                return HttpResponseRedirect(reverse('index'))
    else:
        form = LoginForm()
    return render(request, 'main/login.html', {'form': form})

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            try:
                data = form.cleaned_data
                user = User.objects.create_user(data['username'], data['email'], data['password'])
                user.save()
                login(request, user)
                return HttpResponseRedirect(reverse('index'))
            except:
                return render(request, 'main/register.html', {'form': form, 'message': 'Username already exists'})
    else:
        form = RegisterForm()
    return render(request, 'main/register.html', {'form': form})

@login_required
def logout_view(request):
    if request.method == 'POST':
        form = LogoutForm(request.POST)
        if form.is_valid():
            logout(request)
            return HttpResponseRedirect(reverse('index'))
    else:
        form = LogoutForm()
    return render(request, 'main/logout.html', {'form': form})
