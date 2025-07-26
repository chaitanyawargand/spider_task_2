import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as groupService from '../services/groupService';
import * as expenseService from '../services/expenseService';
import LoadingSpinner from '../components/LoadingSpinner';

function Dashboard() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalOwed, setTotalOwed] = useState(0);
  const [totalOwing, setTotalOwing] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const groupsResponse = await groupService.getMyGroups();
      const groupsData = groupsResponse.data.data.groups;
      setGroups(groupsData);

      // Calculate total balances across all groups
      let totalOwedAmount = 0;
      let totalOwingAmount = 0;

      for (const group of groupsData) {
        try {
          const balanceResponse = await expenseService.getGroupBalances(group._id);
          const balances = balanceResponse.data.data.balances;
          
          const owedAmount = balances.youAreOwed.reduce((sum, item) => sum + item.amount, 0);
          const owingAmount = balances.youOwe.reduce((sum, item) => sum + item.amount, 0);
          
          totalOwedAmount += owedAmount;
          totalOwingAmount += owingAmount;
        } catch (error) {
          console.error(`Failed to fetch balances for group ${group._id}:`, error);
        }
      }

      setTotalOwed(totalOwedAmount);
      setTotalOwing(totalOwingAmount);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
          Welcome back, {user?.name}! 👋
        </h1>
        <p style={{ color: '#6b7280', fontSize: '18px' }}>
          Here's your expense overview
        </p>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-3" style={{ marginBottom: '40px' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#10b981', fontSize: '24px', marginBottom: '8px' }}>
            ₹{totalOwed.toFixed(2)}
          </h3>
          <p style={{ color: '#6b7280' }}>You are owed</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#ef4444', fontSize: '24px', marginBottom: '8px' }}>
            ₹{totalOwing.toFixed(2)}
          </h3>
          <p style={{ color: '#6b7280' }}>You owe</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <h3 style={{ color: '#3b82f6', fontSize: '24px', marginBottom: '8px' }}>
            ₹{(totalOwed - totalOwing).toFixed(2)}
          </h3>
          <p style={{ color: '#6b7280' }}>Net balance</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '40px' }}>
        <h2 style={{ marginBottom: '24px' }}>Quick Actions</h2>
        <div className="grid grid-3">
          <Link to="/groups" className="btn btn-primary" style={{ textDecoration: 'none' }}>
            📊 View All Groups
          </Link>
          <Link to="/friends" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            👥 Manage Friends
          </Link>
          <Link to="/profile" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            ⚙️ Profile Settings
          </Link>
        </div>
      </div>

      {/* Recent Groups */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2>Your Groups</h2>
          <Link to="/groups" className="btn btn-primary">
            View All
          </Link>
        </div>
        
        {groups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              You haven't joined any groups yet
            </p>
            <Link to="/groups" className="btn btn-primary">
              Create Your First Group
            </Link>
          </div>
        ) : (
          <div className="grid grid-2">
            {groups.slice(0, 4).map((group) => (
              <Link
                key={group._id}
                to={`/groups/${group._id}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="card" style={{ marginBottom: '0', cursor: 'pointer', transition: 'all 0.2s ease' }}
                     onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                     onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <h3 style={{ marginBottom: '8px', color: '#1a202c' }}>
                    {group.name}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '12px' }}>
                    {group.description || 'No description'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge badge-primary">
                      {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ color: '#3b82f6', fontSize: '14px' }}>
                      View details →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;