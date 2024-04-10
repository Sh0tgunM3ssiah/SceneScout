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
import { setEvent } from "state";

const EventWidget = ({
  userData,
  eventId,
  eventName,
  eventUserId,
  name,
  venueName,
  description,
  location,
  picturePath,
  likes,
  comments,
  post
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const user = useSelector((state) => state.loggedInUser);
  const userId = user?.user;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const loggedInUserId = user?.user;
  
  // Determine if the post is already liked by the user
  const initialIsLiked = Boolean(likes[loggedInUserId]);
  // Calculate initial like count
  const initialLikeCount = Object.keys(likes).length;

  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const patchLike = async () => {
    // Optimistically update the UI for a responsive feel
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/events/${eventId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        // Ensure you're using the correct user ID field here
        body: JSON.stringify({ userId: user?.user }), // Replace `loggedInUserId` with the actual user ID variable if different
      });
  
      if (!response.ok) {
        // Revert the optimistic UI update in case of failure
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount : likeCount - 1 + 1);
        throw new Error('Failed to update like for event');
      }
  
      const updatedEvent = await response.json();
      // Dispatch the update if necessary. Depending on your state management, you might not need this.
      dispatch(setEvent({ event: updatedEvent })); // Ensure you have a corresponding action creator `setEvent`
    } catch (error) {
      console.error("Error updating like for event:", error);
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Typography color={main} variant="h5" fontWeight="500" sx={{ mt: "1rem" }}>
        {eventName}
      </Typography>
      <Typography color={main}>
        {venueName}
      </Typography>
      <Typography color={main}>
        {location}
      </Typography>
      <Typography color={main}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem", maxHeight:"500px", maxWidth:"500px" }}
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
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {/* {isComments && (
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
      )} */}
    </WidgetWrapper>
  );
};

export default EventWidget;
