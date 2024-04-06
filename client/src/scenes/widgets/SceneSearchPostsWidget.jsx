import React, { useState } from 'react';
import { Grid, Typography, Button, Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import PostWidget from './PostWidget';
import EventWidget from './EventWidget';

const SceneSearchPostsWidget = ({ posts, userData, isProfile = false }) => {
  const [displayLimit, setDisplayLimit] = useState(5);

  if (!userData) {
    return <CircularProgress />
  }

  if (!posts || posts.length === 0) {
    return <Typography variant="body1">No posts available.</Typography>;
  }

  const handleSeeMore = () => {
    setDisplayLimit((prevLimit) => prevLimit + 10);
  };

  return (
    <>
      <Grid container spacing={3} justifyContent="center"> {/* Added justifyContent here */}
        {posts.slice(0, displayLimit).map((post) => (
          post.type === 'post' ? (
            <Grid item xs={12} sm={6} key={post._id}>
              <PostWidget
                {...post} // Assuming destructuring props like this is possible for simplicity
                userData={userData}
              />
            </Grid>
          ) : (
            <Grid item xs={12} key={post._id}>
              <Box display="flex" justifyContent="center"> {/* Wrapper for centering */}
                <EventWidget
                  {...post} // Assuming destructuring props like this is possible for simplicity
                  userData={userData}
                  style={{ maxWidth: '600px', margin: 'auto' }} // You can adjust the maxWidth as needed
                />
              </Box>
            </Grid>
          )
        ))}
      </Grid>
      {displayLimit < posts.length && (
        <Button onClick={handleSeeMore} style={{ marginTop: '20px' }}>
          See More Posts
        </Button>
      )}
    </>
  );
};

export default SceneSearchPostsWidget;