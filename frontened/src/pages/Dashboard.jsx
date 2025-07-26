import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { groupsAPI, expensesAPI } from '../utils/api'
import { toast } from 'react-toastify'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalExpenses: 0,
    totalOwed: 0,
    totalOwing: 0
  })
  const [recentGroups, setRecentGroups] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const groupsResponse = await groupsAPI.getGroups()
      const groups = groupsResponse.data.data.groups || []
      
      setRecentGroups(groups.slice(0, 5)) // Show only 5 recent groups
      
      // Calculate stats
      let totalExpenses = 0
      let totalOwed = 0
      let totalOwing = 0
      
      for (const group of groups) {
        try {
          const balanceResponse = await expensesAPI.getGroupBalances(group._id)
          const { youOwe, youAreOwed } = balanceResponse.data.data
          
          totalOwed += youAreOwed.reduce((sum, item) => sum + item.amount, 0)
          totalOwing += youOwe.reduce((sum, item) => sum + item.amount, 0)
          
          const expensesResponse = await expensesAPI.getExpenses(group._id)
          totalExpenses += expensesResponse.data.results || 0
        } catch (error) {
          console.error(`Error fetching data for group ${group._id}:`, error)
        }
      }
      
      setStats({
        totalGroups: groups.length,
        totalExpenses,
        totalOwed: Math.round(totalOwed * 100) / 100,
        totalOwing: Math.round(totalOwing * 100) / 100
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Welcome back, {user?.name}!</h1>
          <p className="dashboard-subtitle">Here's your expense overview</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalGroups}</div>
            <div className="stat-label">Total Groups</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value">{stats.totalExpenses}</div>
            <div className="stat-label">Total Expenses</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value text-green-600">${stats.totalOwed}</div>
            <div className="stat-label">You are owed</div>
          </div>
          
          <div className="stat-card">
            <div className="stat-value text-red-600">${stats.totalOwing}</div>
            <div className="stat-label">You owe</div>
          </div>
        </div>

        <div className="grid grid-2">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Groups</h2>
              <Link to="/groups" className="btn btn-primary btn-sm">
                View All
              </Link>
            </div>
            
            {recentGroups.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No groups yet</p>
                <Link to="/groups" className="btn btn-primary mt-3">
                  Create Your First Group
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentGroups.map((group) => (
                  <Link
                    key={group._id}
                    to={`/groups/${group._id}`}
                    className="block"
                  >
                    <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{group.name}</h3>
                          <p className="text-sm text-gray-600">
                            {group.members?.length} members
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-500">
                            Created by {group.createdBy?.name}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/groups" className="btn btn-primary w-full">
                Create New Group
              </Link>
              <Link to="/friends" className="btn btn-secondary w-full">
                Add Friends
              </Link>
              <Link to="/profile" className="btn btn-secondary w-full">
                Update Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard