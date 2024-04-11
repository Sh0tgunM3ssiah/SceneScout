import React, { useState } from 'react';
import { Box, IconButton, Typography, useTheme, CircularProgress, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button  } from '@mui/material';
import { PersonAddOutlined, PersonRemoveOutlined, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends, removePost } from "state";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";

const Friend = ({ friendId, friendUserId, name, subtitle, userPicturePath, userData, context, postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const userId = user?.userId;
  const user_id = user?._id;

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  let isFriend = Array.isArray(friends) && friends.some(friend => friend._id === friendId);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [openDialog, setOpenDialog] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditPost = () => {
    handleClose();
    // Replace with your logic to navigate to the post edit page or a modal
    console.log("Editing post:", postId); // Example log
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  
  const confirmDelete = async () => {
    handleCloseDialog();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/delete`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
          },
      });
  
      if (!response.ok) {
          throw new Error('Failed to delete the post');
      }
      dispatch(removePost({ _id: postId }));
      window.location.reload();  // Again, consider a React state update instead
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };


  const patchFriend = async () => {
    if (user_id === friendId) {
      return;
    }

    let endpoint = `${process.env.REACT_APP_BACKEND_URL}/users/${user_id}/${friendId}`;
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
    }
  };

  if (!user || !userData) {
    return <CircularProgress />;
  }

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box onClick={() => navigate(`/profile/${friendUserId}`)}>
          <Typography color={main} variant="h5" fontWeight="500" sx={{ "&:hover": { color: primaryLight, cursor: "pointer" } }}>
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {context === "post" && user_id === friendId ? (
        <>
          <IconButton
            aria-label="more"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="post-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'post-menu-button',
            }}
          >
            {/* <MenuItem onClick={handleEditPost}>Edit Post</MenuItem> */}
            <MenuItem onClick={handleOpenDialog}>Delete Post</MenuItem>
          </Menu>
        </>
      ) : (
        user_id !== friendId && (
          <IconButton
            onClick={patchFriend}
            sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
          >
            {isFriend ? (
              <PersonRemoveOutlined sx={{ color: primaryDark }} />
            ) : (
              <PersonAddOutlined sx={{ color: primaryDark }} />
            )}
          </IconButton>
        )
      )}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this post?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </FlexBetween>
  );
};

export default Friend;