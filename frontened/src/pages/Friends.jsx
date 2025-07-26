import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as friendService from '../services/friendService';
import LoadingSpinner from '../components/LoadingSpinner';
import Modal from '../components/Modal';

function Friends() {
  const [friends, setFriends] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setIsLoading(true);
      const response = await friendService.getFriends();
      setFriends(response.data.data.friends);
    } catch (error) {
      console.error('Failed to fetch friends:', error);
      toast.error('Failed to load friends');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setIsSearching(true);
    try {
      const response = await friendService.searchUsers(searchTerm);
      setSearchResults(response.data.data.users);
    } catch (error) {
      console.error('Search failed:', error);
      toast.error('Search failed');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddFriend = async (userId, userName) => {
    try {
      await friendService.addFriend(userId);
      toast.success(`Added ${userName} as a friend!`);
      setShowSearchModal(false);
      setSearchTerm('');
      setSearchResults([]);
      fetchFriends();
    } catch (error) {
      console.error('Failed to add friend:', error);
      toast.error(error.response?.data?.message || 'Failed to add friend');
    }
  };

  const handleRemoveFriend = async (userId, userName) => {
    if (!window.confirm(`Remove ${userName} from your friends?`)) {
      return;
    }

    try {
      await friendService.removeFriend(userId);
      toast.success(`Removed ${userName} from friends`);
      fetchFriends();
    } catch (error) {
      console.error('Failed to remove friend:', error);
      toast.error(error.response?.data?.message || 'Failed to remove friend');
    }
  };

  const isAlreadyFriend = (userId) => {
    return friends.some(friend => friend._id === userId);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container" style={{ paddingTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
            Your Friends
          </h1>
          <p style={{ color: '#6b7280' }}>
            Manage your friends to add them to groups
          </p>
        </div>
        <button 
          onClick={() => setShowSearchModal(true)}
          className="btn btn-primary"
        >
          👥 Add Friend
        </button>
      </div>

      {friends.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
          <h2 style={{ marginBottom: '16px', color: '#6b7280' }}>No friends yet</h2>
          <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
            Search for users and add them as friends to start splitting bills together
          </p>
          <button 
            onClick={() => setShowSearchModal(true)}
            className="btn btn-primary"
          >
            Find Your First Friend
          </button>
        </div>
      ) : (
        <div className="grid grid-2">
          {friends.map((friend) => (
            <div key={friend._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: '8px', fontSize: '20px' }}>
                    {friend.name}
                  </h3>
                  <p style={{ color: '#6b7280', marginBottom: '16px' }}>
                    {friend.email}
                  </p>
                  <span className="badge badge-success">
                    ✓ Friend
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFriend(friend._id, friend.name)}
                  className="btn btn-danger"
                  style={{ padding: '6px 12px', fontSize: '12px' }}
                  title="Remove friend"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search Modal */}
      <Modal
        isOpen={showSearchModal}
        onClose={() => {
          setShowSearchModal(false);
          setSearchTerm('');
          setSearchResults([]);
        }}
        title="Add New Friend"
      >
        <form onSubmit={handleSearch} style={{ marginBottom: '24px' }}>
          <div className="form-group">
            <label htmlFor="search" className="form-label">
              Search by name or email
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              placeholder="Enter name or email to search"
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ width: '100%' }}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>Search Results</h3>
            {searchResults.map((user) => (
              <div key={user._id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginBottom: '8px'
              }}>
                <div>
                  <span style={{ fontWeight: '500', display: 'block' }}>
                    {user.name}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '14px' }}>
                    {user.email}
                  </span>
                </div>
                
                {isAlreadyFriend(user._id) ? (
                  <span className="badge badge-success">Already a friend</span>
                ) : (
                  <button
                    onClick={() => handleAddFriend(user._id, user.name)}
                    className="btn btn-primary"
                    style={{ padding: '6px 12px', fontSize: '14px' }}
                  >
                    Add Friend
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {searchTerm && searchResults.length === 0 && !isSearching && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: '#6b7280' }}>
              No users found matching "{searchTerm}"
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Friends;