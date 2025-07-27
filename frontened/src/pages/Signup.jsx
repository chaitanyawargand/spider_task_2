import React, { useState } from 'react';
import api from '../api';
import './styles/sign.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });

  const handlechange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlesign = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/signup', form);
      localStorage.setItem('token', res.data.token);
      navigate('/groups');
    } catch (err) {
      alert('signup failed');
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create an Account 🙌</h2>
        <form onSubmit={handlesign} className="signup-form">
          <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handlechange} required />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handlechange} required />
          <input type="password" name="password" placeholder="Password" value={form.password} onChange={handlechange} required />
          <input type="password" name="passwordConfirm" placeholder="Confirm Password" value={form.passwordConfirm} onChange={handlechange} required />
          <button type="submit">Signup</button>
        </form>
        <p className="switch-link">
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup; 
