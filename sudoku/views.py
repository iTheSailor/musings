from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import sudoku_logic
from django_htmx.http import trigger_client_event
from django.views.decorators.http import require_http_methods
import json
from .models import Sudoku
# Create your views here.

def sudoku(request):
    existing_game = Sudoku.objects.filter(player=request.user).order_by('-created_at')
    context = {'existing_game': existing_game}
    return render(request, 'sudoku/sudoku.html', context)

@csrf_exempt
def save_game(request):
    user=request.user
    if not user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'User not authenticated'})
    
    data=request.POST.get('sudoku_data')
    data=json.loads(data)
    puzzle=data['puzzle']
    solution=data['solution']
    current_state=data['rows']
    difficulty=data['difficulty']
    time=data['time']
    is_finished=data['is_finished']

    game, created = Sudoku.objects.update_or_create(
        player=user,
        defaults={
            'puzzle': puzzle,
            'solution': solution,
            'current_state': current_state,
            'difficulty': difficulty,
            'time': time,
            'is_finished': is_finished
        }
    )

    return JsonResponse({'success': True, 'message': 'Game saved successfully'})
def existing_game(request):
    user=request.user
    if not user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'User not authenticated'})
    game=Sudoku.objects.filter(player=user).order_by('-created_at')
    if not game:
        return JsonResponse({'success': False, 'message': 'No game found'})
    return JsonResponse({'success': True, 'game': game})

def load_game(request):
    user=request.user
    if not user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'User not authenticated'})
    game=Sudoku.objects.filter(player=user).order_by('-created_at')
    request.session['sudoku_solution'] = game.solution
    if not game:
        return JsonResponse({'success': False, 'message': 'No game found'})
    return render(request, 'sudoku/partials/', context)
@csrf_exempt
def generate_puzzle(request):
    difficulty = request.POST.get('difficulty')
    boards = sudoku_logic.generate_puzzle(difficulty)
    puzzle_board = boards[0].tolist()
    solution = boards[1].tolist()
    request.session['sudoku_solution'] = solution
    Sudoku.objects.create(
        player=request.user,
        puzzle=json.dumps(puzzle_board),
        solution=json.dumps(solution),
        current_state = json.dumps(puzzle_board),
        difficulty=difficulty
    )
    # print(puzzle_board)
    # print(f'solution board {solution}')
    context = {'puzzle_board' : puzzle_board}
    response = render(request, 'sudoku/partials/puzzleBoard.html', context)
    return trigger_client_event(response, "loadBoard", after="swap")

@csrf_exempt
def puzzle_init(request):
    return generate_puzzle(request)

@csrf_exempt
@require_http_methods(["POST"])
def submit_solution(request):
    try:
        solution_board = request.session.get('sudoku_solution')
        # print('solution board')
        # print(solution_board)
        player_board = request.POST.get('sudoku_data')
        # print('player board')
        player_board = json.loads(player_board)['rows']
        player_board = [[int(cell) if cell else 0 for cell in row] for row in player_board]
        # print(player_board)

        if not solution_board or not player_board:
            return JsonResponse({'success': False, 'message': 'Missing data'})

        # Compare player_board with solution_board
        is_correct = solution_board == player_board

        return JsonResponse({'success': True, 'is_correct': is_correct})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})