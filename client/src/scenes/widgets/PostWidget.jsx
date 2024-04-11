import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state"; // Adjust this import according to your actual state management setup
import { format, formatDistanceToNow } from "date-fns";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";

const PostWidget = ({
  userData,
  userId,
  postId,
  postUserId,
  postRedirectId,
  name,
  description,
  sceneName,
  picturePath,
  userPicturePath,
  likes,
  createdAt,
  comments,
}) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const token = useSelector((state) => state.token);
  const loggedInId = userData._id;
  const loggedInUserId = userData.userId;
  const initialIsLiked = Boolean(likes[loggedInUserId]);
  const initialLikeCount = Object.keys(likes).length;
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isComments, setIsComments] = useState(false);

  const patchLike = async () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });

      if (!response.ok) {
        setIsLiked(isLiked);
        setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
        throw new Error("Failed to update like");
      }

      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const formatCreatedAt = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const oneWeekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

    if (date < oneWeekAgo) {
      return format(date, "MM/dd/yyyy");
    } else {
      return `${formatDistanceToNow(date, { addSuffix: true })}`;
    }
  };

  return (
    <WidgetWrapper mb="2rem">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={sceneName}
        userPicturePath={userPicturePath}
        friendType={userData.accountType}
        userData={userData}
        friendUserId={postRedirectId}
        context="post" // Add this line
        postId={postId} // Pass the postId for edit/delete
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem", maxHeight: "400px", maxWidth: "400px" }}
          src={`${picturePath}?${process.env.REACT_APP_SAS_TOKEN}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem" sx={{ ml: "10px" }}>
            <Typography>{formatCreatedAt(createdAt)}</Typography>
          </FlexBetween>
        </FlexBetween>
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default PostWidget;