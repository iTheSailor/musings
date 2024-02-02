# forms for login, register, and logout

from django.contrib.auth.models import User
from django import forms

class LoginForm(forms.Form):
    username = forms.CharField(label='Username', max_length=100)
    password = forms.CharField(label='Password', max_length=100, widget=forms.PasswordInput)

class RegisterForm(forms.Form):
    username = forms.CharField(label='Username', max_length=100)
    password = forms.CharField(label='Password', max_length=100, widget=forms.PasswordInput)
    email = forms.EmailField(label='Email', max_length=100)

class LogoutForm(forms.Form):
    pass
