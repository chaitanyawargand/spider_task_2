import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/dashboard" className="navbar-brand">
          BillSplit
        </Link>

        <ul className="navbar-nav">
          <li>
            <Link 
              to="/dashboard" 
              className={isActive('/dashboard') ? 'active' : ''}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/groups" 
              className={isActive('/groups') ? 'active' : ''}
            >
              Groups
            </Link>
          </li>
          <li>
            <Link 
              to="/friends" 
              className={isActive('/friends') ? 'active' : ''}
            >
              Friends
            </Link>
          </li>
        </ul>

        <div className="navbar-user">
          <Link to="/profile">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </Link>
          <button onClick={logout} className="btn btn-secondary btn-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar