import { Box, useMediaQuery, Button, Typography, Grid, Card, Badge, Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Navbar from "scenes/navbar";
import ProfileEditWidget from "scenes/widgets/ProfileEditWidget";
import UserProfileImage from "components/UserProfileImage";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import { useUser } from '../../../src/userContext.js'; // Ensure this path matches your project structure

const ProfileEditPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { _id, picturePath } = user; // Destructure the needed properties from the user object

  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const token = useSelector((state) => state.token);
  const { userId } = useParams();

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

  const handleNavigateToEditProfile = () => {
    navigate(`/profile/edit/${userData.userId}`);
  };
  return (
    <Box>
      <Navbar />
      <Box>
        <ProfileEditWidget user={user} userData={userData} />
      </Box>
    </Box>
  );
};

export default ProfileEditPage;
