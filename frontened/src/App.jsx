import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Groups from './pages/Groups'
import GroupDetail from './pages/GroupDetail'
import Friends from './pages/Friends'
import Profile from './pages/Profile'
import './App.css'

function App() {
  const { user } = useAuth()

  return (
    <div className="App">
      {user && <Navbar />}
      <main className={user ? 'main-content' : 'auth-content'}>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/groups" element={user ? <Groups /> : <Navigate to="/login" />} />
          <Route path="/groups/:id" element={user ? <GroupDetail /> : <Navigate to="/login" />} />
          <Route path="/friends" element={user ? <Friends /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App