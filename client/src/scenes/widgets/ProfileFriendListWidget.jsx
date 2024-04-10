// ProfileFriendListWidget.js
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, useTheme, Button } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";

const ProfileFriendListWidget = ({ userId, userData }) => {
  const { palette } = useTheme();
  const [displayedFriends, setDisplayedFriends] = useState([]);

  useEffect(() => {
    const fetchFriends = async () => {
      if (!userData) return; // Ensure userData is available

      // Fetch profile user's friends
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userData._id}/friends`
      );
      const data = await response.json();
      setDisplayedFriends(data.slice(0, 5)); // Initially set to first 5 friends
    };

    fetchFriends();
  }, [userData]);

  const showAllFriends = () => {
    // Handle navigation to view all friends
  };

  return (
    <WidgetWrapper>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friends
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
      {/* Show button only if there are more friends to display */}
      {displayedFriends.length < userData.friends.length && (
        <Button onClick={showAllFriends} sx={{ mt: 2, alignSelf: 'center' }}>
          Show All
        </Button>
      )}
    </WidgetWrapper>
  );
};

export default ProfileFriendListWidget;
