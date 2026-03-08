import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Briefcase, MapPin, Clock, Sparkles, Trash2, ChevronRight, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const STATUS_CONFIG = {
  applied:     { color: '#94a3b8', bg: 'rgba(148,163,184,0.15)', border: 'rgba(148,163,184,0.3)', label: 'Applied' },
  reviewing:   { color: '#fbbf24', bg: 'rgba(251,191,36,0.15)',  border: 'rgba(251,191,36,0.3)',  label: 'Reviewing' },
  shortlisted: { color: '#a5b4fc', bg: 'rgba(165,180,252,0.15)', border: 'rgba(165,180,252,0.3)', label: 'Shortlisted' },
  interview:   { color: '#818cf8', bg: 'rgba(129,140,248,0.15)', border: 'rgba(129,140,248,0.3)', label: 'Interview' },
  offered:     { color: '#4ade80', bg: 'rgba(74,222,128,0.15)',  border: 'rgba(74,222,128,0.3)',  label: 'Offered' },
  hired:       { color: '#4ade80', bg: 'rgba(74,222,128,0.15)',  border: 'rgba(74,222,128,0.3)',  label: 'Hired 🎉' },
  rejected:    { color: '#f87171', bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.3)', label: 'Rejected' },
};

const STATUS_STEPS = ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'hired'];

