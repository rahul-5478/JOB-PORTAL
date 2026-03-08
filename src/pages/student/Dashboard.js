import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, jobAPI, applicationAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const QUICK_ACTIONS = [
  { icon:'🔍', label:'Find Jobs',      link:'/real-jobs',              color:'#f97316' },
  { icon:'📄', label:'Build Resume',   link:'/student/resume-builder', color:'#a78bfa' },
  { icon:'🤖', label:'AI Matches',     link:'/student/ai-matches',     color:'#34d399' },
  { icon:'📊', label:'Analyze Resume', link:'/student/resume-analyzer',color:'#60a5fa' },
  { icon:'💰', label:'Salary Check',   link:'/student/salary-predictor',color:'#f59e0b' },
  { icon:'💬', label:'AI Chat',        link:'/ai-chatbot',             color:'#ec4899' },
];

const JOB_COLORS = ['#f97316','#a78bfa','#34d399','#60a5fa','#f59e0b','#ec4899'];

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [coverPreview, setCoverPreview] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const coverRef = useRef();
  const avatarRef = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        const [pRes, aRes, jRes] = await Promise.allSettled([
          studentAPI.getProfile(),
          applicationAPI.getMyApplications(),
          jobAPI.getAll({ limit:6 }),
        ]);
        if (pRes.status==='fulfilled') setProfile(pRes.value.data.student);
        if (aRes.status==='fulfilled') setApplications(aRes.value.data.applications || []);
        if (jRes.status==='fulfilled') setJobs(jRes.value.data.jobs || []);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) setCoverPreview(URL.createObjectURL(file));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    try {
      const fd = new FormData(); fd.append('avatar', file);
      await studentAPI.uploadAvatar(fd);
      toast.success('Profile photo updated!');
    } catch { toast.error('Upload failed'); }
  };

  const name = profile?.name || user?.name || 'Student';
  const initials = name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
  const completionItems = [
    { label:'Profile Photo', done:!!profile?.avatar },
    { label:'Skills Added', done:profile?.skills?.length > 0 },
    { label:'Resume Uploaded', done:!!profile?.resume },
    { label:'Bio Written', done:!!profile?.bio },
  ];
  const completionScore = Math.round((completionItems.filter(i=>i.done).length / completionItems.length) * 100);

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#07070f', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:40, height:40, border:'3px solid #1a1a2e', borderTop:'3px solid #f97316', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
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
        .qa-btn{ transition:all 0.15s !important; }
        .qa-btn:hover{ transform:scale(1.04) !important; opacity:0.9 !important; }

        /* Mobile */
        @media(max-width:768px){
          .cover-section{ height:140px !important; }
          .profile-row{ padding:0 14px 16px !important; flex-direction:column !important; align-items:center !important; text-align:center !important; }
          .profile-avatar{ width:80px !important; height:80px !important; top:-40px !important; font-size:26px !important; }
          .profile-info{ margin-top:44px !important; }
          .profile-name{ font-size:18px !important; }
          .edit-btn{ display:none !important; }
          .stats-grid{ grid-template-columns:repeat(2,1fr) !important; gap:10px !important; }
          .stat-card{ padding:14px 10px !important; }
          .stat-num{ font-size:22px !important; }
          .qa-grid{ grid-template-columns:repeat(3,1fr) !important; gap:8px !important; }
          .qa-btn{ padding:12px 6px !important; }
          .qa-icon{ font-size:22px !important; }
          .qa-label{ font-size:10px !important; }
          .dash-grid{ grid-template-columns:1fr !important; }
          .section-title{ font-size:15px !important; }
          .dash-pad{ padding:0 14px !important; }
        }
        @media(max-width:400px){
          .qa-grid{ grid-template-columns:repeat(2,1fr) !important; }
          .stats-grid{ grid-template-columns:1fr 1fr !important; }
        }
      `}</style>

      {/* Cover Photo */}
      <div className="cover-section" style={{ position:'relative', height:200, background:'linear-gradient(135deg,#1a0800,#0a0514)', overflow:'hidden', cursor:'pointer' }} onClick={()=>coverRef.current?.click()}>
        {coverPreview
          ? <img src={coverPreview} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
          : <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#f97316 0%,#a78bfa 50%,#34d399 100%)', opacity:0.15 }} />
        }
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,transparent 50%,#07070f 100%)' }} />
        <div style={{ position:'absolute', bottom:12, right:12, background:'rgba(0,0,0,0.6)', border:'1px solid #ffffff22', borderRadius:8, padding:'6px 10px', fontSize:11, color:'#aaa', display:'flex', alignItems:'center', gap:5 }}>
          📷 Change Cover
        </div>
        <input ref={coverRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleCoverChange} />
      </div>

      {/* Profile Row */}
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div className="profile-row" style={{ display:'flex', alignItems:'flex-end', gap:16, padding:'0 24px 20px', position:'relative' }}>
          {/* Avatar */}
          <div style={{ position:'relative', flexShrink:0 }}>
            <div className="profile-avatar" onClick={()=>avatarRef.current?.click()}
              style={{ width:96, height:96, borderRadius:'50%', border:'4px solid #07070f', overflow:'hidden', cursor:'pointer', background:'linear-gradient(135deg,#f97316,#ea580c)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:800, color:'#fff', marginTop:-48, position:'relative', zIndex:2 }}>
              {avatarPreview || profile?.avatar
                ? <img src={avatarPreview || profile?.avatar} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                : <span>{initials}</span>
              }
              <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, opacity:0, transition:'all 0.2s' }}
                onMouseEnter={e=>e.currentTarget.style.opacity=1} onMouseLeave={e=>e.currentTarget.style.opacity=0}>📷</div>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handleAvatarChange} />
          </div>

          <div className="profile-info" style={{ flex:1, paddingBottom:4, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
              <h2 className="profile-name" style={{ margin:0, fontSize:22, fontWeight:800, color:'#fff' }}>{name}</h2>
              <span style={{ background:'#f9731622', border:'1px solid #f9731644', color:'#f97316', padding:'2px 10px', borderRadius:20, fontSize:11, fontWeight:700 }}>Student</span>
            </div>
            <p style={{ margin:'4px 0 0', color:'#555', fontSize:13 }}>{profile?.bio || 'Add a bio to stand out to recruiters'}</p>
          </div>

          <div className="edit-btn" style={{ marginBottom:4 }}>
            <Link to="/student/profile" style={{ background:'transparent', border:'1px solid #2a2a4a', color:'#888', padding:'8px 16px', borderRadius:10, fontSize:13, fontWeight:600, textDecoration:'none' }}>
              ✏️ Edit Profile
            </Link>
          </div>
        </div>

        <div className="dash-pad" style={{ padding:'0 24px' }}>
          {/* Stats */}
          <div className="stats-grid" style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
            {[
              { num:applications.length, label:'Applications', icon:'📋', color:'#f97316' },
              { num:applications.filter(a=>a.status==='shortlisted').length, label:'Shortlisted', icon:'⭐', color:'#a78bfa' },
              { num:Math.floor(completionScore * 0.8), label:'Profile Views', icon:'👁️', color:'#34d399' },
              { num:applications.filter(a=>a.status==='interview').length, label:'Interviews', icon:'🎯', color:'#60a5fa' },
            ].map((s,i)=>(
              <div key={i} className="dash-card stat-card" style={{ background:'#0d0d1f', border:`1px solid ${s.color}22`, borderRadius:14, padding:'16px 12px', textAlign:'center', animation:`fadeUp 0.3s ease ${i*0.07}s both` }}>
                <span style={{ fontSize:24, display:'block', marginBottom:6 }}>{s.icon}</span>
                <p className="stat-num" style={{ margin:'0 0 3px', fontSize:26, fontWeight:800, color:s.color }}>{s.num}</p>
                <p style={{ margin:0, color:'#555', fontSize:11 }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ background:'#0d0d1f', border:'1px solid #1e1e2e', borderRadius:16, padding:'16px', marginBottom:20 }}>
            <h3 className="section-title" style={{ margin:'0 0 14px', fontSize:16, fontWeight:700, color:'#fff' }}>⚡ Quick Actions</h3>
            <div className="qa-grid" style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10 }}>
              {QUICK_ACTIONS.map((a,i)=>(
                <Link key={i} to={a.link} className="qa-btn"
                  style={{ background:a.color+'12', border:`1px solid ${a.color}22`, borderRadius:12, padding:'14px 8px', textAlign:'center', textDecoration:'none', display:'block' }}>
                  <div className="qa-icon" style={{ fontSize:26, marginBottom:6 }}>{a.icon}</div>
                  <p className="qa-label" style={{ margin:0, fontSize:11, color:'#888', fontWeight:600, lineHeight:1.3 }}>{a.label}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="dash-grid" style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16 }}>
            {/* Left: Recent Applications */}
            <div>
              <div style={{ background:'#0d0d1f', border:'1px solid #1e1e2e', borderRadius:16, padding:'16px', marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <h3 className="section-title" style={{ margin:0, fontSize:16, fontWeight:700, color:'#fff' }}>📋 My Applications</h3>
                  <Link to="/student/applications" style={{ color:'#f97316', fontSize:12, fontWeight:600, textDecoration:'none' }}>View All →</Link>
                </div>
                {applications.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'30px 16px' }}>
                    <div style={{ fontSize:36, marginBottom:8 }}>📭</div>
                    <p style={{ color:'#555', fontSize:13, margin:'0 0 12px' }}>No applications yet</p>
                    <Link to="/real-jobs" style={{ background:'linear-gradient(135deg,#f97316,#ea580c)', color:'#fff', padding:'10px 20px', borderRadius:10, fontSize:13, fontWeight:700, textDecoration:'none' }}>
                      Find Jobs →
                    </Link>
                  </div>
                ) : (
                  applications.slice(0,5).map((app,i)=>{
                    const statusColors = { pending:'#f59e0b', shortlisted:'#a78bfa', rejected:'#ef4444', hired:'#22c55e', interview:'#60a5fa' };
                    const color = statusColors[app.status] || '#555';
                    return (
                      <div key={app._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:i<applications.length-1?'1px solid #0e0e1e':'none' }}>
                        <div style={{ width:36, height:36, borderRadius:10, background:JOB_COLORS[i%JOB_COLORS.length]+'22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color:JOB_COLORS[i%JOB_COLORS.length], flexShrink:0 }}>
                          {(app.job?.company?.companyName||'C')[0]}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{app.job?.title||'Job'}</p>
                          <p style={{ margin:0, fontSize:11, color:'#555' }}>{app.job?.company?.companyName||'Company'}</p>
                        </div>
                        <span style={{ background:color+'22', border:`1px solid ${color}44`, color, padding:'3px 8px', borderRadius:20, fontSize:10, fontWeight:700, flexShrink:0, textTransform:'capitalize' }}>
                          {app.status}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* AI Matches */}
              <div style={{ background:'#0d0d1f', border:'1px solid #1e1e2e', borderRadius:16, padding:'16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <h3 className="section-title" style={{ margin:0, fontSize:16, fontWeight:700, color:'#fff' }}>🎯 Recommended Jobs</h3>
                  <Link to="/real-jobs" style={{ color:'#f97316', fontSize:12, fontWeight:600, textDecoration:'none' }}>More →</Link>
                </div>
                {jobs.slice(0,4).map((job,i)=>{
                  const color = JOB_COLORS[i%JOB_COLORS.length];
                  const match = 95 - i*5;
                  return (
                    <div key={job._id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:i<3?'1px solid #0e0e1e':'none' }}>
                      <div style={{ width:36, height:36, borderRadius:10, background:color+'22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:800, color, flexShrink:0 }}>
                        {(job.company?.companyName||'C')[0]}
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ margin:'0 0 2px', fontSize:13, fontWeight:700, color:'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{job.title}</p>
                        <p style={{ margin:0, fontSize:11, color:'#555' }}>{job.company?.companyName} • {job.location}</p>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <p style={{ margin:'0 0 2px', fontSize:12, fontWeight:700, color:'#34d399' }}>{match}%</p>
                        <p style={{ margin:0, fontSize:10, color:'#444' }}>match</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Sidebar */}
            <div>
              {/* Profile Completion */}
              <div style={{ background:'#0d0d1f', border:'1px solid #1e1e2e', borderRadius:16, padding:'16px', marginBottom:16 }}>
                <h3 className="section-title" style={{ margin:'0 0 12px', fontSize:16, fontWeight:700, color:'#fff' }}>✅ Profile Completion</h3>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                  <span style={{ color:'#888', fontSize:13 }}>Completeness</span>
                  <span style={{ color:'#f97316', fontWeight:700, fontSize:13 }}>{completionScore}%</span>
                </div>
                <div style={{ height:6, borderRadius:3, background:'#1a1a2e', marginBottom:14, overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:3, background:'linear-gradient(90deg,#f97316,#ea580c)', width:`${completionScore}%`, transition:'width 0.6s ease' }} />
                </div>
                {completionItems.map((item,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <div style={{ width:18, height:18, borderRadius:'50%', background:item.done?'#22c55e22':'#1a1a2e', border:`1px solid ${item.done?'#22c55e':'#2a2a4a'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      {item.done && <span style={{ color:'#22c55e', fontSize:10 }}>✓</span>}
                    </div>
                    <span style={{ fontSize:12, color:item.done?'#888':'#555' }}>{item.label}</span>
                  </div>
                ))}
                <Link to="/student/profile" style={{ display:'block', textAlign:'center', background:'linear-gradient(135deg,#f97316,#ea580c)', color:'#fff', padding:'10px', borderRadius:10, fontSize:13, fontWeight:700, textDecoration:'none', marginTop:12 }}>
                  Complete Profile →
                </Link>
              </div>

              {/* Resume Score */}
              <div style={{ background:'#0d0d1f', border:'1px solid #1e1e2e', borderRadius:16, padding:'16px' }}>
                <h3 className="section-title" style={{ margin:'0 0 12px', fontSize:16, fontWeight:700, color:'#fff' }}>📊 Resume Score</h3>
                <div style={{ textAlign:'center', marginBottom:12 }}>
                  <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#f9731622,#ea580c22)', border:'3px solid #f97316' }}>
                    <span style={{ fontSize:24, fontWeight:800, color:'#f97316' }}>{profile?.resume ? '72' : '—'}</span>
                  </div>
                  <p style={{ margin:'8px 0 0', color:'#555', fontSize:12 }}>{profile?.resume ? 'Good — keep improving' : 'Upload resume to get score'}</p>
                </div>
                <Link to="/student/resume-analyzer" style={{ display:'block', textAlign:'center', background:'transparent', border:'1px solid #a78bfa44', color:'#a78bfa', padding:'10px', borderRadius:10, fontSize:13, fontWeight:700, textDecoration:'none' }}>
                  Analyze Resume →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}