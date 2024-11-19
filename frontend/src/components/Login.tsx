import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { User } from '../types/type';

const Login = () => {
  const { setUser } = useContext(UserContext) as {
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
  };
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.post('http://localhost:5000/v1/user/login', formData);
      const { token, user } = response.data; // Extract token and user data from response

      // Save token to localStorage and update UserContext
      localStorage.setItem('token', token);
      setUser(user); // Set user in the UserContext

      setMessage('Login successful!');
      navigate('/'); // Redirect to the home page or dashboard
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        setMessage('Invalid email or password.');
      } else {
        setMessage('An error occurred during login. Please try again.');
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
