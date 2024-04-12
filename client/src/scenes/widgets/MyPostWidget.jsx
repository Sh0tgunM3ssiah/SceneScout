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
import CircularProgress from '@mui/material/CircularProgress';
import Dropzone from 'react-dropzone';
import UserImage from 'components/UserImage';
import WidgetWrapper from 'components/WidgetWrapper';
import ScenesDropdown from 'components/scenesDropdown'; // Import the ScenesDropdown component
import { useDispatch, useSelector } from 'react-redux';
import { addPost } from 'state';
import { useNavigate } from 'react-router-dom';

const MyPostWidget = ({ userData, addPost }) => {
  const navigate = useNavigate();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  const [post, setPost] = useState('');
  const [sceneId, setSceneId] = useState(userData.scene || ''); // Prefill with current scene
  const [sceneName, setSceneName] = useState(userData.sceneName || '');
  const [groupedScenes, setGroupedScenes] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!userData) {
    return <CircularProgress />;
  }

  const handlePost = async () => {
    if (!userData || !userData._id || !sceneId) {
      console.error('Required information is missing.');
      return;
    }

    const formData = new FormData();
    const usernameValue = userData.accountType === "Artist" ? userData.name : userData.displayName;
    formData.append('username', usernameValue);
    formData.append('userId', userData._id);
    formData.append('description', post); // Append scene name
    formData.append('sceneId', sceneId);
    formData.append('sceneName', sceneName);
    formData.append('postType', userData.accountType);
    formData.append('userPicturePath', userData.picturePath);
    if (image) {
      formData.append('picture', image);
      formData.append('picturePath', image.name);
    }

    console.log(formData);

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/posts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) throw new Error('Network response was not ok.');
      const posts = await response.json();
      if (sceneId === userData.scene) { // Only dispatch if matches current scene
        addPost(posts);
      }
      setImage(null);
      setIsImage(false);
      setPost('');
      setSceneName(userData.sceneName); // Reset the scene name
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleSceneChange = (sceneId, sceneName) => {
    setSceneId(sceneId);
    setSceneName(sceneName);
  };

  return (
    <WidgetWrapper>
      <Box display="flex" flexDirection="column" gap="1rem">
        <Box display="flex" gap="1rem">
          <UserImage image={userData.picturePath} />
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
              key={image ? 'selected' : 'empty'}
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
        <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems="center" width="100%">
          <IconButton onClick={() => setIsImage(!isImage)} sx={{ marginBottom: isMobile ? '1rem' : '0' }}>
            <ImageOutlined />
          </IconButton>
          <Box sx={{ flex: isMobile ? 1 : 'none', width: isMobile ? '100%' : 'auto' }}>
            <ScenesDropdown
              label="Select Scene"
              value={sceneId}
              onChange={handleSceneChange}
              sx={{
                minWidth: 200,
                width: isMobile ? '100%' : 'auto' // Ensures full width on mobile
              }}
            />
          </Box>
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
            sx={{ width: isMobile ? '100%' : 'auto', marginTop: isMobile ? '1rem' : '' }}
          >
            Post
          </Button>
        </Box>
      </Box>
    </WidgetWrapper>
  );
};

export default MyPostWidget;