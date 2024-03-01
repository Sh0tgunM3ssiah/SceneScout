import React from 'react';
import { Box, Typography, Divider, useTheme } from "@mui/material";
import {
  ManageAccountsOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
  EditOutlined,
} from "@mui/icons-material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../src/userContext"; // Ensure the path matches your project structure

const UserWidget = () => {
  const { palette } = useTheme();
  const navigate = useNavigate();
  const user = useUser(); // Directly use user from context

  // If user context is not loaded yet, user will be undefined/null
  if (!user) {
    return null;
  }

  const {
    _id: userId,
    firstName,
    lastName,
    location,
    occupation,
    picturePath,
    friends = [], // Default to empty array if undefined
    viewedProfile = 0, // Default to 0 if undefined
    impressions = 0, // Default to 0 if undefined
  } = user;

  return (
    <WidgetWrapper>
      {/* FIRST ROW */}
      <FlexBetween gap="0.5rem" pb="1.1rem" onClick={() => navigate(`/profile/${userId}`)}>
        <FlexBetween gap="1rem">
          <UserImage image={picturePath} />
          <Box>
            <Typography variant="h4" color={palette.neutral.dark} fontWeight="500" sx={{ "&:hover": { cursor: "pointer", color: palette.primary.light } }}>
              {firstName} {lastName}
            </Typography>
            <Typography color={palette.neutral.medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>
        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: palette.neutral.main }} />
          <Typography color={palette.neutral.medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: palette.neutral.main }} />
          <Typography color={palette.neutral.medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={palette.neutral.medium}>Who's viewed your profile</Typography>
          <Typography color={palette.neutral.main} fontWeight="500">{viewedProfile}</Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={palette.neutral.medium}>Impressions of your post</Typography>
          <Typography color={palette.neutral.main} fontWeight="500">{impressions}</Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW - Social Profiles */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={palette.neutral.main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>
        <FlexBetween gap="1rem" mb="0.5rem">
          <FlexBetween gap="1rem">
            <img src="../assets/twitter.png" alt="twitter" />
            <Box>
              <Typography color={palette.neutral.main} fontWeight="500">
                Twitter
              </Typography>
              <Typography color={palette.neutral.medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: palette.neutral.main }} />
        </FlexBetween>
        
        <FlexBetween gap="1rem">
          <FlexBetween gap="1rem">
            <img src="../assets/linkedin.png" alt="linkedin" />
            <Box>
              <Typography color={palette.neutral.main} fontWeight="500">
                LinkedIn
              </Typography>
              <Typography color={palette.neutral.medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: palette.neutral.main }} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;