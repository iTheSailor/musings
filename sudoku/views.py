from django.shortcuts import render, get_object_or_404
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
        if game.is_finished != True:
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
    
    easy_wins = Sudoku.objects.filter(player=request.user.id, difficulty='easy', win=True).count()
    medium_wins = Sudoku.objects.filter(player=request.user.id, difficulty='medium', win=True).count()
    hard_wins = Sudoku.objects.filter(player=request.user.id, difficulty='hard', win=True).count()
    context = {
        'existing_games': existing_games,
        'easy_wins': easy_wins,
        'medium_wins': medium_wins,
        'hard_wins': hard_wins,
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
    time=data['time']
    print(time)
    current_state = [[int(cell) if cell else 0 for cell in row] for row in current_state]
    current_board = Sudoku.objects.get(id=game_id)
    current_board.current_state = json.dumps(current_state)
    current_board.time = time
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
    solution = json.loads(game.solution)
    request.session['sudoku_solution'] = solution

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
    enhanced_current_state = enhance_state_with_clues(puzzle_board, puzzle_board)
    game_id = Sudoku.objects.latest('id').id
    context = {
        'game_id': game_id,
        'puzzle_board' : puzzle_board,
        'current_state': enhanced_current_state,
        'difficulty': difficulty,
        'time': 0,  # Set the time to 0 for a new game
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
        user=request.user
        if not user.is_authenticated:
            return JsonResponse({'success': False, 'message': 'User not authenticated'})
        data=request.POST.get('sudoku_data')
        data=json.loads(data)
        player_board=data['rows']
        game_id=data['game_id']
        solution_board=request.session.get('sudoku_solution')
        # print(player_board)
        player_board = [[int(cell) if cell else 0 for cell in row] for row in player_board]
        if not solution_board or not player_board:
            return JsonResponse({'success': False, 'message': 'Missing data'})

        # Compare player_board with solution_board
        print("Player Board: ", player_board)
        print("Solution Board: ", solution_board)
        print("Comparison: ", solution_board == player_board)
        is_correct = solution_board == player_board
        game = Sudoku.objects.get(id=game_id)
        if is_correct:
            game.is_finished = True
            game.win = True
            game.save()

        return JsonResponse({'success': True, 'is_correct': is_correct})
    except Exception as e:
        return JsonResponse({'success': False, 'message': str(e)})
    
    
@csrf_exempt
def update_game_duration(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'User not authenticated'}, status=403)

    data = json.loads(request.body)
    game_id = data.get('game_id')
    duration = data.get('duration')

    try:
        game = Sudoku.objects.get(id=game_id, player=user)
        game.time = duration
        game.save()
        return JsonResponse({'success': True, 'message': 'Duration updated successfully'})
    except Sudoku.DoesNotExist:
        return JsonResponse({'success': False, 'message': 'Game not found'}, status=404)

@csrf_exempt
def give_up(request, id):
    print(id)
    game = Sudoku.objects.get(id=id)
    game.is_finished = True
    game.save()
    solution = request.session.get('sudoku_solution')
    print(solution)
    _solution = enhance_state_with_clues(solution, solution)
    print(_solution)
    difficulty = game.difficulty
    context = {
        'game_id': id,
        'current_state': _solution,
        'new_game': False,
        'difficulty': difficulty,
    }
    response = render(request, 'sudoku/partials/lostPuzzleBoard.html', context)
    return trigger_client_event(response, "loadBoard", after="swap")
    