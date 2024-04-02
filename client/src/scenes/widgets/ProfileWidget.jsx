import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Avatar,
  Badge,
  Button,
  useTheme,
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UserProfileImage from "components/UserProfileImage";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import { useDispatch, useSelector } from "react-redux";
// Other imports...

const ProfileWidget = ({user, userData, id}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const userId = user?.userId;
  const userSceneId = user?.scene;

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  let isFriend = Array.isArray(friends) && friends.some((friend) => friend.userId === userData.userId);

  const handleFollowClick = async () => {
    if (user.user === userData.userId) {
      return;
    }

    let endpoint = `${process.env.REACT_APP_BACKEND_URL}/users/${user.id}/${userData._id}`;
    try {
        const response = await fetch(endpoint, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error('Failed to update friend status');
        }

        const data = await response.json();
        dispatch(setFriends({ friends: data }));

    } catch (error) {
        console.error("Error updating friend status:", error);
        // Handle error, e.g., by showing a notification
    }
  };
  const styles = {
    details: {
      padding: "0 16px",
    },
    value: {
      padding: "0 16px",
      textAlign: "right",
    },
  };

  // Assuming `props` are passed to this component for `name`, `sub`, `dt1`, `dt2`, and `dt3`
  const props = {
    name: "Your Name",
    sub: "Your Subtitle",
    dt1: "Detail 1 Value",
    dt2: "Detail 2 Value",
    dt3: "Detail 3 Value",
  };
  const handleNavigateToEditProfile = () => {
    navigate(`/profile/edit/${userData.userId}`);
  };

  if(!userData) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Card variant="outlined">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item sx={{ p: "1.5rem 0rem", textAlign: "center" }}>
          <UserProfileImage image={userData?.picturePath} />
          <Typography sx={{ mt: "1rem" }} variant="h4">{userData?.type === 'Artist' ? userData?.name : userData?.username}</Typography>
          <Typography variant="h6" color="text.secondary">{userData?.sceneName}</Typography>
          <Typography variant="h6" color="text.secondary">{userData?.friends.length} friends</Typography>
          <Typography variant="h6" color="text.secondary">{userData?.followers.length} followers</Typography>
        </Grid>
        {user.user === userData?.userId ? (
          <Grid item sx={{ width: { xs: '50%', md: '30%' }, px: "16px" }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "100%", p: 1, my: 2 }}
              onClick={handleNavigateToEditProfile}
            >
              Edit Your Profile
            </Button>
          </Grid>
        ) : (
          <Grid item sx={{ width: { xs: '50%', md: '30%' }, px: "16px" }}>
            <Button
              variant="contained"
              color={isFriend ? "primary" : "secondary"}
              sx={{ width: "100%", p: 1, my: 2 }}
              onClick={handleFollowClick}
            >
              {isFriend ? "Following" : "Follow"}
            </Button>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default ProfileWidget;