const S = {
  page: { minHeight: '100vh', background: '#0f172a', padding: '32px 24px', fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: 1100, margin: '0 auto' },
  header: { marginBottom: 28 },
  title: { fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: 0, marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#64748b' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 420px', gap: 20, alignItems: 'flex-start' },
  card: { background: '#1e293b', borderRadius: 16, border: '1px solid #334155', overflow: 'hidden' },
  appCard: (selected) => ({
    background: selected ? '#1a2744' : '#1e293b',
    borderRadius: 14,
    border: `1px solid ${selected ? '#6366f1' : '#334155'}`,
    padding: '16px 18px',
    cursor: 'pointer',
    marginBottom: 10,
    transition: 'all 0.15s',
  }),
  logoBox: (color) => ({
    width: 46, height: 46, borderRadius: 12,
    background: color || 'linear-gradient(135deg,#6366f1,#8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 18, fontWeight: 800, color: 'white', flexShrink: 0,
  }),
  statusBadge: (status) => {
    const c = STATUS_CONFIG[status] || STATUS_CONFIG.applied;
    return { padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: c.bg, color: c.color, border: `1px solid ${c.border}`, whiteSpace: 'nowrap' };
  },
  emptyState: { textAlign: 'center', padding: '80px 20px', background: '#1e293b', borderRadius: 16, border: '1px solid #334155' },
  browseBtn: { padding: '12px 28px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginTop: 16 },
  detailCard: { background: '#1e293b', borderRadius: 16, border: '1px solid #334155', padding: 24, position: 'sticky', top: 80 },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 10 },
  stepDot: (done, current) => ({
    width: 10, height: 10, borderRadius: '50%', margin: '0 auto 5px',
    background: done ? '#6366f1' : '#334155',
    border: current ? '2px solid #a5b4fc' : 'none',
    boxSizing: 'border-box',
  }),
  stepLine: (done) => ({ height: 2, flex: 1, background: done ? '#6366f1' : '#334155', marginBottom: 18 }),
  stepLabel: (done) => ({ fontSize: '0.6rem', color: done ? '#a5b4fc' : '#475569', textAlign: 'center', textTransform: 'capitalize' }),
  actionBtn: (variant) => ({
    flex: 1, padding: '10px', borderRadius: 9,
    border: variant === 'primary' ? 'none' : '1px solid #334155',
    background: variant === 'primary' ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : '#0f172a',
    color: variant === 'primary' ? 'white' : '#94a3b8',
    fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
  }),
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    applicationAPI.getMyApplications()
      .then(({ data }) => setApplications(data.applications))
      .catch(() => toast.error('Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const withdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    try {
      await applicationAPI.withdraw(id);
      setApplications(prev => prev.filter(a => a._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Application withdrawn');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to withdraw'); }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 40, height: 40, border: '3px solid #6366f1', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={S.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={S.container}>

        {/* Header */}
        <div style={S.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={22} color="#a5b4fc" />
            </div>
            <div>
              <h1 style={S.title}>My Applications</h1>
              <p style={S.subtitle}>{applications.length} total application{applications.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        {applications.length > 0 && (
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            {Object.entries(
              applications.reduce((acc, a) => { acc[a.status] = (acc[a.status] || 0) + 1; return acc; }, {})
            ).map(([status, count]) => (
              <div key={status} style={{ padding: '8px 16px', background: STATUS_CONFIG[status]?.bg || 'rgba(148,163,184,0.1)', border: `1px solid ${STATUS_CONFIG[status]?.border || '#334155'}`, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18, fontWeight: 800, color: STATUS_CONFIG[status]?.color || '#94a3b8' }}>{count}</span>
                <span style={{ fontSize: 12, color: '#64748b', textTransform: 'capitalize' }}>{status}</span>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {applications.length === 0 ? (
          <div style={S.emptyState}>
            <Briefcase size={56} color="#334155" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>No applications yet</h3>
            <p style={{ color: '#64748b', fontSize: 14 }}>Start applying to jobs to see them here</p>
            <button style={S.browseBtn} onClick={() => navigate('/jobs')}>Browse Jobs →</button>
          </div>
        ) : (
          <div style={S.grid}>

            {/* Left — Application List */}
            <div>
              {applications.map(app => (
                <div key={app._id} style={S.appCard(selected?._id === app._id)} onClick={() => setSelected(app)}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    {/* Logo */}
                    {app.job?.company?.logo
                      ? <img src={app.job.company.logo} alt="" style={{ width: 46, height: 46, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
                      : <div style={S.logoBox(`hsl(${app.job?.title?.charCodeAt(0) * 5 % 360},55%,35%)`)}>{app.job?.company?.companyName?.[0] || '?'}</div>
                    }

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 4 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{app.job?.title || 'Job Title'}</div>
                        <span style={S.statusBadge(app.status)}>{STATUS_CONFIG[app.status]?.label || app.status}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 8 }}>{app.job?.company?.companyName}</div>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#64748b', flexWrap: 'wrap' }}>
                        {app.job?.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{app.job.location}</span>}
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</span>
                        {app.aiMatchScore > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#a5b4fc' }}><Sparkles size={11} />{app.aiMatchScore}% match</span>}
                      </div>
                    </div>
                    <ChevronRight size={16} color="#475569" style={{ flexShrink: 0, marginTop: 4 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Right — Detail Panel */}
            {selected ? (
              <div style={S.detailCard}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ flex: 1, marginRight: 12 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>{selected.job?.title}</div>
                    <div style={{ fontSize: 13, color: '#94a3b8' }}>{selected.job?.company?.companyName}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={S.statusBadge(selected.status)}>{STATUS_CONFIG[selected.status]?.label || selected.status}</span>
                    <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4 }}><X size={16} /></button>
                  </div>
                </div>

                {/* Progress Tracker */}
                <div style={{ marginBottom: 24 }}>
                  <div style={S.sectionLabel}>Application Progress</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                    {STATUS_STEPS.map((step, i) => {
                      const currentIdx = STATUS_STEPS.indexOf(selected.status);
                      const isRejected = selected.status === 'rejected';
                      const done = !isRejected && i <= currentIdx;
                      const current = i === currentIdx && !isRejected;
                      return (
                        <React.Fragment key={step}>
                          <div style={{ textAlign: 'center', flex: 1 }}>
                            <div style={S.stepDot(done, current)} />
                            <div style={S.stepLabel(done)}>{step}</div>
                          </div>
                          {i < STATUS_STEPS.length - 1 && <div style={S.stepLine(done && i < currentIdx)} />}
                        </React.Fragment>
                      );
                    })}
                  </div>
                  {selected.status === 'rejected' && (
                    <div style={{ marginTop: 12, padding: '8px 14px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 8, fontSize: 12, color: '#f87171', textAlign: 'center' }}>
                      Application was not selected this time
                    </div>
                  )}
                </div>

                {/* AI Match Score */}
                {selected.aiMatchScore > 0 && (
                  <div style={{ padding: 16, background: 'rgba(99,102,241,0.1)', borderRadius: 12, marginBottom: 16, border: '1px solid rgba(99,102,241,0.2)' }}>
                    <div style={S.sectionLabel}>AI Match Score</div>
                    <div style={{ fontSize: 36, fontWeight: 900, color: '#a5b4fc', marginBottom: 4 }}>{selected.aiMatchScore}%</div>
                    {selected.aiMatchReason && <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{selected.aiMatchReason}</p>}
                  </div>
                )}

                {/* Interview Info */}
                {selected.interviewDate && (
                  <div style={{ padding: 14, background: 'rgba(74,222,128,0.08)', borderRadius: 12, marginBottom: 16, border: '1px solid rgba(74,222,128,0.2)' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: '#4ade80', marginBottom: 6, letterSpacing: '0.5px' }}>INTERVIEW SCHEDULED</div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{new Date(selected.interviewDate).toLocaleString()}</div>
                  </div>
                )}

                {/* Cover Letter */}
                {selected.coverLetter && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={S.sectionLabel}>Cover Letter</div>
                    <div style={{ padding: 14, background: '#0f172a', borderRadius: 10, border: '1px solid #334155', fontSize: 13, color: '#94a3b8', lineHeight: 1.7, maxHeight: 140, overflowY: 'auto' }}>
                      {selected.coverLetter}
                    </div>
                  </div>
                )}

                {/* Applied Date */}
                <div style={{ fontSize: 12, color: '#475569', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Clock size={12} />
                  Applied {formatDistanceToNow(new Date(selected.createdAt), { addSuffix: true })}
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button style={S.actionBtn('secondary')} onClick={() => navigate(`/jobs/${selected.job?._id}`)}>View Job</button>
                  <button style={S.actionBtn('primary')} onClick={() => navigate(`/jobs/${selected.job?._id}`)}>Apply Again</button>
                </div>
                {['applied', 'reviewing'].includes(selected.status) && (
                  <button
                    onClick={() => withdraw(selected._id)}
                    style={{ width: '100%', marginTop: 10, padding: '9px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 9, color: '#f87171', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 600 }}>
                    <Trash2 size={13} /> Withdraw Application
                  </button>
                )}
              </div>
            ) : (
              <div style={{ background: '#1e293b', borderRadius: 16, border: '1px dashed #334155', padding: '60px 20px', textAlign: 'center' }}>
                <Briefcase size={40} color="#334155" style={{ marginBottom: 12 }} />
                <div style={{ color: '#475569', fontSize: 14 }}>Select an application<br />to view details</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}