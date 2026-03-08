import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Clock, DollarSign, Filter, X } from 'lucide-react';

const JOB_TYPES = ['Full Time','Part Time','Remote','Internship','Hybrid','Contract'];
const JOB_COLORS = ['#f97316','#a78bfa','#34d399','#60a5fa','#f59e0b','#ec4899'];

const DEMO_JOBS = [
  { _id:'1', title:'Senior React Developer',  company:{companyName:'Razorpay'},    location:'Bangalore', jobType:'Full Time',  salary:{min:2500000,max:4000000}, skills:['React','Node.js','TypeScript','Redux'], experience:{min:3,max:6}, createdAt:new Date(Date.now()-3600000).toISOString() },
  { _id:'2', title:'Data Scientist',           company:{companyName:'Flipkart'},    location:'Bangalore', jobType:'Full Time',  salary:{min:2000000,max:3500000}, skills:['Python','ML','TensorFlow','SQL'],       experience:{min:2,max:5}, createdAt:new Date(Date.now()-7200000).toISOString() },
  { _id:'3', title:'DevOps Engineer',          company:{companyName:'Swiggy'},      location:'Mumbai',    jobType:'Remote',     salary:{min:1800000,max:3000000}, skills:['Docker','Kubernetes','AWS','CI/CD'],    experience:{min:2,max:5}, createdAt:new Date(Date.now()-10800000).toISOString() },
  { _id:'4', title:'Product Manager',          company:{companyName:'CRED'},        location:'Bangalore', jobType:'Full Time',  salary:{min:3000000,max:5000000}, skills:['Strategy','Analytics','Agile','SQL'],   experience:{min:4,max:8}, createdAt:new Date(Date.now()-14400000).toISOString() },
  { _id:'5', title:'ML Engineer',              company:{companyName:'Google India'},location:'Hyderabad', jobType:'Full Time',  salary:{min:3500000,max:6000000}, skills:['PyTorch','Python','GCP','MLOps'],       experience:{min:3,max:7}, createdAt:new Date(Date.now()-18000000).toISOString() },
  { _id:'6', title:'Android Developer',        company:{companyName:'PhonePe'},     location:'Bangalore', jobType:'Full Time',  salary:{min:2200000,max:4000000}, skills:['Kotlin','Android','MVVM','Jetpack'],    experience:{min:2,max:5}, createdAt:new Date(Date.now()-21600000).toISOString() },
  { _id:'7', title:'UI/UX Designer',           company:{companyName:'Meesho'},      location:'Remote',    jobType:'Remote',     salary:{min:1500000,max:2800000}, skills:['Figma','Sketch','Prototyping','CSS'],   experience:{min:2,max:4}, createdAt:new Date(Date.now()-25200000).toISOString() },
  { _id:'8', title:'Backend Engineer',         company:{companyName:'Zomato'},      location:'Delhi',     jobType:'Hybrid',     salary:{min:2000000,max:3500000}, skills:['Go','PostgreSQL','Redis','Kafka'],       experience:{min:3,max:6}, createdAt:new Date(Date.now()-28800000).toISOString() },
  { _id:'9', title:'Frontend Intern',          company:{companyName:'Paytm'},       location:'Noida',     jobType:'Internship', salary:{min:400000,max:700000},   skills:['React','JavaScript','CSS','Git'],        experience:{min:0,max:1}, createdAt:new Date(Date.now()-32400000).toISOString() },
  { _id:'10',title:'Cloud Architect',          company:{companyName:'Infosys'},     location:'Pune',      jobType:'Full Time',  salary:{min:4000000,max:7000000}, skills:['AWS','Azure','Terraform','Kubernetes'],  experience:{min:6,max:12},createdAt:new Date(Date.now()-36000000).toISOString() },
  { _id:'11',title:'Blockchain Developer',     company:{companyName:'Polygon'},     location:'Remote',    jobType:'Remote',     salary:{min:3000000,max:5500000}, skills:['Solidity','Web3','Ethereum','React'],    experience:{min:2,max:5}, createdAt:new Date(Date.now()-39600000).toISOString() },
  { _id:'12',title:'Growth Hacker',            company:{companyName:'Zepto'},       location:'Mumbai',    jobType:'Full Time',  salary:{min:1800000,max:3200000}, skills:['SEO','Analytics','SQL','Python'],        experience:{min:2,max:4}, createdAt:new Date(Date.now()-43200000).toISOString() },
];

