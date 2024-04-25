import React, { useState, useEffect } from 'react';
import { Typography, Button, useMediaQuery, CircularProgress } from '@mui/material';
import PostWidget from './PostWidget';
import { useTheme } from '@mui/material/styles';

const ProfilePostsWidget = ({ posts, userData, isProfile = false }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('md'));

  const INITIAL_POSTS_COUNT = isLargeScreen ? 10 : 5; // Adjust based on screen size
  const MORE_POSTS_COUNT = isLargeScreen ? 10 : 5;

  const [visiblePostsCount, setVisiblePostsCount] = useState(INITIAL_POSTS_COUNT);

  useEffect(() => {
    // Update the initial posts count when the screen size changes
    setVisiblePostsCount(INITIAL_POSTS_COUNT);
  }, [isLargeScreen]);

  if (!userData) {
    return <CircularProgress />;
  }

  if (!posts || posts.length === 0) {
    return <Typography variant="body1">No posts available.</Typography>;
  }

  const showMorePosts = () => {
    setVisiblePostsCount(prevCount => prevCount + MORE_POSTS_COUNT);
  };

  const visiblePosts = posts.slice(0, visiblePostsCount);

  return (
    <>
      {visiblePosts.map((post) => (
        <PostWidget
          userData={userData}
          key={post._id}
          postId={post._id}
          postUserId={post.userId}
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
      {visiblePostsCount < posts.length && (
        <Button onClick={showMorePosts} style={{ display: 'block', margin: '20px auto' }}>
          Show More Posts
        </Button>
      )}
    </>
  );
};

export default ProfilePostsWidget;
