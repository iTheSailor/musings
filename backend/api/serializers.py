from rest_framework import serializers
from .models import Sudoku  # Import your Sudoku model
import json

class SudokuSerializer(serializers.ModelSerializer):
    transformed_state = serializers.SerializerMethodField()
    class Meta:
        model = Sudoku
        fields = [
            'id', 'player', 'puzzle', 'current_state', 'difficulty', 'time',
            'is_finished', 'win', 'created_at', 'updated_at', 'transformed_state'
        ]
        depth = 1  # This is optional, use if you want to include nested relations
    
    def get_transformed_state(self, obj):
        try:
            return json.loads(obj.current_state)
        except json.JSONDecodeError:
            print('Error decoding JSON')
            return None


