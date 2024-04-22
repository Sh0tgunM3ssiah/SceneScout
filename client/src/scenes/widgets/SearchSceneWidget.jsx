import React, { useEffect, useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  useMediaQuery,
  Card
} from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from 'react-redux';
import SceneSearchPostsWidget from './SceneSearchPostsWidget';
import ScenesDropdown from "../../components/scenesDropdown";
import GenresDropdown from "../../components/GenresDropdown";
import Friend from "../../components/Friend";

const SearchSceneWidget = ({ userSceneId, userData }) => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [sceneFilter, setSceneFilter] = useState(userSceneId || '');
  const [genreFilter, setGenreFilter] = useState('');
  const [postTypeFilter, setPostTypeFilter] = useState('');
  const [userFilter, setUserFilter] = useState('Artist'); // Default to 'Artist'
  const [searchType, setSearchType] = useState('Posts'); // Default to 'Posts'
  const token = useSelector(state => state.token);

  useEffect(() => {
    if (searchType === 'Posts') {
      fetchPostsAndEvents();
    } else if (searchType === 'Users' && sceneFilter) {
      fetchUsersByScene(sceneFilter);
    }
  }, [userData, token, sceneFilter, genreFilter, postTypeFilter, searchType, userFilter]);

  const fetchPostsAndEvents = async () => {
    if (!userData || !userData.scene) return;

    const postsEndpoint = `${process.env.REACT_APP_BACKEND_URL}/posts`;
    const eventsEndpoint = `${process.env.REACT_APP_BACKEND_URL}/events`;

    try {
      const [postsResponse, eventsResponse] = await Promise.all([
        fetch(postsEndpoint, { method: "GET", headers: { Authorization: `Bearer ${token}` } }),
        fetch(eventsEndpoint, { method: "GET", headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (!postsResponse.ok || !eventsResponse.ok) {
        throw new Error('Failed to fetch posts or events');
      }

      const postsData = await postsResponse.json();
      const eventsData = await eventsResponse.json();

      const combinedData = [
        ...postsData.map(post => ({ ...post, type: 'post' })),
        ...eventsData.map(event => ({ ...event, type: 'event' }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPosts(combinedData);
      filterPosts(combinedData, sceneFilter, genreFilter, postTypeFilter);
    } catch (err) {
      console.error(err.message);
      setPosts([]);
    }
  };

  const fetchUsersByScene = async (sceneId) => {
    const endpoint = `${process.env.REACT_APP_BACKEND_URL}/users/getusersbyscene/${sceneId}`;
    try {
      const response = await fetch(endpoint, { method: 'GET', headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      setUsers(data);
      filterUsers(data, userFilter);
    } catch (err) {
      console.error('Error fetching users:', err.message);
      setUsers([]);
    }
  };

  const filterPosts = (posts, sceneId, genre, postType) => {
    const filtered = posts.filter(post => 
      (!sceneId || post.sceneId === sceneId) &&
      (!genre || post.genre === genre) &&
      (!postType || post.postType === postType)
    );
    setFilteredPosts(filtered);
  };

  const filterUsers = (users, filter) => {
    const filtered = users.filter(user => 
      !filter || user.type.toLowerCase() === filter.toLowerCase()
    );
    setFilteredUsers(filtered);
  };

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    if (event.target.value === 'Users') {
      setUserFilter('Artist'); // Reset the user filter to 'Artist' when switching to 'Users'
      if (sceneFilter) {
        fetchUsersByScene(sceneFilter); // Re-fetch users with the default filter
      }
    }
    // Reset other filters when search type changes
    setGenreFilter('');
    setPostTypeFilter('');
  };

  const handleUserFilterChange = (event) => {
    setUserFilter(event.target.value);
    filterUsers(users, event.target.value);
  };

  return (
    <WidgetWrapper>
      <Box display="flex" flexDirection="column" gap="1rem">
        <ScenesDropdown
          label="Scene"
          value={sceneFilter}
          onChange={(sceneId, sceneName) => setSceneFilter(sceneId)}
        />
        <FormControl variant="filled" sx={{ width: '100%' }}>
          <InputLabel id="search-type-select-label">Search for</InputLabel>
          <Select
            labelId="search-type-select-label"
            id="search-type-select"
            value={searchType}
            onChange={handleSearchTypeChange}
          >
            <MenuItem value="Users">Users</MenuItem>
            <MenuItem value="Posts">Posts</MenuItem>
          </Select>
        </FormControl>

        {searchType === 'Users' && (
          <FormControl variant="filled" sx={{ width: '100%' }}>
            <InputLabel id="user-filter-select-label">User Type</InputLabel>
            <Select
              labelId="user-filter-select-label"
              id="user-filter-select"
              value={userFilter}
              onChange={handleUserFilterChange}
            >
              <MenuItem value="User">Fans</MenuItem>
              <MenuItem value="Artist">Artists</MenuItem>
            </Select>
          </FormControl>
        )}

        {searchType === 'Posts' && (
          <Box display="flex" flexDirection="column" gap="1rem">
            <FormControl variant="filled" sx={{ width: '100%' }}>
              <InputLabel id="post-type-select-label">Post Type</InputLabel>
              <Select
                labelId="post-type-select-label"
                id="post-type-select"
                value={postTypeFilter}
                onChange={(event) => setPostTypeFilter(event.target.value)}
              >
                <MenuItem value=""><em>All</em></MenuItem>
                <MenuItem value="User">Fan Posts</MenuItem>
                <MenuItem value="Artist">Artist Posts</MenuItem>
                <MenuItem value="Event">Events</MenuItem>
              </Select>
            </FormControl>
            
            {(postTypeFilter === 'Artist' || postTypeFilter === 'Event') && (
              <GenresDropdown
                label="Genre"
                value={genreFilter}
                onChange={(event) => setGenreFilter(event.target.value)}
              />
            )}
          </Box>
        )}

        {/* Conditionally display posts or a custom user list based on the search type */}
        {searchType === 'Posts' ? (
          <SceneSearchPostsWidget posts={filteredPosts} userData={userData} />
        ) : searchType === 'Users' ? (
          <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 2 }}>
            {filteredUsers.map(user => (
              <Box key={user._id} sx={{ flex: '1 1 30%', minWidth: '300px', maxWidth: '300px' }}>
                <Card sx={{padding: '20px'}}>
                  <Friend
                    friendId={user._id}
                    friendUserId={user.userId}
                    name={user.username}
                    subtitle={user.type === 'Artist' ? user.genre : ""}
                    userPicturePath={user.picturePath}
                    userData={userData}
                    context="search"
                  />
                </Card>
              </Box>
            ))}
          </Box>
        ) : null}
      </Box>
    </WidgetWrapper>
  );
};

export default SearchSceneWidget;
