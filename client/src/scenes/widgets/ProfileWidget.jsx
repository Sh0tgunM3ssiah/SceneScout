import React from "react";
import {
  Card,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import UserProfileImage from "components/UserProfileImage";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import { useDispatch, useSelector } from "react-redux";

const ProfileWidget = ({user, userData, friends, id}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  let isFriend = Array.isArray(friends) && friends.some((friend) => friend._id === userData._id);

  const handleFollowClick = async () => {
    if (user.user === userData.userId) {
        return;
    }

    let endpoint = `${process.env.REACT_APP_BACKEND_URL}/users/${user.id}/${userData?._id}`;
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
          <Typography sx={{ mt: "1rem", mb:"1rem" }} variant="h4">{userData?.accountType === 'Artist' ? userData?.name : userData?.displayName}</Typography>
          <Typography variant="h6" color="text.secondary">
            {userData?.location 
              ? `${userData.location.split(', ')[0]}, ${userData.location.split(', ')[1]?.split(' ')[0] ?? ''}` 
              : ''}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb:"1rem" }}>{userData?.sceneName}</Typography>
          <Typography variant="h6" color="text.secondary">{userData?.friends.length} friends</Typography>
          <Typography variant="h6" color="text.secondary">{userData?.followers.length} followers</Typography>
        </Grid>
        <Grid item sx={{ p: "1.5rem 0rem", textAlign: "center" }}>
          <Typography color="text.secondary">{userData?.bio}</Typography>
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
              {isFriend ? "UnFollow" : "Follow"}
            </Button>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

export default ProfileWidget;