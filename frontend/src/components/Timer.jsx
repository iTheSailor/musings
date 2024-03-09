import React, { useState, useEffect } from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import PropTypes from 'prop-types';

const Timer = ({ initialTime = 0, pauseReset, isActive, toggle, onTimeChange }) => {
    const [time, setTime] = useState(initialTime);

    useEffect(() => {
        let timerId;
        if (isActive) {
            timerId = setInterval(() => {
                setTime(time => time + 1);
            }, 1000);
        }
        return () => clearInterval(timerId);
    }, [isActive]);

    useEffect(() => {
        onTimeChange(time);
    }, [time, onTimeChange]);

    const reset = () => {
        setTime(0); // Reset to 0 or initialTime based on your logic
        if (toggle && isActive) {
            toggle();
        }
    };

    return (
        <>
            <Label size='large'>
                <Icon name='clock' /> {time} seconds
            </Label>
            {pauseReset &&
                <Button.Group>
                    <Button toggle active={isActive} onClick={toggle}>
                        {isActive ? 'Pause' : 'Start'}
                    </Button>
                    <Button onClick={reset}>
                        Reset
                    </Button>
                </Button.Group>
            }
        </>
    );
};

Timer.propTypes = {
    initialTime: PropTypes.number,
    pauseReset: PropTypes.bool,
    isActive: PropTypes.bool,
    toggle: PropTypes.func,
    onTimeChange: PropTypes.func,
};

export default Timer;
