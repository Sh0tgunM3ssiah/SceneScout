import React, { useState, useEffect, useRef } from 'react';
import { TextField, CircularProgress } from '@mui/material';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

const LocationAutocomplete = ({ value, error, helperText, onChange }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [inputValue, setInputValue] = useState(value);
  const autoCompleteRef = useRef(null); // Reference to the TextField

  useEffect(() => {
    if (isLoaded && autoCompleteRef.current) {
      const autoComplete = new window.google.maps.places.Autocomplete(autoCompleteRef.current, {
        types: ['geocode'], // Specify the type of places to search
      });
      autoComplete.addListener('place_changed', () => {
        const place = autoComplete.getPlace();
        setInputValue(place.formatted_address); // Update input value with the selected place
        onChange({ target: { value: place.formatted_address, name: 'location' } }); // Mimic an event to pass to onChange
      });
    }
  }, [isLoaded, onChange]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  if (!isLoaded) return <CircularProgress />;

  return (
    <TextField
      label="Location"
      value={inputValue}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      fullWidth
      inputRef={autoCompleteRef} // Use the ref
      // You might want to remove the onChange prop to prevent manual edits,
      // or handle it differently based on your requirements.
    />
  );
};

export default LocationAutocomplete;