import React, { useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import {useActivity} from '../context/activityContext'
import './styles/group.css';
const CreateGroup =({onClose,currentUser})=>{
  const navigate=useNavigate();
  const {addActivity}=useActivity()
  const [name,setName]=useState('');
  const [type,setType]=useState('');
  const [groupId,setGroupId]=useState('');
  const [groupCreated,setGroupCreated]=useState(false);
  const [query,setquery]=useState('');
  const [results,setresults]=useState([]);
  const [members,setmembers]=useState([]);
  const handleCreateGroup=async()=>{
    if (!name||!type) return alert('Please enter group name and select a type.');
    try {
      const res= await api.post('/groups/create', { name, type });
      setGroupId(res.data.data.group._id);
    addActivity(`You created the group "${name}"`);
      setGroupCreated(true);
    } catch (err) {
      console.error('Create group failed:', err);
      alert('Failed to create group');
    }
  };
  const handleSearch=async()=>{
    try {
      const res=await api.get(`/friend/search?name=${query}`);
      const users=res.data.data.users || [];
      const onlyFriends = users.filter((u) => u.status === 'friend');
      setresults(onlyFriends);
    } catch (err){
      console.error('Search failed', err);
    }
  };
  const addUser = async (user) => {
    if (members.some((u) => u._id === user._id)) return;
    try {
      await api.post(`/groups/${groupId}/add-member`, { friendId: user._id });
      setmembers((prev) => [...prev, user]);
    } catch (err) {
      console.error('Add member failed', err);
      alert(err.response?.data?.message || 'Error adding member');
    }
  };
  const removeUser=async (userId) => {
    try {
      await api.post(`/groups/${groupId}/remove-member`, { memberId: userId });
      setmembers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error('Remove failed', err);
    }
  };
  const handleGoToGroup = () => {
   navigate(`/groups/${groupId}`);
  };
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>
        <h2>Create a Group</h2>
        {!groupCreated && (
          <>
            <input type="text" placeholder="Group Name" value={name} onChange={(e) => setName(e.target.value)} className="input-box" />
            <div className="type-buttons">
              {['Travel', 'Home', 'Couple', 'Other'].map((t) => (
                <button key={t} className={`type-btn ${type === t ? 'selected' : ''}`} onClick={() => setType(t)}>  {t}</button>
              ))}
            </div>
            <button className="create-btn" onClick={handleCreateGroup}>
              Create Group
            </button>
          </>
        )} {groupCreated && (
          <> <p className="group-success">✅ Group created: <strong>{name}</strong> ({type})</p>
            <input type="text" placeholder="Search friends"value={query} onChange={(e) => setquery(e.target.value)} onKeyUp={handleSearch}className="input-box"
            />
            <div className="search-results">
              {results.length===0?(
                <p>No friends found</p>
              ):(
               results.map((user)=>(
                  <div key={user._id} className={`search-item ${members.some(u => u._id === user._id) ? 'added' : ''}`} onClick={()=>addUser(user)}  >
                    <span>{user.name}({user.email})</span>
                    {members.some(u=>u._id===user._id)&&<span className="added-text">✔ Added</span>}
                  </div>
                ))
              )}
            </div>
            <div className="selected-members">
              {members.map((user)=>(
                <div key={user._id}className="tag">
                  {user.name}
                  <span className="remove-tag" onClick={() => removeUser(user._id)}>✖</span>
                </div>
              ))}
            </div>
            {members.length>0&&(
              <button className="view-group-btn" onClick={handleGoToGroup}>
                ➤ Go to Group Page
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default CreateGroup;
