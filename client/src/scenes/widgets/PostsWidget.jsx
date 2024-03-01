import React, { useEffect } from 'react';
import { Typography} from '@mui/material';
import PostWidget from './PostWidget';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from 'state'; // Ensure you adjust this import based on your actual state management setup
import { useUser } from '../../../src/userContext'; // Adjust the import path as needed

const PostsWidget = ({ isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  const user = useUser(); // Use the global user context to access the user information
  const userId = user ? user._id : null; // Safely access the user ID

  useEffect(() => {
    const getPosts = async () => {
      const endpoint = isProfile && userId ? `http://localhost:3001/posts/${userId}/posts` : "http://localhost:3001/posts";
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setPosts({ posts: data })); // Ensure your action and reducer are correctly set up to handle this payload
    };

    if (userId || !isProfile) {
      getPosts();
    }
  }, [userId, isProfile, token, dispatch]); // Include dependencies to refetch posts when necessary

  return (
    <>
      {Array.isArray(posts) ? posts.map((post) => (
        <PostWidget
          key={post._id}
          postId={post._id}
          postUserId={post.userId} // Assuming this is the ID of the user who made the post
          name={`${post.firstName} ${post.lastName}`}
          description={post.description}
          location={post.location}
          picturePath={post.picturePath}
          userPicturePath={post.userPicturePath}
          likes={post.likes}
          comments={post.comments}
        />
      )) : (
        <Typography variant="body1">No posts available.</Typography>
      )}
    </>
  );
};

export default PostsWidget;
