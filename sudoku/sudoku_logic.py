import random
import numpy as np

def is_valid(board, row, col, num):
    # Check if 'num' is not already placed 
    #in the current row, current column, 
    #and current 3x3 subgrid.
    for x in range(9):
        if board[row][x] == num or board[x][col] == num:
            return False

    startRow = row - row % 3
    startCol = col - col % 3
    for i in range(3):
        for j in range(3):
            if board[i + startRow][j + startCol] == num:
                return False
    return True

def find_empty_location(board, l):
    for row in range(9):
        for col in range(9):
            if board[row][col] == 0:
                l[0] = row
                l[1] = col
                return True
    return False

def solve_sudoku(board):
    l = [0, 0]
    
    # If there is no unassigned location, we are done
    if not find_empty_location(board, l):
        return True

    row, col = l
    nums = list(range(1,10))
    random.shuffle(nums)

    # Consider digits 1 to 9
    for num in nums:
        # If looks promising
        if is_valid(board, row, col, num):
            # Make tentative assignment
            board[row][col] = num

            # Return, if success
            if solve_sudoku(board):
                return True

            # Failure, undo & try again
            board[row][col] = 0

    # This triggers backtracking
    return False


def generate_sudoku_solution():
    board = np.zeros((9, 9), dtype=int)
    nums = list(range(1,10))
    random.shuffle(nums)
    board[0] = nums
    if solve_sudoku(board):
        print(board)
        return board
    return None

def remove_numbers_to_create_puzzle(board, clues):
    count = 81 - clues
    while count > 0:
        i, j = random.randint(0, 8), random.randint(0, 8)
        if board[i][j] != 0:
            board[i][j] = 0
            count -= 1
    return board

def generate_puzzle(difficulty):
    # Generate a full solution first
    solution_board = generate_sudoku_solution()
    print(difficulty)
    clues = int()   
    if difficulty == 'easy':
        clues = 30
    if difficulty == 'medium':
        clues = 20
    if difficulty == 'hard':
        clues = 10
    if solution_board is not None:
        # Now remove numbers to create the puzzle
        puzzle_board = remove_numbers_to_create_puzzle(solution_board.tolist(), clues)
        return puzzle_board