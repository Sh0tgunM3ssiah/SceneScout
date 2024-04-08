import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';

const GenresDropdown = ({ label, value, onChange, error = false, helperText = "", sx }) => {
  const [groupedGenres, setGroupedGenres] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/services/genres`);
        if (!response.ok) {
          throw new Error('Could not fetch genres');
        }
        const genres = await response.json();

        const sortedGroupedGenres = genres.map(genre => ({
          name: genre.name,
          subGenres: genre.subGenres.sort((a, b) => a.name.localeCompare(b.name)),
          _id: genre._id // Assuming each genre has a unique _id
        })).sort((a, b) => a.name.localeCompare(b.name));

        setGroupedGenres(sortedGroupedGenres);
      } catch (error) {
        console.error("Failed to fetch genres:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <FormControl fullWidth error={error} sx={sx}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        onChange={onChange}
        label={label}
        displayEmpty
        renderValue={selected => {
          // Find the selected genre or subgenre's name
          for (const genre of groupedGenres) {
            if (genre._id === selected) {
              return genre.name;
            }
            for (const subGenre of genre.subGenres) {
              if (subGenre._id === selected) {
                return `${genre.name} - ${subGenre.name}`;
              }
            }
          }
          return '';
        }}
      >
        {groupedGenres.flatMap((genre) => [
          <MenuItem key={genre._id} value={genre._id}>
            {genre.name}
          </MenuItem>,
          genre.subGenres.map((subGenre) => (
            <MenuItem key={subGenre._id} value={subGenre._id} style={{ marginLeft: '20px' }}>
              {subGenre.name}
            </MenuItem>
          ))
        ])}
      </Select>
      {helperText && <p style={{color: "red", fontSize: "0.75rem", marginTop: "3px"}}>{helperText}</p>}
    </FormControl>
  );
};

export default GenresDropdown;