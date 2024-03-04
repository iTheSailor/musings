
import React from 'react';
import { Container, Header, Segment, Card, Grid, Divider } from 'semantic-ui-react';
import IsButton from '../../components/IsButton';
import IsPortal from '../../components/IsPortal';
import DifficultySelector from './DifficultySelector';
import { useState, useEffect } from 'react';
import SudokuBoard from './SudokuBoard';
import SudokuCell from './SudokuCellComponent';
// import PropTypes from 'prop-types';
import axios from 'axios';
// import { useAuth } from '../../utils/AuthContext';


const SudokuPage = () => {
    const [difficulty, setDifficulty] = useState('');
    const [puzzle, setPuzzle] = useState([]);


    useEffect (() => {
        console.log('Difficulty:', difficulty);
    }
    , [difficulty]);

    const startGame = () => {
        console.log('Start game with difficulty:', difficulty);
        console.log('user:', localStorage.getItem('userId'));

        axios.get(`${process.env.REACT_APP_API_URL}/api/sudoku/play`, {
            params: {
                difficulty: difficulty,
                userid: localStorage.getItem('userId')
            }
        }).then((response) => {
            setPuzzle(response.data.puzzle);
        }).catch((error) => {
            console.error('Failed to start game:', error);
        });
    }
    // This could be in SudokuPage or a separate SudokuBoard component
    const renderSudokuBoard = () => {
        return (
            <div className="sudoku-board">
                {puzzle.map((row, rowIndex) => (
                    <div key={rowIndex} className="sudoku-row">
                        {row.map((cell, colIndex) => (
                            // Replace this with your SudokuCell component or equivalent HTML
                            <div key={`${rowIndex}-${colIndex}`} className="sudoku-cell">
                                {cell.value}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        );
    };




    return (
        <Container>
            <Header as='h1'>Sudoku</Header>
            <Segment style={{ padding: '2em 2em', margin: '2em' }}>
                <Grid columns={2} relaxed='very'>
                    <Grid.Column>
                        <Card>
                            <Card.Content>
                                <Card.Header>Play</Card.Header>
                                <Card.Description>
                                    Play a game of Sudoku
                                </Card.Description>
                                <IsPortal label='Go!' content={<p>Play Sudoku</p>}>
                                    <DifficultySelector onDifficultySelect={setDifficulty} startGame={startGame}/>
                                </IsPortal>     
                            </Card.Content>
                        </Card>
                        {/* Sudoku board rendering */}
                        {puzzle.length > 0 && renderSudokuBoard()}
                    </Grid.Column>
                    <Grid.Column>
                        {/* Your saved games logic here */}
                    </Grid.Column>
                </Grid>
                <Divider vertical>Or</Divider>
            </Segment>
        </Container>
    );
    
};

export default SudokuPage;