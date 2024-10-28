//navbar
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import exp from 'constants';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>CollectionAPP 5000</h1>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/books">Books</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;