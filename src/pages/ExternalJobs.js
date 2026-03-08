import React, { useState, useEffect } from 'react';
import API from '../utils/api';

const CATEGORIES = ['All', 'Software Engineer', 'React Developer', 'Data Scientist', 'DevOps', 'Product Manager', 'UI/UX Designer', 'ML Engineer'];
const LOCATIONS  = ['All India', 'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Pune', 'Chennai', 'Remote'];

export default function ExternalJobs() {
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [search, setSearch]     = useState('');
  const [location, setLocation] = useState('india');
  const [category, setCategory] = useState('All');
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const [source, setSource]     = useState('');
  const [error, setError]       = useState('');

  const fetchJobs = async (q, loc, pg = 1) => {
    setLoading(true);
    setError('');
    try {
      const query = q || category !== 'All' ? (q || category) : 'software developer';
      const { data } = await API.get('/external-jobs', {
        params: { q: query, location: loc || location, page: pg, results_per_page: 12 }
      });
      if (data.success) {
        setJobs(data.jobs);
        setTotal(data.total || data.jobs.length);
        setSource(data.source);
      }
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs('', 'india', 1); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJobs(search, location, 1);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
    fetchJobs(cat === 'All' ? '' : cat, location, 1);
  };

  const handleLocation = (loc) => {
    const apiLoc = loc === 'All India' ? 'india' : loc;
    setLocation(apiLoc);
    setPage(1);
    fetchJobs(search, apiLoc, 1);
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days/7)} weeks ago`;
    return `${Math.floor(days/30)} months ago`;
  };

  return (
    <div style={S.page}>
      <style>{`.jcard:hover{border-color:#7c6fff!important;transform:translateY(-2px)}.jcard{transition:all 0.2s}.catbtn:hover{background:#1a1535!important;color:#a78bfa!important}.applybtn:hover{opacity:0.85}`}</style>

      {/* Header */}
      <div style={S.header}>
        <h1 style={S.title}>🌐 Live Jobs from Top Platforms</h1>
        <p style={S.sub}>Real jobs from across India — updated daily</p>

        {/* Search Bar */}
        <div style={S.searchWrap}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch(e)}
            placeholder="Search jobs, skills, company..."
            style={S.searchInput}
          />
          <select onChange={e => handleLocation(e.target.value)} style={S.select}>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button onClick={handleSearch} style={S.searchBtn}>
            {loading ? '⏳' : '🔍 Search'}
          </button>
        </div>

        {/* Category Pills */}
        <div style={S.pills}>
          {CATEGORIES.map(cat => (
            <button key={cat} className="catbtn" onClick={() => handleCategory(cat)}
              style={{ ...S.pill, ...(category === cat ? S.pillActive : {}) }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div style={S.resultsBar}>
        <p style={{ margin:0, color:'#666', fontSize:13 }}>
          {loading ? 'Loading...' : `${total}+ jobs found ${source === 'mock' ? '(Demo data — add Adzuna API key for live jobs)' : '• Live data'}`}
        </p>
        {source === 'mock' && (
          <a href="https://developer.adzuna.com" target="_blank" rel="noreferrer"
            style={{ color:'#7c6fff', fontSize:12, textDecoration:'none' }}>
            🔑 Get free API key →
          </a>
        )}
      </div>

      {error && <div style={S.errBox}>⚠️ {error}</div>}

      {/* Jobs Grid */}
      {loading ? (
        <div style={S.loadGrid}>
          {Array.from({length:8}).map((_,i) => (
            <div key={i} style={S.skeleton} />
          ))}
        </div>
      ) : (
        <div style={S.grid}>
          {jobs.map(job => (
            <div key={job.id} className="jcard" style={S.card}>
              {/* Card Header */}
              <div style={{ display:'flex', gap:12, marginBottom:14, alignItems:'flex-start' }}>
                <img src={job.logo} alt={job.company} style={S.logo}
                  onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=1a1535&color=a78bfa`; }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <h3 style={S.jobTitle}>{job.title}</h3>
                  <p style={S.company}>{job.company}</p>
                </div>
                <span style={S.sourceBadge}>{job.source}</span>
              </div>

              {/* Meta */}
              <div style={S.meta}>
                <span style={S.metaItem}>📍 {job.location}</span>
                <span style={S.metaItem}>💰 {job.salary}</span>
                {job.type && <span style={S.metaItem}>⏱ {job.type}</span>}
              </div>

              {/* Description */}
              <p style={S.desc}>{job.description}</p>

              {/* Skills */}
              {job.skills && (
                <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:14 }}>
                  {job.skills.map(s => (
                    <span key={s} style={S.skill}>{s}</span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div style={S.cardFoot}>
                <span style={{ color:'#555', fontSize:12 }}>🕐 {timeAgo(job.created)}</span>
                <a href={job.url !== '#' ? job.url : '/register'} target={job.url !== '#' ? '_blank' : '_self'}
                  rel="noreferrer" className="applybtn"
                  style={S.applyBtn}>
                  Apply Now →
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More */}
      {!loading && jobs.length > 0 && (
        <div style={{ textAlign:'center', marginTop:32 }}>
          <button onClick={() => { const np = page+1; setPage(np); fetchJobs(search, location, np); }}
            style={S.loadMoreBtn}>
            Load More Jobs
          </button>
        </div>
      )}

      {/* Adzuna Setup Info */}
      {source === 'mock' && (
        <div style={S.setupCard}>
          <h3 style={{ color:'#fff', margin:'0 0 12px', fontSize:16 }}>🔑 Enable Live Jobs (Free)</h3>
          <p style={{ color:'#888', fontSize:13, margin:'0 0 16px', lineHeight:1.7 }}>
            Add Adzuna API key to get real jobs from Naukri, LinkedIn, Indeed and more.
            Free tier: <strong style={{color:'#a78bfa'}}>1000 calls/month</strong>
          </p>
          <div style={S.steps}>
            {[
              ['1', 'Go to developer.adzuna.com'],
              ['2', 'Register free account'],
              ['3', 'Copy App ID and API Key'],
              ['4', 'Add to backend .env file'],
            ].map(([n,t]) => (
              <div key={n} style={S.step}>
                <span style={S.stepNum}>{n}</span>
                <span style={{ color:'#888', fontSize:13 }}>{t}</span>
              </div>
            ))}
          </div>
          <div style={S.envBox}>
            <code style={{ color:'#a78bfa', fontSize:13 }}>
              ADZUNA_APP_ID=your_app_id<br/>
              ADZUNA_API_KEY=your_api_key
            </code>
          </div>
          <a href="https://developer.adzuna.com" target="_blank" rel="noreferrer" style={S.adzunaBtn}>
            Get Free API Key →
          </a>
        </div>
      )}
    </div>
  );
}

const S = {
  page: { minHeight:'100vh', background:'#07070f', color:'#e0e0e0', fontFamily:"'Sora',sans-serif", paddingBottom:80 },
  header: { background:'linear-gradient(180deg,#0d0d20,#07070f)', padding:'48px 24px 32px', borderBottom:'1px solid #1a1a2e' },
  title: { textAlign:'center', margin:'0 0 8px', fontSize:32, fontWeight:800, color:'#fff' },
  sub: { textAlign:'center', margin:'0 0 28px', color:'#666', fontSize:15 },
  searchWrap: { display:'flex', gap:10, maxWidth:760, margin:'0 auto 20px', flexWrap:'wrap' },
  searchInput: { flex:1, minWidth:200, padding:'13px 18px', background:'#0d0d1f', border:'1px solid #2a2a4a', borderRadius:12, color:'#fff', fontSize:14, outline:'none', fontFamily:"'Sora',sans-serif" },
  select: { padding:'13px 16px', background:'#0d0d1f', border:'1px solid #2a2a4a', borderRadius:12, color:'#ccc', fontSize:14, outline:'none', cursor:'pointer', fontFamily:"'Sora',sans-serif" },
  searchBtn: { padding:'13px 24px', background:'linear-gradient(135deg,#7c6fff,#5a4dcc)', border:'none', borderRadius:12, color:'#fff', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Sora',sans-serif" },
  pills: { display:'flex', flexWrap:'wrap', gap:8, justifyContent:'center', maxWidth:900, margin:'0 auto' },
  pill: { padding:'7px 16px', background:'#0d0d1f', border:'1px solid #1e1e3a', borderRadius:20, color:'#888', fontSize:12, cursor:'pointer', transition:'all 0.2s', fontFamily:"'Sora',sans-serif" },
  pillActive: { background:'#1a1535', border:'1px solid #7c6fff', color:'#a78bfa' },
  resultsBar: { maxWidth:1200, margin:'16px auto 0', padding:'0 24px', display:'flex', justifyContent:'space-between', alignItems:'center' },
  errBox: { maxWidth:1200, margin:'12px auto', padding:'12px 24px', background:'#2a0a0a', border:'1px solid #ef4444', borderRadius:10, color:'#f87171', fontSize:13 },
  loadGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:16, maxWidth:1200, margin:'20px auto', padding:'0 24px' },
  skeleton: { height:220, background:'linear-gradient(90deg,#0d0d1f,#1a1a2e,#0d0d1f)', borderRadius:16, animation:'pulse 1.5s infinite' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:16, maxWidth:1200, margin:'20px auto', padding:'0 24px' },
  card: { background:'#0d0d1f', border:'1px solid #1e1e3a', borderRadius:16, padding:'20px' },
  logo: { width:44, height:44, borderRadius:10, objectFit:'cover', flexShrink:0 },
  jobTitle: { margin:'0 0 4px', fontSize:15, fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  company: { margin:0, color:'#7c6fff', fontSize:13, fontWeight:500 },
  sourceBadge: { background:'#1a1535', border:'1px solid #7c6fff33', color:'#888', padding:'3px 8px', borderRadius:6, fontSize:11, whiteSpace:'nowrap', flexShrink:0 },
  meta: { display:'flex', flexWrap:'wrap', gap:10, marginBottom:12 },
  metaItem: { fontSize:12, color:'#666' },
  desc: { color:'#666', fontSize:12, lineHeight:1.6, margin:'0 0 12px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' },
  skill: { background:'#12122a', border:'1px solid #2a2a4a', color:'#9090b0', padding:'3px 10px', borderRadius:6, fontSize:11 },
  cardFoot: { display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:'1px solid #111120' },
  applyBtn: { background:'linear-gradient(135deg,#7c6fff,#5a4dcc)', color:'#fff', padding:'8px 18px', borderRadius:8, fontSize:13, fontWeight:600, textDecoration:'none', display:'inline-block' },
  loadMoreBtn: { background:'transparent', border:'1px solid #2a2a4a', color:'#888', padding:'12px 32px', borderRadius:10, cursor:'pointer', fontSize:14, fontFamily:"'Sora',sans-serif" },
  setupCard: { maxWidth:600, margin:'40px auto', padding:'28px', background:'#0d0d1f', border:'1px solid #7c6fff33', borderRadius:16, marginLeft:'auto', marginRight:'auto' },
  steps: { display:'flex', flexDirection:'column', gap:10, marginBottom:16 },
  step: { display:'flex', alignItems:'center', gap:12 },
  stepNum: { width:24, height:24, borderRadius:'50%', background:'#1a1535', border:'1px solid #7c6fff', color:'#a78bfa', fontSize:12, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  envBox: { background:'#080818', border:'1px solid #1e1e3a', borderRadius:10, padding:'14px 18px', marginBottom:16 },
  adzunaBtn: { display:'inline-block', background:'linear-gradient(135deg,#7c6fff,#5a4dcc)', color:'#fff', padding:'12px 24px', borderRadius:10, fontSize:14, fontWeight:700, textDecoration:'none' },
};