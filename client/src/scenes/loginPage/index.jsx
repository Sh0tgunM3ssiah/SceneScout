import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import Form from './Form';
import { useUser } from '../../../src/userContext'; // Ensure this path matches your project structure
import { useSelector } from 'react-redux'; // Assuming you've set up Redux

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate(); // Hook for programmatic navigation
  const token = useSelector((state) => state.token);
  const userContext = useUser();
  const userId = userContext?.userId;
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  // Optional: State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const authToken = token;
    const fetchUserByUsername = async () => {
      if (!userId) return; // Do not attempt to fetch if userEmail is not available
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${encodeURIComponent(userId)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        setLoading(false);

        if (!response.ok) {
          setError('User not found or error fetching user');
          throw new Error('User not found or error fetching user');
        }

        // If user is found, redirect to the homepage
        navigate('/home');
      } catch (err) {
        console.error(err.message);
        setLoading(false);
        setError(err.message); // Handle errors, e.g., by setting an error state
      }
    };

    fetchUserByUsername();
  }, [userId, token, navigate]); // Add navigate to dependency array

  if (loading) {
    return <Typography>Loading...</Typography>;
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