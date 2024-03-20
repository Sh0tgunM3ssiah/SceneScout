import { Box } from "@mui/material";
import { styled } from "@mui/system";

const FullSizeWidgetWrapper = styled(Box)(({ theme }) => ({
  width: '100%', // Make the width 100% to take up the full available width
  height: '100%', // Make the height 100% to take up the full available height
  padding: "1.5rem", // Adjust padding if needed
  backgroundColor: theme.palette.background.alt,
  borderRadius: "0.75rem",
}));

export default FullSizeWidgetWrapper;
