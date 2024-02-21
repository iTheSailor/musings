// address search bar with autocomplete
import React, { useState } from 'react';
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import './Lookup.css'


const LocationLookup = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);

    function onPlaceSelect(value) {
        console.log(value);
        setSelectedLocation(value);
      }
     
      function onSuggestionChange(value) {
        console.log(value);
      }
     
      const GeoKey = process.env.REACT_APP_GEOAPIFY_API_KEY;

      return <GeoapifyContext apiKey={GeoKey}>
              <GeoapifyGeocoderAutocomplete placeholder="Enter address here"
                value={selectedLocation}
                placeSelect={onPlaceSelect}
                suggestionsChange={onSuggestionChange}
                
                />
              </GeoapifyContext>
          
    }

export default LocationLookup;