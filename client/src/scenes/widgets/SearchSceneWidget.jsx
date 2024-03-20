import React, { useState } from 'react';
import {
  Box,
  InputBase,
  Typography,
  useTheme,
} from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';

const SearchSceneWidget = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);
    const theme = useTheme();
  
    // Static posts data. Replace with your actual data source.
    const posts = [
      { scene: 'mountains', genre: 'adventure', content: 'Mountain Climbing Adventure' },
      { scene: 'city', genre: 'urban', content: 'Exploring Urban Nightlife' },
      { scene: 'forest', genre: 'nature', content: 'Camping in the Forest' },
      // Add more posts as needed
    ];
  
    // Function to filter posts based on search term
    const handleSearch = (event) => {
      const value = event.target.value.toLowerCase();
      setSearchTerm(value);
  
      const filtered = posts.filter(post =>
        post.scene.toLowerCase().includes(value) || 
        post.genre.toLowerCase().includes(value) || 
        post.content.toLowerCase().includes(value)
      );
  
      setFilteredPosts(filtered);
    };
  
    return (
      <WidgetWrapper>
        <Box display="flex" flexDirection="column" gap="1rem">
          <InputBase
            placeholder="Search posts..."
            fullWidth
            onChange={handleSearch}
            value={searchTerm}
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: '20px',
              padding: '10px 20px',
            }}
          />
          {filteredPosts.map((post, index) => (
            <Typography key={index} sx={{ padding: '10px', borderBottom: `1px solid ${theme.palette.divider}` }}>
              {post.content}
            </Typography>
          ))}
        </Box>
      </WidgetWrapper>
    );
  };
  
  export default SearchSceneWidget;
  