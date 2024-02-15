import random
import numpy as np

def is_valid(board, row, col, num):
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
    if not find_empty_location(board, l):
        return True

    row, col = l
    nums = list(range(1,10))
    random.shuffle(nums)

    for num in nums:
        if is_valid(board, row, col, num):
        
            board[row][col] = num

        
            if solve_sudoku(board):
                return True

        
            board[row][col] = 0


    return False


def generate_sudoku_solution():
    board = np.zeros((9, 9), dtype=int)
    nums = list(range(1,10))
    random.shuffle(nums)
    board[0] = nums
    if solve_sudoku(board):
        return board
    return None

def remove_numbers_to_create_puzzle(board, clues):
    # Create a copy of the original board
    original_board = np.copy(board)
    puzzle_board = np.copy(board)

    count = 81 - clues
    while count > 0:
        i, j = random.randint(0, 8), random.randint(0, 8)
        if puzzle_board[i][j] != 0:
            puzzle_board[i][j] = 0
            count -= 1

    # Return both the original (solved) board and the puzzle board
    return [puzzle_board, original_board]

def generate_puzzle(difficulty):

    solution_board = generate_sudoku_solution()

    clues = int()   
    if difficulty == 'test':
        clues = 80
    if difficulty == 'easy':
        clues = 40  
    if difficulty == 'medium':
        clues = 30
    if difficulty == 'hard':
        clues = 20
    if solution_board is not None:
        
        boards = remove_numbers_to_create_puzzle(solution_board.tolist(), clues)
        print(f'puzzle board {boards[0]}')
        print(f'solution board {boards[1]}')
        return boards