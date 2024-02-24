import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Import PropTypes
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete';
import './Lookup.css';

const LocationLookup = ({ setSelectedLocation }) => {
  const [selectedLocation, setSelectedLocationState] = useState(null);

  function onPlaceSelect(location) {
      setSelectedLocationState(location); // Update local state
      if (location && location.properties && location.properties.formatted) {
          setSelectedLocation(location.properties.formatted); // Update parent component's state
          console.log("Selected location:", location.properties.formatted); // Log the formatted location
      } else {
          console.log("Location selection is incomplete or undefined.");
      }
  }

  const GeoKey = process.env.REACT_APP_GEOAPIFY_API_KEY;

  return (
      <GeoapifyContext apiKey={GeoKey}>
          <GeoapifyGeocoderAutocomplete
              placeholder="Enter address here"
              value={selectedLocation}
              placeSelect={onPlaceSelect}
              allowNonVerifiedHouseNumber={true}
              allowNonVerifiedStreet={true}
          />
      </GeoapifyContext>
  );
};

LocationLookup.propTypes = {
  setSelectedLocation: PropTypes.func.isRequired, // Ensure that setSelectedLocation is a function
};

export default LocationLookup;