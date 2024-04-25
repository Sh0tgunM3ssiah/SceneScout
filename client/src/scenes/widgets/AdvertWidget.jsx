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
    <Link href="https://brickartlive.com/event/phobia-breaking-benjamin-my-sacrifice-creed-sorta-temple-pilots-stp-ninety-20/" target="_blank" color="inherit" underline="none">
    <WidgetWrapper>
      <FlexBetween sx={{ justifyContent: 'center' }}>
        <Typography color={dark} variant="h5" fontWeight="500">
          Sponsored By
        </Typography>
      </FlexBetween>
      <FlexBetween sx={{ justifyContent: 'center' }}>
      <Typography variant="h4" color={main} mt={"1rem"} mb={"1rem"}>
        Phobia- Breaking Benjamin Tribute 
      </Typography>
      </FlexBetween>
      <img
        width="100%"
        height="auto"
        alt="advert"
        src="../assets/Phobia.jpg"
        style={{ borderRadius: "0.75rem", margin: "0.75rem 0" }}
      />
      <FlexBetween sx={{ justifyContent: 'center' }}>
        <Typography color={medium}>230 Main Street, Hobart IN</Typography>
      </FlexBetween>
      <Typography color={medium} m="0.5rem 0">
        Hobart Art Theatre we’re ready for you and we’re bringing some friends with us! Come enjoy a full breaking benjamin set for our first headliner along with My Sacrifice Sorta Temple Pilots and Ninety20 Chicago. Tickets are BOGO for a limited time using the code BOGO! Don’t miss is Saturday May 4th!!!
      </Typography>
      <FlexBetween sx={{ justifyContent: 'center' }}>
        <Typography color={medium} m="0.5rem 0">
          May 4
        </Typography>
      </FlexBetween>
    </WidgetWrapper>
    </Link>
  );
};

export default AdvertWidget;
