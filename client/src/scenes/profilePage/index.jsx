import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import ProfileWidget from "scenes/widgets/ProfileWidget";
import { useUser } from '../../../src/userContext'; // Ensure this path matches your project structure

const ProfilePage = () => {
  const user = useUser() ?? {}; // Use useUser hook to access the user context
  const { _id, picturePath } = user; // Destructure the needed properties from the user object

  const [userData, setUserData] = useState(null);
  const token = useSelector((state) => state.token);
  const userContext = useUser(); // Context might initially be null
  const userId = userContext?.userId;

  useEffect(() => {
    const authToken = token;
    const fetchUserByUsername = async () => {
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
  
    fetchUserByUsername();
  }, [userId, token]);

  if (!user) return null;

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
          <ProfileWidget userId={_id} picturePath={picturePath} userData={userData} />
          <Box m="2rem 0" />
          <FriendListWidget userData={userData} />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
