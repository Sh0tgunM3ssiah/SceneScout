import { useState } from "react";
import {
  Box,
  IconButton,
  InputBase,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Search,
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode } from "state"; // Update this path according to your project structure
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";
import { signOut } from 'aws-amplify/auth';

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      await signOut();
      dispatch({ type: 'USER_LOGOUT' }); // Adjust according to your state management
      navigate('/login'); // Redirect to login or another appropriate page
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <FlexBetween padding="1rem 6%" backgroundColor={theme.palette.background.alt}>
      <FlexBetween gap="1.75rem">
        <Typography
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
          SceneScout
        </Typography>
        {isNonMobileScreens && (
          <FlexBetween
            backgroundColor={theme.palette.neutral.light}
            borderRadius="9px"
            gap="3rem"
            padding="0.1rem 1.5rem"
          >
            <InputBase placeholder="Search..." />
            <IconButton>
              <Search />
            </IconButton>
          </FlexBetween>
        )}
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
          <Message sx={{ fontSize: "25px" }} />
          <Notifications sx={{ fontSize: "25px" }} />
          <Help sx={{ fontSize: "25px" }} />
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
            <Message />
            <Notifications />
            <Help />
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