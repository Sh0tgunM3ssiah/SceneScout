import React, { useState } from 'react';
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from '@mui/icons-material';
import Dropzone from 'react-dropzone';
import UserImage from 'components/UserImage';
import WidgetWrapper from 'components/WidgetWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from 'state'; // Adjust the import path to match your project structure
import { addPost } from 'state';
import { useNavigate } from "react-router-dom";

const MyPostWidget = ({ userData }) => {
  const navigate = useNavigate();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');

  if (!userData) {
    return <div>Loading...</div>;
  }

  // Destructure the user data for easy access
  const {
    _id: userId,
    username,
    firstName,
    lastName,
    location,
    scene,
    picturePath,
    friends = [],
    viewedProfile = 0,
    impressions = 0,
  } = userData;

  const handlePost = async () => {
    if (!userData || !userData._id) {
      console.error('User ID is not available.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userData._id);
    formData.append('description', post);
    formData.append('sceneId', userData.scene);
    formData.append('userPicturePath', userData.picturePath)
    if (image) {
      formData.append('picture', image);
      formData.append('picturePath', image.name);
    }

    try {
      const response = await fetch(`http://localhost:3001/posts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const posts = await response.json();
      dispatch(addPost(posts));
      setImage(null);
      setPost('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <WidgetWrapper>
      <Box display="flex" flexDirection="column" gap="1rem">
        <Box display="flex" gap="1rem">
          <UserImage image={picturePath} />
          <InputBase
            placeholder="What's on your mind..."
            fullWidth
            onChange={(e) => setPost(e.target.value)}
            value={post}
            sx={{
              flex: 1,
              backgroundColor: theme.palette.background.paper,
              borderRadius: '20px',
              padding: '10px 20px',
            }}
          />
        </Box>
        {isImage && (
          <Box
            border={`1px solid ${theme.palette.divider}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
              multiple={false}
            >
              {({ getRootProps, getInputProps }) => (
                <Box
                  {...getRootProps()}
                  sx={{
                    border: `2px dashed ${theme.palette.text.secondary}`,
                    borderRadius: '10px',
                    padding: '10px',
                    textAlign: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <input {...getInputProps()} />
                  <Typography>
                    {!image ? 'Drag \'n\' drop an image here, or click to select an image' : image.name}
                  </Typography>
                </Box>
              )}
            </Dropzone>
          </Box>
        )}
        <Divider />
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <IconButton onClick={() => setIsImage(!isImage)}>
            <ImageOutlined />
          </IconButton>

          {/* Optionally showing more icons based on mobile or non-mobile screens */}
          {/* {isNonMobileScreens && (
            <>
              <IconButton>
                <GifBoxOutlined />
              </IconButton>
              <IconButton>
                <AttachFileOutlined />
              </IconButton>
              <IconButton>
                <MicOutlined />
              </IconButton>
              <IconButton>
                <MoreHorizOutlined />
              </IconButton>
            </>
          )} */}

          <Button
            variant="contained"
            disabled={!post && !image}
            onClick={handlePost}
            startIcon={<EditOutlined />}
          >
            Post
          </Button>

          {image && (
            <IconButton onClick={() => setImage(null)} color="error">
              <DeleteOutlined />
            </IconButton>
          )}
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default MyPostWidget;