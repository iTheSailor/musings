import React from 'react';
import { Dropdown, Header} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import IsButton from '../../components/IsButton';

const DifficultySelector = ({onDifficultySelect, startGame, handleClose}) => {
    DifficultySelector.propTypes = {
        onDifficultySelect: PropTypes.func.isRequired,
        startGame: PropTypes.func.isRequired,
        handleClose: PropTypes.func.isRequired,
    };
    const difficultyOptions = [
        { key: 'easy', text: 'Easy', value: 'easy' },
        { key: 'medium', text: 'Medium', value: 'medium' },
        { key: 'hard', text: 'Hard', value: 'hard' },
    ];
    

    return (
        <>
        <Header as='h3' content='Select Difficulty' />
        <div style={{display:'flex', justifyContent:'space-between'}}>
        <Dropdown
            placeholder='Select Difficulty'
            selection
            options={difficultyOptions}
            onChange={(e, data) => onDifficultySelect(data.value)}
        />
        <IsButton
            label='Start Game'
            onClick={startGame}
            color='green'
        ></IsButton>
        </div>
        </> 
    );
}

export default DifficultySelector;