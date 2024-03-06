import React from 'react';
import { useLocation } from 'react-router-dom';
import { Segment, Header, Container, Grid, GridColumn } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CSRFToken from '../../utils/CsrfToken';
import IsButton from '../../components/IsButton';
import PausedSudokuBoard from './PausedBoardComponent';
import SudokuBoard from './BoardComponent';
import Timer from '../../components/Timer';


const SudokuGame = () => {
    const location = useLocation();
    const puzzle = location.state ? location.state.puzzle : [];
    const difficulty = location.state ? location.state.difficulty : '';
    const gameid = location.state ? location.state.gameid : '';
    const time = location.state ? location.state.time : 0;
    const user = location.state ? location.state.userid : '';

    const [isTimerActive, setIsTimerActive] = useState(true);
    const [timerTime, setTimerTime] = useState(time);

    const handleTimeChange = (newTime) => {
        setTimerTime(newTime);
        console.log('Game ID:', gameid);
        axios.put(`${process.env.REACT_APP_API_URL}/api/sudoku/updateTime`, {
            sudoku_id: gameid,
            time: newTime
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                'CSRF-Token': CSRFToken()
            }
        }).then((response) => {
            console.log('Time updated:', response.data);
        }).catch((error) => {
            console.error('Failed to update time:', error);
        });
    }
    

    const toggleTimer = () => {
        setIsTimerActive(!isTimerActive);
    }
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
                label={isTimerActive ? 'Pause' : 'Resume'}
                color='grey'
                style={{marginBottom: '1em'}}
                onClick={toggleTimer}></IsButton>
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
            <Grid 
            columns={3}
            style={{display: 'flex', 
            justifyContent:'space-evenly', 
            alignItems: 'center', 
            textAlign: 'center'}}
            >
            <GridColumn align='left'>
                <Header 
                as='h3' 
                style={{textTransform:'capitalize'}}
                >
                {difficulty} Sudoku
                </Header>
            </GridColumn>
            <GridColumn>
            </GridColumn>
            <GridColumn align='right'>
                <Timer isActive={isTimerActive} onTimeChange={handleTimeChange}/>
            </GridColumn>
            </Grid>
            <br />
            <SudokuBoard puzzle={puzzle} paused={!isTimerActive} />
        </Segment>
        </Container>
    );
};

export default SudokuGame;
