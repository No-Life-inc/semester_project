import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import { UserContext } from '../context/UserContext';

const Navbar: React.FC = () => {
  const { user, setUser } = useContext(UserContext) || {};

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser?.(null);
  };

  return (
    <nav className="navbar" data-testid="navbar">
        <h1 data-testid="navbar-header">CollectionAPP 5000</h1>
        <ul data-testid="navbar-links">
            <li data-testid="navbar-home-link">
                <Link to="/">Home</Link>
            </li>
            {user ? (
                <>
                    <li data-testid="navbar-books-link">
                        <Link to="/books">Books</Link>
                    </li>
                    <li data-testid="navbar-profile-link">
                        <Link to="/profile">Profile</Link>
                    </li>
                    <li>
                        <button
                            onClick={handleLogout}
                            className="logout-button"
                            data-testid="navbar-logout-button"
                        >
                            Logout
                        </button>
                    </li>
                </>
            ) : (
                <>
                    <li data-testid="navbar-register-link">
                        <Link to="/register">Register</Link>
                    </li>
                    <li data-testid="navbar-login-link">
                        <Link to="/login">Login</Link>
                    </li>
                </>
            )}
        </ul>
    </nav>
);

};

export default Navbar;
