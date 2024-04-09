import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery, Typography, CircularProgress } from "@mui/material";
import Navbar from "scenes/navbar";
import SearchSceneWidget from "scenes/widgets/SearchSceneWidget";
import { useSelector } from "react-redux";

const SearchPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const user = useSelector((state) => state.user);
  const [userData, setUserData] = useState(null);
  const token = useSelector((state) => state.token);
  const userId = user?.userId;
  
  useEffect(() => {
    const authToken = token;
    const fetchUser = async () => {
      if (!userId) return; // Do not attempt to fetch if username is not available
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
  
        let entity; // This will hold either the user or the artist
        if (userResponse.ok) {
          const user = await userResponse.json();
          entity = { ...user, type: 'user' };
        } else if (artistResponse.ok) {
          const artist = await artistResponse.json();
          entity = { ...artist, type: 'artist' };
        } else {
          throw new Error('Neither user nor artist found');
        }
  
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

  if (!userData) {
    return <CircularProgress />
  }

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={"flex"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={"90%"}>
          <Typography fontWeight="500" variant="h3" sx={{ mb: '2.5rem' }}>
            Welcome to the Search Engine
          </Typography>
          <SearchSceneWidget userId={userData._id} userSceneId={userData.scene} picturePath={userData.picturePath} userData={userData} />
        </Box>
      </Box>
    </Box>
  );
};

export default SearchPage;