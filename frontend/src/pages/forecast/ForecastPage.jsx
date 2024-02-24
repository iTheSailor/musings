// ForecastPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Header, Segment } from 'semantic-ui-react';
import LocationLookup from '../../components/LocationLookup';
import IsButton from '../../components/IsButton'; // Ensure this is the correct import path


const ForecastPage = () => {
    const { location } = useParams();
    const [selectedLocation, setSelectedLocation] = useState(location || '');

    useEffect(() => {
        if (location) {
            setSelectedLocation(location);
        }
    }, [location]);

    const handleSearch = () => {
        console.log('Searching for:', selectedLocation); // Log the current selected location
        // Here you can also handle other logic that should happen on search
        // No navigation logic if you don't want to navigate
    };

    return (
        <Segment style={{ padding: '8em 0em', margin: 'auto' }} vertical>
            <Container>
                <Header as='h2'>Weather Forecast</Header>
                <LocationLookup setSelectedLocation={setSelectedLocation}/>      
                <IsButton onClick={handleSearch} label="Search"/>   
            </Container>
        </Segment>
    );
};

export default ForecastPage;



