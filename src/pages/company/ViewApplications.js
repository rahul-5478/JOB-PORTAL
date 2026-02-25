import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { applicationAPI, aiAPI, jobAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Sparkles, User, FileText, ChevronLeft, Mail, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const STATUSES = ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'hired', 'rejected'];
const STATUS_COLORS = {
  applied: 'badge-gray', reviewing: 'badge-yellow', shortlisted: 'badge-primary',
  interview: 'badge-primary', offered: 'badge-green', hired: 'badge-green', rejected: 'badge-red'
};

export default function ViewApplications() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [job, setJob] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scoringId, setScoringId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [appRes, jobRes] = await Promise.all([applicationAPI.getJobApplications(jobId, { sortBy }), jobAPI.getById(jobId)]);
        setApplications(appRes.data.applications);
        setJob(jobRes.data.job);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, [jobId, sortBy]);

  const updateStatus = async (appId, status, note = '') => {
    try {
      const { data } = await applicationAPI.updateStatus(appId, { status, note });
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, ...data.application } : a));
      if (selected?._id === appId) setSelected(prev => ({ ...prev, ...data.application }));
      toast.success(`Status updated to "${status}"`);
    } catch { toast.error('Failed to update status'); }
  };

  const scoreWithAI = async (appId) => {
    setScoringId(appId);
    try {
      const { data } = await aiAPI.scoreApplication(appId);
      setApplications(prev => prev.map(a => a._id === appId ? { ...a, aiMatchScore: data.score, aiMatchReason: data.reason } : a));
      if (selected?._id === appId) setSelected(prev => ({ ...prev, aiMatchScore: data.score, aiMatchReason: data.reason, aiStrengths: data.strengths, aiGaps: data.gaps }));
      toast.success(`AI Score: ${data.score}%`);
    } catch { toast.error('AI scoring failed'); }
    finally { setScoringId(null); }
  };

  const filtered = applications.filter(a => !filterStatus || a.status === filterStatus);

  if (loading) return <div className="loader-screen"><div className="spinner" /></div>;

  return (
    <div className="page">
      <button className="btn btn-secondary btn-sm" onClick={() => navigate('/company/jobs')} style={{ marginBottom: 20 }}>
        <ChevronLeft size={16} /> Back to Jobs
      </button>

      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">{job?.title}</h1>
        <p className="page-subtitle">{applications.length} total applications</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <select className="form-select" style={{ width: 160 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="form-select" style={{ width: 160 }} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="createdAt">Latest First</option>
          <option value="aiScore">AI Score</option>
        </select>
        <button className="btn btn-secondary btn-sm" onClick={() => { setFilterStatus(''); setSortBy('createdAt'); }}>Reset</button>
      </div>

      <div className="grid-2" style={{ alignItems: 'flex-start' }}>
        {/* Application List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.length === 0 ? (
            <div className="empty-state"><p>No applications match this filter</p></div>
          ) : filtered.map(app => (
            <div key={app._id} className="card animate-fade" style={{ cursor: 'pointer', borderColor: selected?._id === app._id ? 'var(--primary)' : 'var(--border)', padding: '16px 20px' }}
              onClick={() => setSelected(app)}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                {app.student?.user?.avatar
                  ? <img src={app.student.user.avatar} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', flexShrink: 0 }}>{app.student?.user?.name?.[0]}</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, marginBottom: 2 }}>{app.student?.user?.name}</div>
                  <div style={{ color: 'var(--text2)', fontSize: '0.8rem' }}>{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
                  {app.aiMatchScore > 0 && (
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: app.aiMatchScore >= 70 ? 'var(--green)' : app.aiMatchScore >= 50 ? 'var(--yellow)' : 'var(--red)' }}>
                      {app.aiMatchScore}%
                    </span>
                  )}
                  <span className={`badge ${STATUS_COLORS[app.status]}`}>{app.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail Panel */}
        {selected ? (
          <div className="card" style={{ position: 'sticky', top: 80 }}>
            {/* Candidate Info */}
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              {selected.student?.user?.avatar
                ? <img src={selected.student.user.avatar} alt="" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }} />
                : <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>{selected.student?.user?.name?.[0]}</div>
              }
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{selected.student?.user?.name}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{selected.student?.headline || 'No headline'}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  <span className={`badge ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            {selected.student?.skills?.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600, marginBottom: 8 }}>SKILLS</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {selected.student.skills.map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>
              </div>
            )}

            {/* AI Score */}
            {selected.aiMatchScore > 0 ? (
              <div style={{ padding: 14, background: 'rgba(108,99,255,0.08)', borderRadius: 10, marginBottom: 16, border: '1px solid rgba(108,99,255,0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600 }}>AI MATCH SCORE</p>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: selected.aiMatchScore >= 70 ? 'var(--green)' : selected.aiMatchScore >= 50 ? 'var(--yellow)' : 'var(--red)' }}>{selected.aiMatchScore}%</span>
                </div>
                {selected.aiMatchReason && <p style={{ fontSize: '0.825rem', color: 'var(--text2)', lineHeight: 1.6 }}>{selected.aiMatchReason}</p>}
                {selected.aiStrengths?.length > 0 && (
                  <div style={{ marginTop: 10 }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--green)', fontWeight: 600, marginBottom: 4 }}>STRENGTHS</p>
                    {selected.aiStrengths.map((s, i) => <p key={i} style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>✓ {s}</p>)}
                  </div>
                )}
                {selected.aiGaps?.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--yellow)', fontWeight: 600, marginBottom: 4 }}>GAPS</p>
                    {selected.aiGaps.map((g, i) => <p key={i} style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>⚠ {g}</p>)}
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }} onClick={() => scoreWithAI(selected._id)} disabled={scoringId === selected._id}>
                <Sparkles size={16} /> {scoringId === selected._id ? 'Scoring...' : 'Score with AI'}
              </button>
            )}

            {/* Cover Letter */}
            {selected.coverLetter && (
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600, marginBottom: 8 }}>COVER LETTER</p>
                <p style={{ fontSize: '0.825rem', color: 'var(--text2)', lineHeight: 1.7, maxHeight: 120, overflow: 'auto', background: 'var(--bg3)', padding: 12, borderRadius: 8 }}>{selected.coverLetter}</p>
              </div>
            )}

            {/* Actions */}
            <div style={{ marginBottom: 16 }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text3)', fontWeight: 600, marginBottom: 10 }}>UPDATE STATUS</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {STATUSES.map(s => (
                  <button key={s} className={`btn btn-sm ${selected.status === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => updateStatus(selected._id, s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              {selected.resumeUrl && <a href={selected.resumeUrl} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}><FileText size={14} /> Resume</a>}
              <a href={`mailto:${selected.student?.user?.email}`} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}><Mail size={14} /> Email</a>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text3)' }}>
            Select an applicant to review their profile
          </div>
        )}
      </div>
    </div>
  );
}
