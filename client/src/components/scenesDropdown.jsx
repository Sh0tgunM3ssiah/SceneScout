import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

const ScenesDropdown = ({ label, value, onChange, error = false, helperText = "" }) => {
  const [scenes, setScenes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScenes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/scenes`);
        if (!response.ok) {
          throw new Error('Could not fetch scenes');
        }
        const data = await response.json();
        setScenes(data);
      } catch (error) {
        console.error("Failed to fetch scenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScenes();
  }, []); // Dependency array left empty to only run once at mount

  if (loading) return <CircularProgress />;

  return (
    <FormControl fullWidth error={error}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        displayEmpty
      >
        {scenes.map((scene) => (
          <MenuItem key={scene._id} value={scene._id}>
            {scene.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && <p style={{color: "red", fontSize: "0.75rem", marginTop: "3px"}}>{helperText}</p>}
    </FormControl>
  );
};

export default ScenesDropdown;