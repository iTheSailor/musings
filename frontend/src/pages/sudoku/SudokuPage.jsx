import React from 'react';
import { Container, Header, Segment, Card, Grid, Divider } from 'semantic-ui-react';
import IsButton from '../../components/IsButton';
import IsPortal from '../../components/IsPortal';
import DifficultySelector from './DifficultySelector';
import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
// import PropTypes from 'prop-types';
import axios from 'axios';
// import { useAuth } from '../../utils/AuthContext';


const SudokuPage = () => {
    const [difficulty, setDifficulty] = useState('');
    const navigate = useNavigate();

    useEffect (() => {
        console.log('Difficulty:', difficulty);
    }, [difficulty]);

    const startGame = () => {
        console.log('Start game with difficulty:', difficulty);
        console.log('user:', localStorage.getItem('userId'));

        axios.get(`${process.env.REACT_APP_API_URL}/api/sudoku/play`, {
            params: {
                difficulty: difficulty,
                userid: localStorage.getItem('userId')
            }
        }).then((response) => {
            console.log('Game started:', response.data);
            navigate('/apps/sudoku/game', {state: {puzzle: response.data.puzzle, gameid: response.data.gameid, difficulty: difficulty, userid: localStorage.getItem('userId')}});
        }).catch((error) => {
            console.error('Failed to start game:', error);
        });
    }

    return (
        <Container>
            <Header as='h1'>Sudoku</Header>
            <Segment style={{ padding: '2em 2em', margin: '2em'}}>
                <Grid columns={2} relaxed='very'>
                    <Grid.Column>
                        <Card>
                            <Card.Content>
                                <Card.Header>Play</Card.Header>
                                <Card.Description>
                                    Play a game of Sudoku
                                </Card.Description>
                                <IsPortal
                                    label='Go!'
                                    content={<p>Play Sudoku</p>}
                                >
                                    <DifficultySelector onDifficultySelect={setDifficulty} startGame={startGame}/>
                                </IsPortal>     
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                    <Grid.Column>
                        <Card>
                            <Card.Content>
                                <Card.Header>Continue</Card.Header>
                                <Card.Description>
                                    Continue one of your saved games
                                </Card.Description>
                                <IsPortal
                                    label='Continue'
                                    >

                                </IsPortal>
                            </Card.Content>
                        </Card>
                    </Grid.Column>
                </Grid>
                <Divider vertical>Or</Divider>
            </Segment>
        </Container>
    );
};

export default SudokuPage;
