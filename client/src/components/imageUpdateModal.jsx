import React, { useState } from 'react';
import { Dialog, DialogActions, DialogTitle, Button, DialogContent, TextField } from '@mui/material';

function ImageUpdateModal({ open, onClose, onImageSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleAccept = () => {
    if (selectedFile) {
      onImageSelect(selectedFile);
    }
    onClose(); // Close the modal
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Update Profile Image</DialogTitle>
      <DialogContent>
        <input
          accept="image/*"
          type="file"
          style={{ display: 'none' }}
          id="image-input"
          onChange={handleFileChange}
        />
        <label htmlFor="image-input">
          <Button variant="contained" component="span">
            Upload Image
          </Button>
        </label>
        {fileName && <TextField fullWidth disabled value={fileName} />}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAccept} disabled={!selectedFile}>Accept</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ImageUpdateModal;