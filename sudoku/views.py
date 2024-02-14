from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from . import sudoku_logic
from django_htmx.http import trigger_client_event, HttpResponseLocation
from django.views.decorators.http import require_http_methods
import json
from .models import Sudoku
# Create your views here.

def sudoku(request):
    try:
        if request.user.id is None:
            context = {
            'existing_games': [],
            'easy_wins': 'Must Be Logged In',
            'medium_wins': 'To Keep Track',
            'hard_wins': 'Of Your Wins',
            'user': 'AnonymousUser',
            }
            return render(request, 'sudoku/sudoku.html', context)
        user = request.user.id
        existing_game = Sudoku.objects.filter(player=user)
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
            'user': request.user,
        }

        return render(request, 'sudoku/sudoku.html', context)
    except AttributeError:
        context = {
            'existing_games': [],
            'easy_wins': 'Must Be Logged In',
            'medium_wins': 'To Keep Track',
            'hard_wins': 'Of Your Wins',
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
        player=request.user if request.user.is_authenticated else None,
        puzzle=json.dumps(puzzle_board),
        solution=json.dumps(solution),
        current_state = json.dumps(puzzle_board),
        difficulty=difficulty
    )
    game_id = Sudoku.objects.latest('id').id
    enhanced_current_state = enhance_state_with_clues(puzzle_board, puzzle_board)
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
def update_game_duration(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({'success': False, 'message': 'Must be logged in to save game duration'}, status=403)

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

    
def won_game(request):
    context = request.session.get('context')
    print('Context: ', context)
    if not context:
        return redirect('sudoku')
    
    
    response = render(request, template_name='sudoku/partials/wonPuzzleBoard.html', context=context)
    return trigger_client_event(response, "loadBoard", context, after="receive")
    
def check_sudoku_board(board):
    # Check each row
    for row in board:
        if not is_valid_group(row):
            return False

    # Check each column
    for col in range(9):
        if not is_valid_group([board[row][col] for row in range(9)]):
            return False

    # Check each 3x3 square
    for box_row in range(0, 9, 3):
        for box_col in range(0, 9, 3):
            if not is_valid_box(board, box_row, box_col):
                return False

    # If all checks pass
    return True

def is_valid_group(group):
    """Check if a group (row/column) contains unique numbers from 1 to 9."""
    return sorted(group) == list(range(1, 10))

def is_valid_box(board, start_row, start_col):
    """Check if a 3x3 box contains unique numbers from 1 to 9."""
    numbers = []
    for row in range(3):
        for col in range(3):
            numbers.append(board[start_row + row][start_col + col])
    return is_valid_group(numbers)

@csrf_exempt
def submit_solution(request):
    user = request.user
    data = request.POST.get('sudoku_data')
    if data is None:
        return JsonResponse({'success': False, 'message': 'No data provided'})

    data = json.loads(data)
    player_board = data.get('rows')
    game_id = data.get('game_id')
    difficulty = data.get('difficulty')
    time = data.get('time')

    # Convert player_board to a 2D list of integers
    try:
        player_board = [[int(cell) if cell else 0 for cell in row] for row in player_board]
    except ValueError:
        # In case of conversion failure, return an error
        return JsonResponse({'success': False, 'message': 'Invalid board data'})

    if not player_board:
        return JsonResponse({'success': False, 'message': 'Missing board data'})

    # Use the Sudoku validation function instead of comparing to a solution
    is_correct = check_sudoku_board(player_board)
    print(f"Player Board: {player_board}")
    print(f"Is Correct: {is_correct}")

    if is_correct:
        # Perform actions for authenticated users
        if user.is_authenticated:
            try:
                game = Sudoku.objects.get(id=game_id)
                game.is_finished = True
                game.win = True
                game.save()
            except Sudoku.DoesNotExist:
                # Handle the case where the game does not exist
                return JsonResponse({'success': False, 'message': 'Game not found'})

        # Assuming enhance_state_with_clues is defined elsewhere and used correctly
        _solution = enhance_state_with_clues(player_board, player_board)

        # Prepare the response for a correct solution
        request.session['context'] = {
            'game_id': game_id,
            'current_state': _solution,
            'new_game': False,
            'difficulty': difficulty,
            'time': time,
        }
        return JsonResponse({'success': True, 'message': 'Correct solution'})
    else:
        # Response for an incorrect solution
        return JsonResponse({'success': False, 'message': 'Incorrect solution'})