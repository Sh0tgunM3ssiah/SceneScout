import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery } from "@mui/material";
import Navbar from "scenes/navbar";
import UserWidget from "scenes/widgets/UserWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import AdvertWidget from "scenes/widgets/AdvertWidget";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import { useSelector } from "react-redux";
import { useUser } from '../../../src/userContext.js'; // Ensure this path matches your project structure

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const user = useUser() ?? {}; // Use useUser hook to access the user context
  const { _id, picturePath } = user; // Destructure the needed properties from the user object

  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const token = useSelector((state) => state.token);
  const userId = user?.userId;
  const userSceneId = user?.scene;

  const addPost = (post) => {
    setPosts([post, ...posts]); // Add the new post to the beginning of the posts array
  };

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

  useEffect(() => {
    const fetchPostsAndEvents = async () => {
      if (!userData || !userData.scene) return; // Ensure userData and userData.sceneId are available
      
      const postsEndpoint = `${process.env.REACT_APP_BACKEND_URL}/posts?sceneId=${encodeURIComponent(userData.scene)}`;
      const eventsEndpoint = `${process.env.REACT_APP_BACKEND_URL}/events?sceneId=${encodeURIComponent(userData.scene)}`;

      try {
        // Fetch both posts and events concurrently
        const [postsResponse, eventsResponse] = await Promise.all([
          fetch(postsEndpoint, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(eventsEndpoint, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!postsResponse.ok || !eventsResponse.ok) {
          throw new Error('Failed to fetch posts or events');
        }

        const postsData = await postsResponse.json();
        const eventsData = await eventsResponse.json();

        // Assuming both posts and events have a createdAt field
        const combinedData = [...postsData, ...eventsData].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setPosts(combinedData); // Use the setPosts state to hold combined data
      } catch (err) {
        console.error(err.message);
        setPosts([]); // Handle errors or set an empty array
      }
    };

    fetchPostsAndEvents();
  }, [userData, token]);

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
          <UserWidget userId={_id} picturePath={picturePath} userData={userData} />
        </Box>
        <Box
          flexBasis={isNonMobileScreens ? "42%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget picturePath={picturePath} userData={userData} addPost={addPost} />
          {userData && <PostsWidget userId={_id} isProfile={true} userData={userData} posts={posts} />}
        </Box>
        {isNonMobileScreens && (
          <Box flexBasis="26%">
            <AdvertWidget />
            <FriendListWidget userId={_id} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default HomePage;