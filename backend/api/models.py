from django.db import models
from django.contrib.auth.models import User
import json
from . import sudoku_logic

# Create your models here.

class UserLocation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_user_locations')
    address = models.CharField(max_length=250)
    nickname = models.CharField(max_length=250, blank=True, null=True)
    lat = models.CharField(max_length=100)
    lon = models.CharField(max_length=100)
    timezone = models.CharField(max_length=100, blank=True, null=True)
    country_code = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.nickname: 
            self.nickname = self.address
        super(UserLocation, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.user.username} - {self.nickname}'
    

class Sudoku(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='api_sudoku_games')
    puzzle = models.TextField()
    current_state = models.TextField()
    solution = models.TextField(blank=True, null=True)
    difficulty = models.CharField(max_length=10)
    time = models.IntegerField(default=0)
    is_finished = models.BooleanField(default=False)
    win = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def create(self, *args, **kwargs):
        print(args)
        print(kwargs)
        userid = args[0]['userid']
        difficulty = args[0]['difficulty']
        user = User.objects.get(id=userid)
        print(user, difficulty, userid)
        puzzle_pair = sudoku_logic.generate_puzzle(difficulty)
        puzzle = puzzle_pair[0]
        solution = puzzle_pair[1]
        puzzle_list = puzzle.tolist()
        current_state = self.transform_current_state_to_dict(puzzle_list)
        if puzzle is not None:
            Sudoku.objects.create(
                difficulty=difficulty, 
                puzzle=puzzle_list, 
                solution=solution.tolist(),
                current_state=current_state, 
                player=user)
            game = Sudoku.objects.filter(puzzle=puzzle_list, player=user).latest('created_at')
            return game
        else:
            print('Failed to create game')
            return None
        
    def save(self, *args, **kwargs):
        # If puzzle or current_state is a Python list (or other structure), convert to JSON string before saving
        if isinstance(self.puzzle, list):
            self.puzzle = json.dumps(self.puzzle)
        if isinstance(self.current_state, list):
            self.current_state = json.dumps(self.current_state)
        if isinstance(self.solution, list):
            self.solution = json.dumps(self.solution)
        super().save(*args, **kwargs)

    def load_current_state(self):
        # Deserialize the current_state from JSON string back to Python object
        if isinstance(self.current_state, str):
            try:
                return json.loads(self.current_state)
            except json.JSONDecodeError:
                # Handle error or return a default value if JSON is corrupted
                return None
        return self.current_state  # or some default value if it's neither a string nor a list

    def __str__(self):
        return f'{self.difficulty} Sudoku on {self.created_at.strftime("%d-%b-%Y")}'

    
    @staticmethod
    def get_user_games(userid):
        try:
            user = User.objects.get(id=userid)
            return Sudoku.objects.filter(player=user).order_by('-created_at')
        except:
            return None
        
    @staticmethod
    def transform_puzzle(puzzle):
        transformed_puzzle = []
        puzzle = puzzle[1:-1]
        puzzle = puzzle.split('\n')
        for i in range(len(puzzle)):
            puzzle[i] = puzzle[i].strip()
        for row in puzzle:
            list_row = []
            row = row[1:-1]
            row = row.strip('[').strip(']').strip()
            for i in range(len(row)):
                if row[i] != ' ':
                    cell = int(row[i])
                    list_row.append(cell)
            transformed_puzzle.append(list_row)
        return transformed_puzzle
    
    @staticmethod
    def transform_current_state_to_dict(current_state):
        print(current_state)
        print(type(current_state))
        transformed_state = []
        for row in current_state:
            new_row = []
            for value in row:
                cell = {'value': value, 'clue': value != 0}
                new_row.append(cell)
            transformed_state.append(new_row)
        return transformed_state
    
    @staticmethod
    def delete_game(gameid, userid):
        game = Sudoku.objects.get(id=gameid, player=userid)
        if game:
            game.delete()
            return True
        else:
            return False
        
    @staticmethod
    def update_time(gameid, time):
        game = Sudoku.objects.get(id=gameid)
        game.time = time
        game.save()
        return True
    
    @staticmethod
    def save_game(gameid, current_state, time):
        game = Sudoku.objects.get(id=gameid)
        game.current_state = current_state
        game.time = time
        game.save()
        return True
    

class TodoItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=256)
    completed = models.BooleanField(default=False)
    created = models.DateField(auto_now_add=True)
    description = models.TextField(blank=True)
    duedate = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.title
    
class Image(models.Model):
    title = models.CharField(max_length=256)
    image = models.ImageField(upload_to='images/')

class PortfolioItem(models.Model):
    title = models.CharField(max_length=256)
    description = models.TextField()
    image = models.ImageField(upload_to='images/', blank=True)
    technology = models.CharField(max_length=256)
    created = models.DateField(auto_now_add=True)
    updated = models.DateField(auto_now=True)
    
    def __str__(self):
        return self.title
    