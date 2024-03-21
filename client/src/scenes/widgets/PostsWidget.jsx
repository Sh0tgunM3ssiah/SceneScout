import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import PostWidget from './PostWidget';

const PostsWidget = ({ posts, userData, isProfile = false }) => {

  if (!userData) {
    return <div>Loading...</div>;
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
          name={userData.username}
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

export default PostsWidget;