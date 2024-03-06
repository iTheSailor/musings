import React from 'react';

const PausedSudokuBoard = () => {
    const gridSize = 9; // for a standard Sudoku board
    let board = [];
    for (let row = 0; row < gridSize; row++) {
        let currentRow = [];
        for (let col = 0; col < gridSize; col++) {
            // Insert 'SUDOKU' letters into the middle row
            let cellContent = row === 4 ? 'SUDOKU'[col] || '' : Math.ceil(Math.random() * 9);
            currentRow.push(
                <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#e0e0e0',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid black',
                    background: 'url(https://www.transparenttextures.com/patterns/asfalt-dark.png)' // This is for the concrete look
                }}>
                    {cellContent}
                </div>
            );
        }
        board.push(<div style={{ display: 'flex' }}>{currentRow}</div>);
    }

    return <div>{board}</div>;
};

export default PausedSudokuBoard;