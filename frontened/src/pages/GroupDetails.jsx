import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import * as groupService from '../services/groupService';
import * as expenseService from '../services/expenseService';
import * as friendService from '../services/friendService';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Groceries',
  'Utilities',
  'Travel',
  'Healthcare',
  'Other'
];

function GroupDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [group, setGroup] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState({ youOwe: [], youAreOwed: [] });
  const [categoryData, setCategoryData] = useState({});
  const [friends, setFriends] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  
  const [expenseForm, setExpenseForm] = useState({
    amount: '',
    category: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGroupData();
    fetchFriends();
  }, [id]);

  const fetchGroupData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch group details
      const groupResponse = await groupService.getGroupMembers(id);
      setGroup(groupResponse.data.data);
      
      // Fetch expenses
      const expensesResponse = await expenseService.getGroupExpenses(id);
      setExpenses(expensesResponse.data.data.expenses);
      
      // Fetch balances
      const balancesResponse = await expenseService.getGroupBalances(id);
      setBalances(balancesResponse.data.data.balances);
      
      // Fetch category data
      const categoryResponse = await expenseService.getExpensesByCategory(id);
      setCategoryData(categoryResponse.data.data.categoryData);
      
    } catch (error) {
      console.error('Failed to fetch group data:', error);
      toast.error('Failed to load group details');
      navigate('/groups');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await friendService.getFriends();
      setFriends(response.data.data.friends);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  };

  const handleExpenseFormChange = (e) => {
    setExpenseForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    
    if (!expenseForm.amount || !expenseForm.category) {
      toast.error('Amount and category are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await expenseService.addExpenseToGroup(id, {
        amount: parseFloat(expenseForm.amount),
        category: expenseForm.category
      });
      
      toast.success('Expense added successfully!');
      setShowAddExpenseModal(false);
      setExpenseForm({ amount: '', category: '', description: '' });
      fetchGroupData();
    } catch (error) {
      console.error('Failed to add expense:', error);
      toast.error(error.response?.data?.message || 'Failed to add expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await expenseService.deleteExpense(expenseId);
      toast.success('Expense deleted successfully');
      fetchGroupData();
    } catch (error) {
      console.error('Failed to delete expense:', error);
      toast.error(error.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleAddMember = async (friendId) => {
    try {
      await groupService.addMemberToGroup(id, friendId);
      toast.success('Member added successfully!');
      setShowAddMemberModal(false);
      fetchGroupData();
    } catch (error) {
      console.error('Failed to add member:', error);
      toast.error(error.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from the group?`)) {
      return;
    }

    try {
      await groupService.removeMemberFromGroup(id, memberId);
      toast.success('Member removed successfully');
      fetchGroupData();
    } catch (error) {
      console.error('Failed to remove member:', error);
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  // Prepare chart data
  const chartData = {
    labels: Object.keys(categoryData),
    datasets: [
      {
        data: Object.values(categoryData),
        backgroundColor: [
          '#3b82f6',
          '#ef4444',
          '#10b981',
          '#f59e0b',
          '#8b5cf6',
          '#ec4899',
          '#06b6d4',
          '#84cc16',
          '#6b7280'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ₹${context.parsed}`;
          }
        }
      }
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!group) {
    return <div>Group not found</div>;
  }

  // Filter friends who are not already members
  const availableFriends = friends.filter(friend => 
    !group.members.some(member => member._id === friend._id)
  );

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      {/* Group Header */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
              {group.name}
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              {group.description || 'No description provided'}
            </p>
            <span className="badge badge-primary">
              👥 {group.members.length} member{group.members.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setShowAddExpenseModal(true)}
              className="btn btn-primary"
            >
              💰 Add Expense
            </button>
            <button 
              onClick={() => setShowAddMemberModal(true)}
              className="btn btn-secondary"
            >
              👥 Add Member
            </button>
          </div>
        </div>

        {/* Members List */}
        <div>
          <h3 style={{ marginBottom: '16px' }}>Members</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {group.members.map((member) => (
              <div key={member._id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <span>{member.name}</span>
                {member._id !== user.id && (
                  <button
                    onClick={() => handleRemoveMember(member._id, member.name)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#ef4444', 
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                    title="Remove member"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: '32px' }}>
        {/* Balances */}
        <div className="card">
          <h2 style={{ marginBottom: '24px' }}>Your Balances</h2>
          
          {balances.youOwe.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#ef4444', marginBottom: '12px' }}>You owe:</h3>
              {balances.youOwe.map((debt, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <span>{debt.to}</span>
                  <span style={{ color: '#ef4444', fontWeight: '600' }}>
                    ₹{debt.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {balances.youAreOwed.length > 0 && (
            <div>
              <h3 style={{ color: '#10b981', marginBottom: '12px' }}>You are owed:</h3>
              {balances.youAreOwed.map((credit, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0',
                  borderBottom: '1px solid #f3f4f6'
                }}>
                  <span>{credit.from}</span>
                  <span style={{ color: '#10b981', fontWeight: '600' }}>
                    ₹{credit.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {balances.youOwe.length === 0 && balances.youAreOwed.length === 0 && (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
              All settled up! 🎉
            </p>
          )}
        </div>

        {/* Category Chart */}
        <div className="card">
          <h2 style={{ marginBottom: '24px' }}>Expenses by Category</h2>
          {Object.keys(categoryData).length > 0 ? (
            <div style={{ maxWidth: '300px', margin: '0 auto' }}>
              <Pie data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>
              No expenses yet
            </p>
          )}
        </div>
      </div>

      {/* Expenses List */}
      <div className="card">
        <h2 style={{ marginBottom: '24px' }}>Recent Expenses</h2>
        
        {expenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              No expenses recorded yet
            </p>
            <button 
              onClick={() => setShowAddExpenseModal(true)}
              className="btn btn-primary"
            >
              Add First Expense
            </button>
          </div>
        ) : (
          <div>
            {expenses.map((expense) => (
              <div key={expense._id} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px 0',
                borderBottom: '1px solid #f3f4f6'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <span className="badge badge-secondary">{expense.category}</span>
                    <span style={{ fontWeight: '600', fontSize: '18px' }}>
                      ₹{expense.amount.toFixed(2)}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', margin: 0 }}>
                    Added by {expense.createdBy.name} on {new Date(expense.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {expense.createdBy._id === user.id && (
                  <button
                    onClick={() => handleDeleteExpense(expense._id)}
                    className="btn btn-danger"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    Delete
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={showAddExpenseModal}
        onClose={() => setShowAddExpenseModal(false)}
        title="Add New Expense"
      >
        <form onSubmit={handleAddExpense}>
          <div className="form-group">
            <label htmlFor="amount" className="form-label">Amount (₹)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={expenseForm.amount}
              onChange={handleExpenseFormChange}
              className="form-input"
              placeholder="Enter amount"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              name="category"
              value={expenseForm.category}
              onChange={handleExpenseFormChange}
              className="form-select"
              required
            >
              <option value="">Select a category</option>
              {EXPENSE_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              type="button"
              onClick={() => setShowAddExpenseModal(false)}
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
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        isOpen={showAddMemberModal}
        onClose={() => setShowAddMemberModal(false)}
        title="Add Member to Group"
      >
        {availableFriends.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              No friends available to add
            </p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Add friends from the Friends page first
            </p>
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: '16px', color: '#6b7280' }}>
              Select a friend to add to this group:
            </p>
            {availableFriends.map(friend => (
              <div key={friend._id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                <div>
                  <span style={{ fontWeight: '500' }}>{friend.name}</span>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '14px' }}>{friend.email}</p>
                </div>
                <button
                  onClick={() => handleAddMember(friend._id)}
                  className="btn btn-primary"
                  style={{ padding: '6px 12px', fontSize: '14px' }}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default GroupDetails;