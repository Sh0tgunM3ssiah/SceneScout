import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress, ListSubheader } from '@mui/material';

const ScenesDropdown = ({ label, value, onChange, error = false, helperText = "", sx }) => {
  const [groupedScenes, setGroupedScenes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchScenes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/scenes`);
        if (!response.ok) {
          throw new Error('Could not fetch scenes');
        }
        const scenes = await response.json();
        
        // Group scenes by state
        const grouped = scenes.reduce((acc, scene) => {
          acc[scene.state] = acc[scene.state] || [];
          acc[scene.state].push(scene);
          return acc;
        }, {});
        
        // Sort states and scenes within each state
        const sortedGroupedScenes = Object.keys(grouped).sort().map(state => ({
          state,
          scenes: grouped[state].sort((a, b) => a.name.localeCompare(b.name))
        }));

        setGroupedScenes(sortedGroupedScenes);
      } catch (error) {
        console.error("Failed to fetch scenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScenes();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <FormControl fullWidth error={error} sx={sx}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={(event) => {
          const selectedId = event.target.value;
          // Look up the selected scene to get its name
          const selectedScene = groupedScenes
            .flatMap(group => group.scenes)
            .find(scene => scene._id === selectedId);

          // Call the onChange prop with both ID and name
          if (selectedScene) {
            onChange(selectedId, selectedScene.name);
          } else {
            onChange(selectedId, ''); // Fallback if no scene is found
          }
        }}
        label={label}
        displayEmpty
      >
        {groupedScenes.flatMap(({ state, scenes }) => [
          <ListSubheader key={state} disabled>{state}</ListSubheader>,
          ...scenes.map(scene => (
            <MenuItem key={scene._id} value={scene._id}>
              {scene.name}
            </MenuItem>
          ))
        ])}
      </Select>
      {helperText && <p style={{color: "red", fontSize: "0.75rem", marginTop: "3px"}}>{helperText}</p>}
    </FormControl>
  );
};

export default ScenesDropdown;