import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import PostWidget from './PostWidget';

const ProfilePostsWidget = ({ posts, userData, isProfile = false }) => {

  if (!userData) {
    return <CircularProgress />;
  }

  if (!posts || posts.length === 0) {
    return <Typography variant="body1">No posts available.</Typography>;
  }

  return (
    <>
      {posts.map((post) => (
        <PostWidget
          userData={userData}
          key={post._id}
          postId={post._id}
          postUserId={post.userId} // Assuming this is the ID of the user who made the post
          name={post.username}
          scene={post.scene}
          sceneName={post.sceneName}
          description={post.description}
          location={post.location}
          picturePath={post.picturePath}
          userPicturePath={post.userPicturePath}
          likes={post.likes}
          comments={post.comments}
          createdAt={post.createdAt}
        />
      ))}
    </>
  );
};

export default ProfilePostsWidget;