import React, { useEffect } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import { useUser } from '../../../src/userContext'; // Adjust this path as needed

const FriendListWidget = ({userData}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);// Use the user from context
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  // Safely access friends with optional chaining or default to an empty array
  const friends = useSelector((state) => state.user?.friends || []);

  useEffect(() => {
    const getFriends = async () => {
      if (!user || !userData) return; // Ensure user and userId are available
  
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userData._id}/friends`, // Use user._id from context
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    };

    getFriends();
  }, [user, user?._id, userData, token, dispatch]); // Adjusted dependencies to include optional chaining

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
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            friendUserId={friend.userId}
            name={`${friend.username}`}
            subtitle={friend.sceneName}
            userPicturePath={friend.picturePath}
            userData={friend}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;