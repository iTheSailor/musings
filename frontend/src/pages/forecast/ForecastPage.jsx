import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Header, Segment } from 'semantic-ui-react'
import LocationLookup from '../../components/LocationLookup';
import IsButton from '../../components/IsButton'; // Ensure this is the correct import path

const ForecastPage = () => {
    const { location } = useParams();
    const navigate = useNavigate();
    const [selectedLocation, setSelectedLocation] = useState(location || '');

    useEffect(() => {
        if (location) {
            setSelectedLocation(location);
        }
    }, [location]);

    const handleSearch = () => {
        navigate(`/forecast/${selectedLocation}`);
    }



    return (
        <Segment style={{ padding: '8em 0em' }} vertical>
        <Container>

        <Header as='h2'>Weather Forecast</Header>

            <LocationLookup setSelectedLocation={setSelectedLocation}/>      
            <IsButton onClick={handleSearch} label="Search"/>   
        </Container>
        </Segment>
    );
}

export default ForecastPage;
