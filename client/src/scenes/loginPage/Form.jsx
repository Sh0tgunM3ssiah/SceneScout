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
  CircularProgress,
  ListSubheader
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useUser } from '../../../src/userContext';
import LocationAutocomplete from "../../components/LocationAutocomplete"
import ScenesDropdown from "../../components/scenesDropdown"
import GenresDropdown from "../../components/GenresDropdown"
import { setLogin } from "state";

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
  picture: yup.mixed(),
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
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Hook for programmatic navigation
  const userContext = useUser();
  const [scenes, setScenes] = useState([]);
  const [scene, setScene] = useState("");
  const [formValues, setFormValues] = useState({
    ...initialValues,
    username: userContext?.currentUser?.username || '', // Provide default empty string if username is not available
    userId: userContext?.currentUser?.userId || '', // Provide default empty string if userId is not available
  });  
  const [sceneError, setSceneError] = useState(false);
  const [genre, setGenre] = useState("");
  const [genreError, setGenreError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [groupedScenes, setGroupedScenes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Once userContext is available and not null, update formValues
    if (userContext && userContext.currentUser) {
      setFormValues(currentValues => ({
        ...currentValues,
        username: userContext.currentUser.username || '',
        userId: userContext.currentUser.userId || '',
      }));
    }
  }, [userContext]);

  useEffect(() => {
    const fetchScenes = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/scenes`);
        if (!response.ok) {
          throw new Error('Could not fetch scenes');
        }
        const scenes = await response.json();
        
        // Group scenes by state
        const grouped = scenes.reduce((acc, scene) => {
          acc[scene.state] = acc[scene.state] || [];
          acc[scene.state].push(scene);
          return acc;
        }, {});
        
        // Sort states and scenes within each state
        const sortedGroupedScenes = Object.keys(grouped).sort().map(state => ({
          state,
          scenes: grouped[state].sort((a, b) => a.name.localeCompare(b.name))
        }));

        setGroupedScenes(sortedGroupedScenes);
      } catch (error) {
        console.error("Failed to fetch scenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScenes();
  }, []);

  const handleSceneChange = (event) => {
    const selectedValue = event.target.value;
    setScene(selectedValue);
  };

  const handleRegistration = async (values, { resetForm }) => {
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      // Check if the key is 'picture'. If so, only append it if it's not null and is a Blob.
      if (key === "picture") {
        if (value instanceof Blob) {
          formData.append(key, value);
        }
        // Skip appending the 'picture' field if it's null or not a Blob
      } else {
        // For all other fields, convert the value to a string and append
        formData.append(key, String(value));
      }
    });

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/register`, {
        method: "POST",
        body: formData,
      });
    
      if (!response.ok) {
        throw new Error("Failed to register.");
      }
      
      // Assuming the response contains JSON data you might need
      const data = await response.json();
      dispatch(
        setLogin({
          user: data,
          id: data._id
        })
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Error during registration:", error);
      // Handle the error, e.g., set an error state and show it in the UI
    } finally {
      navigate('/home');
      setIsLoading(false); // Ensure loading state is reset after submission
    }    
  };

  const validateSceneAndGenre = (values) => {
    let errors = {};
    if (!values.scene) {
      setSceneError(true);
      errors.scene = 'Scene is required';
    } else {
      setSceneError(false);
    }

    if (values.accountType === "Artist" && !values.genre) {
      setGenreError(true);
      errors.genre = 'Genre is required';
    } else {
      setGenreError(false);
    }

    return errors;
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Formik
      initialValues={formValues}
      validationSchema={registerSchema}
      onSubmit={handleRegistration}
      enableReinitialize
      validate={validateSceneAndGenre}
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
        dirty
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
            <FormControl fullWidth sx={{ gridColumn: "span 4" }} error={Boolean(sceneError)} helperText={sceneError && "Scene is required"}>
              <InputLabel>Scene</InputLabel>
              <Select
                name="scene"
                value={values.scene}
                displayEmpty
                onChange={(event) => {
                  // Update the form value for scene based on the selected MenuItem's value
                  const selectedSceneId = event.target.value;
                  const selectedScene = groupedScenes.flatMap(group => group.scenes).find(scene => scene._id === selectedSceneId);

                  // Assuming scene ID is stored in values.scene and scene name in values.sceneName
                  setFieldValue("scene", selectedSceneId);
                  setFieldValue("sceneName", selectedScene ? selectedScene.name : '');
                }}
                renderValue={selected => {
                  // Display the name of the selected scene in the Select field
                  const selectedScene = groupedScenes.flatMap(group => group.scenes).find(scene => scene._id === selected);
                  return selectedScene ? selectedScene.name : '';
                }}
                label="Scene"
              >
                {groupedScenes.map(group => [
                  <ListSubheader key={group.state} disabled>
                    {group.state}
                  </ListSubheader>,
                  ...group.scenes.map(scene => (
                    <MenuItem key={scene._id} value={scene._id}>
                      {scene.name}
                    </MenuItem>
                  ))
                ])}
              </Select>
              {sceneError && <p style={{color: "red", fontSize: "0.75rem", marginTop: "3px"}}>{sceneError}</p>}
            </FormControl>
            <FormControl fullWidth sx={{ gridColumn: "span 4" }}>
              <InputLabel>Account Type</InputLabel>
              <Select
                name="accountType"
                value={values.accountType}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(touched.accountType) && Boolean(errors.accountType)}
                helpertext={touched.accountType && errors.accountType}
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
                  helperText={touched.firstName && errors.firstName} // Correct prop is `helperText`, not `helpertext`
                  sx={{ 
                    gridColumn: 'span 4', 
                    // Apply 'span 2' starting from 'sm' breakpoint and up
                    [theme.breakpoints.up('sm')]: {
                      gridColumn: 'span 2',
                    }
                  }}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName} // Correct prop is `helperText`, not `helpertext`
                  sx={{ 
                    gridColumn: 'span 4',
                    // Apply 'span 2' starting from 'sm' breakpoint and up
                    [theme.breakpoints.up('md')]: {
                      gridColumn: 'span 2',
                    }
                  }}
                />
                <TextField
                  label="Display Name"
                  name="displayName"
                  value={values.displayName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(touched.displayName) && Boolean(errors.displayName)}
                  helpertext={touched.displayName && errors.displayName}
                  sx={{ gridColumn: "span 4" }}
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
              // disabled={!(isValid && dirty)}
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