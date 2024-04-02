// FollowStatusContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const FollowStatusContext = createContext();

export const useFollowStatus = () => useContext(FollowStatusContext);

export const FollowStatusProvider = ({ children }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  // Assume you have a function to fetch the initial follow status
  useEffect(() => {
    const fetchFollowStatus = async () => {
      // Fetch follow status logic here
      setIsFollowing(/* fetched status */);
    };

    fetchFollowStatus();
  }, []);

  return (
    <FollowStatusContext.Provider value={{ isFollowing, setIsFollowing }}>
      {children}
    </FollowStatusContext.Provider>
  );
};
