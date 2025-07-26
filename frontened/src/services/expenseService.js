import api from './api';

export const getGroupExpenses = async (groupId) => {
  const response = await api.get(`/expenses/group/${groupId}`);
  return response;
};

export const addExpenseToGroup = async (groupId, expenseData) => {
  const response = await api.post(`/expenses/group/${groupId}`, expenseData);
  return response;
};

export const deleteExpense = async (expenseId) => {
  const response = await api.delete(`/expenses/${expenseId}`);
  return response;
};

export const getGroupBalances = async (groupId) => {
  const response = await api.get(`/expenses/group/${groupId}/balances`);
  return response;
};

export const getExpensesByCategory = async (groupId) => {
  const response = await api.get(`/expenses/group/${groupId}/categories`);
  return response;
};