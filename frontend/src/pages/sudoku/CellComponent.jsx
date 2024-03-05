import React from 'react';
import PropTypes from 'prop-types';
import './Sudoku.css';

const SudokuCell = ({ cell, rowIndex, colIndex, onInputChange }) => {
    SudokuCell.propTypes = {
        cell: PropTypes.object.isRequired,
        rowIndex: PropTypes.number.isRequired,
        colIndex: PropTypes.number.isRequired,
        onInputChange: PropTypes.func.isRequired,
    };
    const handleChange = (event) => {
        const newValue = event.target.value.replace(/[^1-9]/g, '');
        if (newValue.length <= 1) {
            onInputChange(newValue, rowIndex, colIndex);
        }
    };

    return (
        <div className={`sudoku-cell ${colIndex === 2 || colIndex === 5 ? 'bold-border-right' : ''} ${rowIndex === 2 || rowIndex === 5 ? 'bold-border-bottom' : ''}`}>
            <input
                type="text"
                value={cell.value || ''}
                onChange={handleChange}
                className={`sudoku-input ${cell.clue ? 'concrete' : ''}`}
                disabled={cell.clue}
            />
        </div>
    );
};


export default SudokuCell;