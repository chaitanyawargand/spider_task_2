import { useState, useEffect } from 'react'
import { friendsAPI } from '../utils/api'
import { toast } from 'react-toastify'

const Friends = () => {
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetchFriendsData()
  }, [])

  const fetchFriendsData = async () => {
    try {
      const [friendsResponse, requestsResponse] = await Promise.all([
        friendsAPI.getFriends(),
        friendsAPI.getFriendRequests()
      ])
      
      setFriends(friendsResponse.data.data.friends || [])
      setFriendRequests(requestsResponse.data.data.friendRequests || [])
    } catch (error) {
      console.error('Error fetching friends data:', error)
      toast.error('Failed to load friends data')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) return
    
    setSearching(true)
    try {
      const response = await friendsAPI.searchUsers(searchTerm)
      setSearchResults(response.data.data.users || [])
    } catch (error) {
      console.error('Error searching users:', error)
      toast.error('Search failed')
    } finally {
      setSearching(false)
    }
  }

  const sendFriendRequest = async (userId) => {
    try {
      await friendsAPI.sendFriendRequest(userId)
      toast.success('Friend request sent!')
      setSearchResults(searchResults.filter(user => user._id !== userId))
    } catch (error) {
      console.error('Error sending friend request:', error)
      toast.error('Failed to send friend request')
    }
  }

  const respondToRequest = async (requestId, response) => {
    try {
      await friendsAPI.respondToFriendRequest(requestId, response)
      toast.success(`Friend request ${response}!`)
      fetchFriendsData()
    } catch (error) {
      console.error('Error responding to friend request:', error)
      toast.error('Failed to respond to friend request')
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
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Friends</h1>
        <p className="text-gray-600">Manage your friends and connections</p>
      </div>

      {/* Search Section */}
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Find Friends</h2>
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={searching}
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-3">Search Results</h3>
            <div className="space-y-2">
              {searchResults.map((user) => (
                <div key={user._id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </div>
                  <button
                    onClick={() => sendFriendRequest(user._id)}
                    className="btn btn-primary btn-sm"
                  >
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-2 gap-6">
        {/* Friend Requests */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
          {friendRequests.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {friendRequests.map((request) => (
                <div key={request._id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{request.from.name}</div>
                      <div className="text-sm text-gray-600">{request.from.email}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => respondToRequest(request._id, 'accepted')}
                        className="btn btn-success btn-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => respondToRequest(request._id, 'rejected')}
                        className="btn btn-danger btn-sm"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Friends */}
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">My Friends ({friends.length})</h2>
          {friends.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No friends yet</p>
          ) : (
            <div className="space-y-3">
              {friends.map((friend) => (
                <div key={friend._id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold">{friend.name}</div>
                      <div className="text-sm text-gray-600">{friend.email}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Friends