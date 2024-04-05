import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import FollowersListWidget from "scenes/widgets/FollowersListWidget";
import { useSelector } from "react-redux";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const user = useSelector(state => state.user);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const token = useSelector(state => state.token);

  const addPost = (post) => {
    setPosts([post, ...posts]); // Add the new post to the beginning of the posts array
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) return; // Do not attempt to fetch if username is not available
      try {
        const userUrl = `${process.env.REACT_APP_BACKEND_URL}/users/${encodeURIComponent(user.user)}`;

        const userResponse = await fetch(userUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) throw new Error('User not found');

        const fetched = await userResponse.json();
    
        let entity = { ...fetched, type: fetched.accountType };
  
        // Now we have either a user or artist, check if they have a scene
        if (entity.scene) {
          const sceneResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/scenes/${entity.scene}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
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
  }, [token]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userData || !userData.scene) return; // Ensure userData and userData.sceneId are available
      const endpoint = `${process.env.REACT_APP_BACKEND_URL}/posts?sceneId=${encodeURIComponent(userData.scene)}`;
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedData); // Update the posts state with the sorted posts
      } else {
        // Handle errors or set an empty array
        setPosts([]);
      }
    };
  
    fetchPosts();
  }, [userData, token]);

  if (userData) {
    return (
      <Box>
        <Navbar />
        <Box
          width="100%"
          padding="2rem 6%"
          display={isNonMobileScreens ? "flex" : "block"}
          gap="0.5rem"
          justifyContent="space-between"
        >
          <Box flexBasis={isNonMobileScreens ? "26%" : undefined}>
            <Box mb="2rem">
              {userData && <UserWidget userId={userData._id} picturePath={userData.picturePath} userData={userData} />}
            </Box>
            {isNonMobileScreens && userData && <FollowersListWidget userId={userData._id} userData={userData} />}
          </Box>
          <Box
            flexBasis={isNonMobileScreens ? "42%" : undefined}
            mt={isNonMobileScreens ? undefined : "2rem"}
          >
            {userData && <MyPostWidget picturePath={userData.picturePath} userData={userData} addPost={addPost} />}
            <Box mt="2rem">
              {userData && <PostsWidget userId={userData._id} isProfile={true} userData={userData} posts={posts} />}
            </Box>
          </Box>
          {isNonMobileScreens && (
            <Box flexBasis="26%">
              <Box mb="2rem">
                <AdvertWidget />
              </Box>
              {userData && <FriendListWidget userId={userData._id} userData={userData} />}
            </Box>
          )}
        </Box>
      </Box>
    );
  } else {
    return (
      <Box>
        <Navbar />
        <Box
          width="100%"
          padding="2rem 6%"
          display={isNonMobileScreens ? "flex" : "block"}
          gap="0.5rem"
          justifyContent="space-between"
        >
          <CircularProgress />
        </Box>
      </Box>
    );
  }
};

export default HomePage;