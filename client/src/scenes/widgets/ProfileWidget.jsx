import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { useSelector } from "react-redux";
import { useUser } from "../../../src/userContext";

const registerSchema = yup.object({
  username: yup.string().required("Username is required"),
  artistName: yup.string().when("accountType", {
    is: "Artist",
    then: yup.string().required("Artist name is required"),
  }),
  firstName: yup.string().when("accountType", {
    is: "User",
    then: yup.string().required("First name is required"),
  }),
  lastName: yup.string().when("accountType", {
    is: "User",
    then: yup.string().required("Last name is required"),
  }),
  email: yup.string().email("Invalid email").required("Email is required"),
  location: yup.string().required("Location is required"),
  scene: yup.string().required("Scene is required"),
  accountType: yup.string().required("Account type is required"),
  genre: yup.string().when("accountType", {
    is: "Artist",
    then: yup.string().required("Genre is required"),
  }),
  picture: yup.mixed().required("A profile picture is required"),
});

const initialValues = {
  username: "",
  artistName: "",
  firstName: "",
  lastName: "",
  email: "",
  location: "",
  scene: "",
  accountType: "User", // Assuming default account type
  genre: "",
  picturePath: "",
  picture: null,
};

const ProfileWidget = () => {
  const { palette } = useTheme();
  const userContext = useUser();
  const [scenes, setScenes] = useState([]);
  const token = useSelector((state) => state.token);
  const [userData, setUserData] = useState(null);

  // Setup initial form values based on user context or other conditions
  const [formValues, setFormValues] = useState({ ...initialValues, username: userContext?.username });

  useEffect(() => {
    const fetchScenes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/scenes/`);
        if (!response.ok) throw new Error("Failed to fetch scenes");
        const data = await response.json();
        setScenes(data);
      } catch (error) {
        console.error("Error fetching scenes:", error);
      }
    };
  
    const fetchUserByUsername = async () => {
      if (!userContext?.userId || !token) return;
      try {
        const userUrl = `${process.env.REACT_APP_BACKEND_URL}/users/${encodeURIComponent(userContext.userId)}`;
        const artistUrl = `${process.env.REACT_APP_BACKEND_URL}/artists/${encodeURIComponent(userContext.userId)}`;
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        };
        const userResponse = await fetch(userUrl, { method: "GET", headers });
        const artistResponse = await fetch(artistUrl, { method: "GET", headers });
  
        let entity;
        if (userResponse.ok) {
          const user = await userResponse.json();
          entity = { ...user, type: "user" };
        } else if (artistResponse.ok) {
          const artist = await artistResponse.json();
          entity = { ...artist, type: "artist" };
        }
  
        if (entity && entity.scene) {
          const sceneResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/scenes/${entity.scene}`, { method: "GET", headers });
          if (sceneResponse.ok) {
            const sceneData = await sceneResponse.json();
            entity.sceneName = sceneData.name;
          }
        }
  
        setUserData(entity); // This updates the userData state
      } catch (error) {
        console.error("Error fetching user/Artist data:", error);
      }
    };
  
    fetchScenes();
    fetchUserByUsername();
  }, [userContext?.username, token]);

  useEffect(() => {
    if (userData) {
      setFormValues(prev => ({
        ...prev,
        username: userData.username || "",
        email: userData.email || "",
        accountType: userData.type === 'user' ? 'User' : 'Artist',
        // Ensure you populate other necessary fields based on userData
      }));
    }
  }, [userContext?.username, userData]);

  const handleRegistration = async (values, { resetForm }) => {
    // Implementation for handling form submission
  };

  return (
    <Formik
      initialValues={formValues}
      validationSchema={registerSchema}
      onSubmit={handleRegistration}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        setFieldValue,
        isValid,
        dirty,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box display="grid" gridTemplateColumns="repeat(4, minmax(0, 1fr))" gap="20px">
            <TextField
              label="Username"
              name="username"
              value={values.username}
              disabled
              sx={{ gridColumn: "span 4" }}
            />
            <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
              <InputLabel>Scene</InputLabel>
              <Select
              label="Scene"
              name="scene"
              value={values.scene}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.scene && Boolean(errors.scene)}
              helpertext={touched.scene && errors.scene}
            >
              {scenes.map((scene) => (
                <MenuItem key={scene._id} value={scene._id}>
                  {scene.name}
                </MenuItem>
              ))}
            </Select>
            </FormControl>
            <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
              <InputLabel>Account Type</InputLabel>
              <Select
                name="accountType"
                value={values.accountType}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Artist">Artist</MenuItem>
              </Select>
            </FormControl>
            {values.accountType === "Artist" && (
              <>
                <TextField
                  label="Artist Name"
                  name="artistName"
                  value={values.artistName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.artistName) && Boolean(errors.artistName)}
                  helpertext={touched.artistName && errors.artistName}
                  sx={{ gridColumn: "span 4" }}
                />
                <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
                  <InputLabel>Genre</InputLabel>
                  <Select
                    name="genre"
                    value={values.genre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={Boolean(touched.genre) && Boolean(errors.genre)}
                    helpertext={touched.genre && errors.genre}
                  >
                    <MenuItem value="Rock">Rock</MenuItem>
                    <MenuItem value="Metal">Metal</MenuItem>
                    <MenuItem value="Jazz">Jazz</MenuItem>
                    <MenuItem value="Hip Hop">Hip Hop</MenuItem>
                    {/* Additional genres can be listed here */}
                  </Select>
                </FormControl>
              </>
            )}
            {values.accountType === "User" && (
              <>
                <TextField
                  label="First Name"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                  helpertext={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helpertext={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
              </>
            )}
            <TextField
              label="Email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.email) && Boolean(errors.email)}
              helpertext={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Location"
              name="location"
              value={values.location}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(touched.location) && Boolean(errors.location)}
              helpertext={touched.location && errors.location}
              sx={{ gridColumn: "span 4" }}
            />
            <Box sx={{ gridColumn: "span 4" }}>
              <Dropzone onDrop={(acceptedFiles) => { setFieldValue("picture", acceptedFiles[0]); setFieldValue("picturePath", acceptedFiles[0].name);}}>
                {({ getRootProps, getInputProps }) => (
                  <Box {...getRootProps()} p={2} border={`2px dashed ${palette.primary.main}`} sx={{ "&:hover": { cursor: "pointer" } }}>
                    <input {...getInputProps()} />
                    <Typography>Drag 'n' drop profile picture here, or click to select file</Typography>
                    {values.picture && (
                      <FlexBetween>
                        <Typography>{values.picture.name}</Typography>
                        <EditOutlinedIcon />
                      </FlexBetween>
                    )}
                  </Box>
                )}
              </Dropzone>
            </Box>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!(isValid && dirty)}
              sx={{ gridColumn: "span 4", mt: 2 }}
            >
              Register
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default ProfileWidget;