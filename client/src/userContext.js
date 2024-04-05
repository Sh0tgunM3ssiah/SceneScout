import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthenticator } from '@aws-amplify/ui-react';
import { signOut } from 'aws-amplify/auth';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const logout = async () => {
    try {
      await signOut();
      setCurrentUser(null); // This effectively "logs out" the user by setting the currentUser to null.
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  // Provide both currentUser and logout in the context value
  return (
    <UserContext.Provider value={{ currentUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};