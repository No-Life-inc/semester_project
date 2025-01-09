import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/v1/user/register', formData);
      setMessage('Registration successful');
      console.log(response.data);
    } catch (error) {
      setMessage('An error occurred during registration');
      console.error(error);
    }
  };

  return (
    <div data-testid="register-container">
        <h2 data-testid="register-header">Register</h2>
        <form onSubmit={handleSubmit} data-testid="register-form">
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                required
                data-testid="register-name-input"
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
                data-testid="register-email-input"
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                data-testid="register-password-input"
            />
            <button type="submit" data-testid="register-submit-button">Register</button>
        </form>
        {message && <p data-testid="register-message">{message}</p>}
    </div>
);

};

export default Register;
