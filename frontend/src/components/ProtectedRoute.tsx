import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, setUser } = useContext(UserContext) || {};

  const token = localStorage.getItem('token');

  if (!user && token && setUser) {
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
    if (savedUser) {
      setUser(savedUser); 
    }
  }

  if (!user && !token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
