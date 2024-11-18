import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { User } from '../types/type';

interface DecodedToken {
  name: string;
  email: string;
}

const Profile = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode the token to extract user information
        const decoded = jwtDecode<DecodedToken>(token);
        console.log(decoded); 
        setUserName(decoded.name); // Assume the token contains a "name" field
      } catch (error) {
        console.error('Error decoding token:', error);
        setUserName(null);
      }
    }
  }, []);
  

  return (
    <div>
      <h1>Profile</h1>
      {userName ? (
        <p>Welcome, {userName}!</p>
      ) : (
        <p>Welcome to your profile!</p>
      )}
    </div>
  );
};

export default Profile;
