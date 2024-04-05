import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import Navbar from "scenes/navbar";
import { useSelector } from "react-redux";
import Form from './Form.jsx';
import { useNavigate } from "react-router-dom";

const CreateEventPage = () => {
    const theme = useTheme();
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState([]);
    const token = useSelector((state) => state.token);
    const userId = user?.user;
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const authToken = token;
      const fetchUser = async () => {
        if (!userId) return; // Do not attempt to fetch if username is not available
        try {
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
    
          // Now we have either a user or artist, check if they have a scene
          if (entity.scene) {
            const sceneResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/scenes/${entity.scene}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${authToken}`,
              },
            });
    
            if (!sceneResponse.ok) throw new Error('Scene not found');
            const sceneData = await sceneResponse.json();
            entity.sceneName = sceneData.name; // Add the scene name to your entity
          }
    
          setUserData(entity); // Update state with either user or artist, including scene name if applicable
    
        } catch (err) {
          console.error(err.message);
          // Handle errors, e.g., by setting an error state or displaying a notification
        }
      };
    
      fetchUser();
    }, [userId, token]);

  if (isLoading || !userData) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Navbar />
      <Box width={isNonMobileScreens ? '50%' : '93%'} p="2rem" m="2rem auto" borderRadius="1.5rem" backgroundColor={theme.palette.background.alt}>
        <Typography fontWeight="500" variant="h3" sx={{ mb: '2.5rem' }}>
          Got an Event Coming Up? Let Your Scene Know About It!
        </Typography>
        <Form userData={userData} />
      </Box>
    </Box>
  );
};

export default CreateEventPage;