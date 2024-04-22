import React from 'react';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
    const { user } = useAuthenticator();

//   // If the user is authenticated, navigate to the home page or desired route
//   if (user) {
//     return <Navigate to="/home" />;
//   }

  // Authenticator component wraps the login functionality
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <div>
          <h1>Welcome, {user.username}</h1>
          <button onClick={signOut}>Sign out</button>
        </div>
      )}
    </Authenticator>
  );
};

export default LoginPage;
