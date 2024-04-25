import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, useTheme, Button, Tabs, Tab } from "@mui/material";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import ProfileWidget from "scenes/widgets/ProfileWidget";
import ProfileFriendListWidget from "scenes/widgets/ProfileFriendListWidget";
import ProfileFollowersListWidget from "scenes/widgets/ProfileFollowersListWidget";
import ProfilePostsWidget from "scenes/widgets/ProfilePostsWidget";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const friends = useSelector((state) => state.friends);
  const [tabValue, setTabValue] = useState(0);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const token = useSelector((state) => state.token);
  const { userId } = useParams();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const authToken = token;
    const fetchUser = async () => {
      if (!userId) return;

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
          entity.sceneName = sceneData.name;
        }
  
        setUserData(entity);
  
      } catch (err) {
        console.error(err.message);
      }
    };
  
    fetchUser();
  }, [userId, token]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!userData || !userData.scene) return;
      const endpoint = `${process.env.REACT_APP_BACKEND_URL}/posts/${encodeURIComponent(userData._id)}/posts`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedData);
      } else {
        setPosts([]);
      }
    };
  
    fetchUserPosts();
  }, [userData, token]);

  if(!userData) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="0.5rem"
      >
        <Box width="90%" mb="2rem">
          <ProfileWidget user={user} userData={userData} friends={friends} />
        </Box>

        <Box width="50%">
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Posts" />
            <Tab label="Following" />
            <Tab label="Followers" />
          </Tabs>

          {/* Render different components based on the selected tab */}
          {tabValue === 0 && (
            <ProfilePostsWidget userId={user._id} isProfile={true} userData={userData} posts={posts} />
          )}
          {tabValue === 1 && (
            <ProfileFriendListWidget userId={user._id} userData={userData} />
          )}
          {tabValue === 2 && (
            <ProfileFollowersListWidget userId={user._id} userData={userData} />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;