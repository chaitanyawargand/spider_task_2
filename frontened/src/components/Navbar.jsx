import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActiveLink = (path) => {
    return location.pathname === path ? 'navbar-link active' : 'navbar-link';
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            💰 SplitBill
          </Link>

          <div className="navbar-menu">
            <Link to="/dashboard" className={isActiveLink('/dashboard')}>
              Dashboard
            </Link>
            <Link to="/groups" className={isActiveLink('/groups')}>
              Groups
            </Link>
            <Link to="/friends" className={isActiveLink('/friends')}>
              Friends
            </Link>
            <Link to="/profile" className={isActiveLink('/profile')}>
              Profile
            </Link>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="navbar-link">
                👋 Hi, {user?.name}
              </span>
              <button 
                onClick={logout}
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '14px' }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;