function timeAgo(d) {
  const h = Math.floor((Date.now()-new Date(d))/3600000);
  if(h<1) return 'Just now';
  if(h<24) return `${h}h ago`;
  return `${Math.floor(h/24)}d ago`;
}
function fmtSalary(min,max) {
  if(!min) return 'Negotiable';
  return `₹${(min/100000).toFixed(0)}L-₹${(max/100000).toFixed(0)}L`;
}

export default function RealJobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState('');
  const [jobType, setJobType]   = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage]         = useState(1);
  const [total, setTotal]       = useState(0);
  const PER_PAGE = 9;

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: PER_PAGE, page });
      if(search)   params.append('search', search);
      if(location) params.append('location', location);
      if(jobType)  params.append('jobType', jobType);
      // Try API, fallback to demo
      let filtered = DEMO_JOBS.filter(j => {
        if(search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.skills?.some(s=>s.toLowerCase().includes(search.toLowerCase()))) return false;
        if(location && !j.location.toLowerCase().includes(location.toLowerCase())) return false;
        if(jobType && j.jobType !== jobType) return false;
        return true;
      });
      setTotal(filtered.length);
      setJobs(filtered.slice((page-1)*PER_PAGE, page*PER_PAGE));
    } catch {
      setJobs(DEMO_JOBS);
      setTotal(DEMO_JOBS.length);
    } finally { setLoading(false); }
  }, [search, location, jobType, page]);

  useEffect(() => { fetchJobs(); }, [page]);

  const handleSearch = (e) => { e?.preventDefault(); setPage(1); fetchJobs(); };
  const clearFilters = () => { setSearch(''); setLocation(''); setJobType(''); setPage(1); };
  const hasFilters = search || location || jobType;

  return (
    <div style={{ minHeight:'100vh', background:'#07070f', fontFamily:"'Sora',sans-serif" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .rjinput{width:100%;background:#0d0d1f;border:1.5px solid #2a2a4a;border-radius:12px;padding:12px 14px 12px 42px;color:#fff;font-size:16px;font-family:'Sora',sans-serif;outline:none;transition:border-color 0.2s;box-sizing:border-box}
        .rjinput:focus{border-color:#f97316}
        .rjinput::placeholder{color:#444;font-size:13px}
        .rjselect{width:100%;background:#0d0d1f;border:1.5px solid #2a2a4a;border-radius:12px;padding:12px 14px;color:#fff;font-size:14px;font-family:'Sora',sans-serif;outline:none;cursor:pointer}
        .rjselect:focus{border-color:#f97316}
        .jcard{background:#0d0d1f;border:1px solid #1e1e2e;border-radius:16px;padding:18px;position:relative;overflow:hidden;transition:all 0.25s;cursor:pointer}
        .jcard:hover{transform:translateY(-4px);border-color:#f9731655;box-shadow:0 12px 32px rgba(249,115,22,0.1)}
        .skilltag{background:#12122a;border:1px solid #2a2a4a;color:#8888aa;padding:3px 8px;border-radius:6px;font-size:11px}
        .tbtn{background:#0d0d1f;border:1px solid #2a2a4a;color:#888;border-radius:8px;padding:8px 14px;cursor:pointer;font-family:'Sora',sans-serif;font-size:12px;transition:all 0.2s}
        .tbtn:hover,.tbtn.active{background:#f9731618;border-color:#f97316;color:#f97316}
        .pgbtn{background:#0d0d1f;border:1px solid #2a2a4a;color:#888;border-radius:8px;padding:8px 14px;cursor:pointer;font-family:'Sora',sans-serif;font-size:13px;transition:all 0.2s;min-width:40px}
        .pgbtn:hover{border-color:#f97316;color:#f97316}
        .pgbtn.active{background:linear-gradient(135deg,#f97316,#ea580c);border-color:#f97316;color:#fff}

        /* MOBILE */
        @media(max-width:768px){
          .rj-wrap{padding:20px 14px 80px!important}
          .rj-header{margin-bottom:20px!important}
          .rj-title{font-size:22px!important}
          .filter-row{flex-direction:column!important;gap:10px!important}
          .type-pills{display:none!important}
          .filter-toggle{display:flex!important}
          .jobs-grid{grid-template-columns:1fr!important}
          .filter-drawer{position:fixed!important;bottom:0!important;left:0!important;right:0!important;background:#0d0d1f!important;border-radius:20px 20px 0 0!important;padding:20px!important;z-index:9999!important;border:1px solid #2a2a4a!important}
        }
        @media(min-width:769px){
          .filter-toggle{display:none!important}
        }
      `}</style>

      <div className="rj-wrap" style={{ maxWidth:1200, margin:'0 auto', padding:'32px 20px 80px' }}>

        {/* Header */}
        <div className="rj-header" style={{ marginBottom:28, animation:'fadeUp 0.4s ease' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#22c55e', animation:'pulse 1.5s infinite' }} />
            <span style={{ color:'#22c55e', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase' }}>Live Jobs Feed</span>
          </div>
          <h1 className="rj-title" style={{ margin:'0 0 6px', fontSize:28, fontWeight:800, color:'#fff' }}>
            🔍 Find Your Next Role
          </h1>
          <p style={{ margin:0, color:'#555', fontSize:13 }}>
            <span style={{ color:'#f97316', fontWeight:700 }}>{total}</span> jobs available · Updated live
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch}>
          <div className="filter-row" style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap' }}>
            {/* Search */}
            <div style={{ flex:2, minWidth:180, position:'relative' }}>
              <Search size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#555' }} />
              <input className="rjinput" placeholder="Job title or skill..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
            {/* Location */}
            <div style={{ flex:1, minWidth:130, position:'relative' }}>
              <MapPin size={15} style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#555' }} />
              <input className="rjinput" placeholder="City..." value={location} onChange={e=>setLocation(e.target.value)} />
            </div>
            {/* Search button */}
            <button type="submit" style={{ background:'linear-gradient(135deg,#f97316,#ea580c)', border:'none', color:'#fff', borderRadius:12, padding:'12px 20px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Sora',sans-serif", whiteSpace:'nowrap' }}>
              Search
            </button>
            {/* Filter toggle — mobile only */}
            <button type="button" className="filter-toggle" onClick={()=>setShowFilter(!showFilter)}
              style={{ background:'#0d0d1f', border:'1px solid #2a2a4a', color:'#888', borderRadius:12, padding:'12px 16px', cursor:'pointer', display:'none', alignItems:'center', gap:6 }}>
              <Filter size={15} /> Filters {jobType && <span style={{ background:'#f97316', color:'#fff', borderRadius:'50%', width:16, height:16, fontSize:10, display:'flex', alignItems:'center', justifyContent:'center' }}>1</span>}
            </button>
          </div>
        </form>

        {/* Job Type Pills — desktop */}
        <div className="type-pills" style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:20 }}>
          <button className={`tbtn${!jobType?' active':''}`} onClick={()=>{setJobType('');setPage(1);}}>All Types</button>
          {JOB_TYPES.map(t=>(
            <button key={t} className={`tbtn${jobType===t?' active':''}`} onClick={()=>{setJobType(t);setPage(1);}}>
              {t==='Remote'?'🌐 ':t==='Internship'?'🎓 ':''}{t}
            </button>
          ))}
          {hasFilters && (
            <button onClick={clearFilters} style={{ background:'#ef444418', border:'1px solid #ef444433', color:'#ef4444', borderRadius:8, padding:'8px 12px', cursor:'pointer', fontSize:12, fontFamily:"'Sora',sans-serif", display:'flex', alignItems:'center', gap:5 }}>
              <X size={12} /> Clear
            </button>
          )}
        </div>

        {/* Mobile Filter Drawer */}
        {showFilter && (
          <>
            <div onClick={()=>setShowFilter(false)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', zIndex:9998 }} />
            <div className="filter-drawer">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
                <h3 style={{ margin:0, color:'#fff', fontSize:15, fontWeight:700 }}>Filter Jobs</h3>
                <button onClick={()=>setShowFilter(false)} style={{ background:'none', border:'none', color:'#888', fontSize:20, cursor:'pointer' }}>✕</button>
              </div>
              <p style={{ margin:'0 0 10px', color:'#555', fontSize:11, textTransform:'uppercase', letterSpacing:1 }}>Job Type</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:16 }}>
                <button className={`tbtn${!jobType?' active':''}`} onClick={()=>{setJobType('');setShowFilter(false);}}>All</button>
                {JOB_TYPES.map(t=>(
                  <button key={t} className={`tbtn${jobType===t?' active':''}`} onClick={()=>{setJobType(t);setPage(1);setShowFilter(false);}}>
                    {t}
                  </button>
                ))}
              </div>
              {hasFilters && (
                <button onClick={()=>{clearFilters();setShowFilter(false);}} style={{ width:'100%', background:'#ef444418', border:'1px solid #ef444433', color:'#ef4444', borderRadius:10, padding:'11px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
                  Clear All Filters
                </button>
              )}
            </div>
          </>
        )}

        {/* Loading */}
        {loading ? (
          <div className="jobs-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
            {Array.from({length:6}).map((_,i)=>(
              <div key={i} style={{ height:200, borderRadius:16, background:'linear-gradient(90deg,#0d0d1f 25%,#1a1a2e 50%,#0d0d1f 75%)', backgroundSize:'200% 100%', animation:'shimmer 1.5s infinite' }} />
            ))}
          </div>

        /* Empty */
        ) : jobs.length===0 ? (
          <div style={{ textAlign:'center', padding:'60px 16px' }}>
            <div style={{ fontSize:52, marginBottom:12 }}>🔍</div>
            <h3 style={{ color:'#fff', margin:'0 0 8px' }}>No jobs found</h3>
            <p style={{ color:'#555', fontSize:13 }}>Try different keywords or clear filters</p>
            <button onClick={clearFilters} style={{ marginTop:16, background:'linear-gradient(135deg,#f97316,#ea580c)', border:'none', color:'#fff', padding:'11px 24px', borderRadius:10, fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:"'Sora',sans-serif" }}>
              Clear Filters
            </button>
          </div>

        /* Jobs Grid */
        ) : (
          <>
            <div className="jobs-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
              {jobs.map((job,i)=>{
                const color = JOB_COLORS[i%JOB_COLORS.length];
                const co = job.company?.companyName||'Company';
                const typeColor = job.jobType==='Remote'?'#34d399':job.jobType==='Internship'?'#f59e0b':'#a78bfa';
                return (
                  <div key={job._id} className="jcard" onClick={()=>navigate(`/jobs/${job._id}`)}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg,${color},${color}66)` }} />
                    
                    {/* Header */}
                    <div style={{ display:'flex', gap:12, marginBottom:14, alignItems:'flex-start' }}>
                      <div style={{ width:46, height:46, borderRadius:13, background:color+'22', border:`1px solid ${color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800, color, flexShrink:0 }}>{co[0]}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <h4 style={{ margin:'0 0 2px', fontSize:14, fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{job.title}</h4>
                        <p style={{ margin:0, color, fontSize:12, fontWeight:600 }}>{co}</p>
                      </div>
                      <span style={{ background:typeColor+'22', border:`1px solid ${typeColor}44`, color:typeColor, padding:'3px 8px', borderRadius:20, fontSize:10, fontWeight:700, flexShrink:0, textTransform:'capitalize' }}>
                        {job.jobType}
                      </span>
                    </div>

                    {/* Meta */}
                    <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:12, fontSize:11, color:'#555' }}>
                      {job.location && <span style={{ display:'flex', alignItems:'center', gap:4 }}><MapPin size={11} style={{ color:'#f97316' }} />{job.location}</span>}
                      {job.salary?.min && <span style={{ display:'flex', alignItems:'center', gap:4, color:'#34d399' }}><DollarSign size={11} />{fmtSalary(job.salary.min,job.salary.max)}</span>}
                      <span style={{ display:'flex', alignItems:'center', gap:4 }}><Clock size={11} />{timeAgo(job.createdAt)}</span>
                    </div>

                    {/* Skills */}
                    {job.skills?.length>0 && (
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
                        {job.skills.slice(0,4).map(s=><span key={s} className="skilltag">{s}</span>)}
                        {job.skills.length>4 && <span style={{ color:'#555', fontSize:11 }}>+{job.skills.length-4}</span>}
                      </div>
                    )}

                    {/* Footer */}
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:12, borderTop:'1px solid #0e0e1e' }}>
                      <span style={{ color:'#444', fontSize:11 }}>
                        {job.experience ? `💼 ${job.experience.min}-${job.experience.max} yrs` : '💼 Open'}
                      </span>
                      <span style={{ background:`linear-gradient(135deg,${color},${color}cc)`, color:'#fff', padding:'7px 14px', borderRadius:8, fontSize:12, fontWeight:700 }}>Apply →</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {total > PER_PAGE && (
              <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:36, flexWrap:'wrap' }}>
                <button className="pgbtn" disabled={page===1} onClick={()=>setPage(p=>p-1)}>← Prev</button>
                {Array.from({length:Math.ceil(total/PER_PAGE)},(_,i)=>i+1).slice(0,7).map(p=>(
                  <button key={p} className={`pgbtn${p===page?' active':''}`} onClick={()=>setPage(p)}>{p}</button>
                ))}
                <button className="pgbtn" disabled={page===Math.ceil(total/PER_PAGE)} onClick={()=>setPage(p=>p+1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}