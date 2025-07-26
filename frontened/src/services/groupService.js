import api from './api';

export const getMyGroups = async () => {
  const response = await api.get('/groups');
  return response;
};

export const createGroup = async (groupData) => {
  const response = await api.post('/groups', groupData);
  return response;
};

export const deleteGroup = async (groupId) => {
  const response = await api.delete(`/groups/${groupId}`);
  return response;
};

export const getGroupMembers = async (groupId) => {
  const response = await api.get(`/groups/${groupId}/members`);
  return response;
};

export const addMemberToGroup = async (groupId, friendId) => {
  const response = await api.post(`/groups/${groupId}/members`, { friendId });
  return response;
};

export const removeMemberFromGroup = async (groupId, memberId) => {
  const response = await api.delete(`/groups/${groupId}/members`, { 
    data: { memberId } 
  });
  return response;
};