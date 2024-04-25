import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  Icon,
} from "@mui/material";
import {
  Home,
  Event,
  Search,
  Assignment,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "state"; // Update this path according to your project structure
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import { useUser } from '../../../src/userContext.js'; // Ensure this path matches your project structure
import { signOut } from '@aws-amplify/auth';
import { Image, View } from '@aws-amplify/ui-react';

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.loggedInUser);
  const [userData, setUserData] = useState(null);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const userId = user?.userId;
  const token = useSelector((state) => state.token);
  const userSceneId = user?.scene;

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

  const handleLogout = async () => {
  
    try {
      // Sign out from AWS Amplify
      await signOut();
  
      // Dispatch logout action to update your application state
      dispatch(setLogout());
  
      // Redirect to the login page or another page as needed
      navigate('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  const handleNavigateToHome = () => {
    navigate('/home');
  };

  const handleNavigateToSearch = () => {
    navigate('/search');
  };

  const handleNavigateToCreateEvent = () => {
    navigate('/event');
  };

  const handleNavigateToClassifieds = () => {
    navigate(`/classifieds/${userData.sceneName}`);
  };

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={theme.palette.background.alt}>
      <FlexBetween gap="1.75rem">
        <img
          src="/scenescoutLogoScriptMastiff.png"
          alt="SceneScout Logo"
          onClick={() => navigate("/home")}
          style={{
            cursor: "pointer",
            minWidth: "200px",
            maxWidth: "250px"
          }}
        />
        {/* <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2vw, 2.25rem)"
          color="primary"
          onClick={() => navigate("/home")}
          sx={{
            "&:hover": {
              cursor: "pointer",
            },
          }}
        >
          SceneScout.io
        </Typography> */}
      </FlexBetween>

      {isNonMobileScreens ? (
        <FlexBetween gap="2rem">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode sx={{ fontSize: "25px" }} />
            ) : (
              <LightMode sx={{ color: theme.palette.neutral.dark, fontSize: "25px" }} />
            )}
          </IconButton>
          <IconButton onClick={handleNavigateToHome}>
            <Home sx={{ fontSize: "25px" }} />
          </IconButton>
          <IconButton onClick={handleNavigateToSearch}>
            <Search sx={{ fontSize: "25px" }} />
          </IconButton>
          {userData?.accountType === 'Artist' && (
            <IconButton onClick={handleNavigateToCreateEvent}>
              <Event sx={{ fontSize: "25px" }} />
            </IconButton>
          )}
          {/* <IconButton onClick={handleNavigateToClassifieds}>
            <Assignment sx={{ fontSize: "25px" }} />
          </IconButton> */}
          <Button onClick={handleLogout} variant="outlined" color="inherit">
            Log Out
          </Button>
        </FlexBetween>
      ) : (
        <IconButton
          onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        >
          {isMobileMenuToggled ? <Close /> : <Menu />}
        </IconButton>
      )}

      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={theme.palette.background.default}
          display="flex"
          flexDirection="column"
        >
          <IconButton
            onClick={() => setIsMobileMenuToggled(false)}
            sx={{ alignSelf: "flex-end", m: 1 }}
          >
            <Close />
          </IconButton>
          <FlexBetween flexDirection="column" gap="2rem" alignItems="center">
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode />
              ) : (
                <LightMode sx={{ color: theme.palette.neutral.dark }} />
              )}
            </IconButton>
            <IconButton onClick={handleNavigateToHome}>
              <Home sx={{ fontSize: "25px" }} />
            </IconButton>
            <IconButton onClick={handleNavigateToSearch}>
              <Search/>
            </IconButton>
            {userData?.type === 'artist' && (
              <IconButton onClick={handleNavigateToCreateEvent}>
                <Event sx={{ fontSize: "25px" }} />
              </IconButton>
            )}
            {/* <IconButton onClick={handleNavigateToClassifieds}>
              <Assignment/>
            </IconButton> */}
            <Button onClick={handleLogout} variant="outlined" color="inherit">
              Log Out
            </Button>
          </FlexBetween>
        </Box>
      )}
    </FlexBetween>
  );
};

export default Navbar;