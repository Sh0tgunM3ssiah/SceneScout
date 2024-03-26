import React, { useEffect, useState } from 'react';
import { Box, useMediaQuery, Typography, useTheme, Button } from "@mui/material";
import Navbar from "scenes/navbar";
import EventsWidget from "scenes/widgets/EventsWidget.jsx";
import { useSelector } from "react-redux";
import { useUser } from '../../../src/userContext.js'; // Ensure this path matches your project structure
import { useNavigate } from 'react-router-dom';

const EventPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const user = useUser() ?? {}; // Use useUser hook to access the user context
  const { _id, picturePath } = user; // Destructure the needed properties from the user object

  const [userData, setUserData] = useState(null);
  const token = useSelector((state) => state.token);
  const userId = user?.userId;

  useEffect(() => {
    const authToken = token;
    const fetchUserByUsername = async () => {
      if (!userId) return; // Do not attempt to fetch if username is not available
      try {
        const userUrl = `${process.env.REACT_APP_BACKEND_URL}/users/${encodeURIComponent(userId)}`;
        const artistUrl = `${process.env.REACT_APP_BACKEND_URL}/artists/${encodeURIComponent(userId)}`;
        // Concurrently fetch user and artist data
        const [userResponse, artistResponse] = await Promise.all([
          fetch(userUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          }),
          fetch(artistUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          })
        ]);
  
        let entity; // This will hold either the user or the artist
        if (userResponse.ok) {
          const user = await userResponse.json();
          entity = { ...user, type: 'user' };
        } else if (artistResponse.ok) {
          const artist = await artistResponse.json();
          entity = { ...artist, type: 'artist' };
        } else {
          throw new Error('Neither user nor artist found');
        }
  
        // Now we have either a user or artist, check if they have a scene
        if (entity.scene) {
          const sceneResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/scenes/${entity.scene}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          });
  
          if (!sceneResponse.ok) throw new Error('Scene not found');
          const sceneData = await sceneResponse.json();
          entity.sceneName = sceneData.name; // Add the scene name to your entity
        }
  
        setUserData(entity); // Update state with either user or artist, including scene name if applicable
  
      } catch (err) {
        console.error(err.message);
        // Handle errors, e.g., by setting an error state or displaying a notification
      }
    };
  
    fetchUserByUsername();
  }, [userId, token]);

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userData || !userData.scene) return; // Ensure userData and userData.scene are available
      const eventsEndpoint = `${process.env.REACT_APP_BACKEND_URL}/events?sceneId=${encodeURIComponent(userData.scene)}`;
    
      try {
        const response = await fetch(eventsEndpoint, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
    
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const eventsData = await response.json();
    
        setEvents(eventsData); // Use the setEvents state to store the events data
      } catch (err) {
        console.error(err.message);
        setEvents([]); // Handle errors or set an empty array
      }
    };

    fetchEvents();
  }, [userData, token]);

  const handleCreateEvent = () => {
    navigate('/event/create');
  };

  return (
    <Box>
      <Navbar />
      <Box width={isNonMobileScreens ? '50%' : '93%'} p="2rem" m="2rem auto" borderRadius="1.5rem" backgroundColor={theme.palette.background.alt}>
        <Typography fontWeight="500" variant="h3" sx={{ mb: '2.5rem' }}>
          Events Happening In Your Scene
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleCreateEvent}
        >
          Don't See Your Event? Create It Here!
        </Button>
        <EventsWidget userData={userData} events={events}/>
      </Box>
    </Box>
  );
};

export default EventPage;