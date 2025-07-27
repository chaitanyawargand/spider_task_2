import React, { useEffect, useState } from "react";
import api from "../api";
import "./styles/friend.css";

const FriendsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [requestsReceived, setRequestsReceived] = useState([]);

  const fetchFriends = async () => {
    const res = await api.get("/friend/Myfriends");
    setFriends(res.data.data.friends || []);
  };

  const fetchSearchResults = async () => {
    const res = await api.get(`/friend/search?name=${searchTerm}`);
    const all = res.data.data.users || [];
    setUsers(all);
    const received = all.filter((u) => u.status === "request_received");
    setRequestsReceived(received);
  };
  useEffect(() => {
    fetchFriends();
    fetchSearchResults();
  }, [searchTerm]);
  const handleAction = async (id, action) => {
    try {
      if (action === "send") {
        await api.post(`/friend/send-request/${id}`);
      } else if (action === "accept") {
        await api.post(`/friend/accept-request/${id}`);
      } else if (action === "reject") {
        await api.post(`/friend/reject-request/${id}`);
      } else if (action === "remove") {
        await api.delete(`/friend/remove-friend/${id}`);
      }
      fetchFriends();
      fetchSearchResults();
    } catch (err) {
      console.error(`Error performing ${action} action:`, err);
    }
  };
return (
  <div className="friends-page">
    <h1 className="page-title">My Friends</h1>

    <div className="friends-main">
      <div className="friends-list">
        {friends.map((friend) => (
          <div className="friend-card" key={friend._id}>
            <div className="avatar">{friend.name.charAt(0)}</div>
            <div className="friend-name">{friend.name}</div>
            <div className="friend-badge">Friend ✅</div>
          </div>
        ))}
      </div>

      <div className="friends-sidebar">
        <div className="search-box">
          <h3>Find New Friends</h3>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name"
          />
          <div className="user-list">
            {users
              .filter((u) => u.status !== "friend")
              .map((user) => (
                <div className="user-result" key={user._id}>
                  <span>{user.name}</span>
                  {user.status === "not_friend" && (
                    <button onClick={() => handleAction(user._id, "send")}>
                      Send Request
                    </button>
                  )}
                  {user.status === "request_sent" && (
                    <button className="disabled" disabled>
                      Request Sent
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>

        <div className="requests-box">
          <h3>Friend Requests</h3>
          {requestsReceived.length === 0 ? (
            <p>No requests yet.</p>
          ) : (
            requestsReceived.map((user) => (
              <div className="user-result" key={user._id}>
                <span>{user.name}</span>
                <button onClick={() => handleAction(user._id, "accept")}>
                  Accept
                </button>
                <button onClick={() => handleAction(user._id, "reject")}>
                  Reject
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);
};
export default FriendsPage;
