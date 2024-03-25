import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import Dropzone from "react-dropzone";
import { useNavigate } from "react-router-dom";
import LocationAutocomplete from "../../components/LocationAutocomplete"

const eventSchema = yup.object({
  name: yup.string().required("Event name is required"),
  location: yup.string().required("Location is required"),
  venueName: yup.string().required("Venue name is required"),
  bands: yup.array().of(yup.string()).min(1, "At least one band is required"),
  genres: yup.array().of(yup.string()).min(1, "At least one genre is required"),
  details: yup.string().required("Details are required"),
  picture: yup.mixed(),
  ticketLink: yup.string().url("Enter a valid URL"),
  facebookLink: yup.string().url("Enter a valid URL"),
});

const initialValues = {
  name: "",
  location: "",
  venueName: "",
  bands: [],
  genres: [],
  details: "",
  picture: null,
  ticketLink: "",
  facebookLink: "",
};

const CreateEventForm = () => {
  const navigate = useNavigate();
  
  // Placeholder for bands and genres. Ideally, fetch these from a server.
  const bands = ["Band 1", "Band 2", "Band 3"];
  const genres = ["Rock", "Jazz", "Metal"];

  const handleEventCreation = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(item => formData.append(`${key}[]`, item));
      } else {
        formData.append(key, value instanceof Blob ? value : String(value));
      }
    });

    // Implement the API call logic here. Example:
    try {
      console.log("Submitting form...", formData);
      // const response = await fetch("Your API endpoint", { method: "POST", body: formData });
      // if (!response.ok) throw new Error("Failed to create event.");

      alert("Event created successfully!"); // Placeholder success feedback
      resetForm();
      navigate('/events'); // Redirect to the events page or wherever appropriate
    } catch (error) {
      console.error("Error during event creation:", error);
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={eventSchema}
      onSubmit={handleEventCreation}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Event Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />
            <LocationAutocomplete
                name="location"
                value={values.location}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.location && Boolean(errors.location)}
                helperText={touched.location && errors.location}
            />
            <TextField
              label="Venue Name"
              name="venueName"
              value={values.venueName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.venueName && Boolean(errors.venueName)}
              helperText={touched.venueName && errors.venueName}
            />
            {/* For bands and genres, consider using Select with multiple selection */}
            {/* Details */}
            <TextField
              label="Details about the Event"
              name="details"
              value={values.details}
              multiline
              rows={4}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.details && Boolean(errors.details)}
              helperText={touched.details && errors.details}
            />
            {/* Optional Picture Upload */}
            <Dropzone onDrop={(acceptedFiles) => setFieldValue("picture", acceptedFiles[0])}>
              {({ getRootProps, getInputProps }) => (
                <Box {...getRootProps()} p={2} border="1px dashed grey">
                  <input {...getInputProps()} />
                  <Typography>Drag 'n' drop an event picture here, or click to select a file</Typography>
                  {values.picture && (
                    <Box mt={2}>
                      <Typography>{values.picture.name}</Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Dropzone>
            <TextField
              label="Ticket Provider Link"
              name="ticketLink"
              value={values.ticketLink}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.ticketLink && Boolean(errors.ticketLink)}
              helperText={touched.ticketLink && errors.ticketLink}
            />
            <TextField
              label="Facebook Event Link"
              name="facebookLink"
              value={values.facebookLink}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.facebookLink && Boolean(errors.facebookLink)}
              helperText={touched.facebookLink && errors.facebookLink}
            />

            {/* For Bands, assuming a text field where band names can be entered and separated by commas */}
            <TextField
              label="Bands (comma separated)"
              name="bands"
              value={values.bands.join(', ')} // Assuming bands is an array of strings
              onChange={(e) => setFieldValue("bands", e.target.value.split(',').map(band => band.trim()))}
              onBlur={handleBlur}
              error={touched.bands && Boolean(errors.bands)}
              helperText={touched.bands && errors.bands}
            />

            {/* For Genres, also assuming a similar approach as Bands */}
            <TextField
              label="Genres (comma separated)"
              name="genres"
              value={values.genres.join(', ')} // Assuming genres is an array of strings
              onChange={(e) => setFieldValue("genres", e.target.value.split(',').map(genre => genre.trim()))}
              onBlur={handleBlur}
              error={touched.genres && Boolean(errors.genres)}
              helperText={touched.genres && errors.genres}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Create Event
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default CreateEventForm;
