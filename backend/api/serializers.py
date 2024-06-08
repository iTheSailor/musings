from rest_framework import serializers
from .models import Sudoku, TodoItem, Image, PortfolioItem
import json

class SudokuSerializer(serializers.ModelSerializer):
    transformed_state = serializers.SerializerMethodField()
    transformed_solution = serializers.SerializerMethodField()
    class Meta:
        model = Sudoku
        fields = [
            'id', 'player', 'puzzle', 'current_state', 'difficulty', 'time',
            'is_finished', 'win', 'created_at', 'updated_at', 'transformed_state', 'transformed_solution', 'solution'
        ]
        depth = 1  # This is optional, use if you want to include nested relations
    
    def get_transformed_state(self, obj):
        try:
            return json.loads(obj.current_state)
        except json.JSONDecodeError:
            print('Error decoding JSON')
            return None
        
    def get_transformed_solution(self, obj):
        try:
            return json.loads(obj.solution)
        except json.JSONDecodeError:
            print('Error decoding JSON')
            return None


class TodoItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodoItem
        fields = ['id', 'title', 'description', 'completed', 'created_at', 'updated_at']
        depth = 1  


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['id', 'title', 'image']

class PortfolioItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioItem
        fields = ['id', 'title', 'description', 'image', 'technology', 'created', 'updated']
        depth = 1
