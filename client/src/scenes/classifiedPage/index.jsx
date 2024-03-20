import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useSelector } from "react-redux";
import { useUser } from '../../userContext.js'; // Ensure this path matches your project structure

const SearchPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const user = useUser() ?? {}; // Use useUser hook to access the user context
  const { _id, picturePath } = user; // Destructure the needed properties from the user object

  const [userData, setUserData] = useState(null);
  const token = useSelector((state) => state.token);
  const username = user?.username;

  useEffect(() => {
    const authToken = token;
    const fetchUserByUsername = async () => {
      if (!username) return; // Do not attempt to fetch if username is not available
      try {
        const userUrl = `http://localhost:3001/users/username/${encodeURIComponent(username)}`;
        const bandUrl = `http://localhost:3001/bands/username/${encodeURIComponent(username)}`;
        // Concurrently fetch user and band data
        const [userResponse, bandResponse] = await Promise.all([
          fetch(userUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          }),
          fetch(bandUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          })
        ]);
  
        let entity; // This will hold either the user or the band
        if (userResponse.ok) {
          const user = await userResponse.json();
          entity = { ...user, type: 'user' };
        } else if (bandResponse.ok) {
          const band = await bandResponse.json();
          entity = { ...band, type: 'band' };
        } else {
          throw new Error('Neither user nor band found');
        }
  
        // Now we have either a user or band, check if they have a scene
        if (entity.scene) {
          const sceneResponse = await fetch(`http://localhost:3001/scenes/${entity.scene}`, {
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
  
        setUserData(entity); // Update state with either user or band, including scene name if applicable
  
      } catch (err) {
        console.error(err.message);
        // Handle errors, e.g., by setting an error state or displaying a notification
      }
    };
  
    fetchUserByUsername();
  }, [username, token]);

  return (
    <Box>
      <Navbar />
    </Box>
  );
};

export default SearchPage;