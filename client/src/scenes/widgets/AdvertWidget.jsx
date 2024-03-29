import { Typography, useTheme, Link } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { Link as RouterLink } from 'react-router-dom';

const AdvertWidget = () => {
  const { palette } = useTheme();
  const dark = palette.neutral.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  return (
    <Link href="https://www.facebook.com/events/1067426181133071" target="_blank" color="inherit" underline="none">
    <WidgetWrapper>
      <FlexBetween sx={{ justifyContent: 'center' }}>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored By
        </Typography>
      </FlexBetween>
      <FlexBetween sx={{ justifyContent: 'center' }}>
      <Typography variant="h4" color={main} mt={"1rem"} mb={"1rem"}>
        RECOGNITION FEST
      </Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="../assets/RecogFest.jpg"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween sx={{ justifyContent: 'center' }}>
        <Typography color={medium}>Pilsen Neighborhood, Chicago</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Mixed Genre Music Fest featuring Live Music and Vendors from the Chicagoland and Northwest Indiana area.
      </Typography>
      <FlexBetween sx={{ justifyContent: 'center' }}>
        <Typography color={medium} m="0.5rem 0">
          April 12 - 13
        </Typography>
      </FlexBetween>
    </WidgetWrapper>
    </Link>
  );
};

export default AdvertWidget;
