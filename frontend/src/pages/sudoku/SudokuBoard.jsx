import React, { useState, useEffect } from 'react';
import SudokuCell from './SudokuCellComponent';

const SudokuBoard = () => {
    const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill({ value: 0, clue: false })));

    // Function to initialize the board
    const initializeBoard = (puzzleData) => {
        const newBoard = puzzleData.map((row, rowIndex) => 
            row.map((cellValue, colIndex) => ({
                value: cellValue,
                clue: cellValue !== 0
            }))
        );
        setBoard(newBoard);
    };

    // Load board on component mount
    useEffect(() => {
        // Assuming 'puzzleData' comes from your backend or local data
        const puzzleData = [];
        initializeBoard(puzzleData);
    }, []); // Empty dependency array means this effect runs once on mount

    const handleInputChange = (newValue, rowIndex, colIndex) => {
        const newBoard = [...board];
        newBoard[rowIndex][colIndex].value = newValue;
        setBoard(newBoard);
    };

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
};

export default SudokuBoard;