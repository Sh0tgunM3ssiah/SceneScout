import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage';
import LoginPage from 'scenes/loginPage';
import ProfilePage from 'scenes/profilePage';
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
  const token = useSelector((state) => state.token);
  const userContext = useUser();

  // Define state to store user data
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserByUsername = async () => {
      const authToken = token;
      const username = userContext?.username;
      if (!username) return; // Do not attempt to fetch if username is not available
      try {
        const userUrl = `http://localhost:3001/users/username/${encodeURIComponent(username)}`;
        const bandUrl = `http://localhost:3001/bands/username/${encodeURIComponent(username)}`;
        // Concurrently fetch user and band data
        const [userResponse, bandResponse] = await Promise.all([
          fetch(userUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          }),
          fetch(bandUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          })
        ]);

        let entity; // This will hold either the user or the band
        if (userResponse.ok) {
          const user = await userResponse.json();
          entity = { ...user, type: 'user' };
        } else if (bandResponse.ok) {
          const band = await bandResponse.json();
          entity = { ...band, type: 'band' };
        } else {
          throw new Error('Neither user nor band found');
        }

        // Now we have either a user or band, check if they have a scene
        if (entity.scene) {
          const sceneResponse = await fetch(`http://localhost:3001/scenes/${entity.scene}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${authToken}`,
            },
          });

          if (!sceneResponse.ok) throw new Error('Scene not found');
          const sceneData = await sceneResponse.json();
          entity.sceneName = sceneData.name; // Add the scene name to your entity
        }

        setUserData(entity); // Update state with either user or band, including scene name if applicable

      } catch (err) {
        console.error(err.message);
        // Handle errors, e.g., by setting an error state or displaying a notification
      }
    };

    fetchUserByUsername();
  }, [token, userContext]); // Re-run when token or userContext changes

  return (
    <Authenticator>
      {({ signOut }) => (
        <UserProvider value={userData}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Routes>
                <Route path="/login" element={<LoginPage userData={userData} />} />
                <Route path="/" element={<HomePage userData={userData} />} />
                <Route path="/home" element={<HomePage userData={userData} />} />
                <Route path="/profile/:userId" element={<ProfilePage userData={userData} />} />
              </Routes>
            </ThemeProvider>
          </BrowserRouter>
        </UserProvider>
      )}
    </Authenticator>
  );
}

export default App;