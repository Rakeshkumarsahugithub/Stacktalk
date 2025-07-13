import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { useState } from 'react';

function Navbar() {
  const { username, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };
  if (!username) return null;

  return (
    <header className="navbar-header">
      <nav className="navbar-inner">
        <Link to="/questions" className="navbar-brand">StackTalk</Link>
        <ul className="navbar-desktop-nav">
          <li><Link to="/questions" className={`navbar-link${isActive('/questions') ? ' active' : ''}`}>All Questions</Link></li>
          <li><Link to="/ask" className={`navbar-link${isActive('/ask') ? ' active' : ''}`}>Ask Question</Link></li>
          <li><Link to="/my-questions" className={`navbar-link${isActive('/my-questions') ? ' active' : ''}`}>My Questions</Link></li>
          <li className="navbar-welcome">Welcome, <span>{username}</span></li>
          <li><button onClick={handleLogout} className="navbar-logout">Logout</button></li>
        </ul>
        {/* Hamburger (Mobile Only) */}
        <button className="navbar-hamburger" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open menu">
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
      </nav>
      {/* Mobile Menu Overlay & Slider */}
      {isMobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu-panel">
            <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">&times;</button>
            <ul className="mobile-menu-list">
              <li><Link to="/questions" className={`mobile-menu-link${isActive('/questions') ? ' active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>All Questions</Link></li>
              <li><Link to="/ask" className={`mobile-menu-link${isActive('/ask') ? ' active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Ask Question</Link></li>
              <li><Link to="/my-questions" className={`mobile-menu-link${isActive('/my-questions') ? ' active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>My Questions</Link></li>
              <li className="mobile-menu-divider"></li>
              <li className="mobile-menu-user">Welcome, <span>{username}</span></li>
              <li><button onClick={handleLogout} className="mobile-menu-logout">Logout</button></li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar; 