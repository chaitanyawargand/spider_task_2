import api from './api';

export const login = async (email, password) => {
  const response = await api.post('/users/login', { email, password });
  return response;
};

export const signup = async (userData) => {
  const response = await api.post('/users/signup', userData);
  return response;
};

export const getCurrentUser = async () => {
  const response = await api.get('/users/me');
  return response;
};

export const updateProfile = async (userData) => {
  const response = await api.patch('/users/updateMe', userData);
  return response;
};

export const updatePassword = async (passwordData) => {
  const response = await api.patch('/users/updateMyPassword', passwordData);
  return response;
};

export const resetPassword = async (token, passwordData) => {
  const response = await api.patch(`/users/resetPassword/${token}`, passwordData);
  return response;
};