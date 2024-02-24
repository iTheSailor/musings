import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Header, Segment } from 'semantic-ui-react';
import LocationLookup from '../../components/LocationLookup';
import IsButton from '../../components/IsButton'; 
import axios from 'axios';

const ForecastPage = () => {
    const { location } = useParams();
    const [selectedLocation, setSelectedLocation] = useState(location || '');
    const locationDataRef = useRef({}); // Initialize with an empty object

    useEffect(() => {
        if (selectedLocation) {
            setSelectedLocation(selectedLocation); // This seems redundant, consider removing if not needed
            // Assuming 'selectedLocation' is an object with the necessary properties:
            locationDataRef.current = {
                coordinates: {
                    lat: selectedLocation.properties?.lat,
                    lon: selectedLocation.properties?.lon
                },
                country_code: selectedLocation.properties?.country_code,
                formatted: selectedLocation.properties?.formatted,
            };
            console.log('Updated ref data:', locationDataRef.current);
        }
    }, [selectedLocation]); // Depend on selectedLocation since that's what we're tracking

    const handleSearch = () => {
        console.log('Searching for:', selectedLocation);
        console.log('Data from ref:', locationDataRef.current);
        // Send the request to the server with the location data
        axios.get('http://localhost:8000/api/weather', {
            params: {
                lat: locationDataRef.current.coordinates.lat,
                lon: locationDataRef.current.coordinates.lon,
                country_code: locationDataRef.current.country_code,
                formatted: locationDataRef.current.formatted
            }
        }).then(response => {
            console.log('Response:', response.data);
        }
        ).catch(error => {
            console.error('Error:', error);
        })
    }



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
