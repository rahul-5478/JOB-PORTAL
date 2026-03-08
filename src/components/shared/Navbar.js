import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const SERVICES = [
  { title: 'Resume Writing', links: [
    ['Text Resume', '/services/text-resume'],
    ['Visual Resume', '/services/visual-resume'],
    ['Resume Critique', '/services/resume-critique'],
  ]},
  { title: 'Find Jobs', links: [
    ['Jobs4u', '/services/jobs4u'],
    ['Priority Applicant', '/services/priority-applicant'],
  ]},
  { title: 'Contact Us', links: [
    ['Get Recruiter Attention', '/services/resume-display'],
    ['Resume Display', '/services/resume-display'],
    ['Monthly Plans', '/pricing'],
  ]},
  { title: 'Free Resources', links: [
    ['Resume Maker', '/student/resume-builder'],
    ['Resume Quality Score', '/student/resume-analyzer'],
    ['Resume Samples', '/services/visual-resume'],
    ['Job Letter Samples', '/services/resume-critique'],
  ]},
];

const COMPANIES = [
  { title: 'Explore Categories', links: [
    ['Unicorn', '/companies/category/unicorn'],
    ['MNC', '/companies/category/mnc'],
    ['Startup', '/companies/category/startup'],
    ['Product Based', '/companies/category/product-based'],
    ['Internet', '/companies/category/internet'],
  ]},
  { title: 'Explore Collections', links: [
    ['Top Companies', '/companies/category/top-companies'],
    ['IT Companies', '/companies/category/it-companies'],
    ['Fintech Companies', '/companies/category/fintech-companies'],
    ['All Companies', '/companies'],
  ]},
  { title: 'Research', links: [
    ['Interview Questions', '/student/skill-assessment'],
    ['Salary Calculator', '/student/salary-predictor'],
    ['Company Reviews', '/companies'],
  ]},
];

