import React, { createContext, useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthContexProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken = jwtDecode(token);

        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setUser(decodedToken);
         
        }
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const login = (token) => {
    try {
      const decodedToken = jwtDecode(token);

      const expirationTime = Math.floor(Date.now() / 1000) + 3 * 60 * 60; 
      decodedToken.exp = expirationTime;

      setUser(decodedToken);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
