from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Sudoku(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    puzzle = models.TextField()
    solution = models.TextField()
    current_state = models.TextField()
    difficulty = models.CharField(max_length=10)
    time = models.IntegerField()
    is_finished = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Sudoku by {self.player.username} on {self.created_at.strftime("%d-%b-%Y")}'
