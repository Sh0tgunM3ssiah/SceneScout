import React, { useEffect } from 'react';
import { Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from 'state'; // Adjust this import based on your actual state management setup
import { useUser } from '../../../src/userContext'; // Adjust the import path as needed
import PostWidget from './PostWidget';

const PostsWidget = ({ userData, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  
  useEffect(() => {
    const getPosts = async () => {
      const endpoint = isProfile && userData ? `http://localhost:3001/posts/${userData._id}/posts` : "http://localhost:3001/posts";
      const response = await fetch(endpoint, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      // Assuming data is an array of posts, sort them by createdAt in descending order
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      dispatch(setPosts({ posts: sortedData })); // Update the posts state with the sorted posts
    };

    if (userData || !isProfile) {
      getPosts();
    }
  }, [userData, isProfile, token, dispatch]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {Array.isArray(posts) ? posts.map((post) => (
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
      )) : (
        <Typography variant="body1">No posts available.</Typography>
      )}
    </>
  );
};

export default PostsWidget;