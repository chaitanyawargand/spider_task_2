import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (email, password) => api.post('/users/login', { email, password }),
  register: (name, email, password, passwordConfirm) => 
    api.post('/users/signup', { name, email, password, passwordConfirm }),
  getMe: () => api.get('/users/me'),
  updateProfile: (data) => api.patch('/users/updateMe', data),
  updatePassword: (passwordCurrent, password, passwordConfirm) =>
    api.patch('/users/updateMyPassword', { passwordCurrent, password, passwordConfirm }),
}

export const friendsAPI = {
  searchUsers: (search) => api.get(`/users/search?search=${search}`),
  getFriends: () => api.get('/users/friends'),
  getFriendRequests: () => api.get('/users/friend-requests'),
  sendFriendRequest: (userId) => api.post(`/users/friend-request/${userId}`),
  respondToFriendRequest: (requestId, response) =>
    api.patch(`/users/friend-request/${requestId}`, { response }),
  removeFriend: (userId) => api.delete(`/users/friends/${userId}`),
}

export const groupsAPI = {
  getGroups: () => api.get('/groups'),
  getGroup: (groupId) => api.get(`/groups/${groupId}`),
  createGroup: (name, description) => api.post('/groups', { name, description }),
  addMember: (groupId, friendId) => api.patch(`/groups/${groupId}/add-member`, { friendId }),
  removeMember: (groupId, memberId) => api.patch(`/groups/${groupId}/remove-member`, { memberId }),
  deleteGroup: (groupId) => api.delete(`/groups/${groupId}`),
  getGroupMembers: (groupId) => api.get(`/groups/${groupId}/members`),
  getGroupExpenses: (groupId) => api.get(`/groups/${groupId}/expenses`),
}

export const expensesAPI = {
  addExpense: (groupId, description, category, amount) =>
    api.post(`/expenses/group/${groupId}`, { description, category, amount }),
  getExpenses: (groupId) => api.get(`/expenses/group/${groupId}`),
  deleteExpense: (expenseId) => api.delete(`/expenses/${expenseId}`),
  getGroupBalances: (groupId) => api.get(`/expenses/group/${groupId}/balances`),
  getCategoryStats: (groupId) => api.get(`/expenses/group/${groupId}/category-stats`),
}