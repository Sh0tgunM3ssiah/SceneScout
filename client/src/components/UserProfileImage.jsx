import { Box } from "@mui/material";

const UserProfileImage = ({ image, size = "100px" }) => {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mb: "2rem" // Applying margin-bottom here
      }}
    >
      <img
        style={{ 
          objectFit: "cover", 
          borderRadius: "10%",
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%', // Ensuring the image covers the full width of the parent flex container
          height: '100%', // Ensuring the image covers the full height of the parent flex container
        }}
        alt="user"
        src={`${image}?${process.env.REACT_APP_SAS_TOKEN}`}
      />
    </Box>
  );
};

export default UserProfileImage;
