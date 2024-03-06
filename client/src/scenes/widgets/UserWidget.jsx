import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, useTheme } from "@mui/material";
import {
  ManageAccountsOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  EditOutlined,
} from "@mui/icons-material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUser } from "../../../src/userContext"; // Ensure the path matches your project structure

const UserWidget = () => {
  const [userData, setUserData] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const userContext = useUser(); // Context might initially be null
  const username = userContext?.username;

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
  }, [username, token]); // Re-run when username or token changes  

  // If userData is not loaded yet, return null or a loading indicator
  if (!userData) {
    return <div>Loading...</div>;
  }

  // Destructure the user data for easy access
  const {
    _id: userId,
    firstName,
    lastName,
    location,
    scene,
    picturePath,
    friends = [],
    viewedProfile = 0,
    impressions = 0,
  } = userData;

  console.log(userData);

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem" onClick={() => navigate(`/profile/${userId}`)}>
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography variant="h4" color={palette.neutral.dark} fontWeight="500" sx={{ "&:hover": { cursor: "pointer", color: palette.primary.light } }}>
              {/* Conditionally display band name or user's full name */}
              {userData.type === 'band' ? userData.name : `${firstName} ${lastName}`}
            </Typography>
            <Typography color={palette.neutral.medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: palette.neutral.main }} />
          <Typography color={palette.neutral.medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: palette.neutral.main }} />
          <Typography color={palette.neutral.medium}>{userData.sceneName}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={palette.neutral.medium}>Who's viewed your profile</Typography>
          <Typography color={palette.neutral.main} fontWeight="500">{viewedProfile}</Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={palette.neutral.medium}>Impressions of your post</Typography>
          <Typography color={palette.neutral.main} fontWeight="500">{impressions}</Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW - Social Profiles */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={palette.neutral.main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>
        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={palette.neutral.main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={palette.neutral.medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: palette.neutral.main }} />
        </FlexBetween>
        
        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={palette.neutral.main} fontWeight="500">
                LinkedIn
              </Typography>
              <Typography color={palette.neutral.medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: palette.neutral.main }} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;