import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { groupsAPI } from '../utils/api'
import { toast } from 'react-toastify'

const Groups = () => {
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newGroup, setNewGroup] = useState({ name: '', description: '' })
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await groupsAPI.getGroups()
      setGroups(response.data.data.groups || [])
    } catch (error) {
      console.error('Error fetching groups:', error)
      toast.error('Failed to load groups')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateGroup = async (e) => {
    e.preventDefault()
    setCreating(true)
    
    try {
      await groupsAPI.createGroup(newGroup.name, newGroup.description)
      toast.success('Group created successfully!')
      setShowCreateModal(false)
      setNewGroup({ name: '', description: '' })
      fetchGroups()
    } catch (error) {
      console.error('Error creating group:', error)
      toast.error('Failed to create group')
    } finally {
      setCreating(false)
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
    <div className="container" style={{ padding: '32px 20px' }}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Groups</h1>
          <p className="text-gray-600">Manage your expense groups</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          Create Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-500 mb-4">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
            <p className="text-gray-500">Create your first group to start splitting expenses with friends</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Create Your First Group
          </button>
        </div>
      ) : (
        <div className="grid grid-3 gap-6">
          {groups.map((group) => (
            <Link key={group._id} to={`/groups/${group._id}`}>
              <div className="group-card">
                <div className="group-card-header">
                  <h3 className="group-card-title">{group.name}</h3>
                  {group.description && (
                    <p className="group-card-description">{group.description}</p>
                  )}
                </div>
                <div className="group-card-body">
                  <div className="group-members">
                    {group.members?.slice(0, 4).map((member, index) => (
                      <div key={member._id} className="member-avatar">
                        {member.name?.charAt(0)?.toUpperCase()}
                      </div>
                    ))}
                    {group.members?.length > 4 && (
                      <div className="member-avatar">
                        +{group.members.length - 4}
                      </div>
                    )}
                  </div>
                  <div className="group-stats">
                    <span>{group.members?.length || 0} members</span>
                    <span>Created by {group.createdBy?.name}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Create New Group</h2>
              <button 
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleCreateGroup}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Group Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    required
                    placeholder="Enter group name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description (Optional)</label>
                  <textarea
                    className="form-control"
                    value={newGroup.description}
                    onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                    placeholder="Describe your group"
                    rows="3"
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Groups