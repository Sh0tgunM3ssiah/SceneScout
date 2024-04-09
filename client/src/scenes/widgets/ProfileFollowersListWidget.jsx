import React, { useEffect } from 'react';
import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setFollowers } from "state";

const ProfileFollowersListWidget = ({userData}) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);// Use the user from context
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  // Safely access friends with optional chaining or default to an empty array
  const followers = useSelector((state) => state.user?.followers || []);
  console.log(followers);

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
  }, [userData, token, dispatch]); // Adjusted dependencies to include optional chaining

  if (!user || !userData) {
    return (
      <CircularProgress />
    );
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
        {followers.map((follower) => (
          <Friend
            key={follower._id}
            friendId={follower._id}
            friendUserId={follower.userId}
            name={`${follower.username}`}
            subtitle={follower.sceneName}
            userPicturePath={follower.picturePath}
            userData={follower}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default ProfileFollowersListWidget;