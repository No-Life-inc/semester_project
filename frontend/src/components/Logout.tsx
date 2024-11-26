import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Logout: React.FC = () => {
  const { setUser } = useContext(UserContext) || {}; // Access UserContext
  const navigate = useNavigate();

  useEffect(() => {
    // Clear token and update context state
    localStorage.removeItem('token');
    setUser?.(null); // Set user to null in the context
    navigate('/'); // Redirect to the home or login page
  }, [setUser, navigate]);

  return <p>Logging out...</p>; // Provide a brief message to the user
};

export default Logout;
