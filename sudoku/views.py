from django.shortcuts import render

# Create your views here.

def sudoku(request):
    return render(request, 'sudoku/sudoku.html')
