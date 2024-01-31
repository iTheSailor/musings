from django import forms
from .models import TodoItem
from django.forms import BaseFormSet, formset_factory


class TodoItemForm(forms.ModelForm):
    class Meta:
        model = TodoItem
        fields = ['title', 'details', 'duedate']
        widgets = {
            'title': forms.TextInput(attrs={'class': 'form-control'}),

            'details': forms.Textarea(attrs={'class': 'form-control'}),
            'duedate': forms.SelectDateWidget(attrs={'class': 'date-input'}),
        }
        labels = {
            'title': 'Title',

            'details': 'Details',
            'duedate': 'Due Date',
        }
        help_texts = {
            'title': 'Enter the title of the task',

            'details': 'Enter details of the task',
            'duedate': 'Enter the due date of the task',
        }
        error_messages = {
            'title': {
                'max_length': 'The title must be less than 256 characters',
            },
        }

        required_css_class = 'bootstrap5-req'

        def clean(self):
            cleaned_data = super().clean()
            title = cleaned_data.get('title')

            details = cleaned_data.get('details')
            duedate = cleaned_data.get('duedate')
            if not title and not completed and not details and not duedate:
                raise forms.ValidationError('You have to write something!')
            return cleaned_data
