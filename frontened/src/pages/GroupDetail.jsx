import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { groupsAPI, expensesAPI } from '../utils/api'
import { toast } from 'react-toastify'

const GroupDetail = () => {
  const { id } = useParams()
  const [group, setGroup] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [balances, setBalances] = useState({ youOwe: [], youAreOwed: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchGroupData()
    }
  }, [id])

  const fetchGroupData = async () => {
    try {
      const [groupResponse, expensesResponse, balancesResponse] = await Promise.all([
        groupsAPI.getGroup(id),
        expensesAPI.getExpenses(id),
        expensesAPI.getGroupBalances(id)
      ])

      setGroup(groupResponse.data.data.group)
      setExpenses(expensesResponse.data.data.expenses || [])
      setBalances(balancesResponse.data.data)
    } catch (error) {
      console.error('Error fetching group data:', error)
      toast.error('Failed to load group data')
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

  if (!group) {
    return (
      <div className="container" style={{ padding: '32px 20px' }}>
        <div className="text-center">
          <h1>Group not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '32px 20px' }}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">{group.name}</h1>
        {group.description && <p className="text-gray-600">{group.description}</p>}
      </div>

      <div className="grid grid-2 gap-6">
        {/* Balances Section */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Balances</h2>
          
          {balances.youOwe.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-red-600 mb-2">You owe:</h3>
              {balances.youOwe.map((item, index) => (
                <div key={index} className="balance-item owe">
                  <span className="balance-user">{item.to}</span>
                  <span className="balance-amount">${item.amount}</span>
                </div>
              ))}
            </div>
          )}

          {balances.youAreOwed.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-green-600 mb-2">You are owed:</h3>
              {balances.youAreOwed.map((item, index) => (
                <div key={index} className="balance-item owed">
                  <span className="balance-user">{item.from}</span>
                  <span className="balance-amount">${item.amount}</span>
                </div>
              ))}
            </div>
          )}

          {balances.youOwe.length === 0 && balances.youAreOwed.length === 0 && (
            <p className="text-gray-500 text-center py-4">All settled up!</p>
          )}
        </div>

        {/* Recent Expenses */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Recent Expenses</h2>
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No expenses yet</p>
          ) : (
            <div className="space-y-3">
              {expenses.slice(0, 5).map((expense) => (
                <div key={expense._id} className="expense-item">
                  <div className="expense-info">
                    <div className="expense-title">{expense.description}</div>
                    <div className="expense-details">
                      {expense.category} • Added by {expense.createdBy?.name}
                    </div>
                  </div>
                  <div className="expense-amount">${expense.amount}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default GroupDetail