import api from './api';

export const searchUsers = async (searchTerm) => {
  const response = await api.get(`/users/search?search=${searchTerm}`);
  return response;
};

export const getFriends = async () => {
  const response = await api.get('/users/friends');
  return response;
};

export const addFriend = async (userId) => {
  const response = await api.post(`/users/friends/${userId}`);
  return response;
};

export const removeFriend = async (userId) => {
  const response = await api.delete(`/users/friends/${userId}`);
  return response;
};