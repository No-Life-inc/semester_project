import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token'); // Remove the token
    navigate('/'); // Redirect to the login page
    window.location.reload(); // Refresh the page to update the Navbar
  }, [navigate]);

  return null; // No UI for the Logout component
};

export default Logout;
