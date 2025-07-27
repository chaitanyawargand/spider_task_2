import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import FriendsPage from './pages/Frined';
import Group from './pages/group';
import Navbar from './components/Navbar';
import GroupInfo from './pages/GroupInfo';
import ActivityPage from './pages/ActivityPage';
import Profile from './pages/profile';
const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/friend" element={<FriendsPage />} />
        <Route path="/groups" element={<Group />} />
        <Route path="/groups/:groupId" element={<GroupInfo />} />
        <Route path="/activities" element={<ActivityPage/>}/>
        <Route path="/profile" element={<Profile />}/>
      </Routes>
    </>
  );
};

export default App;
