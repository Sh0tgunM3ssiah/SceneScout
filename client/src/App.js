import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage';
import LoginPage from 'scenes/loginPage';
import Login from './components/LoginPage';
import ProfilePage from 'scenes/profilePage';
import ProfileEditPage from 'scenes/profilePage/edit';
import SearchPage from 'scenes/searchPage';
import CreateEventPage from 'scenes/eventPage/create';
import ClassifiedPage from 'scenes/classifiedPage';
import EventsPage from 'scenes/eventPage';
import EventsEditPage from 'scenes/eventPage/edit';
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider, Typography } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { Authenticator, View, Image, useTheme, Text, Heading, Button, useAuthenticator, ThemeProvider as AmplifyThemeProvider, Grid, Flex } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { UserProvider, useUser } from "../src/userContext"; // Ensure the path matches your project structure
import UserWidget from './scenes/widgets/UserWidget';
import { grey } from '@mui/material/colors';

Amplify.configure(awsconfig);

function App() {
  const mode = useSelector((state) => state.mode);
  const appTheme = createTheme(themeSettings(mode));
  const { tokens } = useTheme();
  const theme = {
    name: 'Auth Example Theme',
    tokens: {
      components: {
        authenticator: {
          router: {
            boxShadow: `0 0 16px ${tokens.colors.overlay['10']}`,
            borderWidth: '0',
          },
          form: {
            padding: `${tokens.space.medium} ${tokens.space.xl} ${tokens.space.medium}`,
          },
        },
        button: {
          primary: {
            backgroundColor: tokens.colors.blue['60'],
          },
          link: {
            color: tokens.colors.neutral['80'],
          },
        },
        fieldcontrol: {
          _focus: {
            boxShadow: `0 0 0 2px ${tokens.colors.blue['60']}`,
          },
        },
        tabs: {
          item: {
            color: tokens.colors.blue['60'],
            _active: {
              borderColor: tokens.colors.blue['100'],
              color: tokens.colors.neutral['100'],
            },
          },
        },
      },
    },
  }

  const components = {
    Header() {
      const { tokens } = useTheme();
  
      return (
        <View textAlign="center" paddingTop={tokens.space.xxxl} paddingBottom={tokens.space.large}>
          <Image
            alt="Amplify logo"
            src="/scenescoutLogoScriptMastiff.png"
          />
          {/* <Typography
            fontWeight="bold"
            fontSize="clamp(3rem, 2vw, 10.25rem)"
            color="primary"
            fontStyle={'oblique'}
          >
            SceneScout.io
        </Typography> */}
        </View>
      );
    },
  
    Footer() {
      const { tokens } = useTheme();
  
      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Text color={tokens.colors.white}>
            &copy; All Rights Reserved
          </Text>
          {/* <Text color={tokens.colors.neutral[80]}>
            In Loving Memory of The Best Fat Man, Kylo
          </Text> */}
        </View>
      );
    }
  };

  return (
    <AmplifyThemeProvider theme={theme}>
    <Authenticator components={components}>
      {({ signOut }) => (
        <UserProvider>
          <BrowserRouter>
            <ThemeProvider theme={appTheme}>
              <CssBaseline />
              <Routes>
                <Route path="/login" element={<LoginPage/>} />
                <Route path="/register" element={<LoginPage/>} />
                <Route path="/" element={<HomePage/>} />
                <Route path="/home" element={<HomePage/>} />
                <Route path="/profile/:userId" element={<ProfilePage/>} />
                <Route path="/profile/edit/:userId" element={<ProfileEditPage/>} />
                <Route path="/search" element={<SearchPage/>} />
                <Route path="/event" element={<EventsPage/>} />
                <Route path="/event/:id" element={<EventsEditPage/>} />
                <Route path="/event/create" element={<CreateEventPage/>} />
                <Route path="/classifieds/:scene" element={<ClassifiedPage/>} />
              </Routes>
            </ThemeProvider>
          </BrowserRouter>
        </UserProvider>
      )}
    </Authenticator>
    </AmplifyThemeProvider>
  );
}

export default App;