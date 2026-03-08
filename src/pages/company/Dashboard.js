import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { companyAPI, jobAPI, applicationAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = { pending:'#f59e0b', shortlisted:'#a78bfa', rejected:'#ef4444', hired:'#22c55e', interview:'#60a5fa' };

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coverPreview, setCoverPreview] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const coverRef = useRef();
  const logoRef = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, jRes] = await Promise.allSettled([
          companyAPI.getProfile(),
          jobAPI.getMyJobs(),
        ]);
        if (pRes.status==='fulfilled') setProfile(pRes.value.data.company);
        if (jRes.status==='fulfilled') setJobs(jRes.value.data.jobs || []);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    try {
      const fd = new FormData(); fd.append('logo', file);
      await companyAPI.uploadLogo(fd);
      toast.success('Logo updated!');
    } catch { toast.error('Upload failed'); }
  };

  const name = profile?.companyName || user?.name || 'Company';
  const initials = name.slice(0,2).toUpperCase();
  const totalApps = jobs.reduce((s,j) => s + (j.applicationsCount || 0), 0);

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#07070f', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:40, height:40, border:'3px solid #1a1a2e', borderTop:'3px solid #a78bfa', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#07070f', fontFamily:"'Sora',sans-serif", color:'#e0e0e0', paddingBottom:80, overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .dash-card{ transition:all 0.2s !important; }
        .dash-card:hover{ transform:translateY(-2px) !important; }

        @media(max-width:768px){
          .cover-section{ height:130px !important; }
          .co-profile-row{ padding:0 14px 16px !important; flex-direction:column !important; align-items:center !important; text-align:center !important; }
          .co-logo{ width:72px !important; height:72px !important; top:-36px !important; font-size:26px !important; }
          .co-info{ margin-top:40px !important; }
          .co-name{ font-size:18px !important; }
          .co-stats{ grid-template-columns:repeat(2,1fr) !important; gap:10px !important; }
          .co-stat{ padding:14px 10px !important; }
          .co-stat-num{ font-size:22px !important; }
          .co-actions{ grid-template-columns:repeat(2,1fr) !important; gap:8px !important; }
          .co-grid{ grid-template-columns:1fr !important; }
          .co-pad{ padding:0 14px !important; }
          .section-title{ font-size:15px !important; }
        }
      `}</style>

      {/* Cover */}
      <div className="cover-section" style={{ position:'relative', height:190, background:'linear-gradient(135deg,#05051a,#0a0a1a)', overflow:'hidden', cursor:'pointer' }} onClick={()=>coverRef.current?.click()}>
        {coverPreview
          ? <img src={coverPreview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#a78bfa 0%,#7c6fff 50%,#34d399 100%)', opacity:0.12 }} />
              <div style={{ position:'absolute', top:20, left:24, display:'flex', gap:8 }}>
                {['🏢 Hiring Now','⭐ Top Company','🚀 Fast Growing'].map((tag,i)=>(
                  <span key={i} style={{ background:'rgba(167,139,250,0.2)', border:'1px solid #a78bfa44', color:'#a78bfa', padding:'4px 10px', borderRadius:20, fontSize:10, fontWeight:700 }}>{tag}</span>
                ))}
              </div>
            </>
        }
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 50%,#07070f 100%)' }} />
        <div style={{ position:'absolute', bottom:12, right:12, background:'rgba(0,0,0,0.6)', border:'1px solid #ffffff22', borderRadius:8, padding:'6px 10px', fontSize:11, color:'#aaa', display:'flex', alignItems:'center', gap:5 }}>
          📷 Change Cover
        </div>
        <input ref={coverRef} type="file" accept="image/*" style={{ display:'none' }} onChange={e=>{const f=e.target.files[0];if(f)setCoverPreview(URL.createObjectURL(f));}} />
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        {/* Profile Row */}
        <div className="co-profile-row" style={{ display:'flex', alignItems:'flex-end', gap:16, padding:'0 24px 20px', position:'relative' }}>
          <div style={{ position:'relative', flexShrink:0 }}>
            <div className="co-logo" onClick={()=>logoRef.current?.click()}
              style={{ width:88, height:88, borderRadius:18, border:'4px solid #07070f', overflow:'hidden', cursor:'pointer', background:'linear-gradient(135deg,#a78bfa,#7c6fff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:800, color:'#fff', marginTop:-44, position:'relative', zIndex:2 }}>
              {logoPreview || profile?.logo
                ? <img src={logoPreview || profile?.logo} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <span>{initials}</span>
              }
            </div>
            <input ref={logoRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleLogoChange} />
          </div>

          <div className="co-info" style={{ flex:1, paddingBottom:4, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <h2 className="co-name" style={{ margin:0, fontSize:22, fontWeight:800, color:'#fff' }}>{name}</h2>
              <span style={{ background:'#a78bfa22', border:'1px solid #a78bfa44', color:'#a78bfa', padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>Company</span>
              {profile?.verified && <span style={{ background:'#22c55e22', border:'1px solid #22c55e44', color:'#22c55e', padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>✓ Verified</span>}
            </div>
            <p style={{ margin:'4px 0 0', color:'#555', fontSize:13 }}>{profile?.industry || 'Technology'} • {profile?.location || 'India'}</p>
          </div>

          <Link to="/company/profile" style={{ background:'transparent', border:'1px solid #2a2a4a', color:'#888', padding:'8px 14px', borderRadius:10, fontSize:13, fontWeight:600, textDecoration:'none', marginBottom:4, flexShrink:0 }}>
            ✏️ Edit
          </Link>
        </div>

        <div className="co-pad" style={{ padding:'0 24px' }}>
          {/* Stats */}
          <div className="co-stats" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {[
              { num:jobs.length,         label:'Active Jobs',  icon:'💼', color:'#f97316' },
              { num:totalApps,           label:'Applications', icon:'📋', color:'#a78bfa' },
              { num:jobs.length * 42,    label:'Profile Views',icon:'👁️', color:'#34d399' },
              { num:jobs.filter(j=>j.status==='closed').length, label:'Positions Filled', icon:'✅', color:'#60a5fa' },
            ].map((s,i)=>(
              <div key={i} className="dash-card co-stat" style={{ background:'#0d0d1f', border:`1px solid ${s.color}22`, borderRadius:14, padding:'16px 12px', textAlign:'center', animation:`fadeUp 0.3s ease ${i*0.07}s both` }}>
                <span style={{ fontSize:24, display:'block', marginBottom:6 }}>{s.icon}</span>
                <p className="co-stat-num" style={{ margin:'0 0 3px', fontSize:26, fontWeight:800, color:s.color }}>{s.num}</p>
                <p style={{ margin:0, color:'#555', fontSize:11 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ background:'#0d0d1f', border:'1px solid #1e1e2e', borderRadius:16, padding:'16px', marginBottom:20 }}>
            <h3 className="section-title" style={{ margin:'0 0 14px', fontSize:16, fontWeight:700, color:'#fff' }}>⚡ Quick Actions</h3>
            <div className="co-actions" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
              {[
                { icon:'➕', label:'Post Job',      link:'/company/post-job',     color:'#f97316' },
                { icon:'📋', label:'Applications',  link:'/company/applications', color:'#a78bfa' },
                { icon:'✏️', label:'Edit Profile',  link:'/company/profile',      color:'#34d399' },
                { icon:'💎', label:'Upgrade Plan',  link:'/pricing',              color:'#60a5fa' },
              ].map((a,i)=>(
                <Link key={i} to={a.link}
                  style={{ background:a.color+'12', border:`1px solid ${a.color}22`, borderRadius:12, padding:'14px 8px', textAlign:'center', textDecoration:'none', display:'block', transition:'all 0.15s' }}>
                  <div style={{ fontSize:24, marginBottom:6 }}>{a.icon}</div>
                  <p style={{ margin:0, fontSize:11, color:'#888', fontWeight:600 }}>{a.label}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="co-grid" style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:16 }}>
            {/* Active Jobs */}
            <div>
              <div style={{ background:'#0d0d1f', border:'1px solid #1e1e2e', borderRadius:16, padding:'16px', marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <h3 className="section-title" style={{ margin:0, fontSize:16, fontWeight:700, color:'#fff' }}>💼 Active Job Posts</h3>
                  <Link to="/company/post-job" style={{ background:'linear-gradient(135deg,#f97316,#ea580c)', color:'#fff', padding:'6px 12px', borderRadius:8, fontSize:12, fontWeight:700, textDecoration:'none' }}>+ Post Job</Link>
                </div>
                {jobs.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'30px 16px' }}>
                    <div style={{ fontSize:36, marginBottom:8 }}>📭</div>
                    <p style={{ color:'#555', fontSize:13, margin:'0 0 12px' }}>No jobs posted yet</p>
                    <Link to="/company/post-job" style={{ background:'linear-gradient(135deg,#f97316,#ea580c)', color:'#fff', padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:700, textDecoration:'none' }}>
                      Post Your First Job →
                    </Link>
                  </div>
                ) : (
                  jobs.slice(0,5).map((job,i)=>(
                    <div key={job._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:i<jobs.length-1?'1px solid #0e0e1e':'none' }}>
                      <div style={{ width:38, height:38, borderRadius:10, background:'#f9731622', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>💼</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{job.title}</p>
                        <p style={{ margin:0, fontSize:11, color:'#555' }}>{job.location} • {job.jobType}</p>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:700, color:'#a78bfa' }}>{job.applicationsCount || 0}</p>
                        <p style={{ margin:0, fontSize:10, color:'#444' }}>applicants</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Hiring Funnel */}
              <div style={{ background:'#0d0d1f', border:'1px solid #1e1e2e', borderRadius:16, padding:'16px' }}>
                <h3 className="section-title" style={{ margin:'0 0 14px', fontSize:16, fontWeight:700, color:'#fff' }}>📊 Hiring Funnel</h3>
                {[
                  { label:'Applications Received', count:totalApps,                          color:'#f97316', pct:100 },
                  { label:'Screened',               count:Math.floor(totalApps*0.6),          color:'#a78bfa', pct:60 },
                  { label:'Shortlisted',            count:Math.floor(totalApps*0.3),          color:'#34d399', pct:30 },
                  { label:'Hired',                  count:Math.floor(totalApps*0.1),          color:'#22c55e', pct:10 },
                ].map((stage,i)=>(
                  <div key={i} style={{ marginBottom:10 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:12, color:'#888' }}>{stage.label}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:stage.color }}>{stage.count}</span>
                    </div>
                    <div style={{ height:5, borderRadius:3, background:'#1a1a2e', overflow:'hidden' }}>
                      <div style={{ height:'100%', borderRadius:3, background:stage.color, width:`${stage.pct}%`, transition:'width 0.6s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div>
              {/* Recent Applications */}
              <div style={{ background:'#0d0d1f', border:'1px solid #1e1e2e', borderRadius:16, padding:'16px', marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <h3 className="section-title" style={{ margin:0, fontSize:15, fontWeight:700, color:'#fff' }}>🌟 Recent Applicants</h3>
                  <Link to="/company/applications" style={{ color:'#f97316', fontSize:11, fontWeight:600, textDecoration:'none' }}>All →</Link>
                </div>
                {[1,2,3,4].map(i=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                    <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg,${['#f97316','#a78bfa','#34d399','#60a5fa'][i-1]},${['#f97316','#a78bfa','#34d399','#60a5fa'][i-1]}88)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:800, color:'#fff', flexShrink:0 }}>
                      {['R','S','A','P'][i-1]}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ margin:'0 0 1px', fontSize:12, fontWeight:600, color:'#fff' }}>{['Rahul K.','Sneha M.','Arjun P.','Priya S.'][i-1]}</p>
                      <p style={{ margin:0, fontSize:10, color:'#555' }}>{['React Dev','Data Sci','DevOps','PM'][i-1]}</p>
                    </div>
                    <span style={{ fontSize:10, background:'#a78bfa22', color:'#a78bfa', padding:'2px 6px', borderRadius:10, fontWeight:700, flexShrink:0 }}>{[92,88,85,81][i-1]}%</span>
                  </div>
                ))}
              </div>

              {/* Plan Card */}
              <div style={{ background:'linear-gradient(135deg,#1a0a00,#0a0514)', border:'1px solid #f9731622', borderRadius:16, padding:'16px', textAlign:'center' }}>
                <div style={{ fontSize:32, marginBottom:8 }}>💎</div>
                <h4 style={{ margin:'0 0 6px', color:'#fff', fontSize:14, fontWeight:700 }}>Upgrade to Premium</h4>
                <p style={{ margin:'0 0 12px', color:'#555', fontSize:11, lineHeight:1.6 }}>Get featured listings, priority support, and AI screening</p>
                <Link to="/pricing" style={{ display:'block', background:'linear-gradient(135deg,#f97316,#ea580c)', color:'#fff', padding:'10px', borderRadius:10, fontSize:13, fontWeight:700, textDecoration:'none' }}>
                  View Plans →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}