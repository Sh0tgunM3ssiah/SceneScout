import { Box, Tabs, Tab } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "scenes/navbar";
import ProfileWidget from "scenes/widgets/ProfileWidget";
import ProfileFriendListWidget from "scenes/widgets/ProfileFriendListWidget";
import ProfileFollowersListWidget from "scenes/widgets/ProfileFollowersListWidget";
import ProfilePostsWidget from "scenes/widgets/ProfilePostsWidget";

const ProfilePage = () => {
  const user = useSelector((state) => state.user);
  const friends = user.friends;
  const id = useSelector((state) => state.user);
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
          <ProfileWidget user={user} userData={userData} id={id} friends={friends} />
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
                <ProfileFriendListWidget userId={user._id} userData={userData} />
              </Box>
            </Box>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                <ProfileFollowersListWidget userId={user._id} userData={userData} />
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