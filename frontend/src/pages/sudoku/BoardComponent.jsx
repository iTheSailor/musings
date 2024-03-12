import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SudokuCell from './CellComponent';
import './Sudoku.css';

const SudokuBoard = ({current_state, paused, onBoardChange, errors}) => {

    const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill({ value: 0, clue: false })));

   
    
    const initializeBoard = (current_state) => {
        if(Array.isArray(current_state)){
        const newBoard = current_state.map((row, rowIndex) => 
            row.map((cell => ({
                value: cell.value,
                clue: cell.clue ,
                error: false
            }))
        ));
        setBoard(newBoard);
    }
    };
    const handleInputChange = (newValue, rowIndex, colIndex) => {
        if (paused) return;
        const newBoard = [...board];
        const numericValue = isNaN(parseInt(newValue)) ? 0 : parseInt(newValue);
        newBoard[rowIndex][colIndex] = { ...newBoard[rowIndex][colIndex], value: numericValue };
        setBoard(newBoard);
        if (onBoardChange) {
            onBoardChange(newBoard);
        }
    };
    const noop = () => {};

    useEffect(() => { 
        initializeBoard(current_state);
    }, [current_state]); 

    const errorsToCellPositions = (errors) => {
        var errorCells = new Set();

        // Add cells that are at the intersection of erroneous rows and columns.
        errors.rows.forEach(rowIndex => {
            errors.columns.forEach(colIndex => {
                errorCells.add(`${rowIndex}-${colIndex}`);
            });
        });
        var errorInstance = errorCells;
    return errorInstance;
    };

    
    
    
    useEffect(() => {
        if (!errors || (!errors.rows.length && !errors.columns.length && !errors.boxes.length)) {
            console.log('No errors to process.');
            return; // Exit if there are no actual errors.
        }
        console.log('Updating board for errors:', errors);
        console.log('errors!!!!!:', errors);
        // This code should run only if `errors` change.
        var errorCells = errorsToCellPositions(errors);
        console.log('errorCells:', errorCells)
        const newBoard = board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
                const isError = errorCells.has(`${rowIndex}-${colIndex}`);
                return { ...cell, error: isError }; 
            })
        );
        errorCells = new Set();
        setBoard(newBoard);
    }, [errors]);
    

    if (paused) {
        const pausedBoard = () => {
            const gridSize = 9; // for a standard Sudoku board
            let board = [];
            for (let row = 0; row < gridSize; row++) {
                let currentRow = [];
                for (let col = 0; col < gridSize; col++) {
                    // Insert 'SUDOKU' letters into the middle row
                    let cellContent = row === 4 ? '数独-SUDOKU'[col] || '' : Math.ceil(Math.random() * 9);
                    currentRow.push(
                        <SudokuCell
                            key={`${row}-${col}`}
                            cell={{ value: cellContent, clue: row === 4 ? false : true}}
                            rowIndex={row}
                            colIndex={col}
                            onInputChange={noop}
                            
                            ></SudokuCell>
                    );
                }
                board.push(<div style={{ display: 'flex' }}>{currentRow}</div>);
            }
            return board;
        }
        return (
            <div id="sudokuBoard" className="sudoku-board">
                {pausedBoard()}
            </div>
        );
    } else {

    

    return (
        <div id="sudokuBoard" className="sudoku-board">
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="sudoku-row">
                    {row.map((cell, colIndex) => (
                        <SudokuCell
                            key={`${rowIndex}-${colIndex}`}
                            cell={cell}
                            rowIndex={rowIndex}
                            colIndex={colIndex}
                            onInputChange={handleInputChange}
                            isError={cell.error}
                            
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
}

SudokuBoard.propTypes = {
    current_state: PropTypes.array,
    paused: PropTypes.bool,
    onBoardChange: PropTypes.func,
    errors: PropTypes.shape({ // Use PropTypes.shape for better structuring
        rows: PropTypes.arrayOf(PropTypes.number),
        columns: PropTypes.arrayOf(PropTypes.number),
        boxes: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))
    }),
};

export default SudokuBoard;