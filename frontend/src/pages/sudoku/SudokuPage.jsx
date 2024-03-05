import React from 'react';
import { Container, Header, Segment, Card, Grid, Divider } from 'semantic-ui-react';
import IsButton from '../../components/IsButton';
import IsPortal from '../../components/IsPortal';
import DifficultySelector from './DifficultySelectorComponent';
import { useState, useEffect } from 'react';
import { useNavigate} from 'react-router-dom';
// import PropTypes from 'prop-types';
import axios from 'axios';
// import { useAuth } from '../../utils/AuthContext';


const SudokuPage = () => {
    

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
                                    <DifficultySelector />
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
