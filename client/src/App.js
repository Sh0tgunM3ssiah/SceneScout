import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage"; // If you decide to use a custom login page
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { UserProvider } from '../src/userContext'; // Adjust the path as necessary

Amplify.configure(awsconfig);

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return (
    <Authenticator>
      {({ signOut, user }) => (
        <UserProvider value={user}>
          <BrowserRouter>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Routes>
              <Route path="/login" element={<LoginPage user={user} />} />
                <Route path="/" element={<HomePage user={user} />} />
                <Route path="/home" element={<HomePage user={user} />} />
                <Route path="/profile/:userId" element={<ProfilePage user={user} />} />
              </Routes>
            </ThemeProvider>
          </BrowserRouter>
        </UserProvider>
      )}
    </Authenticator>
  );
}

export default App;