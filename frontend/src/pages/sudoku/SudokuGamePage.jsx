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
import Cookies from 'js-cookie';


const SudokuGame = () => {
    const location = useLocation();
    const puzzle = location.state ? location.state.current_state : [];
    const difficulty = location.state ? location.state.difficulty : '';
    const gameid = location.state ? location.state.gameid : '';
    const time = location.state ? location.state.time : 0;
    const user = location.state ? location.state.userid : '';
    const [isTimerActive, setIsTimerActive] = useState(true);
    const [timerTime, setTimerTime] = useState(time);
    const [currentBoard, setCurrentBoard] = useState(puzzle); // Initialize with the initial puzzle.
    var token = Cookies.get('csrftoken');
    const handleBoardChange = (newBoard) => {
        setCurrentBoard(newBoard);
    };

    



    const handleTimeChange = (newTime) => {
        setTimerTime(newTime);
        axios.put(`${process.env.REACT_APP_API_URL}/api/sudoku/updateTime`, {
            sudoku_id: gameid,
            time: newTime
        }, {
            withCredentials: true,
            headers: { 
                'X-CSRFToken': token,
                'Content-Type': 'application/json',
            }
            
        }).catch((error) => {
            console.error('Failed to update time:', error);
        });
    }

    const saveGame = () => {
        console.log('Save game:', gameid);
        axios.put(`${process.env.REACT_APP_API_URL}/api/sudoku/saveGame`, {
            gameid: gameid,
            userid: user,
            current_state: currentBoard,
            time: timerTime
        }, {
            withCredentials: true,
            headers: { 
                'X-CSRFToken': token,
                'Content-Type': 'application/json',
            }
        }).then((response) => {
            console.log('Game saved:', response.data);
        }).catch((error) => {
            console.error('Failed to save game:', error);
        });
    }


    const [errors, setErrors] = useState({ rows: [], columns: [], boxes: [] });
    useEffect(() => {
        if (errors && (errors.rows.length || errors.columns.length || errors.boxes.length)) {
            const errorTimeout = setTimeout(() => {
                // Clear the errors from state here if necessary
                setErrors({ rows: [], columns: [], boxes: [] });
            }, 1000);  // Match this duration to your CSS animation
            
            return () => clearTimeout(errorTimeout);
        }
    }, [errors]);

    const checkSolution = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/sudoku/checkSolution`, {
            board: currentBoard  // Adjust with the correct format
        }, {
            headers: { 'Content-Type': 'application/json' , 'X-CSRFToken': token},
            withCredentials: true,
        }).then(response => {
            const { status, isCorrect, errors } = response.data;
            console.log('Response:', response.data);
            console.log('Status:', status);
            console.log('Correct:', isCorrect ? 'Yes' : 'No');
            console.log('Errors:', errors);
            if (status === 'success') {
                console.log('Solution checked:', isCorrect);
 
                if (isCorrect){
                    alert('Congratulations! Correct solution.');
                }
                else {
                    alert('Incorrect solution.');
                    setErrors(errors);
                    console.log('Errors:', errors);
                }
                // handle game win logic here
            } else {
                console.log('Issue sending')
            }
        }).catch(error => {
            console.error('Error checking solution:', error);
        });
    };

    const noop = () => {};
    

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
                style={{marginBottom: '1em'}}
                onClick={checkSolution}
            >
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
                onClick={saveGame}
            ></IsButton>
            <IsButton
            label="Give Up"
            color='red'
            onClick={noop}></IsButton>
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
                <Timer isActive={isTimerActive} onTimeChange={handleTimeChange} initialTime={timerTime}/>
                
            </GridColumn>
            </Grid>
            <br />
            <SudokuBoard current_state={puzzle} paused={!isTimerActive} onBoardChange={handleBoardChange} errors={errors} />
        </Segment>
        </Container>
    );
};

export default SudokuGame;
