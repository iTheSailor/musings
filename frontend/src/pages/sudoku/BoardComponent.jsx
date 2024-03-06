import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SudokuCell from './CellComponent';
import './Sudoku.css';

const SudokuBoard = ({puzzle, paused}) => {
    SudokuBoard.propTypes = {
        puzzle: PropTypes.array,
        paused: PropTypes.bool,
    };
    const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill({ value: 0, clue: false })));
    

    const initializeBoard = (puzzleData) => {
        if(Array.isArray(puzzleData)){
        const newBoard = puzzleData.map((row, rowIndex) => 
            row.map((cellValue, colIndex) => ({
                value: cellValue,
                clue: cellValue !== 0
            }))
        );
        setBoard(newBoard);
    }
    };




    const handleInputChange = (newValue, rowIndex, colIndex) => {
        if (paused) return;
        const newBoard = [...board];
        newBoard[rowIndex][colIndex].value = newValue;
        setBoard(newBoard);
    };

    const noop = () => {};

    


    useEffect(() => {
        const puzzleData = [];
        initializeBoard(puzzleData);
    }, []); 

    

    useEffect(() => {
        if (puzzle.length) {
            initializeBoard(puzzle);
        }
    }, [puzzle]);

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
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
}


export default SudokuBoard;