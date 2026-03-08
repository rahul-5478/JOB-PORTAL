import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const STUDENT_LINKS = [
  { icon: '🏠', label: 'Home',            path: '/' },
  { icon: '🔍', label: 'Find Jobs',       path: '/real-jobs' },
  { icon: '💼', label: 'My Applications', path: '/student/applications' },
  { icon: '🎯', label: 'AI Matches',      path: '/student/ai-matches' },
  { icon: '📄', label: 'Resume Builder',  path: '/student/resume-builder' },
  { icon: '📊', label: 'Resume Analyzer', path: '/student/resume-analyzer' },
  { icon: '💰', label: 'Salary Predictor',path: '/student/salary-predictor' },
  { icon: '🏆', label: 'Skill Test',      path: '/student/skill-assessment' },
  { icon: '📅', label: 'Interviews',      path: '/student/interviews' },
  { icon: '🤖', label: 'AI Chatbot',      path: '/ai-chatbot' },
  { icon: '🏢', label: 'Companies',       path: '/companies' },
  { icon: '💎', label: 'Pricing',         path: '/pricing' },
];

const COMPANY_LINKS = [
  { icon: '🏠', label: 'Home',          path: '/' },
  { icon: '📊', label: 'Dashboard',     path: '/company/dashboard' },
  { icon: '➕', label: 'Post Job',      path: '/company/post-job' },
  { icon: '📋', label: 'Applications',  path: '/company/applications' },
  { icon: '👤', label: 'Profile',       path: '/company/profile' },
  { icon: '🤖', label: 'AI Chatbot',    path: '/ai-chatbot' },
  { icon: '💎', label: 'Pricing',       path: '/pricing' },
];

const PUBLIC_LINKS = [
  { icon: '🏠', label: 'Home',      path: '/' },
  { icon: '🔍', label: 'Jobs',      path: '/jobs' },
  { icon: '🌐', label: 'Live Jobs', path: '/real-jobs' },
  { icon: '🏢', label: 'Companies', path: '/companies' },
  { icon: '🤖', label: 'AI Chat',   path: '/ai-chatbot' },
  { icon: '💎', label: 'Pricing',   path: '/pricing' },
  { icon: '📞', label: 'Contact',   path: '/contact' },
];

export default function SideDrawer({ open, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const links = user?.role === 'student' ? STUDENT_LINKS
              : user?.role === 'company' ? COMPANY_LINKS
              : PUBLIC_LINKS;

  const name = user?.name || user?.companyName || 'Guest';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  const handleLogout = () => { logout(); onClose(); navigate('/login'); };

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        zIndex: 9998, opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity 0.3s ease',
        backdropFilter: 'blur(4px)',
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: 280,
        background: '#09090f', borderRight: '1px solid #1a1a2e',
        zIndex: 9999,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.32s cubic-bezier(0.32,0,0.67,0)',
        display: 'flex', flexDirection: 'column', overflowY: 'auto',
      }}>
        <style>{`
          .dlink{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:12px;text-decoration:none;color:#666;font-size:13px;font-family:'Sora',sans-serif;transition:all 0.18s;margin-bottom:2px}
          .dlink:hover,.dlink.active{background:#f9731618;color:#f97316}
          .dlink.active{border-left:3px solid #f97316;padding-left:11px}
          .dicon{width:34px;height:34px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;background:#ffffff08;flex-shrink:0}
          .dlink.active .dicon,.dlink:hover .dicon{background:#f9731622}
        `}</style>

        {/* Header */}
        <div style={{ padding: '44px 18px 18px', borderBottom: '1px solid #1a1a2e', position: 'relative' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, background: '#1a1a2e', border: '1px solid #2a2a4a', color: '#888', width: 34, height: 34, borderRadius: 10, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

          {/* App Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <div style={{ width: 42, height: 42, borderRadius: 13, background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⚡</div>
            <div>
              <p style={{ margin: 0, fontWeight: 900, fontSize: 18, fontFamily: "'Sora',sans-serif" }}>
                <span style={{ color: '#fff' }}>Hire</span><span style={{ color: '#f97316' }}>AI</span>
              </p>
              <p style={{ margin: 0, color: '#444', fontSize: 10 }}>AI Powered Jobs</p>
            </div>
          </div>

          {/* User */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0d0d1f', border: '1px solid #1e1e2e', borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff', fontSize: 15, flexShrink: 0 }}>{initials}</div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: '0 0 1px', color: '#fff', fontSize: 13, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</p>
                <p style={{ margin: 0, color: '#555', fontSize: 10, textTransform: 'capitalize' }}>{user.role} Account</p>
              </div>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/login" onClick={onClose} style={{ flex: 1, textAlign: 'center', background: '#0d0d1f', border: '1px solid #2a2a4a', color: '#ccc', padding: '10px', borderRadius: 10, fontSize: 13, textDecoration: 'none', fontFamily: "'Sora',sans-serif" }}>Login</Link>
              <Link to="/register" onClick={onClose} style={{ flex: 1, textAlign: 'center', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: "'Sora',sans-serif" }}>Sign Up</Link>
            </div>
          )}
        </div>

        {/* Dashboard shortcut */}
        {user && (
          <div style={{ padding: '10px 14px 0' }}>
            <Link to={user.role === 'student' ? '/student/dashboard' : '/company/dashboard'} onClick={onClose}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg,#1a0800,#0a0514)', border: '1px solid #f9731633', borderRadius: 12, padding: '11px 14px', textDecoration: 'none', marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>📊</span>
              <span style={{ color: '#f97316', fontSize: 13, fontWeight: 700 }}>My Dashboard</span>
              <span style={{ marginLeft: 'auto', color: '#f97316' }}>→</span>
            </Link>
          </div>
        )}

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '10px 14px' }}>
          <p style={{ color: '#2a2a4a', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', fontWeight: 700, margin: '6px 0 8px 4px', fontFamily: "'Sora',sans-serif" }}>MENU</p>
          {links.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} onClick={onClose} className={`dlink${isActive ? ' active' : ''}`}>
                <span className="dicon">{link.icon}</span>
                <span>{link.label}</span>
                {isActive && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#f97316' }} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '14px', borderTop: '1px solid #1a1a2e' }}>
          {user ? (
            <button onClick={handleLogout} style={{ width: '100%', background: '#1a0808', border: '1px solid #ef444433', color: '#ef4444', padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Sora',sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8" }}>
              🚪 Logout
            </button>
          ) : (
            <p style={{ textAlign: 'center', color: '#2a2a4a', fontSize: 11, margin: 0 }}>HireAI v1.0</p>
          )}
        </div>
      </div>
    </>
  );
}