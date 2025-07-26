import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as groupService from '../services/groupService';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const response = await groupService.getMyGroups();
      setGroups(response.data.data.groups);
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await groupService.createGroup(formData);
      toast.success('Group created successfully!');
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      fetchGroups();
    } catch (error) {
      console.error('Failed to create group:', error);
      toast.error(error.response?.data?.message || 'Failed to create group');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGroup = async (groupId, groupName) => {
    if (!window.confirm(`Are you sure you want to delete "${groupName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await groupService.deleteGroup(groupId);
      toast.success('Group deleted successfully');
      fetchGroups();
    } catch (error) {
      console.error('Failed to delete group:', error);
      toast.error(error.response?.data?.message || 'Failed to delete group');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            Your Groups
          </h1>
          <p style={{ color: '#6b7280' }}>
            Manage your bill splitting groups
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
        >
          ➕ Create New Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <h2 style={{ marginBottom: '16px', color: '#6b7280' }}>No groups yet</h2>
          <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
            Create your first group to start splitting bills with friends
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Create Your First Group
          </button>
        </div>
      ) : (
        <div className="grid grid-2">
          {groups.map((group) => (
            <div key={group._id} className="card">
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ marginBottom: '8px' }}>
                  <Link 
                    to={`/groups/${group._id}`}
                    style={{ textDecoration: 'none', color: '#1a202c' }}
                  >
                    {group.name}
                  </Link>
                </h3>
                <p style={{ color: '#6b7280', marginBottom: '12px' }}>
                  {group.description || 'No description provided'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="badge badge-primary">
                    👥 {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>
                    Created {new Date(group.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <Link 
                  to={`/groups/${group._id}`}
                  className="btn btn-primary"
                  style={{ flex: 1, textDecoration: 'none', textAlign: 'center' }}
                >
                  View Details
                </Link>
                <button 
                  onClick={() => handleDeleteGroup(group._id, group.name)}
                  className="btn btn-danger"
                  style={{ padding: '8px 12px' }}
                  title="Delete Group"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Group"
      >
        <form onSubmit={handleCreateGroup}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Group Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter group name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter group description"
              rows="3"
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              type="button"
              onClick={() => setShowCreateModal(false)}
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
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Groups;