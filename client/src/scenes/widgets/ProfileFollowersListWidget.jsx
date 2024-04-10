import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, useTheme, Button} from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { setProfileFollowers } from "state";

const ProfileFollowersListWidget = ({ userData }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const followers = useSelector((state) => state.profileFollowers);
  const [displayedFollowers, setDisplayedFollowers] = useState([]);

  useEffect(() => {
    const getFollowers = async () => {
      if (!userData) return;
  
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userData._id}/followers`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setDisplayedFollowers(data.slice(0, 5));
    };

    getFollowers();
  }, [userData, token, dispatch]);

  const showAllFollowers = () => {
    // Handle navigation to view all friends
  };

  if (!userData) {
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
        {displayedFollowers.map((follower) => (
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
        {displayedFollowers.length < userData.followers.length && (
        <Button onClick={showAllFollowers} sx={{ mt: 2, alignSelf: 'center' }}>
          Show All
        </Button>
      )}
      </Box>
    </WidgetWrapper>
  );
};

export default ProfileFollowersListWidget;
