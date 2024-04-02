import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import EventWidget from './EventWidget';

const EventsWidget = ({ events, userData, isProfile = false }) => {

  if (!userData) {
    return <CircularProgress />;
  }
  
  if (!events || events.length === 0) {
    return <Typography variant="body1">No events available.</Typography>;
  }

  return (
    <>
      {events.map((post) => (
        <EventWidget
          userData={userData}
          key={post._id}
          postId={post._id}
          postUserId={post.userId} // Assuming this is the ID of the user who made the post
          name={post.username}
          scene={post.scene}
          description={post.description}
          location={post.location}
          picturePath={post.picturePath}
          userPicturePath={post.userPicturePath}
          likes={post.likes}
          comments={post.comments}
        />
      ))}
    </>
  );
};

export default EventsWidget;