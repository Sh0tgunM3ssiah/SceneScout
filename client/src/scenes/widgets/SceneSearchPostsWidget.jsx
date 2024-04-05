import React, { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import PostWidget from './PostWidget';
import EventWidget from './EventWidget';

const SceneSearchPostsWidget = ({ posts, userData, isProfile = false }) => {

  if (!userData) {
    return <CircularProgress />
  }

  if (!posts || posts.length === 0) {
    return <Typography variant="body1">No posts available.</Typography>;
  }

  return (
    <Grid container spacing={3}>
    <>
      {posts.map((post) => (
        post.type === 'post' ? (
        <PostWidget
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
          createdAt={post.createdAt}
        />
        ) : (
          <EventWidget
            userData={userData}
            key={post._id}
            postId={post._id}
            postUserId={post.userId} // Assuming this is the ID of the user who made the post
            name={post.username}
            eventName={post.eventName}
            venueName={post.venueName}
            scene={post.scene}
            description={post.description}
            location={post.location}
            picturePath={post.picturePath}
            userPicturePath={post.userPicturePath}
            likes={post.likes}
            comments={post.comments}
            post={post}
            eventId={post._id}
          />
        )
      ))}
    </>
    </Grid>
  );
};

export default SceneSearchPostsWidget;