import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, CircularProgress, Button } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const FriendListWidget = ({ userData }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const navigate = useNavigate(); // Hook for navigation
  // Local state to manage displayed friends
  const friends = useSelector((state) => state.user?.friends || []);
  const [displayedFriends, setDisplayedFriends] = useState([]);

  useEffect(() => {
    const getFriends = async () => {
      if (!userData) return; // Ensure userData is available

      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userData._id}/friends`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      dispatch(setFriends({ friends: data })); // Update Redux state with fetched friends
      setDisplayedFriends(data.slice(0, 5)); // Initially set to first 5 friends
    };

    getFriends();
  }, []);

  useEffect(() => {
    setDisplayedFriends(friends.slice(0, 5)); // Update displayedFriends whenever friends list changes
  }, [friends]);

  const showAllFriends = () => {
    navigate(`/profile/${userData._id}/friends`); // Adjust this route as needed
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
        Following
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {displayedFriends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            friendUserId={friend.userId}
            name={friend.username}
            subtitle={friend.sceneName}
            userPicturePath={friend.picturePath}
            userData={friend}
          />
        ))}
      </Box>
      {displayedFriends.length < friends.length && ( // Show button only if there are more friends to display
        <Button onClick={showAllFriends} sx={{ mt: 2, alignSelf: 'center' }}>
          Show All
        </Button>
      )}
    </WidgetWrapper>
  );
};

export default FriendListWidget;