import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SideDrawer from './SideDrawer';

export default function AppNavbar() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setDrawerOpen(false); }, [location.pathname]);

  const getTitle = () => {
    const p = location.pathname;
    if (p === '/') return null;
    if (p.includes('dashboard')) return 'Dashboard';
    if (p.includes('real-jobs')) return 'Live Jobs';
    if (p.includes('ai-chatbot')) return 'AI Assistant';
    if (p.includes('applications')) return 'Applications';
    if (p.includes('resume-builder')) return 'Resume Builder';
    if (p.includes('resume-analyzer')) return 'Resume Analyzer';
    if (p.includes('salary-predictor')) return 'Salary Predictor';
    if (p.includes('ai-matches')) return 'AI Matches';
    if (p.includes('skill-assessment')) return 'Skill Test';
    if (p.includes('interviews')) return 'Interviews';
    if (p.includes('companies')) return 'Companies';
    if (p.includes('jobs')) return 'Jobs';
    if (p.includes('pricing')) return 'Pricing';
    if (p.includes('profile')) return 'Profile';
    if (p.includes('post-job')) return 'Post Job';
    if (p.includes('contact')) return 'Contact';
    if (p.includes('login')) return 'Sign In';
    if (p.includes('register')) return 'Sign Up';
    return 'HireAI';
  };

  const isHome = location.pathname === '/';
  const title = getTitle();

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 1000,
        background: scrolled ? 'rgba(7,7,15,0.97)' : '#07070f',
        borderBottom: '1px solid #1a1a2e',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.3s ease',
        fontFamily: "'Sora',sans-serif",
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>

          {/* Left */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Hamburger */}
            <button onClick={() => setDrawerOpen(true)} style={{ width: 38, height: 38, borderRadius: 11, background: '#0d0d1f', border: '1px solid #2a2a4a', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, flexShrink: 0 }}>
              <span style={{ width: 16, height: 2, background: '#ccc', borderRadius: 1, display: 'block' }} />
              <span style={{ width: 12, height: 2, background: '#f97316', borderRadius: 1, display: 'block' }} />
              <span style={{ width: 16, height: 2, background: '#ccc', borderRadius: 1, display: 'block' }} />
            </button>

            {/* Logo or Page Title */}
            {isHome ? (
              <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
                <span style={{ fontWeight: 900, fontSize: 18 }}>
                  <span style={{ color: '#fff' }}>Hire</span><span style={{ color: '#f97316' }}>AI</span>
                </span>
              </Link>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 20, padding: '4px 6px', display: 'flex', alignItems: 'center' }}>←</button>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{title}</span>
              </div>
            )}
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button onClick={() => navigate('/real-jobs')} style={{ width: 36, height: 36, borderRadius: 10, background: '#0d0d1f', border: '1px solid #2a2a4a', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔍</button>
            {user && (
              <button onClick={() => navigate('/notifications')} style={{ width: 36, height: 36, borderRadius: 10, background: '#0d0d1f', border: '1px solid #2a2a4a', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                🔔
                <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: '#f97316', border: '2px solid #07070f' }} />
              </button>
            )}
            {user ? (
              <button onClick={() => navigate(user.role === 'student' ? '/student/dashboard' : '/company/dashboard')}
                style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#f97316,#ea580c)', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {(user.name || user.companyName || 'U')[0].toUpperCase()}
              </button>
            ) : (
              <Link to="/login" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', padding: '8px 14px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>Login</Link>
            )}
          </div>
        </div>

        {/* Bottom Tab Bar */}
        {user && (
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(7,7,15,0.97)', borderTop: '1px solid #1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '6px 0 10px', zIndex: 1000, backdropFilter: 'blur(20px)' }}>
            {(user?.role === 'student' ? [
              { icon: '🏠', label: 'Home',    path: '/' },
              { icon: '🔍', label: 'Jobs',    path: '/real-jobs' },
              { icon: '🎯', label: 'Matches', path: '/student/ai-matches' },
              { icon: '📋', label: 'Applied', path: '/student/applications' },
              { icon: '🤖', label: 'AI Chat', path: '/ai-chatbot' },
            ] : [
              { icon: '🏠', label: 'Home',    path: '/' },
              { icon: '➕', label: 'Post',    path: '/company/post-job' },
              { icon: '📋', label: 'Apps',    path: '/company/applications' },
              { icon: '🤖', label: 'AI Chat', path: '/ai-chatbot' },
              { icon: '👤', label: 'Profile', path: '/company/profile' },
            ]).map(tab => {
              const isActive = location.pathname === tab.path;
              return (
                <Link key={tab.path} to={tab.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, textDecoration: 'none', minWidth: 52, padding: '4px 8px', borderRadius: 12, background: isActive ? '#f9731618' : 'transparent', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: 20, filter: isActive ? 'none' : 'grayscale(0.5) opacity(0.5)' }}>{tab.icon}</span>
                  <span style={{ fontSize: 9, color: isActive ? '#f97316' : '#444', fontWeight: isActive ? 700 : 400, fontFamily: "'Sora',sans-serif" }}>{tab.label}</span>
                  {isActive && <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#f97316' }} />}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      <SideDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}