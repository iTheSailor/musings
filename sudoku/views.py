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
    existing_game = Sudoku.objects.filter(player=request.user.id)
    existing_games = []
    for game in existing_game:
        request.session['sudoku_solution'] = game.solution
        puzzle_board = json.loads(game.puzzle)
        current_state = json.loads(game.current_state)
        time = game.time

        difficulty = game.difficulty
        is_finished = game.is_finished
        existing_games.append({
            'game_id': game.id,
            'puzzle_board': puzzle_board,
            'current_state': current_state,
            'time': time,
            'difficulty': difficulty,
            'is_finished': is_finished,
            'created_at': game.created_at.strftime('%d-%b %H:%M'),
        })
    context = {
        'existing_games': existing_games
    }

    return render(request, 'sudoku/sudoku.html', context)

@csrf_exempt
def save_game(request):
    user=request.user
    if not user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'User not authenticated'})
    data=request.POST.get('sudoku_data')
    data=json.loads(data)
    current_state=data['rows']
    game_id=data['game_id']
    current_state = [[int(cell) if cell else 0 for cell in row] for row in current_state]
    current_board = Sudoku.objects.get(id=game_id)
    current_board.current_state = json.dumps(current_state)
    current_board.save()

    return JsonResponse({'success': True, 'message': 'Game saved successfully'})


def load_game(request):
    game_id = request.POST.get('game')
    game = Sudoku.objects.get(id=game_id)

    # Load the original puzzle and current state from the game
    puzzle_board = json.loads(game.puzzle)
    current_state = json.loads(game.current_state)
    time = game.time
    difficulty = game.difficulty

    # Enhance current_state with clue information
    enhanced_current_state = enhance_state_with_clues(puzzle_board, current_state)

    context = {
        'game_id': game_id,
        'current_state': enhanced_current_state,  # Use the enhanced current state
        'new_game': False,
        'difficulty': difficulty,
        'time': time,
    }

    response = render(request, 'sudoku/partials/puzzleBoard.html', context)
    print(game_id)
    return trigger_client_event(response, "loadBoard", after="swap")

def enhance_state_with_clues(puzzle_board, current_state):

    enhanced_state = []

    for row_index, row in enumerate(puzzle_board):
        enhanced_row = []
        for col_index, value in enumerate(row):
            is_clue = value != 0  # If the original puzzle cell is not empty, it's a clue
            cell_value = current_state[row_index][col_index] if current_state[row_index][col_index] != 0 else value
            enhanced_row.append({
                "value": cell_value,
                "clue": is_clue,
            })
        enhanced_state.append(enhanced_row)

    return enhanced_state
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
    game_id = Sudoku.objects.latest('id').id
    context = {
        'game_id': game_id,
        'puzzle_board' : puzzle_board,
        'difficulty': difficulty,
        'new_game': True}
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