import React, { useState } from 'react';
import { Typography, Button, Grid, CircularProgress } from '@mui/material';
import EventWidget from './EventWidget';

const INITIAL_EVENTS_COUNT = 5; // Initial number of events to display
const MORE_EVENTS_COUNT = 10; // Number of events to add each time the user clicks "Load More"

const EventsWidget = ({ events, userData, isProfile = false }) => {
  const [visibleEventsCount, setVisibleEventsCount] = useState(INITIAL_EVENTS_COUNT);

  if (!userData) {
    return <CircularProgress />;
  }
  
  if (!events || events.length === 0) {
    return <Typography variant="body1">No events available.</Typography>;
  }

  const showMoreEvents = () => {
    setVisibleEventsCount(prevCount => prevCount + MORE_EVENTS_COUNT);
  };

  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        {events.slice(0, visibleEventsCount).map((event) => (
          <Grid item xs={12} key={event._id} display="flex" justifyContent="center">
            {/* Assuming EventWidget can handle being centered through its internal styling */}
            <EventWidget
              userData={userData}
              {...event}
            />
          </Grid>
        ))}
      </Grid>
      {visibleEventsCount < events.length && (
        <Button 
          onClick={showMoreEvents} 
          style={{ display: 'block', margin: '20px auto' }}
        >
          Load More Events
        </Button>
      )}
    </>
  );
};

export default EventsWidget;