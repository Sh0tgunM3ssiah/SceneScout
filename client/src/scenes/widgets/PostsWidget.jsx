import React, { useState } from 'react';
import { Typography, Button } from '@mui/material';
import PostWidget from './PostWidget';
import CircularProgress from '@mui/material/CircularProgress';

const INITIAL_POSTS_COUNT = 5; // Initial number of posts to display
const MORE_POSTS_COUNT = 10; // Number of posts to add each time

const PostsWidget = ({ posts, userData, isProfile = false }) => {
  const [visiblePostsCount, setVisiblePostsCount] = useState(INITIAL_POSTS_COUNT);

  if (!userData) {
    return <CircularProgress />;
  }

  if (!posts || posts.length === 0) {
    return <Typography variant="body1">No posts available.</Typography>;
  }

  // Function to load more posts
  const showMorePosts = () => {
    setVisiblePostsCount(prevCount => prevCount + MORE_POSTS_COUNT);
  };

  // Get only the posts that should be currently visible
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

export default PostsWidget;