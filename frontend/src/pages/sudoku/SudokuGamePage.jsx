import React from 'react';
import { useLocation } from 'react-router-dom';
import SudokuBoard from './BoardComponent';
import { Segment, Header, Container } from 'semantic-ui-react';
import IsButton from '../../components/IsButton';

const SudokuGame = () => {
    const location = useLocation();
    const puzzle = location.state ? location.state.puzzle : [];

    return (
        <Container style={{display: 'flex', justifyContent:'space-evenly', alignItems: 'center'}}>
        <Segment style={{display:'flex', flexDirection:'column'}}
            >
            <Header as='h3'>Game Controls</Header>
            <IsButton
                label='Check'
                color='green'
                style={{marginBottom: '1em'}}>
            </IsButton>
            <IsButton
                label='Pause'
                color='gray'
                style={{marginBottom: '1em'}}></IsButton>
            <IsButton
                label='Save Game'
                color='blue'
                style={{marginBottom: '1em'}}
            ></IsButton>
            <IsButton
            label="Give Up"
            color='red'></IsButton>
            </Segment>
        <Segment>
            <Header>Sudoku</Header>
            <SudokuBoard puzzle={puzzle} />
        </Segment>
        </Container>
    );
};

export default SudokuGame;
