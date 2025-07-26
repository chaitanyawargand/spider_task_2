import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FriendsPage from './pages/Friends';
import Group from './pages/group';
import Navbar from './components/navbar';
import GroupInfo from './pages/GroupInfo';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/friends" element={<FriendsPage />} />
        <Route path="/groups" element={<Group />} />
        <Route path="/groups/:groupId" element={<GroupInfo />} />
      </Routes>
    </> 
  );
};

export default App;