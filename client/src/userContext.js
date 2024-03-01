import React, { createContext, useContext } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  
  // If there are additional user details or states you wish to manage globally,
  // you can include them here and provide setter functions to update them.

  return (
    <UserContext.Provider value={user}>
      {children}
    </UserContext.Provider>
  );
};
