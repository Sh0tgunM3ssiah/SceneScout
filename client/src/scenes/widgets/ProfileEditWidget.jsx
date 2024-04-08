import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  Avatar,
  Badge,
  Button,
  TextField,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import UserProfileImage from "components/UserProfileImage";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import LocationAutocomplete from "../../components/LocationAutocomplete";
import ScenesDropdown from "../../components/scenesDropdown";
import ImageUpdateModal from '../../components/imageUpdateModal';
import GenresDropdown from "../../components/GenresDropdown";


const ProfileEditWidget = ({ user, userData }) => {
  const navigate = useNavigate();

  // States for editable fields and scenes
  const [databaseId, setDatabaseId] = useState("");
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [sceneName, setSceneName] = useState("");
  const [scene, setScene] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [scenes, setScenes] = useState([]);
  const [genre, setGenre] = useState("");
  const [members, setMembers] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const defaultImagePath = "../../../public/logo192.png";
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch scenes from the API
  useEffect(() => {
    const fetchScenes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/scenes/`);
        if (!response.ok) throw new Error('Failed to fetch scenes');
        const data = await response.json();
        setScenes(data);
        // Set the user's current scene based on their sceneId
        if (userData?.scene) {
          const userScene = data.find(scene => scene._id === userData.scene);
          setSceneName(userScene?.name || '');
          setScene(userScene?._id || '');
        }
      } catch (error) {
        console.error('Error fetching scenes:', error);
      }
    };
    fetchScenes();
  }, [userData]);

  useEffect(() => {
    if (userData) {
      if (userData.accountType === "Artist") {
        setDisplayName(userData.name || "");
        setGenre(userData.genre || ""); // Assume genre is part of userData
        setMembers(userData.members?.join(", ") || ""); // Assume members is an array
      } else {
        setDisplayName(userData.displayName || "");
        setFirstName(userData.firstName || "");
        setLastName(userData.lastName || "");
      }
      setDatabaseId(userData._id || "");
      setUserId(userData.userId || "");
      setEmail(userData.email || "");
      setBio(userData.bio || "");
      setLocation(userData.location || "");
      setCreatedAt(userData.createdAt ? format(new Date(userData.createdAt), 'MMMM dd, yyyy') : "");
      setIsLoading(false);
    }
  }, [userData]);

  const genres = ["Rock", "Metal", "Jazz", "Hip-Hop", "Electronic", "Pop"];

  const handleNavigateToProfile = () => {
    navigate(`/profile/${userData.userId}`);
  };

  const handleUpdateUserProfile = async () => {
    setIsLoading(true);
    const formData = new FormData();
    // Append the image file if selected
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
  
    // Append other user profile fields
    formData.append('displayName', displayName);
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('bio', bio);
    formData.append('location', location);
    formData.append('scene', scene);
    formData.append('genre', genre);
    // Assuming 'members' is an array. Join it as a string if necessary.
    formData.append('members', members.split(", ").filter(Boolean).join(","));
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/edit/${databaseId}`, {
        method: "POST",
        body: formData, // Send FormData
        // Don't set 'Content-Type' header, so browser will set it with the correct boundary
      });
  
      if (!response.ok) {
        throw new Error('Failed to update user profile');
      }
  
      const data = await response.json();
      setIsLoading(false);
      navigate(`/profile/${userData.userId}`);
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error - possibly display an error message to the user
    }
  };

  const handleImageChange = (file) => {
    setSelectedFile(file);
  };

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

  useEffect(() => {
    if (selectedFile) {
      handleUpdateUserProfile(true);
    }
  }, [selectedFile]);

  if (isLoading || !userData || scenes.length === 0) {
    return <CircularProgress />;
  }

  return (
    <Card variant="outlined">
      <form onSubmit={(e) => e.preventDefault()}>
        <Grid
          container
          direction="column"
          justifyContent="center"
          alignItems="center"
        >
          {/* User profile image and basic info */}
          <Grid item sx={{ p: "1.5rem 0rem", textAlign: "center" }}>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <>
                  <label htmlFor="icon-button-file">
                    <PhotoCameraIcon
                      onClick={() => setIsModalOpen(true)}
                      sx={{
                        border: "2px solid white",
                        backgroundColor: "#ff558f",
                        borderRadius: "50%",
                        padding: ".2rem",
                        width: 35,
                        height: 35,
                        cursor: "pointer",
                      }}
                    />
                  </label>
                </>
              }
            >
              <UserProfileImage image={imagePreview || userData?.picturePath || defaultImagePath} />
            </Badge>
            {/* This could be made editable or kept static depending on your use case */}
            <Typography sx={{ mt: "1rem" }} variant="h4">
              {userData?.username}
            </Typography>
            <Typography sx={{ mb: "1rem" }}>Member Since: {createdAt}</Typography>
            <Typography>{email}</Typography>
          </Grid>
          <Grid item sx={{ width: { xs: '50%', md: '30%' }, px: "16px", mb:"2rem" }}>
              <Button
                variant="contained"
                color="secondary"
                sx={{ width: "100%", p: 1}}
                onClick={handleNavigateToProfile}
              >
                View Your Public Profile
              </Button>
            </Grid>

          {/* Editable user details form */}
          <Grid container spacing={2} sx={{ p: "0 16px", width: "100%" }}>
            <Grid item xs={12} sx={{mt:"1rem"}}>
              <TextField
                fullWidth
                label="Display Name"
                variant="outlined"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sx={{mb:"3rem"}}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Bio"
                variant="outlined"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocationAutocomplete
                  name="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  sx={{ gridColumn: "span 4" }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ScenesDropdown
                label="Scene"
                value={scene}
                onChange={(e) => setScene(e.target.value)}
              />
            </Grid>
            {userData.accountType !== "Artist" && (
            <>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            </>
            )}
            {userData.accountType === "Artist" && (
              <>
                <Grid item xs={12} sm={6}>
                  <GenresDropdown
                    label="Genre"
                    value={genre}
                    onChange={handleGenreChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Members"
                    variant="outlined"
                    value={members}
                    onChange={(e) => setMembers(e.target.value)}
                    helperText="Comma-separated list"
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} sx={{ mt: 2, textAlign: "center", mb:"5rem" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateUserProfile}
              >
                Update Profile
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
      <ImageUpdateModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImageSelect={handleImageChange}
      />
    </Card>
  );
};

export default ProfileEditWidget;