import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { useUser } from '../../src/userContext'; // Ensure this path matches your project structure

const Friend = ({ friendId, friendUserId, name, subtitle, userPicturePath, userData, friendType }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const userId = user?.userId;
  const userSceneId = user?.scene;

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  let isFriend = Array.isArray(friends) && friends.some((friend) => friend._id === friendId);

  const patchFriend = async () => {
    // Check if userData._id and friendId match
    if (userData?._id === friendId) {
        return;
    }

    let endpoint = `${process.env.REACT_APP_BACKEND_URL}/users/${userData?._id}/${friendId}`;
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

  if (!user || !userData) {
    return (
      <CircularProgress />
    );
  }
  

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendUserId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {userData?._id !== friendId && (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
