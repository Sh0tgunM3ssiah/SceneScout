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
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UserProfileImage from "components/UserProfileImage";
import { useNavigate } from "react-router-dom";
// Other imports...

const ProfileEditWidget = ({user, userData}) => {
  const navigate = useNavigate();
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

  const handleNavigateToProfile = () => {
    navigate(`/profile/${userData.userId}`);
  };

  // Your existing useEffect hooks and functions...

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
          <Typography sx={{mt:"1rem"}} variant="h4">{userData?.type === 'Artist' ? userData?.name : userData?.username}</Typography>
          <Typography variant="h6" color="text.secondary">{userData?.sceneName}</Typography>
          <Typography variant="h6" color="text.secondary">{userData?.friends.length} friends</Typography>
          <Typography variant="h6" color="text.secondary">{userData?.followers.length} followers</Typography>
        </Grid>
        {user.user === userData?.userId && (
          <Grid item sx={{ width: { xs: '50%'}, px: "16px" }}>
            <Button
              variant="contained"
              color="secondary"
              sx={{ width: "100%", p: 1, my: 2 }}
              onClick={handleNavigateToProfile}
            >
              View Your Public Profile
            </Button>
          </Grid>
        )}
        <Grid container sx={{ p: "0 16px" }}>
          <Grid item xs={12}>
            <Box sx={{mb:"1rem"}}>
              <Typography>Display Name:</Typography>
              <Typography>{userData?.displayName}</Typography>
            </Box>
            <Box sx={{mb:"1rem", mt:"1rem"}}>
              <Typography>Scene:</Typography>
              <Typography>{userData?.sceneName}</Typography>
            </Box>
            <Box sx={{mb:"1rem"}}>
              <Typography>First Name:</Typography>
              <Typography>{userData?.firstName}</Typography>
            </Box>
            <Box sx={{mb:"1rem"}}>
              <Typography>Last Name:</Typography>
              <Typography>{userData?.lastName}</Typography>
            </Box>
            <Box sx={{mb:"1rem"}}>
              <Typography>Email:</Typography>
              <Typography>{userData?.email}</Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Card>
  );
};

export default ProfileEditWidget;