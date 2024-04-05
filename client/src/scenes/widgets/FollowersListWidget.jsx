import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, useTheme, Button } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setFollowers } from "state";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const FollowersListWidget = ({ userData }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const navigate = useNavigate(); // Hook for navigation
  // Use local state to manage displayed followers
  const followers = useSelector((state) => state.user?.followers || []);
  const [displayedFollowers, setDisplayedFollowers] = useState([]);

  useEffect(() => {
    const getFollowers = async () => {
      if (!userData) return; // Ensure userData is available

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userData._id}/followers`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      dispatch(setFollowers({ followers: data })); // Update Redux state with fetched followers
      setDisplayedFollowers(data.slice(0, 5)); // Initially set to first 5 followers
    };

    getFollowers();
  }, [userData, token, dispatch]);

  const showAllFollowers = () => {
    navigate(`/profile/${userData._id}/followers`); // Adjust this route as needed
  };

  if (!userData) {
    return <CircularProgress />;
  }

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Followers
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {displayedFollowers.map((follower) => (
          <Friend
            key={follower._id}
            friendId={follower._id}
            friendUserId={follower.userId}
            name={follower.username}
            subtitle={follower.sceneName}
            userPicturePath={follower.picturePath}
            userData={follower}
          />
        ))}
      </Box>
      {displayedFollowers.length < followers.length && ( // Show button only if there are more followers to display
        <Button onClick={showAllFollowers} sx={{ mt: 2, alignSelf: 'center' }}>
          Show All
        </Button>
      )}
    </WidgetWrapper>
  );
};

export default FollowersListWidget;