import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { UserContext } from '../context/UserContext';

const Navbar: React.FC = () => {
  const { user, setUser } = useContext(UserContext) || {}; // Access UserContext

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setUser?.(null); // Update context state to null
  };

  return (
    <nav className="navbar">
      <h1>CollectionAPP 5000</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/books">Books</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
