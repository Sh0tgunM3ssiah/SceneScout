import React, { useEffect } from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setFollowers } from "state";
import { useUser } from '../../userContext'; // Adjust this path as needed

const FollowersListWidget = ({userData}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);// Use the user from context
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  // Safely access friends with optional chaining or default to an empty array
  const followers = useSelector((state) => state.user?.followers || []);

  useEffect(() => {
    const getFollowers = async () => {
      if (!user || !userData) return; // Ensure user and userId are available
  
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userData._id}/followers`, // Use user._id from context
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      dispatch(setFollowers({ followers: data }));
    };

    getFollowers();
  }, [user, user?._id, userData, token, dispatch]); // Adjusted dependencies to include optional chaining

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
        {followers.map((follower) => (
          <Friend
            key={follower._id}
            friendId={follower._id}
            name={`${follower.username}`}
            subtitle={follower.scene}
            userPicturePath={follower.picturePath}
            userData={follower}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FollowersListWidget;