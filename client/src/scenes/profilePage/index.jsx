import { Box, useMediaQuery, Button, Typography, Grid, Card, Badge, Avatar, Tabs, Tab } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Navbar from "scenes/navbar";
import ProfileWidget from "scenes/widgets/ProfileWidget";
import UserProfileImage from "components/UserProfileImage";
import FriendListWidget from "scenes/widgets/FriendListWidget";
import FollowersListWidget from "scenes/widgets/FollowersListWidget";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import ProfilePostsWidget from "scenes/widgets/ProfilePostsWidget";
import UserWidget from "scenes/widgets/UserWidget";
import { useUser } from '../../../src/userContext.js'; // Ensure this path matches your project structure

const ProfilePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const id = useSelector((state) => state.user);
  const [tabValue, setTabValue] = useState(0);
  const { _id, picturePath } = user; // Destructure the needed properties from the user object

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
    const fetchUserPosts = async () => {
      if (!userData || !userData.scene) return; // Ensure userData and userData.sceneId are available
      const endpoint = `${process.env.REACT_APP_BACKEND_URL}/posts/${encodeURIComponent(userData._id)}/posts`;
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
          <ProfileWidget user={user} userData={userData} id={id} />
        </Box>

        <Box width="90%">
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Posts" />
            <Tab label="Following" />
            <Tab label="Followers" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                <ProfilePostsWidget userId={user._id} isProfile={true} userData={userData} posts={posts} />
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                <FriendListWidget userId={user._id} userData={userData} />
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                <FollowersListWidget userId={user._id} userData={userData} />
              </Box>
            </Box>
          </TabPanel>
        </Box>
      </Box>
    </Box>
  );
};

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default ProfilePage;