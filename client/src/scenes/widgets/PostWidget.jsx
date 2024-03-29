import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";

const PostWidget = ({
  userData,
  userId,
  postId,
  postUserId,
  name,
  description,
  sceneName,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const token = useSelector((state) => state.token);
  const loggedInUserId = userData.userId;
  
  // Determine if the post is already liked by the user
  const initialIsLiked = Boolean(likes[loggedInUserId]);
  // Calculate initial like count
  const initialLikeCount = Object.keys(likes).length;

  // Use useState to manage like state and count
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isComments, setIsComments] = useState(false);

  const patchLike = async () => {
    // Optimistically update the UI
    if (isLiked) {
      // If it was already liked, decrement the like count and update isLiked
      setLikeCount(likeCount - 1);
    } else {
      // If it was not liked, increment the like count and update isLiked
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
        // If the request failed, revert the optimistic update
        setIsLiked(isLiked);
        setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
        throw new Error('Failed to update like');
      }

      const updatedPost = await response.json();
      // Here, you might not need to dispatch if you're already updating the UI optimistically
      dispatch(setPost({ post: updatedPost }));
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={sceneName}
        userPicturePath={userPicturePath}
        friendType={userData.accountType}
        userData={userData}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
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

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
