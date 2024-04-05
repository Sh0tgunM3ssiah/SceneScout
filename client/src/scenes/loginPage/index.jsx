import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useDispatch } from "react-redux";
import Form from './Form';
import { useUser } from '../../../src/userContext'; // Ensure this path matches your project structure
import { useSelector } from 'react-redux'; // Assuming you've set up Redux
import { setLogin } from "state";

const LoginPage = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for programmatic navigation
  const token = useSelector((state) => state.token);
  const userContext = useUser();
  const userId = userContext?.currentUser?.userId || null;
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  console.log(userContext);

  // Optional: State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const authToken = token;
    setLoading(true);
    const fetchUserAndArtist = async () => {
      if (!userId) return; // Do not attempt to fetch if userId is not available
      try {
        const userUrl = `${process.env.REACT_APP_BACKEND_URL}/users/${encodeURIComponent(userId)}`;
        const artistUrl = `${process.env.REACT_APP_BACKEND_URL}/artists/${encodeURIComponent(userId)}`;
        // Concurrently fetch user and artist data
        const [userResponse, artistResponse] = await Promise.all([
          fetch(userUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          }),
          fetch(artistUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          })
        ]);
  
        setLoading(false); // Stop loading state
  
        let entity; // This will hold either the user or the artist
        if (userResponse.ok) {
          const user = await userResponse.json();
          entity = { ...user, type: 'user' };
        } else if (artistResponse.ok) {
          const artist = await artistResponse.json();
          entity = { ...artist, type: 'artist' };
        } else {
          setError('Neither user nor artist found');
          throw new Error('Neither user nor artist found');
        }
        const loggedIn = entity;
        if (loggedIn) {
          dispatch(
            setLogin({
              user: userId,
              token: token,
              id: loggedIn._id
            })
          );
        }
        // If we have either a user or an artist, navigate to the home page
        navigate('/home');
      } catch (err) {
        console.error(err.message);
        setLoading(false); // Ensure loading is false in case of an error
        setError(err.message); // Handle errors, e.g., by setting an error state
      }
    };
  
    fetchUserAndArtist();
  }, [userId, token, navigate, setLoading, setError]); // Ensure all used state setters and navigate are in the dependency array  

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Box width="100%" backgroundColor={theme.palette.background.alt} p="1rem 6%" textAlign="center">
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          SceneScout
        </Typography>
      </Box>

      <Box width={isNonMobileScreens ? '50%' : '93%'} p="2rem" m="2rem auto" borderRadius="1.5rem" backgroundColor={theme.palette.background.alt}>
        <Typography fontWeight="500" variant="h3" sx={{ mb: '2.5rem' }}>
          Welcome to SceneScout, the Social Media for Local Artists and Their Fans!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;