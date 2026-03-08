import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI, aiAPI, studentAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MapPin, Clock, DollarSign, Users, Bookmark, BookmarkCheck, Sparkles, ArrowLeft, Building2, ExternalLink } from 'lucide-react';

function timeAgo(d) {
  const h = Math.floor((Date.now() - new Date(d)) / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [job, setJob]                   = useState(null);
  const [loading, setLoading]           = useState(true);
  const [applying, setApplying]         = useState(false);
  const [showModal, setShowModal]       = useState(false);
  const [coverLetter, setCoverLetter]   = useState('');
  const [generatingCover, setGeneratingCover] = useState(false);
  const [saved, setSaved]               = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await jobAPI.getById(id);
        setJob(data.job);
        if (user?.role === 'student' && profile) {
          setSaved(profile.savedJobs?.some(j => j._id === id || j === id));
          const apps = await applicationAPI.getMyApplications();
          setAlreadyApplied(apps.data.applications.some(a => a.job?._id === id));
        }
      } catch { navigate('/jobs'); }
      finally { setLoading(false); }
    };
    fetchJob();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) { navigate('/login'); return; }
    if (!profile?.resume?.url) { toast.error('Please upload your resume first!'); navigate('/student/profile'); return; }
    setApplying(true);
    try {
      await applicationAPI.apply(id, { coverLetter });
      toast.success('Application submitted! 🎉');
      setAlreadyApplied(true);
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally { setApplying(false); }
  };

  const generateCover = async () => {
    setGeneratingCover(true);
    try {
      const { data } = await aiAPI.generateCoverLetter(id);
      setCoverLetter(data.coverLetter);
      toast.success('Cover letter generated! ✨');
    } catch { toast.error('AI generation failed'); }
    finally { setGeneratingCover(false); }
  };

  const toggleSave = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await studentAPI.toggleSaveJob(id);
      setSaved(data.saved);
      toast.success(data.message);
    } catch { toast.error('Failed to save job'); }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#07070f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 44, height: 44, border: '3px solid #1a1a2e', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!job) return null;

  const typeColor = job.jobType === 'remote' ? '#34d399' : job.jobType === 'internship' ? '#f59e0b' : '#a78bfa';

  return (
    <div style={{ minHeight: '100vh', background: '#07070f', fontFamily: "'Sora',sans-serif", padding: '32px 24px 80px' }}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes modalIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        .skilltag{background:#12122a;border:1px solid #2a2a4a;color:#8888aa;padding:5px 14px;border-radius:8px;font-size:12px;font-family:'Sora',sans-serif}
        .backbtn{background:#0d0d1f;border:1px solid #2a2a4a;color:#ccc;padding:9px 18px;border-radius:10px;cursor:pointer;font-family:'Sora',sans-serif;font-size:13px;display:flex;align-items:center;gap:8px;transition:all 0.2s;margin-bottom:24px}
        .backbtn:hover{border-color:#f97316;color:#f97316}
        .applybtn{background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;border:none;border-radius:12px;padding:13px 28px;font-size:15px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif;transition:opacity 0.2s}
        .applybtn:hover{opacity:0.85}
        .applybtn:disabled{opacity:0.5;cursor:not-allowed}
        .savebtn{background:#0d0d1f;border:1px solid #2a2a4a;color:#ccc;border-radius:12px;padding:13px 22px;font-size:14px;cursor:pointer;font-family:'Sora',sans-serif;display:flex;align-items:center;gap:8px;transition:all 0.2s}
        .savebtn:hover{border-color:#f97316;color:#f97316}
        .card{background:#0d0d1f;border:1px solid #1e1e2e;border-radius:16px;padding:24px;margin-bottom:20px}
        .aibtn{background:#a78bfa22;border:1px solid #a78bfa44;color:#a78bfa;padding:8px 16px;border-radius:8px;font-size:13px;cursor:pointer;font-family:'Sora',sans-serif;display:flex;align-items:center;gap:6px;transition:all 0.2s}
        .aibtn:hover{background:#a78bfa33}
        .aibtn:disabled{opacity:0.5;cursor:not-allowed}
        .cancelbtn{background:#1a1a2e;border:1px solid #2a2a4a;color:#ccc;border-radius:10px;padding:11px 22px;font-size:14px;cursor:pointer;font-family:'Sora',sans-serif;transition:all 0.2s}
        .cancelbtn:hover{border-color:#f97316;color:#f97316}
        .submitbtn{background:linear-gradient(135deg,#f97316,#ea580c);color:#fff;border:none;border-radius:10px;padding:11px 24px;font-size:14px;font-weight:700;cursor:pointer;font-family:'Sora',sans-serif}
        .submitbtn:disabled{opacity:0.5;cursor:not-allowed}
        @media(max-width:900px){
          .jd-layout{flex-direction:column !important}
          .jd-sidebar{width:100% !important}
        }
        @media(max-width:600px){
          .jd-wrap{padding:20px 14px 60px !important}
          .jd-title{font-size:22px !important}
          .jd-header{flex-direction:column !important;gap:12px !important}
          .jd-btns{flex-wrap:wrap !important}
          .card{padding:16px !important}
          .modal-box{padding:20px !important;margin:10px !important}
        }
      `}</style>

      <div className="jd-wrap" style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Back */}
        <button className="backbtn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back
        </button>

        {/* Layout */}
        <div className="jd-layout" style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>

          {/* ── MAIN ── */}
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Header Card */}
            <div className="card" style={{ animation: 'fadeUp 0.4s ease' }}>
              <div className="jd-header" style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
                {job.company?.logo
                  ? <img src={job.company.logo} alt="" style={{ width: 72, height: 72, borderRadius: 14, objectFit: 'cover', flexShrink: 0, border: '1px solid #2a2a4a' }} />
                  : <div style={{ width: 72, height: 72, borderRadius: 14, background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                      {job.company?.companyName?.[0]}
                    </div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <h1 className="jd-title" style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>{job.title}</h1>
                    <span style={{ background: typeColor + '22', border: `1px solid ${typeColor}44`, color: typeColor, padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'capitalize', flexShrink: 0 }}>
                      {job.jobType}
                    </span>
                  </div>
                  <p style={{ color: '#f97316', fontSize: 14, fontWeight: 600, margin: '0 0 12px' }}>{job.company?.companyName}</p>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13, color: '#666' }}>
                    {job.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} style={{ color: '#f97316' }} />{job.location}</span>}
                    {job.salary?.min && <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#34d399' }}><DollarSign size={13} />₹{(job.salary.min / 100000).toFixed(1)}L – ₹{(job.salary.max / 100000).toFixed(1)}L</span>}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} />{timeAgo(job.createdAt)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={13} />{job.totalApplications || 0} applicants</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="jd-btns" style={{ display: 'flex', gap: 12 }}>
                {user?.role === 'student' && (
                  alreadyApplied
                    ? <button className="applybtn" disabled>✅ Already Applied</button>
                    : <button className="applybtn" onClick={() => setShowModal(true)}>Apply Now 🚀</button>
                )}
                {user?.role === 'student' && (
                  <button className="savebtn" onClick={toggleSave}>
                    {saved ? <BookmarkCheck size={16} style={{ color: '#f97316' }} /> : <Bookmark size={16} />}
                    {saved ? 'Saved' : 'Save Job'}
                  </button>
                )}
                {!user && (
                  <button className="applybtn" onClick={() => navigate('/login')}>Login to Apply 🔐</button>
                )}
              </div>
            </div>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="card" style={{ animation: 'fadeUp 0.4s ease 0.1s both' }}>
                <h2 style={{ fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 16 }}>🛠 Required Skills</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {job.skills.map(s => <span key={s} className="skilltag">{s}</span>)}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="card" style={{ animation: 'fadeUp 0.4s ease 0.15s both' }}>
              <h2 style={{ fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 16 }}>📋 Job Description</h2>
              <p style={{ color: '#888', lineHeight: 1.8, fontSize: 14, whiteSpace: 'pre-wrap' }}>{job.description}</p>
            </div>

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="card" style={{ animation: 'fadeUp 0.4s ease 0.2s both' }}>
                <h2 style={{ fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 16 }}>✅ Requirements</h2>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {job.requirements.map((r, i) => (
                    <li key={i} style={{ display: 'flex', gap: 10, color: '#888', fontSize: 14, lineHeight: 1.6 }}>
                      <span style={{ color: '#f97316', flexShrink: 0 }}>◆</span>{r}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="jd-sidebar" style={{ width: 320, flexShrink: 0 }}>

            {/* Company Info */}
            <div className="card" style={{ animation: 'fadeUp 0.4s ease 0.1s both' }}>
              <h3 style={{ fontWeight: 700, color: '#fff', fontSize: 15, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Building2 size={16} style={{ color: '#f97316' }} /> About Company
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#555' }}>Industry:</span>
                  <span style={{ color: '#ccc', fontWeight: 500 }}>{job.company?.industry || 'N/A'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#555' }}>Location:</span>
                  <span style={{ color: '#ccc', fontWeight: 500 }}>{job.company?.location || 'N/A'}</span>
                </div>
                {job.company?.website && (
                  <a href={job.company.website} target="_blank" rel="noreferrer"
                    style={{ color: '#f97316', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, textDecoration: 'none', marginTop: 4 }}>
                    <ExternalLink size={13} /> Visit Website
                  </a>
                )}
                {job.company?.description && (
                  <p style={{ color: '#666', fontSize: 12, lineHeight: 1.6, marginTop: 8, borderTop: '1px solid #1a1a2e', paddingTop: 12 }}>
                    {job.company.description.substring(0, 200)}...
                  </p>
                )}
              </div>
            </div>

            {/* Job Details */}
            <div className="card" style={{ animation: 'fadeUp 0.4s ease 0.15s both' }}>
              <h3 style={{ fontWeight: 700, color: '#fff', fontSize: 15, marginBottom: 16 }}>📊 Job Details</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['Experience', `${job.experience?.min || 0}–${job.experience?.max || 3} years`],
                  ['Education', job.education || 'Any'],
                  ['Openings', `${job.openings || 1} position(s)`],
                  ['Deadline', job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN') : 'Open until filled'],
                  ['Views', `${job.views || 0} views`],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13 }}>
                    <span style={{ color: '#555' }}>{k}:</span>
                    <span style={{ color: '#ccc', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply CTA */}
            {!user && (
              <div style={{ background: 'linear-gradient(135deg,#1a0800,#0a0514)', border: '1px solid #f9731633', borderRadius: 16, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🚀</div>
                <h4 style={{ color: '#fff', margin: '0 0 8px', fontSize: 14 }}>Ready to Apply?</h4>
                <p style={{ color: '#666', fontSize: 12, margin: '0 0 14px' }}>Create a free account to apply</p>
                <button className="applybtn" style={{ width: '100%' }} onClick={() => navigate('/register')}>
                  Get Started Free
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── APPLY MODAL ── */}
      {showModal && (
        <div onClick={e => e.target === e.currentTarget && setShowModal(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' }}>
          <div className="modal-box" style={{ background: '#0d0d1f', border: '1px solid #2a2a4a', borderRadius: 20, padding: 28, width: '100%', maxWidth: 520, animation: 'modalIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 800, margin: 0 }}>Apply for {job.title}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#555', fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>✕</button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <label style={{ color: '#ccc', fontSize: 13, fontWeight: 600 }}>Cover Letter <span style={{ color: '#555' }}>(optional)</span></label>
                <button className="aibtn" onClick={generateCover} disabled={generatingCover}>
                  <Sparkles size={13} />
                  {generatingCover ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                placeholder="Write a compelling cover letter or use AI to generate one..."
                style={{ width: '100%', minHeight: 160, background: '#07070f', border: '1px solid #2a2a4a', borderRadius: 12, padding: 14, color: '#fff', fontSize: 13, fontFamily: "'Sora',sans-serif", outline: 'none', resize: 'vertical', lineHeight: 1.6 }} />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="cancelbtn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="submitbtn" onClick={handleApply} disabled={applying}>
                {applying ? '⏳ Submitting...' : '🚀 Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}