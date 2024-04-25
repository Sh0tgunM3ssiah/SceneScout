import { Box } from "@mui/material";

const UserImage = ({ image, size = "60px" }) => {
  const defaultImageUrl = '../assets/mastiffLogo.png';

  return (
    <Box width={size} height={size}>
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={image ? `${image}?${process.env.REACT_APP_SAS_TOKEN}` : defaultImageUrl}
      />
    </Box>
  );
};

export default UserImage;
