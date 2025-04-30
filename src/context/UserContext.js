import React, { createContext, useState, useEffect, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(() => {
    const savedToken = localStorage.getItem('accessToken');
    return savedToken ? savedToken : null;
  });

  const [permissions, setPermissions] = useState(() => {
    const savedPermissions = localStorage.getItem('permissions');
    return savedPermissions ? JSON.parse(savedPermissions) : [];
  });

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  useEffect(() => {
    if (permissions.length > 0) {
      localStorage.setItem('permissions', JSON.stringify(permissions));
    } else {
      localStorage.removeItem('permissions');
    }
  }, [permissions]);

  return (
    <UserContext.Provider value={{ accessToken, permissions, setAccessToken, setPermissions }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
