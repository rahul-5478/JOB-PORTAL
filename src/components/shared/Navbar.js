import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, LogOut, User, LayoutDashboard, ChevronDown, Sparkles, Building2 } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="nav-logo">
          <Briefcase size={22} color="var(--primary)" />
          <span>Hire</span>AI
        </Link>

        <div className="nav-links">
          <Link className={`nav-link ${isActive('/jobs') ? 'active' : ''}`} to="/jobs">Jobs</Link>
          <Link className={`nav-link ${isActive('/companies') ? 'active' : ''}`} to="/companies">Companies</Link>

          {user ? (
            <div className="nav-user-menu" ref={menuRef}>
              <div onClick={() => setMenuOpen(!menuOpen)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '6px 10px', borderRadius: 10, background: menuOpen ? 'var(--bg3)' : 'transparent' }}>
                {user.avatar
                  ? <img src={user.avatar} alt="" className="nav-avatar" />
                  : <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>{user.name[0]}</div>
                }
                <span style={{ fontSize: '0.875rem', fontWeight: 600, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</span>
                <ChevronDown size={14} color="var(--text2)" />
              </div>

              {menuOpen && (
                <div className="nav-dropdown animate-fade">
                  {user.role === 'student' && <>
                    <div className="nav-dropdown-item" onClick={() => { navigate('/student/dashboard'); setMenuOpen(false); }}>
                      <LayoutDashboard size={16} /> Dashboard
                    </div>
                    <div className="nav-dropdown-item" onClick={() => { navigate('/student/profile'); setMenuOpen(false); }}>
                      <User size={16} /> My Profile
                    </div>
                    <div className="nav-dropdown-item" onClick={() => { navigate('/student/applications'); setMenuOpen(false); }}>
                      <Briefcase size={16} /> Applications
                    </div>
                    <div className="nav-dropdown-item" onClick={() => { navigate('/student/ai-matches'); setMenuOpen(false); }}>
                      <Sparkles size={16} /> AI Matches
                    </div>
                  </>}
                  {user.role === 'company' && <>
                    <div className="nav-dropdown-item" onClick={() => { navigate('/company/dashboard'); setMenuOpen(false); }}>
                      <LayoutDashboard size={16} /> Dashboard
                    </div>
                    <div className="nav-dropdown-item" onClick={() => { navigate('/company/profile'); setMenuOpen(false); }}>
                      <Building2 size={16} /> Company Profile
                    </div>
                    <div className="nav-dropdown-item" onClick={() => { navigate('/company/jobs'); setMenuOpen(false); }}>
                      <Briefcase size={16} /> Manage Jobs
                    </div>
                  </>}
                  <div className="divider" style={{ margin: '8px 0' }} />
                  <div className="nav-dropdown-item danger" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
