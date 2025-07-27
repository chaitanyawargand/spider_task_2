
import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import './styles/login.css';

const Login = () => {
  const navigate = useNavigate();
  const [form, setform] = useState({ email: '', password: '' });

  const handlechange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/login', form);
      localStorage.setItem('token', res.data.token);
      alert('login successfully');
      navigate('/groups');
    } catch (err) {
      alert('login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Welcome Back 👋</h2>
        <form onSubmit={handlesubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handlechange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handlechange}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p className="switch-link">
          Don’t have an account? <a href="/signup">Signup</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
