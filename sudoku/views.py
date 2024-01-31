from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import sudoku_logic

# Create your views here.

def sudoku(request):
    return render(request, 'sudoku/sudoku.html')

@csrf_exempt
def generate_puzzle(request):
    difficulty = request.POST.get('difficulty')
    puzzle_board = sudoku_logic.generate_puzzle(difficulty)
    context = {'puzzle_board' : puzzle_board}
    return render(request,'sudoku/partials/puzzleBoard.html', context)

@csrf_exempt
def puzzle_init(request):
    print(request)
    print(request)
    return generate_puzzle(request)
@csrf_exempt
def submit_solution(request):
    sudoku_data = request.POST.get('sudoku_data')
    if sudoku_data:
        return JsonResponse({'result': 'success', 'message': 'data recieved'})
    else:
        return JsonResponse({'result': 'uh oh', 'message': 'we did an oopsie'})
