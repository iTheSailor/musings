import React from 'react';
import { Dropdown, Header} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import IsButton from '../../components/IsButton';

const UserSavedGames = ({onGameSelect, onDeleteGame, games}) => {
    UserSavedGames.propTypes = {
        onGameSelect: PropTypes.func.isRequired,
        onDeleteGame: PropTypes.func.isRequired,
        games: PropTypes.array.isRequired,
    };

    const gameOptions = games.map(game => {
        return { key: game.id, text: game.name, value: game.id }
    });

    return (
        <>
        <Header as='h3' content='Select Game' />
        <Dropdown
            placeholder='Select Game'
            selection
            options={gameOptions}
            onChange={(e, data) => onGameSelect(data.value)}
        />
        <IsButton
            label='Delete Game'
            onClick={onDeleteGame}
            color='red'
        ></IsButton>
        </> 
    );
}