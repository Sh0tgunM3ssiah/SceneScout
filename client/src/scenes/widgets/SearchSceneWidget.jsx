import React, { useEffect, useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from 'react-redux';
import SceneSearchPostsWidget from './SceneSearchPostsWidget';

const SearchSceneWidget = ({ userSceneId, userData }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [sceneFilter, setSceneFilter] = useState(userSceneId || '');
  const [genreFilter, setGenreFilter] = useState('');
  const [postTypeFilter, setPostTypeFilter] = useState('');
  const [scenes, setScenes] = useState([]); // Will hold fetched scenes
  const token = useSelector((state) => state.token); // Assuming token is stored in redux for API authorization

  useEffect(() => {
    const fetchPostsAndEvents = async () => {
      if (!userData || !userData.scene) return; // Ensure userData and userData.sceneId are available
      
      const postsEndpoint = `${process.env.REACT_APP_BACKEND_URL}/posts?sceneId=${encodeURIComponent(userData.scene)}`;
      const eventsEndpoint = `${process.env.REACT_APP_BACKEND_URL}/events?sceneId=${encodeURIComponent(userData.scene)}`;

      try {
        // Fetch both posts and events concurrently
        const [postsResponse, eventsResponse] = await Promise.all([
          fetch(postsEndpoint, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(eventsEndpoint, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!postsResponse.ok || !eventsResponse.ok) {
          throw new Error('Failed to fetch posts or events');
        }

        const postsData = await postsResponse.json();
        const eventsData = await eventsResponse.json();

        // Assuming both posts and events have a createdAt field
        const combinedData = [...postsData, ...eventsData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setPosts(combinedData); // Assuming data is the array of posts
        filterPosts(combinedData, sceneFilter, genreFilter, postTypeFilter);
      } catch (err) {
        console.error(err.message);
        setPosts([]); // Handle errors or set an empty array
      }
    };

    fetchPostsAndEvents();
  }, [userData, token, sceneFilter, genreFilter, postTypeFilter]);

  // Filter function updated to use scene ID
  const filterPosts = (posts, sceneId, genre, postType) => {
    const filtered = posts.filter(post => {
      const matchesScene = !sceneId || post.sceneId === sceneId;
      const matchesGenre = !genre || post.genre === genre;
      const matchesType = !postType || post.postType === postType; // Adjusted for case sensitivity and property name
      return matchesScene && matchesGenre && matchesType;
    });
    setFilteredPosts(filtered);
  };

  // Update filters
  const handleSceneFilterChange = (event) => {
    setSceneFilter(event.target.value);
  };

  const handleGenreFilterChange = (event) => {
    setGenreFilter(event.target.value);
  };

  const handlePostTypeFilterChange = (event) => {
    setPostTypeFilter(event.target.value);
  };

  return (
    <WidgetWrapper>
      <Box display="flex" flexDirection="column" gap="1rem">
        {/* Filters */}
        <Box display="flex" flexDirection="column" gap="1rem">
          <FormControl variant="filled" sx={{ width: '100%' }}>
            <InputLabel id="scene-select-label">Scene</InputLabel>
            <Select
              labelId="scene-select-label"
              id="scene-select"
              value={sceneFilter}
              onChange={handleSceneFilterChange}
            >
              <MenuItem value="">
                <em>Default Scene</em>
              </MenuItem>
              {scenes.map((scene) => (
                <MenuItem key={scene._id} value={scene._id}>{scene.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="filled" sx={{ width: '100%' }}>
            <InputLabel id="post-type-select-label">Post Type</InputLabel>
            <Select
              labelId="post-type-select-label"
              id="post-type-select"
              value={postTypeFilter}
              onChange={handlePostTypeFilterChange}
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="User">Fan Posts</MenuItem>
              <MenuItem value="Artist">Artist Posts</MenuItem>
              <MenuItem value="Event">Events</MenuItem>
            </Select>
          </FormControl>
          
          {/* Conditionally render the Genre filter based on the postTypeFilter */}
          {(postTypeFilter === 'Artist' || postTypeFilter === 'Event') && (
            <FormControl variant="filled" sx={{ width: '100%' }}>
              <InputLabel id="genre-select-label">Genre</InputLabel>
              <Select
                labelId="genre-select-label"
                id="genre-select"
                value={genreFilter}
                onChange={handleGenreFilterChange}
              >
                <MenuItem value="">
                  <em>All</em>
                </MenuItem>
                <MenuItem value="rock">Rock</MenuItem>
                <MenuItem value="pop">Pop</MenuItem>
                <MenuItem value="jazz">Jazz</MenuItem>
                <MenuItem value="metal">Metal</MenuItem>
                {/* Add more genres as needed */}
              </Select>
            </FormControl>
          )}
        </Box>
        
        {/* Display filtered posts */}
        <SceneSearchPostsWidget posts={filteredPosts} userData={userData} />
      </Box>
    </WidgetWrapper>
  );
};

export default SearchSceneWidget;