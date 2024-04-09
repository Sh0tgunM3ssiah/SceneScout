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
  // Optional: State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const authToken = token;
    setLoading(true);
    const fetchUserAndArtist = async () => {
      // if (!userId) return; // Do not attempt to fetch if userId is not available
      // try {
        const userUrl = `${process.env.REACT_APP_BACKEND_URL}/users/${encodeURIComponent(userId)}`;

        const userResponse = await fetch(userUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`,
          },
        });

        if (!userResponse.ok) throw new Error('User not found');

        const user = await userResponse.json();
    
        let entity = { ...user, type: user.accountType };
        const loggedIn = entity;
        if (loggedIn) {
          dispatch(
            setLogin({
              user: loggedIn.userId,
              token: token,
              id: loggedIn._id
            })
          );
        }
        console.log(loggedIn);
        navigate('/home');
      // } catch (err) {
      //   console.error(err.message);
      //   setLoading(false); // Ensure loading is false in case of an error
      //   setError(err.message); // Handle errors, e.g., by setting an error state
      // }
    };
  
    fetchUserAndArtist();
  }, [userContext]); // Ensure all used state setters and navigate are in the dependency array  

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