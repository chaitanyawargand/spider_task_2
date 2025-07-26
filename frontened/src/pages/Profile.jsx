import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import * as authService from '../services/authService';

function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  
  const [passwordForm, setPasswordForm] = useState({
    passwordCurrent: '',
    password: '',
    passwordConfirm: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileFormChange = (e) => {
    setProfileForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handlePasswordFormChange = (e) => {
    setPasswordForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!profileForm.name.trim() || !profileForm.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authService.updateProfile(profileForm);
      updateUser(response.data.data.user);
      toast.success('Profile updated successfully!');
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.passwordCurrent || !passwordForm.password || !passwordForm.passwordConfirm) {
      toast.error('All password fields are required');
      return;
    }

    if (passwordForm.password !== passwordForm.passwordConfirm) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.password.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.updatePassword(passwordForm);
      toast.success('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordForm({
        passwordCurrent: '',
        password: '',
        passwordConfirm: ''
      });
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelEditProfile = () => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || ''
    });
    setIsEditingProfile(false);
  };

  const cancelChangePassword = () => {
    setPasswordForm({
      passwordCurrent: '',
      password: '',
      passwordConfirm: ''
    });
    setIsChangingPassword(false);
  };

  return (
    <div className="container" style={{ paddingTop: '40px', maxWidth: '600px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
          Profile Settings
        </h1>
        <p style={{ color: '#6b7280' }}>
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Information Card */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Profile Information</h2>
          {!isEditingProfile && (
            <button 
              onClick={() => setIsEditingProfile(true)}
              className="btn btn-secondary"
            >
              ✏️ Edit
            </button>
          )}
        </div>

        {isEditingProfile ? (
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profileForm.name}
                onChange={handleProfileFormChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileFormChange}
                className="form-input"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                type="button"
                onClick={cancelEditProfile}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Full Name</label>
              <p style={{ fontSize: '16px', padding: '12px 0', color: '#1a202c' }}>
                {user?.name}
              </p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label className="form-label">Email Address</label>
              <p style={{ fontSize: '16px', padding: '12px 0', color: '#1a202c' }}>
                {user?.email}
              </p>
            </div>

            <div>
              <label className="form-label">Account Status</label>
              <p style={{ fontSize: '16px', padding: '12px 0' }}>
                <span className="badge badge-success">Active</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Card */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Change Password</h2>
          {!isChangingPassword && (
            <button 
              onClick={() => setIsChangingPassword(true)}
              className="btn btn-secondary"
            >
              🔒 Change Password
            </button>
          )}
        </div>

        {isChangingPassword ? (
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label htmlFor="passwordCurrent" className="form-label">Current Password</label>
              <input
                type="password"
                id="passwordCurrent"
                name="passwordCurrent"
                value={passwordForm.passwordCurrent}
                onChange={handlePasswordFormChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">New Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={passwordForm.password}
                onChange={handlePasswordFormChange}
                className="form-input"
                minLength="8"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="passwordConfirm" className="form-label">Confirm New Password</label>
              <input
                type="password"
                id="passwordConfirm"
                name="passwordConfirm"
                value={passwordForm.passwordConfirm}
                onChange={handlePasswordFormChange}
                className="form-input"
                minLength="8"
                required
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button 
                type="button"
                onClick={cancelChangePassword}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              For security reasons, we recommend changing your password regularly.
            </p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Last changed: Never (account created recently)
            </p>
          </div>
        )}
      </div>

      {/* Account Statistics */}
      <div className="card">
        <h2 style={{ marginBottom: '24px' }}>Account Statistics</h2>
        
        <div className="grid grid-2">
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#3b82f6', fontSize: '24px', marginBottom: '8px' }}>
              {user?.friends?.length || 0}
            </h3>
            <p style={{ color: '#6b7280' }}>Friends</p>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ color: '#10b981', fontSize: '24px', marginBottom: '8px' }}>
              Active
            </h3>
            <p style={{ color: '#6b7280' }}>Account Status</p>
          </div>
        </div>
        
        <div style={{ marginTop: '20px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Member since {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;