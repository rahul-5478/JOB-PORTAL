import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';

const SLIDES = [
  { title: 'Find Your Dream Job', sub: 'with AI Matching', desc: 'AI-powered matching connects you to your perfect job in seconds.', cta: 'Find Jobs Now', link: '/real-jobs', img: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80', accent: '#f97316' },
  { title: 'Build a Resume', sub: 'That Gets You Hired', desc: 'Professional templates trusted by 1M+ job seekers across India.', cta: 'Build My Resume', link: '/student/resume-builder', img: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80', accent: '#a78bfa' },
  { title: 'Let AI Find', sub: 'Your Dream Job', desc: 'Smart technology analyzes your profile and finds the best matches.', cta: 'Try AI Matching', link: '/student/ai-matches', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80', accent: '#34d399' },
  { title: 'Get Hired Faster', sub: 'with Priority Badge', desc: 'Stand out to recruiters and get 5x more interview calls.', cta: 'Upgrade Now', link: '/pricing', img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&q=80', accent: '#60a5fa' },
];

const CATEGORIES = [
  { icon: '💻', label: 'IT & Software', count: '45,230', color: '#60a5fa' },
  { icon: '📊', label: 'Data Science',  count: '12,450', color: '#a78bfa' },
  { icon: '📣', label: 'Marketing',     count: '18,900', color: '#f97316' },
  { icon: '💰', label: 'Finance',       count: '22,100', color: '#34d399' },
  { icon: '🎨', label: 'Design',        count: '8,760',  color: '#ec4899' },
  { icon: '⚙️', label: 'Engineering',   count: '31,200', color: '#f59e0b' },
  { icon: '🏥', label: 'Healthcare',    count: '14,300', color: '#34d399' },
  { icon: '📚', label: 'Education',     count: '9,870',  color: '#60a5fa' },
];

const COMPANIES = [
  { name: 'Google', color: '#4285f4' }, { name: 'Microsoft', color: '#00a4ef' },
  { name: 'Amazon', color: '#f97316' }, { name: 'Flipkart',  color: '#f97316' },
  { name: 'Razorpay',color: '#2563eb' },{ name: 'Swiggy',   color: '#f97316' },
  { name: 'CRED',    color: '#a78bfa' },{ name: 'Zomato',   color: '#e23744' },
  { name: 'PhonePe', color: '#5f259f' },{ name: 'Meesho',   color: '#9b2c9b' },
  { name: 'Paytm',   color: '#002970' },{ name: 'Infosys',  color: '#007cc3' },
];

const FEATURES = [
  { icon: '🎯', title: 'AI Job Matching',   desc: '98% accurate skill-based matching',  link: '/student/ai-matches',      color: '#f97316' },
  { icon: '📊', title: 'Resume Analyzer',   desc: 'Instant ATS score + suggestions',    link: '/student/resume-analyzer', color: '#a78bfa' },
  { icon: '💰', title: 'Salary Predictor',  desc: 'Know your exact market value',       link: '/student/salary-predictor',color: '#34d399' },
  { icon: '🤖', title: 'AI Assistant',      desc: '24/7 career coaching chatbot',       link: '/ai-chatbot',              color: '#60a5fa' },
];

const DEMO_JOBS = [
  { _id:'1', title:'Senior React Developer', company:{companyName:'Razorpay'},   location:'Bangalore', jobType:'Full Time', salary:{min:2500000,max:4000000}, skills:['React','Node.js','TypeScript'], createdAt:new Date().toISOString() },
  { _id:'2', title:'Data Scientist',         company:{companyName:'Flipkart'},   location:'Bangalore', jobType:'Full Time', salary:{min:2000000,max:3500000}, skills:['Python','ML','TensorFlow'],    createdAt:new Date().toISOString() },
  { _id:'3', title:'DevOps Engineer',        company:{companyName:'Swiggy'},     location:'Mumbai',    jobType:'Remote',    salary:{min:1800000,max:3000000}, skills:['Docker','K8s','AWS'],          createdAt:new Date().toISOString() },
  { _id:'4', title:'Product Manager',        company:{companyName:'CRED'},       location:'Bangalore', jobType:'Full Time', salary:{min:3000000,max:5000000}, skills:['Strategy','Analytics','Agile'],createdAt:new Date().toISOString() },
  { _id:'5', title:'ML Engineer',            company:{companyName:'Google India'},location:'Hyderabad', jobType:'Full Time', salary:{min:3500000,max:6000000}, skills:['PyTorch','Python','GCP'],      createdAt:new Date().toISOString() },
  { _id:'6', title:'Android Developer',      company:{companyName:'PhonePe'},    location:'Bangalore', jobType:'Full Time', salary:{min:2200000,max:4000000}, skills:['Kotlin','Android','MVVM'],     createdAt:new Date().toISOString() },
];

const JOB_COLORS = ['#f97316','#a78bfa','#34d399','#60a5fa','#f59e0b','#ec4899'];

export default function Landing() {
  const navigate = useNavigate();
  const [slide, setSlide]               = useState(0);
  const [search, setSearch]             = useState('');
  const [jobs, setJobs]                 = useState([]);
  const [jobsLoading, setJobsLoading]   = useState(true);
  const [offerVisible, setOfferVisible] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setSlide(p => (p+1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setOfferVisible(true), 6000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get('/jobs?limit=6&page=1');
        setJobs(data.success && data.jobs?.length > 0 ? data.jobs : DEMO_JOBS);
      } catch { setJobs(DEMO_JOBS); }
      finally { setJobsLoading(false); }
    };
    fetchJobs();
  }, []);

  const cur = SLIDES[slide];
  const fmtSalary = (min, max) => !min ? 'Negotiable' : `₹${Math.round(min/100000)}L-₹${Math.round(max/100000)}L`;
  const timeAgo = d => { const h = Math.floor((Date.now()-new Date(d))/3600000); return h<1?'Just now':h<24?`${h}h ago`:`${Math.floor(h/24)}d ago`; };

  return (
    <div style={{ minHeight:'100vh', background:'#07070f', color:'#e0e0e0', fontFamily:"'Sora',sans-serif", overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 24px #f9731630}50%{box-shadow:0 0 48px #f9731660}}
        @keyframes popIn{from{opacity:0;transform:scale(0.85) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes dotPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}
        .jcard:hover{transform:translateY(-4px)!important;border-color:#f9731655!important}
        .jcard{transition:all 0.25s!important}
        .catcard:hover{transform:translateY(-3px)!important}
        .catcard{transition:all 0.2s!important}
        .featcard:hover{transform:translateY(-4px)!important}
        .featcard{transition:all 0.22s!important}
        .sugg:hover{background:#1a1508!important;color:#f97316!important}
        .sugg{transition:all 0.15s!important}
        .skilltag{background:#12122a;border:1px solid #2a2a4a;color:#8888aa;padding:3px 8px;border-radius:6px;font-size:11px}

        /* ── MOBILE FIXES ── */
        @media(max-width:768px){
          .hero-section{ height:100svh !important; min-height:580px !important; }
          .hero-content{ padding:0 16px 100px !important; justify-content:flex-end !important; align-items:flex-end !important; }
          .hero-inner{ max-width:100% !important; width:100% !important; }
          .hero-title{ font-size:28px !important; line-height:1.15 !important; }
          .hero-sub{ font-size:28px !important; line-height:1.15 !important; }
          .hero-desc{ font-size:13px !important; margin-bottom:12px !important; }
          .hero-thumbs{ display:none !important; }
          .hero-cta{ flex-direction:column !important; gap:8px !important; }
          .hero-cta a{ text-align:center !important; width:100% !important; }
          .hero-suggestions{ display:none !important; }
          .search-wrap{ max-width:100% !important; }
          .search-wrap input{ font-size:16px !important; }
          .stats-bar{ display:grid !important; grid-template-columns:1fr 1fr !important; }
          .stat-item{ border-right:none !important; border-bottom:1px solid #1a1a2e !important; padding:14px 8px !important; }
          .stat-num{ font-size:20px !important; }
          .jobs-grid{ grid-template-columns:1fr !important; }
          .cat-grid{ grid-template-columns:repeat(2,1fr) !important; }
          .feat-grid{ grid-template-columns:1fr !important; }
          .section-pad{ padding:32px 14px !important; }
          .section-head{ flex-direction:column !important; align-items:flex-start !important; gap:6px !important; }
          .section-title{ font-size:20px !important; }
          .cta-wrap{ padding:48px 16px !important; }
          .cta-title{ font-size:24px !important; }
          .cta-btns{ flex-direction:column !important; align-items:stretch !important; }
          .cta-btns a{ text-align:center !important; width:100% !important; }
          .offer-box{ bottom:80px !important; right:8px !important; left:8px !important; width:auto !important; max-width:100% !important; }
          .ticker-wrap{ padding:8px 12px !important; }
          .comp-row{ gap:8px !important; padding:0 12px !important; }
          .comp-badge{ padding:5px 10px !important; }
          .hero-tag{ font-size:11px !important; }
          .slide-dots{ bottom:80px !important; }
        }
        @media(max-width:420px){
          .hero-title{ font-size:24px !important; }
          .hero-sub{ font-size:24px !important; }
          .hero-tag span:last-child{ display:none; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="hero-section" style={{ position:'relative', height:'600px', overflow:'hidden' }}>
        {SLIDES.map((s,i) => (
          <div key={i} style={{ position:'absolute', inset:0, backgroundImage:`url(${s.img})`, backgroundSize:'cover', backgroundPosition:'center top', opacity:i===slide?1:0, transition:'opacity 0.9s ease', zIndex:0 }} />
        ))}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg,rgba(5,5,12,0.97) 0%,rgba(5,5,12,0.85) 50%,rgba(5,5,12,0.35) 100%)', zIndex:1 }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 40%,#07070f 100%)', zIndex:1 }} />

        <div className="hero-content" style={{ position:'relative', zIndex:2, maxWidth:1200, margin:'0 auto', padding:'0 24px', height:'100%', display:'flex', alignItems:'center' }}>
          <div className="hero-inner" style={{ maxWidth:600, width:'100%' }} key={slide}>
            {/* Tag */}
            <div className="hero-tag" style={{ display:'inline-flex', alignItems:'center', gap:8, background:cur.accent+'18', border:`1px solid ${cur.accent}44`, borderRadius:24, padding:'5px 14px', marginBottom:16, animation:'fadeUp 0.4s ease', fontSize:12, maxWidth:'100%' }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:cur.accent, animation:'dotPulse 1.5s infinite', display:'inline-block', flexShrink:0 }} />
              <span style={{ color:cur.accent, fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{['🚀 10,000+ New Jobs Today','📄 Pro Templates','🤖 AI Matching','⭐ Get Hired 5x Faster'][slide]}</span>
            </div>

            <h1 className="hero-title" style={{ margin:'0 0 4px', fontSize:52, fontWeight:800, color:'#fff', lineHeight:1.1, animation:'fadeUp 0.4s ease 0.1s both' }}>{cur.title}</h1>
            <h2 className="hero-sub" style={{ margin:'0 0 12px', fontSize:52, fontWeight:800, color:cur.accent, lineHeight:1.1, animation:'fadeUp 0.4s ease 0.15s both' }}>{cur.sub}</h2>
            <p className="hero-desc" style={{ margin:'0 0 20px', color:'#999', fontSize:16, lineHeight:1.7, animation:'fadeUp 0.4s ease 0.2s both' }}>{cur.desc}</p>

            {/* Search */}
            <div className="search-wrap" style={{ display:'flex', alignItems:'center', background:'rgba(13,13,31,0.92)', border:`1px solid ${cur.accent}55`, borderRadius:14, overflow:'hidden', marginBottom:14, maxWidth:520, animation:'fadeUp 0.4s ease 0.25s both' }}>
              <span style={{ color:'#555', fontSize:18, padding:'0 12px', flexShrink:0 }}>🔍</span>
              <input
                value={search} onChange={e=>setSearch(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&navigate(`/real-jobs${search?`?q=${search}`:''}`)}
                placeholder="Job title, skill..." 
                style={{ flex:1, background:'none', border:'none', color:'#fff', padding:'14px 8px', fontSize:16, outline:'none', fontFamily:"'Sora',sans-serif", minWidth:0 }} 
              />
              <button 
                onClick={()=>navigate(`/real-jobs${search?`?q=${search}`:''}`)}
                style={{ background:`linear-gradient(135deg,${cur.accent},${cur.accent}cc)`, border:'none', color:'#fff', padding:'14px 18px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Sora',sans-serif", whiteSpace:'nowrap', flexShrink:0 }}>
                Search
              </button>
            </div>

            {/* Suggestions – hidden mobile */}
            <div className="hero-suggestions" style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:18, animation:'fadeUp 0.4s ease 0.3s both' }}>
              {['React Developer','Data Scientist','Fresher Jobs','Remote Jobs'].map(t=>(
                <button key={t} className="sugg" onClick={()=>navigate(`/real-jobs?q=${t}`)}
                  style={{ background:'#ffffff08', border:'1px solid #ffffff15', color:'#aaa', padding:'5px 12px', borderRadius:20, fontSize:12, cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>{t}</button>
              ))}
            </div>

            {/* CTA */}
            <div className="hero-cta" style={{ display:'flex', gap:10, animation:'fadeUp 0.4s ease 0.35s both' }}>
              <Link to={cur.link} style={{ background:`linear-gradient(135deg,${cur.accent},${cur.accent}cc)`, color:'#fff', padding:'13px 24px', borderRadius:12, fontSize:15, fontWeight:700, textDecoration:'none' }}>{cur.cta} →</Link>
              <Link to="/register" style={{ background:'transparent', border:'1px solid #ffffff22', color:'#ccc', padding:'13px 20px', borderRadius:12, fontSize:14, fontWeight:500, textDecoration:'none' }}>Sign Up Free</Link>
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="slide-dots" style={{ position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)', display:'flex', gap:8, zIndex:3 }}>
          {SLIDES.map((_,i)=>(
            <button key={i} onClick={()=>setSlide(i)}
              style={{ width:i===slide?26:8, height:8, borderRadius:4, background:i===slide?cur.accent:'#ffffff33', border:'none', cursor:'pointer', transition:'all 0.3s', padding:0 }} />
          ))}
        </div>

        {/* Thumbnails – desktop only */}
        <div className="hero-thumbs" style={{ position:'absolute', right:32, top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', gap:10, zIndex:3 }}>
          {SLIDES.map((s,i)=>(
            <div key={i} onClick={()=>setSlide(i)} style={{ width:54, height:38, borderRadius:8, overflow:'hidden', cursor:'pointer', border:`2px solid ${i===slide?s.accent:'transparent'}`, opacity:i===slide?1:0.5, transition:'all 0.3s' }}>
              <img src={s.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            </div>
          ))}
        </div>
      </section>

      {/* ── LIVE TICKER ── */}
      <div className="ticker-wrap" style={{ display:'flex', alignItems:'center', gap:12, background:'#08080f', borderBottom:'1px solid #1a1a2e', padding:'9px 24px', overflow:'hidden' }}>
        <div style={{ background:'#ef444422', border:'1px solid #ef444444', color:'#ef4444', padding:'3px 10px', borderRadius:6, fontSize:11, fontWeight:700, flexShrink:0, display:'flex', alignItems:'center', gap:5 }}>
          <span style={{ width:5, height:5, borderRadius:'50%', background:'#ef4444', animation:'dotPulse 1s infinite', display:'inline-block' }} />LIVE
        </div>
        <div style={{ flex:1, overflow:'hidden', minWidth:0 }}>
          <div style={{ display:'flex', gap:36, animation:'ticker 22s linear infinite', width:'max-content' }}>
            {[...DEMO_JOBS,...DEMO_JOBS].map((j,i)=>(
              <span key={i} style={{ fontSize:12, color:'#555', whiteSpace:'nowrap' }}>
                <span style={{ color:'#f97316', fontWeight:600 }}>{j.company?.companyName}</span>{' hiring '}
                <span style={{ color:'#ccc' }}>{j.title}</span>{' • '}
                <span style={{ color:'#34d399' }}>{fmtSalary(j.salary?.min,j.salary?.max)}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div className="stats-bar" style={{ display:'flex', background:'#0a0a18', borderBottom:'1px solid #1a1a2e' }}>
        {[['1M+','Job Seekers','👥'],['50K+','Companies','🏢'],['2L+','Jobs Posted','💼'],['85%','Placement','🎯']].map(([n,l,ic])=>(
          <div key={l} className="stat-item" style={{ flex:1, textAlign:'center', padding:'22px 16px', borderRight:'1px solid #1a1a2e' }}>
            <span style={{ fontSize:20, display:'block', marginBottom:4 }}>{ic}</span>
            <p className="stat-num" style={{ margin:'0 0 2px', fontSize:24, fontWeight:800, color:'#f97316' }}>{n}</p>
            <p style={{ margin:0, color:'#555', fontSize:11 }}>{l}</p>
          </div>
        ))}
      </div>

      {/* ── TODAY'S JOBS ── */}
      <section className="section-pad" style={{ maxWidth:1200, margin:'0 auto', padding:'60px 24px' }}>
        <div className="section-head" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24, flexWrap:'wrap', gap:10 }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, marginBottom:6 }}>
              <span style={{ width:6, height:6, borderRadius:'50%', background:'#22c55e', animation:'dotPulse 1.5s infinite', display:'inline-block' }} />
              <span style={{ color:'#22c55e', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:1 }}>Updated Today</span>
            </div>
            <h2 className="section-title" style={{ margin:0, fontSize:26, fontWeight:800, color:'#fff' }}>🔥 Today's Job Openings</h2>
          </div>
          <Link to="/real-jobs" style={{ color:'#f97316', fontSize:13, fontWeight:700, textDecoration:'none' }}>View All →</Link>
        </div>

        {jobsLoading ? (
          <div className="jobs-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
            {Array.from({length:6}).map((_,i)=>(
              <div key={i} style={{ height:180, borderRadius:16, background:'linear-gradient(90deg,#0d0d1f 25%,#1a1a2e 50%,#0d0d1f 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />
            ))}
          </div>
        ) : (
          <div className="jobs-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
            {jobs.map((job,i)=>{
              const color = JOB_COLORS[i%JOB_COLORS.length];
              const co = job.company?.companyName||'Company';
              return (
                <div key={job._id} className="jcard" style={{ background:'#0d0d1f', border:'1px solid #1e1e2e', borderRadius:16, padding:18, position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${color},${color}66)` }} />
                  <div style={{ display:'flex', gap:12, marginBottom:12, alignItems:'flex-start' }}>
                    <div style={{ width:44, height:44, borderRadius:12, background:color+'22', border:`1px solid ${color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800, color, flexShrink:0 }}>{co[0]}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <h4 style={{ margin:'0 0 2px', fontSize:14, fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{job.title}</h4>
                      <p style={{ margin:0, color, fontSize:12, fontWeight:600 }}>{co}</p>
                    </div>
                    <span style={{ background:'#22c55e22', border:'1px solid #22c55e44', color:'#22c55e', padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700, flexShrink:0 }}>NEW</span>
                  </div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                    <span style={{ background:'#ffffff08', border:'1px solid #ffffff0f', color:'#666', padding:'3px 8px', borderRadius:6, fontSize:11 }}>📍 {job.location||'India'}</span>
                    <span style={{ background:'#ffffff08', border:'1px solid #ffffff0f', color:'#34d399', padding:'3px 8px', borderRadius:6, fontSize:11 }}>💰 {fmtSalary(job.salary?.min,job.salary?.max)}</span>
                  </div>
                  {job.skills?.length>0 && (
                    <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 }}>
                      {job.skills.slice(0,3).map(s=><span key={s} className="skilltag">{s}</span>)}
                    </div>
                  )}
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10, borderTop:'1px solid #0e0e1e' }}>
                    <span style={{ color:'#444', fontSize:11 }}>🕐 {timeAgo(job.createdAt)}</span>
                    <Link to={`/jobs/${job._id}`} style={{ background:`linear-gradient(135deg,${color},${color}cc)`, color:'#fff', padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:700, textDecoration:'none' }}>Apply →</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ textAlign:'center', marginTop:24 }}>
          <Link to="/real-jobs" style={{ display:'inline-block', background:'transparent', border:'1px solid #f9731644', color:'#f97316', padding:'12px 28px', borderRadius:12, fontSize:14, fontWeight:600, textDecoration:'none' }}>Browse All Jobs →</Link>
        </div>
      </section>

      {/* ── COMPANIES ── */}
      <section style={{ padding:'36px 16px', borderTop:'1px solid #1a1a2e', borderBottom:'1px solid #1a1a2e' }}>
        <p style={{ textAlign:'center', color:'#333', fontSize:11, letterSpacing:3, textTransform:'uppercase', marginBottom:20 }}>TRUSTED BY TOP COMPANIES</p>
        <div className="comp-row" style={{ display:'flex', flexWrap:'wrap', gap:10, justifyContent:'center', maxWidth:900, margin:'0 auto' }}>
          {COMPANIES.map(c=>(
            <div key={c.name} className="comp-badge" style={{ background:c.color+'15', border:`1px solid ${c.color}33`, borderRadius:10, padding:'7px 14px', display:'flex', alignItems:'center', gap:7 }}>
              <div style={{ width:22, height:22, borderRadius:7, background:c.color+'33', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, color:c.color, fontSize:11 }}>{c.name[0]}</div>
              <span style={{ color:'#ccc', fontSize:12, fontWeight:600 }}>{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="section-pad" style={{ maxWidth:1200, margin:'0 auto', padding:'60px 24px' }}>
        <div className="section-head" style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20, flexWrap:'wrap', gap:8 }}>
          <div>
            <h2 className="section-title" style={{ margin:0, fontSize:26, fontWeight:800, color:'#fff' }}>🗂 Browse by Category</h2>
            <p style={{ margin:'4px 0 0', color:'#555', fontSize:12 }}>Explore thousands of jobs in your field</p>
          </div>
          <Link to="/jobs" style={{ color:'#f97316', fontSize:13, fontWeight:700, textDecoration:'none' }}>All →</Link>
        </div>
        <div className="cat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:12 }}>
          {CATEGORIES.map(c=>(
            <Link key={c.label} to={`/jobs/category/${c.label.toLowerCase().replace(/ & /g,'-').replace(/ /g,'-')}`} className="catcard"
              style={{ background:'#0d0d1f', border:`1px solid ${c.color}22`, borderRadius:14, padding:'18px 12px', textAlign:'center', textDecoration:'none', display:'block' }}>
              <div style={{ fontSize:30, marginBottom:8 }}>{c.icon}</div>
              <p style={{ margin:'0 0 3px', fontSize:12, fontWeight:700, color:'#fff' }}>{c.label}</p>
              <p style={{ margin:0, fontSize:11, color:c.color, fontWeight:600 }}>{c.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── AI FEATURES ── */}
      <section style={{ background:'linear-gradient(180deg,#06060f,#0a0a1a)', padding:'60px 16px', borderTop:'1px solid #1a1a2e' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <span style={{ display:'inline-block', background:'#f9731618', border:'1px solid #f9731633', color:'#f97316', padding:'5px 16px', borderRadius:20, fontSize:11, fontWeight:700, marginBottom:10 }}>⚡ AI POWERED</span>
            <h2 className="section-title" style={{ margin:'0 0 6px', fontSize:24, fontWeight:800, color:'#fff', textAlign:'center' }}>Smart Career Tools</h2>
            <p style={{ color:'#555', fontSize:13 }}>Everything you need to land your dream job</p>
          </div>
          <div className="feat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:14 }}>
            {FEATURES.map(f=>(
              <Link key={f.title} to={f.link} className="featcard"
                style={{ background:'#0d0d1f', border:`1px solid ${f.color}22`, borderRadius:16, padding:'22px', textDecoration:'none', display:'block' }}>
                <div style={{ width:46, height:46, borderRadius:13, background:f.color+'22', border:`1px solid ${f.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:12 }}>{f.icon}</div>
                <h4 style={{ margin:'0 0 6px', color:'#fff', fontSize:15, fontWeight:700 }}>{f.title}</h4>
                <p style={{ margin:'0 0 12px', color:'#555', fontSize:12, lineHeight:1.6 }}>{f.desc}</p>
                <span style={{ color:f.color, fontSize:12, fontWeight:700 }}>Try Now →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-wrap" style={{ background:'linear-gradient(135deg,#1a0800,#0a0514)', padding:'72px 24px', textAlign:'center', borderTop:'1px solid #f9731622' }}>
        <div style={{ maxWidth:500, margin:'0 auto' }}>
          <div style={{ fontSize:52, marginBottom:14, animation:'float 3s ease-in-out infinite' }}>⚡</div>
          <h2 className="cta-title" style={{ margin:'0 0 12px', fontSize:34, fontWeight:800, color:'#fff', lineHeight:1.2 }}>
            Get Hired with <span style={{ color:'#f97316' }}>HireAI</span>
          </h2>
          <p style={{ margin:'0 0 24px', color:'#555', fontSize:14, lineHeight:1.7 }}>
            Join 1 million job seekers who found their dream jobs with AI-powered matching
          </p>
          <div className="cta-btns" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/register" style={{ background:'linear-gradient(135deg,#f97316,#ea580c)', color:'#fff', padding:'14px 28px', borderRadius:12, fontSize:15, fontWeight:700, textDecoration:'none', animation:'glow 3s infinite' }}>Get Started Free 🚀</Link>
            <Link to="/real-jobs" style={{ background:'transparent', border:'1px solid #f9731644', color:'#f97316', padding:'14px 28px', borderRadius:12, fontSize:14, fontWeight:600, textDecoration:'none' }}>Browse Jobs</Link>
          </div>
        </div>
      </section>

      {/* ── OFFER POPUP ── */}
      {offerVisible && (
        <div className="offer-box" style={{ position:'fixed', bottom:24, right:20, zIndex:9999, background:'#0d0d20', border:'1px solid #2a2a4a', borderRadius:18, padding:'20px', width:270, boxShadow:'0 20px 60px rgba(0,0,0,0.8)', animation:'popIn 0.4s ease' }}>
          <button onClick={()=>setOfferVisible(false)} style={{ position:'absolute', top:10, right:12, background:'none', border:'none', color:'#555', fontSize:18, cursor:'pointer' }}>✕</button>
          <div style={{ fontSize:34, textAlign:'center', marginBottom:8 }}>🎉</div>
          <div style={{ textAlign:'center', marginBottom:8 }}>
            <span style={{ background:'#f9731622', border:'1px solid #f9731644', color:'#f97316', padding:'3px 10px', borderRadius:20, fontSize:10, fontWeight:700 }}>LIMITED TIME</span>
          </div>
          <h3 style={{ textAlign:'center', color:'#fff', margin:'8px 0 6px', fontSize:13, fontWeight:800 }}>Get Priority Applicant Badge</h3>
          <p style={{ textAlign:'center', color:'#666', fontSize:11, margin:'0 0 12px', lineHeight:1.5 }}>5x more callbacks guaranteed!</p>
          <Link to="/pricing" onClick={()=>setOfferVisible(false)}
            style={{ display:'block', textAlign:'center', background:'linear-gradient(135deg,#f97316,#ea580c)', color:'#fff', padding:'10px', borderRadius:10, fontSize:13, fontWeight:700, textDecoration:'none', marginBottom:8 }}>
            Claim Free 7-Day Trial →
          </Link>
          <p onClick={()=>setOfferVisible(false)} style={{ textAlign:'center', color:'#333', fontSize:11, cursor:'pointer', margin:0 }}>No thanks</p>
        </div>
      )}

      {/* ── FLOATING AI BUTTON ── */}
      <Link to="/ai-chatbot" style={{ position:'fixed', bottom:90, left:16, width:52, height:52, borderRadius:'50%', background:'linear-gradient(135deg,#a78bfa,#7c6fff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, textDecoration:'none', boxShadow:'0 8px 24px #a78bfa55', zIndex:9998 }}>
        🤖
        <span style={{ position:'absolute', top:-2, right:-2, width:16, height:16, borderRadius:'50%', background:'#22c55e', border:'2px solid #07070f', fontSize:8, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>AI</span>
      </Link>
    </div>
  );
}