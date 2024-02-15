from django.db import models

# Create your models here.

class TodoItem(models.Model):
    title = models.CharField(max_length=256)
    completed = models.BooleanField(default=False)
    created = models.DateField(auto_now_add=True)
    details = models.TextField(blank=True)
    duedate = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.title
    