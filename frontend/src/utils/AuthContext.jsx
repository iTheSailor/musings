import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
    
}


export const AuthProvider = ({ children }) => {
  AuthProvider.propTypes = {
      children: PropTypes.node.isRequired,
  };

  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  const logIn = (token) => {
    localStorage.setItem('token', token);
    setLoggedIn(true);
  };

  const logOut = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
  }
    


  return (
    <AuthContext.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
