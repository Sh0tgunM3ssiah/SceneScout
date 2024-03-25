import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage';
import LoginPage from 'scenes/loginPage';
import ProfilePage from 'scenes/profilePage';
import SearchPage from 'scenes/searchPage';
import CreateEventPage from 'scenes/eventPage/create';
import ClassifiedPage from 'scenes/classifiedPage';
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { UserProvider, useUser } from "../src/userContext"; // Ensure the path matches your project structure
import UserWidget from './scenes/widgets/UserWidget';

Amplify.configure(awsconfig);

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = createTheme(themeSettings(mode));

  return (
    <Authenticator>
      {({ signOut }) => (
        <UserProvider>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Routes>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/" element={<HomePage/>} />
                <Route path="/home" element={<HomePage/>} />
                <Route path="/profile/:userId" element={<ProfilePage/>} />
                <Route path="/search" element={<SearchPage/>} />
                <Route path="/event/create" element={<CreateEventPage/>} />
                <Route path="/classifieds/:scene" element={<ClassifiedPage/>} />
              </Routes>
            </ThemeProvider>
          </BrowserRouter>
        </UserProvider>
      )}
    </Authenticator>
  );
}

export default App;