const JOBS = [
  { title: 'Jobs in Demand', links: [
    ['Fresher Jobs', '/jobs/category/fresher-jobs'],
    ['MNC Jobs', '/jobs/category/mnc-jobs'],
    ['Remote Jobs', '/jobs/category/remote-jobs'],
    ['Work from Home', '/jobs/category/work-from-home'],
    ['Walk-in Jobs', '/jobs/category/walk-in-jobs'],
    ['Part-time Jobs', '/jobs/category/part-time-jobs'],
  ]},
  { title: 'Jobs by Location', links: [
    ['Jobs in Delhi', '/jobs/category/delhi-jobs'],
    ['Jobs in Mumbai', '/jobs/category/mumbai-jobs'],
    ['Jobs in Bangalore', '/jobs/category/bangalore-jobs'],
    ['Jobs in Hyderabad', '/jobs/category/hyderabad-jobs'],
    ['Jobs in Chennai', '/jobs/category/chennai-jobs'],
    ['Jobs in Pune', '/jobs/category/pune-jobs'],
  ]},
  { title: 'Popular Categories', links: [
    ['IT Jobs', '/jobs/category/it-jobs'],
    ['Sales Jobs', '/jobs/category/sales-jobs'],
    ['Marketing Jobs', '/jobs/category/marketing-jobs'],
    ['Data Science Jobs', '/jobs/category/data-science-jobs'],
    ['HR Jobs', '/jobs/category/hr-jobs'],
    ['Engineering Jobs', '/jobs/category/engineering-jobs'],
  ]},
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(null);
  const [mob, setMob] = useState(false);
  const ref = useRef();

  // Close menu when clicking outside
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(null); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  // Close on route change
  useEffect(() => { setOpen(null); setMob(false); }, [location.pathname]);

  const MENUS = [
    { label: 'Services', key: 'services', data: SERVICES },
    { label: 'Companies', key: 'companies', data: COMPANIES },
    { label: 'Jobs', key: 'jobs', data: JOBS },
  ];

  return (
    <nav ref={ref} style={S.nav}>
      <style>{`
        .nlink:hover { color: #a78bfa !important; }
        .mlink:hover { color: #a78bfa !important; background: #13132a !important; border-radius: 6px; }
        .gbtn:hover { background: #1a1a3a !important; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div style={S.inner}>
        {/* Logo */}
        <Link to="/" style={S.logo}>
          <span>⚡</span>
          <span style={{ fontSize:20, fontWeight:800, color:'#fff' }}>
            Hire<span style={{ color:'#a78bfa' }}>AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={S.dLinks}>
          {MENUS.map(({ label, key, data }) => (
            <div key={key} style={{ position:'relative' }}>
              <button
                onClick={() => setOpen(open === key ? null : key)}
                style={{ ...S.ddBtn, color: open === key ? '#a78bfa' : '#ccc' }}
              >
                {label}
                <span style={{ fontSize:9, marginLeft:4, display:'inline-block', transform: open===key ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>▼</span>
              </button>

              {/* Mega Menu */}
              {open === key && (
                <div style={S.mega}>
                  <div style={S.megaGrid}>
                    {data.map(section => (
                      <div key={section.title}>
                        <p style={S.secTitle}>{section.title}</p>
                        {section.links.map(([label, path]) => (
                          <Link
                            key={label}
                            to={path}
                            className="mlink"
                            style={S.mlink}
                            onClick={() => setOpen(null)}
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <Link to="/jobs" className="nlink" style={S.nlink}>Browse Jobs</Link>
          <Link to="/companies" className="nlink" style={S.nlink}>Companies</Link>
          <Link to="/contact" className="nlink" style={S.nlink}>Contact</Link>
          <Link to="/pricing" className="nlink" style={{ ...S.nlink, color:'#a78bfa', fontWeight:600 }}>💎 Plans</Link>
        </div>

        {/* Auth Buttons Desktop */}
        <div style={S.authBtns}>
          {user ? (
            <>
              <Link to={`/${user.role}/dashboard`} style={S.dashBtn}>Dashboard</Link>
              <button className="gbtn" onClick={() => { logout(); navigate('/'); }} style={S.ghostBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="gbtn" style={S.ghostBtn}>Login</Link>
              <Link to="/register" style={S.regBtn}>Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMob(!mob)} style={S.hamburger}>
          {mob ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {mob && (
        <div style={S.mobMenu}>
          {MENUS.map(({ label, key, data }) => (
            <div key={key}>
              <button
                onClick={() => setOpen(open === key ? null : key)}
                style={S.mobItem}
              >
                {label} <span style={{ fontSize:10 }}>{open === key ? '▲' : '▼'}</span>
              </button>
              {open === key && (
                <div style={{ background:'#060614', paddingBottom:8 }}>
                  {data.map(section => (
                    <div key={section.title} style={{ paddingLeft:16 }}>
                      <p style={{ margin:'8px 0 4px', fontSize:11, color:'#444', textTransform:'uppercase', letterSpacing:1 }}>
                        {section.title}
                      </p>
                      {section.links.map(([lbl, path]) => (
                        <Link
                          key={lbl}
                          to={path}
                          style={{ display:'block', padding:'7px 16px', color:'#777', fontSize:13, textDecoration:'none' }}
                          onClick={() => { setOpen(null); setMob(false); }}
                        >
                          {lbl}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link to="/jobs" style={S.mobItem} onClick={() => setMob(false)}>Browse Jobs</Link>
          <Link to="/companies" style={S.mobItem} onClick={() => setMob(false)}>Companies</Link>
          <Link to="/contact" style={S.mobItem} onClick={() => setMob(false)}>Contact</Link>
          <Link to="/pricing" style={{ ...S.mobItem, color:'#a78bfa' }} onClick={() => setMob(false)}>💎 Plans</Link>

          <div style={{ display:'flex', gap:10, padding:'14px 16px' }}>
            {user ? (
              <>
                <Link to={`/${user.role}/dashboard`} style={{ ...S.regBtn, flex:1, textAlign:'center' }} onClick={() => setMob(false)}>Dashboard</Link>
                <button onClick={() => { logout(); navigate('/'); setMob(false); }} style={{ ...S.ghostBtn, flex:1 }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ ...S.ghostBtn, flex:1, textAlign:'center' }} onClick={() => setMob(false)}>Login</Link>
                <Link to="/register" style={{ ...S.regBtn, flex:1, textAlign:'center' }} onClick={() => setMob(false)}>Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

const S = {
  nav: { position:'sticky', top:0, zIndex:1000, background:'rgba(7,7,15,0.95)', backdropFilter:'blur(20px)', borderBottom:'1px solid #1a1a2e', fontFamily:"'Sora',sans-serif" },
  inner: { maxWidth:1280, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', gap:8 },
  logo: { display:'flex', alignItems:'center', gap:8, textDecoration:'none', marginRight:12, flexShrink:0 },
  dLinks: { display:'flex', alignItems:'center', gap:2, flex:1, '@media(max-width:900px)':{display:'none'} },
  ddBtn: { background:'none', border:'none', cursor:'pointer', padding:'8px 12px', fontSize:14, fontWeight:500, display:'flex', alignItems:'center', gap:4, fontFamily:"'Sora',sans-serif", borderRadius:8 },
  nlink: { textDecoration:'none', padding:'8px 12px', borderRadius:8, fontSize:14, fontWeight:500, color:'#ccc', transition:'color 0.2s' },
  mega: { position:'absolute', top:'calc(100% + 10px)', left:'50%', transform:'translateX(-50%)', background:'#0c0c1e', border:'1px solid #1e1e3a', borderRadius:16, padding:24, minWidth:580, boxShadow:'0 24px 60px rgba(0,0,0,0.8)', animation:'fadeIn 0.18s ease', zIndex:999 },
  megaGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:'20px 24px' },
  secTitle: { margin:'0 0 10px', fontSize:11, fontWeight:700, color:'#7c6fff', textTransform:'uppercase', letterSpacing:1 },
  mlink: { display:'block', padding:'5px 8px', color:'#888', fontSize:13, textDecoration:'none', transition:'all 0.15s', marginBottom:2 },
  authBtns: { display:'flex', alignItems:'center', gap:10, flexShrink:0 },
  dashBtn: { background:'linear-gradient(135deg,#7c6fff,#5a4dcc)', color:'#fff', padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, textDecoration:'none' },
  ghostBtn: { background:'transparent', border:'1px solid #2a2a4a', color:'#ccc', padding:'8px 18px', borderRadius:8, fontSize:13, cursor:'pointer', textDecoration:'none', transition:'background 0.2s', fontFamily:"'Sora',sans-serif" },
  regBtn: { background:'linear-gradient(135deg,#7c6fff,#5a4dcc)', color:'#fff', padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, textDecoration:'none', display:'inline-block' },
  hamburger: { display:'none', background:'none', border:'none', color:'#fff', fontSize:24, cursor:'pointer', padding:'4px 8px', marginLeft:'auto' },
  mobMenu: { background:'#08081a', borderTop:'1px solid #1a1a2e', paddingBottom:8 },
  mobItem: { display:'block', width:'100%', padding:'13px 20px', background:'none', border:'none', borderBottom:'1px solid #0e0e20', color:'#ccc', fontSize:14, textAlign:'left', cursor:'pointer', textDecoration:'none', fontFamily:"'Sora',sans-serif', boxSizing:'border-box" },
};