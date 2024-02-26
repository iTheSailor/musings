import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Header, Segment, Card, Grid, Divider } from 'semantic-ui-react';
import LocationLookup from '../../components/LocationLookup';
import IsButton from '../../components/IsButton';
import axios from 'axios';

const formatDate = (dateTimeStr) => {
    return dateTimeStr.split('T')[0]; // Converts '2024-02-25T05:00:00' to '2024-02-25'
};

const combineData = (supplemental, weather) => {
    const combined = {};
    weather.forEach((day) => {
        const dateKey = formatDate(day.date);
        combined[dateKey] = {
            date: day.date,
            weather: {
                temperature_2m_max: day.temperature_2m_max,
                temperature_2m_min: day.temperature_2m_min,
            },
            forecasts: supplemental[dateKey] || [],
        };
    });
    return Object.values(combined); // Convert the combined object into an array
};

const ForecastPage = () => {
    const { location } = useParams();
    const [selectedLocation, setSelectedLocation] = useState(location || '');
    const locationDataRef = useRef({});
    const [weatherData, setWeatherData] = useState([]);
    const [supplementalData, setSupplementalData] = useState({});
    const [address, setAddress] = useState('');
    const [combinedData, setCombinedData] = useState([]);
    const [weatherCardHidden, setWeatherCardHidden] = useState(true);

    useEffect(() => {
        if (selectedLocation) {
            setSelectedLocation(selectedLocation);
            locationDataRef.current = {
                coordinates: {
                    lat: selectedLocation.properties?.lat,
                    lon: selectedLocation.properties?.lon,
                },
                country_code: selectedLocation.properties?.country_code,
                formatted: selectedLocation.properties?.formatted,
                timezone: selectedLocation.properties?.timezone.name,
            };
        }
    }, [selectedLocation]);

    const handleSearch = () => {
        console.log("Selected Location:", selectedLocation);
        console.log("Searching for:", locationDataRef.current);
        axios.get("http://localhost:8000/api/weather", {
            params: {
                lat: locationDataRef.current.coordinates.lat,
                lon: locationDataRef.current.coordinates.lon,
                country_code: locationDataRef.current.country_code,
                formatted: locationDataRef.current.formatted,
                timezone: locationDataRef.current.timezone
            },
        })
        .then((response) => {
            setWeatherData(response.data.weather || []);
            setSupplementalData(response.data.supplemental || {}); // Note: Ensure this matches the key in your response
            setAddress(response.data.address);
            setWeatherCardHidden(false);

            console.log("Fetched Data:", response.data); // Log the fetched data for debugging
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };
    

    useEffect(() => {
        if (weatherData.length > 0 && Object.keys(supplementalData).length > 0){
            const combined = combineData(supplementalData, weatherData);
            setCombinedData(combined);
            console.log("Combined Data:", combined);
  
        }
    }, [weatherData, supplementalData]);
    

    return (
        <Container>
            <Segment style={{ padding: '8em 0em', margin: 'auto'}} vertical className='flex-column align-items-center'>
                <Header as='h2'>Weather Forecast</Header>
                <LocationLookup setSelectedLocation={setSelectedLocation} />
                <Divider></Divider>
                <IsButton onClick={handleSearch} label="Search" className="searchButton"/>
            </Segment>
            <Segment hidden={weatherCardHidden}>
                <Header as='h3'>{address}</Header>
                <Grid padded columns={2} divided>
                    {combinedData.map((day, index) => (
                        <Grid.Row key={index}>
                            <Grid.Column>
                                <Card fluid>
                                    <Card.Content>
                                        <Card.Header>{new Date(day.date).toLocaleDateString()}</Card.Header>
                                        <Card.Meta>Max Temp: {parseInt(day.weather.temperature_2m_max)}°F</Card.Meta>
                                        <Card.Meta>Min Temp: {parseInt(day.weather.temperature_2m_min)}°F</Card.Meta>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                            <Grid.Column>
                                {locationDataRef.current.country_code === "us" ?
                                    day.forecasts.map((forecast, idx) => (
                                        <Card fluid key={idx}>
                                            <Card.Content>
                                                <Card.Meta>
                                                    {forecast.isDaytime ? 'Daytime' : 'Nighttime'}: {forecast.detailedForecast}
                                                </Card.Meta>
                                            </Card.Content>
                                        </Card>
                                    )) :
                                    <Card fluid>
                                        <Card.Content>
                                            <Card.Description>
                                                Detailed forecast is only available for US locations.
                                            </Card.Description>
                                        </Card.Content>
                                    </Card>
                                }
                            </Grid.Column>
                            <Divider />
                        </Grid.Row>
                    ))}
                </Grid>
            </Segment>
        </Container>
    );
};

export default ForecastPage;
