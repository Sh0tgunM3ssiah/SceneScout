import React, { useEffect, useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import WidgetWrapper from 'components/WidgetWrapper';
import { useSelector } from 'react-redux';
import SceneSearchPostsWidget from './SceneSearchPostsWidget';

const ClassifiedWidget = ({ userData }) => {
  return (
    <WidgetWrapper>
      <Box display="flex" flexDirection="column" gap="1rem">
        {/* Filters */}
      </Box>
    </WidgetWrapper>
  );
};

export default ClassifiedWidget;