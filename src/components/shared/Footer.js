import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(''); }
  };

  const cols = [
    {
      title: 'Services',
      links: [
        { label: 'Text Resume', to: '/services/text-resume' },
        { label: 'Visual Resume', to: '/services/visual-resume' },
        { label: 'Resume Critique', to: '/services/resume-critique' },
        { label: 'Jobs4u', to: '/services/jobs4u' },
        { label: 'Priority Applicant', to: '/services/priority-applicant' },
        { label: 'Resume Display', to: '/services/resume-display' },
      ],
    },
    {
      title: 'Companies',
      links: [
        { label: 'Unicorn Companies', to: '/companies/category/unicorn' },
        { label: 'MNC', to: '/companies/category/mnc' },
        { label: 'Startups', to: '/companies/category/startup' },
        { label: 'IT Companies', to: '/companies/category/it-companies' },
        { label: 'Fintech Companies', to: '/companies/category/fintech-companies' },
        { label: 'All Companies', to: '/companies' },
      ],
    },
    {
      title: 'Browse Jobs',
      links: [
        { label: 'Fresher Jobs', to: '/jobs/category/fresher-jobs' },
        { label: 'Remote Jobs', to: '/jobs/category/remote-jobs' },
        { label: 'Work from Home', to: '/jobs/category/work-from-home' },
        { label: 'MNC Jobs', to: '/jobs/category/mnc-jobs' },
        { label: 'Part-time Jobs', to: '/jobs/category/part-time-jobs' },
        { label: 'Walk-in Jobs', to: '/jobs/category/walk-in-jobs' },
      ],
    },
    {
      title: 'Jobs by City',
      links: [
        { label: 'Jobs in Delhi', to: '/jobs/category/delhi-jobs' },
        { label: 'Jobs in Mumbai', to: '/jobs/category/mumbai-jobs' },
        { label: 'Jobs in Bangalore', to: '/jobs/category/bangalore-jobs' },
        { label: 'Jobs in Hyderabad', to: '/jobs/category/hyderabad-jobs' },
        { label: 'Jobs in Chennai', to: '/jobs/category/chennai-jobs' },
        { label: 'Jobs in Pune', to: '/jobs/category/pune-jobs' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Resume Maker', to: '/student/resume-builder' },
        { label: 'Resume Quality Score', to: '/student/resume-analyzer' },
        { label: 'Salary Calculator', to: '/student/salary-predictor' },
        { label: 'Skill Assessment', to: '/student/skill-assessment' },
        { label: 'AI Job Matches', to: '/student/ai-matches' },
        { label: 'AI Assistant', to: '/ai-assistant' },
      ],
    },
    {
      title: 'HireAI',
      links: [
        { label: 'About Us', to: '/' },
        { label: 'Contact Us', to: '/contact' },
        { label: 'Privacy Policy', to: '/' },
        { label: 'Terms of Service', to: '/' },
        { label: '💎 Pricing Plans', to: '/pricing' },
        { label: 'Browse All Jobs', to: '/jobs' },
      ],
    },
  ];

  return (
    <footer style={S.footer}>
      <style>{`.fl:hover{color:#a78bfa!important}.sb:hover{opacity:0.85}.socbtn:hover{background:#1a1a3a!important;border-color:#7c6fff!important}`}</style>

      {/* Subscribe Banner */}
      <div style={S.banner}>
        <div style={S.bannerInner}>
          <div>
            <h3 style={S.bannerTitle}>📬 Subscribe to Monthly Job Alerts</h3>
            <p style={S.bannerSub}>Get latest jobs, career tips and resume advice in your inbox</p>
          </div>
          {subscribed ? (
            <div style={S.success}>✅ Subscribed! Check your inbox.</div>
          ) : (
            <div style={S.subForm}>
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email address"
                style={S.subInput}
                type="email"
              />
              <button onClick={handleSubscribe} className="sb" style={S.subBtn}>
                Subscribe Free
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Links */}
      <div style={S.main}>
        {/* Brand */}
        <div style={S.brand}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <span style={{ fontSize:26 }}>⚡</span>
            <span style={{ fontSize:22, fontWeight:800, color:'#fff' }}>
              Hire<span style={{ color:'#a78bfa' }}>AI</span>
            </span>
          </div>
          <p style={S.brandDesc}>
            India's smartest AI-powered job portal. Connecting 1M+ students with top companies.
          </p>
          <div style={S.statsRow}>
            {[['1M+','Job Seekers'],['50K+','Companies'],['200K+','Jobs']].map(([n,l]) => (
              <div key={l}>
                <p style={{ margin:0, fontSize:18, fontWeight:800, color:'#a78bfa' }}>{n}</p>
                <p style={{ margin:0, fontSize:11, color:'#555' }}>{l}</p>
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:8, marginTop:20 }}>
            {['in','𝕏','📸','▶'].map((icon, i) => (
              <button key={i} className="socbtn" style={S.socBtn}>{icon}</button>
            ))}
          </div>
        </div>

        {/* Link columns */}
        <div style={S.grid}>
          {cols.map(col => (
            <div key={col.title}>
              <h4 style={S.colTitle}>{col.title}</h4>
              {col.links.map(l => (
                <Link key={l.label} to={l.to} className="fl" style={S.footLink}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div style={S.bottom}>
        <p style={{ margin:0, color:'#444', fontSize:13 }}>
          © 2025 HireAI. All rights reserved. Made with ❤️ in India
        </p>
        <div style={{ display:'flex', gap:20 }}>
          {[['Privacy','/'],[' Terms','/'],[' Cookies','/'],[' Sitemap','/']].map(([t,p]) => (
            <Link key={t} to={p} className="fl" style={{ ...S.footLink, fontSize:12 }}>{t}</Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

const S = {
  footer: { background:'#05050f', borderTop:'1px solid #1a1a2e', fontFamily:"'Sora',sans-serif" },
  banner: { background:'linear-gradient(135deg,#0d0d2a,#1a0a3a)', borderBottom:'1px solid #2a1a4a', padding:'40px 24px' },
  bannerInner: { maxWidth:1280, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:24 },
  bannerTitle: { margin:'0 0 6px', fontSize:20, fontWeight:700, color:'#fff' },
  bannerSub: { margin:0, color:'#888', fontSize:14 },
  subForm: { display:'flex', gap:10, flexWrap:'wrap' },
  subInput: { padding:'12px 18px', borderRadius:10, border:'1px solid #2a2a4a', background:'#0d0d1f', color:'#fff', fontSize:14, outline:'none', width:280, fontFamily:"'Sora',sans-serif" },
  subBtn: { padding:'12px 24px', borderRadius:10, background:'linear-gradient(135deg,#7c6fff,#5a4dcc)', border:'none', color:'#fff', fontWeight:700, fontSize:14, cursor:'pointer', whiteSpace:'nowrap', fontFamily:"'Sora',sans-serif" },
  success: { background:'#052e16', border:'1px solid #16a34a', color:'#4ade80', padding:'12px 20px', borderRadius:10, fontSize:14 },
  main: { maxWidth:1280, margin:'0 auto', padding:'56px 24px 40px', display:'flex', gap:48, flexWrap:'wrap' },
  brand: { width:240, flexShrink:0 },
  brandDesc: { color:'#555', fontSize:13, lineHeight:1.7, marginBottom:20 },
  statsRow: { display:'flex', gap:24 },
  socBtn: { width:36, height:36, borderRadius:8, background:'#0d0d1f', border:'1px solid #1e1e3a', color:'#888', cursor:'pointer', fontSize:14, transition:'all 0.2s' },
  grid: { flex:1, display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'32px 24px' },
  colTitle: { margin:'0 0 14px', fontSize:11, fontWeight:700, color:'#fff', textTransform:'uppercase', letterSpacing:1 },
  footLink: { display:'block', color:'#555', fontSize:13, textDecoration:'none', marginBottom:9, transition:'color 0.2s' },
  bottom: { maxWidth:1280, margin:'0 auto', padding:'20px 24px', borderTop:'1px solid #111120', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 },
};