import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Briefcase, SlidersHorizontal, X } from 'lucide-react';
import { jobAPI } from '../utils/api';

const JOB_TYPES = ['Full Time','Part Time','Remote','Internship','Contract'];
const JOB_COLORS = ['#f97316','#a78bfa','#34d399','#60a5fa','#f59e0b','#ec4899'];

export default function Jobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [search, location, jobType, page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (location) params.location = location;
      if (jobType) params.jobType = jobType;
      const { data } = await jobAPI.getAll(params);
      setJobs(data.jobs || []);
      setTotalPages(data.pages || 1);
    } catch { setJobs([]); }
    finally { setLoading(false); }
  };

  const fmtSalary = (min, max) => {
    if (!min) return 'Negotiable';
    return `₹${Math.round(min/100000)}L – ₹${Math.round(max/100000)}L`;
  };

  const timeAgo = (d) => {
    const h = Math.floor((Date.now() - new Date(d)) / 3600000);
    return h < 1 ? 'Just now' : h < 24 ? `${h}h ago` : `${Math.floor(h/24)}d ago`;
  };

  const clearFilters = () => { setLocation(''); setJobType(''); setSearch(''); setPage(1); };
  const hasFilters = search || location || jobType;

  return (
    <div style={{ minHeight:'100vh', background:'#07070f', fontFamily:"'Sora',sans-serif", color:'#e0e0e0', overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .jcard{ transition:all 0.2s !important; }
        .jcard:hover{ transform:translateY(-3px) !important; border-color:#f9731544 !important; }
        .type-pill{ transition:all 0.15s !important; cursor:pointer; }
        .type-pill:hover{ opacity:0.85 !important; }
        .jinput:focus{ border-color:#f97316 !important; outline:none !important; box-shadow:0 0 0 2px #f9731620 !important; }
        .page-btn:hover{ background:#1a1a2e !important; }
        /* Mobile */
        @media(max-width:768px){
          .jobs-header{ padding:20px 14px 14px !important; }
          .jobs-title{ font-size:22px !important; }
          .search-row{ flex-direction:column !important; gap:8px !important; }
          .search-row > div{ width:100% !important; }
          .filter-row{ display:none !important; }
          .mobile-filter-btn{ display:flex !important; }
          .jobs-grid{ grid-template-columns:1fr !important; gap:12px !important; }
          .job-meta{ flex-wrap:wrap !important; gap:4px !important; }
          .pagination{ gap:6px !important; }
          .page-btn{ padding:8px 12px !important; font-size:13px !important; }
          .filter-drawer{ display:block !important; }
        }
        @media(min-width:769px){
          .mobile-filter-btn{ display:none !important; }
          .filter-drawer{ display:none !important; }
          .filter-row{ display:flex !important; }
        }
      `}</style>

      {/* Header */}
      <div className="jobs-header" style={{ background:'#0a0a18', borderBottom:'1px solid #1a1a2e', padding:'28px 24px 20px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <h1 className="jobs-title" style={{ margin:'0 0 4px', fontSize:28, fontWeight:800, color:'#fff' }}>Browse Jobs</h1>
          <p style={{ margin:'0 0 18px', color:'#555', fontSize:13 }}>Find your perfect role from thousands of openings</p>

          {/* Search Row */}
          <div className="search-row" style={{ display:'flex', gap:10, marginBottom:12 }}>
            <div style={{ flex:1, position:'relative', minWidth:0 }}>
              <Search size={16} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#555' }} />
              <input
                className="jinput"
                value={search}
                onChange={e=>{setSearch(e.target.value);setPage(1);}}
                placeholder="Job title, skill, company..."
                style={{ width:'100%', background:'#07070f', border:'1px solid #2a2a4a', borderRadius:12, padding:'13px 14px 13px 40px', color:'#fff', fontSize:16, fontFamily:"'Sora',sans-serif", transition:'all 0.2s' }}
              />
            </div>
            <div style={{ position:'relative', minWidth:0, width:160 }}>
              <MapPin size={16} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#555' }} />
              <input
                className="jinput"
                value={location}
                onChange={e=>{setLocation(e.target.value);setPage(1);}}
                placeholder="Location"
                style={{ width:'100%', background:'#07070f', border:'1px solid #2a2a4a', borderRadius:12, padding:'13px 12px 13px 36px', color:'#fff', fontSize:16, fontFamily:"'Sora',sans-serif", transition:'all 0.2s' }}
              />
            </div>
            {/* Mobile filter button */}
            <button className="mobile-filter-btn" onClick={()=>setShowFilters(!showFilters)}
              style={{ background:showFilters?'#f9731620':'#07070f', border:`1px solid ${showFilters?'#f97316':'#2a2a4a'}`, borderRadius:12, padding:'13px 16px', color:showFilters?'#f97316':'#888', cursor:'pointer', alignItems:'center', gap:6, fontFamily:"'Sora',sans-serif", fontSize:13, flexShrink:0 }}>
              <SlidersHorizontal size={16} />
            </button>
          </div>

          {/* Desktop Filter Pills */}
          <div className="filter-row" style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
            {JOB_TYPES.map(t=>(
              <button key={t} className="type-pill" onClick={()=>{setJobType(jobType===t?'':t);setPage(1);}}
                style={{ background:jobType===t?'#f9731622':'#07070f', border:`1px solid ${jobType===t?'#f97316':'#2a2a4a'}`, color:jobType===t?'#f97316':'#888', padding:'6px 14px', borderRadius:20, fontSize:12, fontWeight:600, fontFamily:"'Sora',sans-serif" }}>
                {t}
              </button>
            ))}
            {hasFilters && (
              <button onClick={clearFilters}
                style={{ background:'none', border:'none', color:'#555', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontFamily:"'Sora',sans-serif" }}>
                <X size={14}/> Clear
              </button>
            )}
          </div>

          {/* Mobile Filter Drawer */}
          {showFilters && (
            <div className="filter-drawer" style={{ marginTop:12, background:'#07070f', border:'1px solid #1a1a2e', borderRadius:14, padding:'14px' }}>
              <p style={{ margin:'0 0 10px', fontSize:12, color:'#555', fontWeight:600 }}>Filter by Type</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {JOB_TYPES.map(t=>(
                  <button key={t} className="type-pill" onClick={()=>{setJobType(jobType===t?'':t);setPage(1);setShowFilters(false);}}
                    style={{ background:jobType===t?'#f9731622':'#0d0d1f', border:`1px solid ${jobType===t?'#f97316':'#2a2a4a'}`, color:jobType===t?'#f97316':'#888', padding:'8px 14px', borderRadius:10, fontSize:13, fontFamily:"'Sora',sans-serif" }}>
                    {t}
                  </button>
                ))}
              </div>
              {hasFilters && (
                <button onClick={clearFilters} style={{ marginTop:10, background:'none', border:'none', color:'#f97316', fontSize:12, cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'20px 14px 80px' }}>
        {/* Count */}
        {!loading && (
          <p style={{ margin:'0 0 16px', color:'#555', fontSize:13 }}>
            {jobs.length > 0 ? `${jobs.length} jobs found${hasFilters?' (filtered)':''}` : 'No jobs found'}
            {jobType && <span style={{ color:'#f97316', fontWeight:600 }}> • {jobType}</span>}
          </p>
        )}

        {loading ? (
          <div className="jobs-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
            {Array.from({length:6}).map((_,i)=>(
              <div key={i} style={{ height:200, borderRadius:16, background:'linear-gradient(90deg,#0d0d1f 25%,#1a1a2e 50%,#0d0d1f 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign:'center', padding:'60px 24px' }}>
            <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
            <h3 style={{ color:'#fff', margin:'0 0 8px', fontSize:18 }}>No jobs found</h3>
            <p style={{ color:'#555', margin:'0 0 20px', fontSize:14 }}>Try different keywords or clear filters</p>
            <button onClick={clearFilters} style={{ background:'linear-gradient(135deg,#f97316,#ea580c)', border:'none', color:'#fff', padding:'12px 24px', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="jobs-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
              {jobs.map((job, i) => {
                const color = JOB_COLORS[i % JOB_COLORS.length];
                const co = job.company?.companyName || 'Company';
                return (
                  <div key={job._id} className="jcard"
                    style={{ background:'#0d0d1f', border:'1px solid #1e1e2e', borderRadius:16, padding:'18px', position:'relative', overflow:'hidden', animation:`fadeIn 0.3s ease ${i*0.05}s both` }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${color},${color}66)` }} />
                    <div style={{ display:'flex', gap:12, marginBottom:12, alignItems:'flex-start' }}>
                      <div style={{ width:44, height:44, borderRadius:12, background:color+'22', border:`1px solid ${color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color, flexShrink:0 }}>
                        {co[0]}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <h4 style={{ margin:'0 0 3px', fontSize:14, fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{job.title}</h4>
                        <p style={{ margin:0, color, fontSize:12, fontWeight:600 }}>{co}</p>
                      </div>
                      <span style={{ background:'#22c55e22', border:'1px solid #22c55e44', color:'#22c55e', padding:'2px 8px', borderRadius:20, fontSize:10, fontWeight:700, flexShrink:0, whiteSpace:'nowrap' }}>
                        {job.jobType || 'Full Time'}
                      </span>
                    </div>

                    <div className="job-meta" style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:10 }}>
                      {job.location && <span style={{ background:'#ffffff08', border:'1px solid #ffffff0f', color:'#666', padding:'3px 8px', borderRadius:6, fontSize:11, display:'flex', alignItems:'center', gap:4 }}>📍 {job.location}</span>}
                      <span style={{ background:'#ffffff08', border:'1px solid #ffffff0f', color:'#34d399', padding:'3px 8px', borderRadius:6, fontSize:11 }}>💰 {fmtSalary(job.salary?.min, job.salary?.max)}</span>
                    </div>

                    {job.skills?.length > 0 && (
                      <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 }}>
                        {job.skills.slice(0,3).map(s=>(
                          <span key={s} style={{ background:'#12122a', border:'1px solid #2a2a4a', color:'#8888aa', padding:'2px 8px', borderRadius:6, fontSize:11 }}>{s}</span>
                        ))}
                      </div>
                    )}

                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:10, borderTop:'1px solid #0e0e1e' }}>
                      <span style={{ color:'#444', fontSize:11 }}>🕐 {timeAgo(job.createdAt)}</span>
                      <Link to={`/jobs/${job._id}`}
                        style={{ background:`linear-gradient(135deg,${color},${color}cc)`, color:'#fff', padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:700, textDecoration:'none' }}>
                        Apply →
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination" style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:8, marginTop:32, flexWrap:'wrap' }}>
                <button className="page-btn" onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
                  style={{ background:'#0d0d1f', border:'1px solid #2a2a4a', color:page===1?'#333':'#888', padding:'10px 16px', borderRadius:10, fontSize:13, cursor:page===1?'default':'pointer', fontFamily:"'Sora',sans-serif', transition:'all 0.15s" }}>
                  ← Prev
                </button>
                {Array.from({length:Math.min(totalPages,5)}, (_,i) => {
                  const p = page <= 3 ? i+1 : page - 2 + i;
                  if (p < 1 || p > totalPages) return null;
                  return (
                    <button key={p} className="page-btn" onClick={()=>setPage(p)}
                      style={{ background:p===page?'linear-gradient(135deg,#f97316,#ea580c)':'#0d0d1f', border:`1px solid ${p===page?'transparent':'#2a2a4a'}`, color:p===page?'#fff':'#888', padding:'10px 16px', borderRadius:10, fontSize:13, cursor:'pointer', fontFamily:"'Sora',sans-serif", fontWeight:p===page?700:400, minWidth:42 }}>
                      {p}
                    </button>
                  );
                })}
                <button className="page-btn" onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
                  style={{ background:'#0d0d1f', border:'1px solid #2a2a4a', color:page===totalPages?'#333':'#888', padding:'10px 16px', borderRadius:10, fontSize:13, cursor:page===totalPages?'default':'pointer', fontFamily:"'Sora',sans-serif", transition:'all 0.15s' }}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}