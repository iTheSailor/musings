import React from 'react';
import { useLocation } from 'react-router-dom';
import SudokuBoard from './SudokuBoardComponent';
import { Segment, Header, Container } from 'semantic-ui-react';

const SudokuGame = () => {
    const location = useLocation();
    const puzzle = location.state ? location.state.puzzle : [];

    return (
        <Container>
        <Segment>
            <Header>Sudoku</Header>
            <SudokuBoard puzzle={puzzle} />
        </Segment>
        </Container>
    );
};

export default SudokuGame;
