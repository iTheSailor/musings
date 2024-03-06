import React, { useState, useEffect } from 'react';
import { Button, Icon, Label } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import PropTypes from 'prop-types';

const Timer = ({ initialTime = 0, pauseReset, isActive, toggle, onTimeChange }) => {
    Timer.propTypes = {
        initialTime: PropTypes.number,
        pauseReset: PropTypes.bool,
        isActive: PropTypes.bool,
        toggle: PropTypes.func,
        onTimeChange: PropTypes.func,
    };
  const [time, setTime] = useState(initialTime);


  const reset = () => {
    setTime(initialTime);
    if (toggle && isActive) { // Only toggle if isActive to avoid unnecessary calls
        toggle();
        }
    };

  useEffect(() => {
    const tick = () => {
        setTime(currentTime => {
            const newTime = currentTime + 1;
            onTimeChange(newTime);
            return newTime;
        })
    };
    if (isActive) {
        const timerId = setInterval(tick, 1000);
        return () => clearInterval(timerId);
    }
  }, [isActive, onTimeChange]);

  useEffect(() => {
    let interval = null;

    if (isActive) {
        interval = setInterval(() => {
            setTime((time) => time + 1);
        }, 1000);
    } else {
        clearInterval(interval);
    }

    return () => clearInterval(interval);
    }, [isActive]);


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

export default Timer;