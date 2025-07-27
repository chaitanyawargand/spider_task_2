import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import {useActivity} from '../context/activityContext'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './styles/Groupinfo.css';
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#8dd1e1', '#a4de6c', '#d0ed57'];
const GroupInfo = () => {
  const { groupId } = useParams();
  const {addActivity}= useActivity()
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [balances, setBalances] = useState({ youOwe: [], youAreOwed: [] });
  const fetchGroupData = async () => {
    try {
      setLoading(true);
      const [groupRes, balancesRes] = await Promise.all([
        api.get(`/groups/${groupId}`),
        api.get(`/groups/${groupId}/expenses/balances`)
      ]);
      const groupData = groupRes.data.data.group;
      if (!groupData.expenses) {
        groupData.expenses = [];
      }
      setGroup(groupData);
      setBalances(balancesRes.data.data.balances || { youOwe: [], youAreOwed: [] });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch group data');
      setLoading(false);
    }
  };
  const fetchCurrentUser=async () => {
    try {
      const res = await api.get('/users/me');
      setCurrentUser(res.data.data.user);
    } catch (err) {
      setError('Failed to fetch current user');
    }
  };
  useEffect(() => {
    fetchCurrentUser();
    fetchGroupData();
  }, [groupId]);
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    try {
      await api.post(`/groups/${groupId}/expenses/`, {
        amount: parseFloat(amount),
        category
      });
   addActivity(`You added an expense of ₹${amount} in "${group.name}"`);
      setAmount('');
      setCategory('');
      await fetchGroupData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    }
  };
  const handleDeleteExpense = async (expenseId) => {
    try {
      await api.delete(`/groups/${groupId}/expenses/${expenseId}`);
      fetchGroupData();
      addActivity(`You deleted an expense of ₹${amount} from "${group.name}"`);
    } catch (err) {
      setError('Failed to delete expense');
    }
  };
  const handleDeleteGroup = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this group?');
    if (!confirmDelete) return;
    try {
      await api.delete(`/groups/${groupId}`);
      navigate('/groups');
    } catch (err) {
      setError('Failed to delete group');
    }
  };
  const getCategoryData = () => {
    const data = {};
    group?.expenses.forEach((exp) => {
      data[exp.category] = (data[exp.category] || 0) + exp.amount;
    });
    return Object.entries(data).map(([name, value]) => ({ name, value }));
  };
  if (loading || !currentUser) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!group) return <div className="error">Group not found</div>;
  return (
    <div className="group-info-container">
      <div className="group-info-header">
        <h2>{group.name}</h2>
        <p>{group.description}</p>
        {group.createdBy?._id === currentUser._id && (
          <button className="delete-group-btn" onClick={handleDeleteGroup}>
            Delete Group
          </button>
        )}
      </div>
      <div className="members-list">
        <h3>Members:</h3>
        <ul>
          {group.members?.map((member) => (
            <li key={member._id}>
              {member.name}
              {member._id === group.createdBy?._id && ' (Admin)'}
            </li>
          ))}
        </ul>
      </div>
      <div className="expenses-section">
        <h3>Expenses:</h3>
        {group.expenses?.length === 0 ? (
          <p>No expenses yet.</p>
        ) : (
          <div className="expenses-list">
          {group.expenses.map((expense) => (
            <div className="expense-item" key={expense._id}>
              <div className="expense-details">
                <strong>{expense.category}</strong>: ₹{expense.amount}
                <span> Added by: {expense.createdBy?.name}</span>
                </div>
                {expense.createdBy?._id === currentUser._id && (
                  <button
                    className="delete-expense-btn"
                    onClick={() => handleDeleteExpense(expense._id)} >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <form className="add-expense-form" onSubmit={handleAddExpense}>
        <h3>Add Expense:</h3>
        <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required/>
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required/>
        <button type="submit">Add Expense</button>
      </form>
      <div className="balances-section">
        <h3>Balances:</h3>
        {balances.youOwe.length > 0 && (
          <div className="you-owe">
        <h4>You Owe:</h4>
          <ul>
         {balances.youOwe.map((item, index) => (
             <li key={index}>
              ₹{item.amount.toFixed(2)} to {item.to}
            </li>
              ))}
            </ul>
          </div>
        )}
        {balances.youAreOwed.length > 0 && (
          <div className="you-are-owed">
          <h4>You Are Owed:</h4>
            <ul>
              {balances.youAreOwed.map((item, index) => (
                <li key={index}>
                  ₹{item.amount.toFixed(2)} from {item.from}
                </li>
              ))}
            </ul>
          </div>
        )}
        {balances.youOwe.length === 0 && balances.youAreOwed.length === 0 && (
          <p>No balances to show</p>
        )}
      </div>
      <div className="chart-section">
        <h3>Category-wise Expenses:</h3>
        {group.expenses.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getCategoryData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >  {getCategoryData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>No expense data to display</p>
        )}
      </div>
    </div>
  );
};
export default GroupInfo;
