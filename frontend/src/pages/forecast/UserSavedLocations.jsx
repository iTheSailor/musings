import React from 'react';
import {

    Segment,
    Button
} from 'semantic-ui-react';
import { useState } from 'react';
// import PropTypes from 'prop-types';
import axios from 'axios';

const UserSavedLocations = () => {
    const [userLocations, setUserLocations] = useState([]);
    const user = JSON.parse(localStorage.getItem('userId')) || '';
    
    axios.get(
        `${process.env.REACT_APP_API_URL}/api/weather/${user}`
    ).then((response) => {
        console.log(response.data);
        setUserLocations(response.data);
    }).catch((error) => {
        console.error('Failed to get favorites:', error);
    }
    );

    const handleGetForecast = (location) => {
        console.log('Get forecast for:', location);
    }

    const handleDeleteLocation = (location) => {
        console.log('Delete location:', location);
    }


    return (
        <Segment>
            <h2>Your Saved Locations</h2>
            <ul>
                {userLocations.map((location) => (
                    <li key={location.id}>{location.nickname}
                        <Button onClick={() => handleGetForecast(location)}>Get Forecast</Button>
                        <Button onClick={() => handleDeleteLocation(location)}>Delete</Button>
                    </li>

                ))}
                
            </ul>
        </Segment>
    )

}


export default UserSavedLocations;