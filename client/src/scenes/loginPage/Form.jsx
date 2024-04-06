import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
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
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useUser } from '../../../src/userContext';
import LocationAutocomplete from "../../components/LocationAutocomplete"
import ScenesDropdown from "../../components/scenesDropdown"

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
  displayName: yup.string().when("accountType", {
    is: "User",
    then: yup.string().required("Display name is required"),
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
  userId: "",
  username: "",
  displayName: "",
  artistName: "",
  firstName: "",
  lastName: "",
  email: "",
  location: "",
  scene: "",
  sceneName: "",
  accountType: "",
  genre: "",
  picturePath: "",
  picture: null,
};

const Form = () => {
  const { palette } = useTheme();
  const navigate = useNavigate(); // Hook for programmatic navigation
  const userContext = useUser();
  const [scenes, setScenes] = useState([]);
  const [scene, setScene] = useState("");
  const [formValues, setFormValues] = useState({ ...initialValues, username: userContext?.username, userId: userContext?.userId });

  useEffect(() => {
    const fetchScenes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/scenes/`);
        if (!response.ok) throw new Error('Failed to fetch scenes');
        const data = await response.json();
        setScenes(data);
      } catch (error) {
        console.error('Error fetching scenes:', error);
      }
    };

    fetchScenes();
    if (userContext?.userId) {
      setFormValues(prevValues => ({ ...prevValues, username: userContext.username, userId: userContext.userId }));
    }
    const initialSceneName = scenes.find(scene => scene._id === userContext?.scene)?.name || '';
    setFormValues(prevValues => ({ ...prevValues, sceneName: initialSceneName }));
  }, [scenes, userContext]);

  const handleRegistration = async (values, { resetForm }) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value instanceof Blob ? value : String(value));
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to register.");
      
      resetForm();
      navigate('/home');
    } catch (error) {
      console.error("Error during registration:", error);
    }
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
            <ScenesDropdown
                label="Scene"
                value={scene}
                onChange={(e) => setScene(e.target.value)}
            />
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
                    <MenuItem value="Hip-Hop">Hip-Hop</MenuItem>
                    <MenuItem value="Electronic">Electronic</MenuItem>
                    <MenuItem value="Pop">Pop</MenuItem>
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
                <TextField
                  label="Display Name"
                  name="displayName"
                  value={values.displayName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.displayName) && Boolean(errors.displayName)}
                  helpertext={touched.displayName && errors.displayName}
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
            <LocationAutocomplete
                name="location"
                value={values.location}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.location && Boolean(errors.location)}
                helperText={touched.location && errors.location}
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
            <input
              type="hidden"
              name="userId"
              value={values.userId}
              onChange={handleChange}
            />
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

export default Form;