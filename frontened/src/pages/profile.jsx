import React, { useEffect, useState } from 'react';
import './styles/Profile.css';
import api from '../api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/users/getme');
        const userData = res.data?.data?.user;

        if (!userData) throw new Error('User not found');

        setUser(userData);
        setForm({ name: userData.name, email: userData.email });
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    try {
      const res = await api.patch('/users/updateMe', form);
      const updatedUser = res.data?.data?.user;

      if (!updatedUser) throw new Error('Update failed');

      setUser(updatedUser);
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update user:', err);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img src={defaultAvatar} alt="User Avatar" className="profile-avatar" />
        <div className="profile-info">
          {!editMode ? (
            <>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <span className="profile-role">USER</span>
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                Edit Profile
              </button>
            </>
          ) : (
            <div className="edit-form">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
              />
              <div className="edit-actions">
                <button onClick={handleUpdate}>Save</button>
                <button onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
