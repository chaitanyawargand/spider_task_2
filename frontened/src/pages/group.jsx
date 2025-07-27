import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import './styles/group.css';
import CreateGroup from '../components/createGroup';

const Group = () => {
  const [group, setGroup] = useState([]);
  const [addGroup, setAddGroup] = useState(false);
  const [currentUser, setCurrentUser] = useState('');

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get('/users/me');
      setCurrentUser(res.data.data.user);
    } catch (err) {
      console.log('Failed to fetch current user:', err);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await api.get('/groups/my-groups');
      setGroup(res.data.data.groups);
    } catch (err) {
      console.log('Failed to fetch groups:', err);
    }
  };
  useEffect(() => {
    fetchCurrentUser();
    fetchGroups();
  }, []);
  return (
    <div className="groups-page">
      <h1 className="page-title">My Groups</h1>
      <div className="groups-main">
        <div className="groups-list">
          {group.map((group) => (
            <Link key={group._id} to={`/groups/${group._id}`} className="group-card">
              <div className="avatar">{group.name.charAt(0)}</div>
              <div className="group-name">{group.name}</div>
            </Link>
          ))}
        </div>
      </div>
      {addGroup && (
        <CreateGroup onClose={() => setAddGroup(false)} currentUser={currentUser} />
      )}
      <button className="fab-button" onClick={() => setAddGroup(true)}>+</button>
    </div>
  );
};

export default Group;
