import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './styles/Groupinfo.css';

const GroupInfo = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [owedDetails, setOwedDetails] = useState([]);
  
  const fetchGroup = async () => {
    try {
      const groupRes = await api.get(`/groups/${groupId}`);
      const membersRes = await api.get(`/groups/${groupId}/members`);
      const expensesRes = await api.get(`/groups/${groupId}/expenses`);
      const balancesRes = await api.get(`/groups/${groupId}/expenses/balances`);
      
      setGroup({
        ...groupRes.data.data.group,
        members: membersRes.data.data.members,
        expenses: expensesRes.data.data.expenses,
        currentUserId: balancesRes.data.data.currentUserId,
      });
      setOwedDetails(balancesRes.data.data.balances || []); 
    } catch (err) {
      console.error('❌ Error fetching group info:', err);
    }
  };

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    try {
      await api.post(`/groups/${groupId}/expenses`, {
        amount: parseFloat(amount),
        category,
        title: category,
      });
      setAmount('');
      setCategory('');
      fetchGroup();
    } catch (err) {
      console.error('❌ Error adding expense:', err);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    try {
      await api.delete(`/groups/${groupId}/expenses/${expenseId}`);
      fetchGroup();
    } catch (err) {
      console.error('❌ Error deleting expense:', err);
    }
  };

  const handleDeleteGroup = async () => {
    const confirm = window.confirm('Are you sure you want to delete this group?');
    if (!confirm) return;

    try {
      await api.delete(`/groups/${groupId}`);
      navigate('/groups');
    } catch (err) {
      console.error('❌ Error deleting group:', err);
    }
  };

  if (!group) return <p>Loading group info...</p>;

  return (
    <div className="group-info-container">
      <div className="group-info-header">
        <h2>{group.name}</h2>
        <button onClick={handleDeleteGroup}>Delete Group</button>
      </div>

      <div className="members-list">
        <h3>Members:</h3>
        <ul>
          {group.members?.map((member) => (
            <li key={member._id}>{member.name} ({member.email})</li>
          ))}
        </ul>
      </div>

      <div className="expenses-section">
        <h3>Expenses:</h3>
        {group.expenses?.length === 0 ? (
          <p>No expenses yet.</p>
        ) : (
          group.expenses.map((expense) => (
            <div className="expense-item" key={expense._id}>
              <div className="expense-details">
                <strong>{expense.category}</strong>: ₹{expense.amount} — by {expense.createdBy?.name || 'Unknown'}
              </div>
              {expense.createdBy?._id === group.currentUserId && (
                <div className="expense-actions">
                  <button onClick={() => handleDeleteExpense(expense._id)}>Delete</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <form className="add-expense-form" onSubmit={handleAddExpense}>
        <h3>Add Expense:</h3>
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>

      <div className="owed-summary">
        <h4>Who Owes Whom:</h4>
        {owedDetails.length === 0 ? (
          <p>No outstanding debts.</p>
        ) : (
          <ul>
            {owedDetails.map((item, idx) => (
              <li key={idx}>
                {item.from} owes {item.to} ₹{item.amount.toFixed(2)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GroupInfo;