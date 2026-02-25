import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { applicationAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Briefcase, MapPin, Clock, Sparkles, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const STATUS_COLORS = {
  applied: 'badge-gray', reviewing: 'badge-yellow', shortlisted: 'badge-primary',
  interview: 'badge-primary', offered: 'badge-green', hired: 'badge-green', rejected: 'badge-red'
};

const STATUS_STEPS = ['applied', 'reviewing', 'shortlisted', 'interview', 'offered', 'hired'];

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    applicationAPI.getMyApplications()
      .then(({ data }) => setApplications(data.applications))
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

  if (loading) return <div className="loader-screen"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">My Applications</h1>
        <p className="page-subtitle">{applications.length} total applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="empty-state">
          <Briefcase size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
          <h3>No applications yet</h3>
          <p style={{ marginBottom: 20 }}>Start applying to jobs to see them here</p>
          <button className="btn btn-primary" onClick={() => navigate('/jobs')}>Browse Jobs</button>
        </div>
      ) : (
        <div className="grid-2" style={{ alignItems: 'flex-start' }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {applications.map(app => (
              <div key={app._id} className="card animate-fade" style={{ cursor: 'pointer', borderColor: selected?._id === app._id ? 'var(--primary)' : 'var(--border)' }} onClick={() => setSelected(app)}>
                <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
                  {app.job?.company?.logo
                    ? <img src={app.job.company.logo} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                    : <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white' }}>{app.job?.company?.companyName?.[0]}</div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, marginBottom: 2 }}>{app.job?.title}</div>
                    <div style={{ color: 'var(--text2)', fontSize: '0.825rem' }}>{app.job?.company?.companyName}</div>
                  </div>
                  <span className={`badge ${STATUS_COLORS[app.status] || 'badge-gray'}`}>{app.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text3)' }}>
                  <span><Clock size={12} style={{ display: 'inline', marginRight: 4 }} />{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}</span>
                  {app.aiMatchScore > 0 && <span style={{ color: 'var(--primary-light)', fontWeight: 600 }}><Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />{app.aiMatchScore}% AI match</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected ? (
            <div className="card" style={{ position: 'sticky', top: 80 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{selected.job?.title}</h3>
                  <p style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{selected.job?.company?.companyName}</p>
                </div>
                <span className={`badge ${STATUS_COLORS[selected.status]}`}>{selected.status}</span>
              </div>

              {/* Status tracker */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text3)', marginBottom: 12 }}>APPLICATION PROGRESS</p>
                <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  {STATUS_STEPS.map((step, i) => {
                    const currentIdx = STATUS_STEPS.indexOf(selected.status);
                    const isRejected = selected.status === 'rejected';
                    const done = !isRejected && i <= currentIdx;
                    return (
                      <React.Fragment key={step}>
                        <div style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ width: 10, height: 10, borderRadius: '50%', background: done ? 'var(--primary)' : 'var(--border)', margin: '0 auto 4px', border: i === currentIdx && !isRejected ? '2px solid var(--primary-light)' : 'none' }} />
                          <div style={{ fontSize: '0.65rem', color: done ? 'var(--primary-light)' : 'var(--text3)' }}>{step}</div>
                        </div>
                        {i < STATUS_STEPS.length - 1 && <div style={{ height: 2, flex: 0.5, background: done && i < currentIdx ? 'var(--primary)' : 'var(--border)', marginBottom: 16 }} />}
                      </React.Fragment>
                    );
                  })}
                </div>
                {selected.status === 'rejected' && <div style={{ marginTop: 8, color: 'var(--red)', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>Application was not selected</div>}
              </div>

              {selected.aiMatchScore > 0 && (
                <div style={{ padding: 14, background: 'rgba(108,99,255,0.1)', borderRadius: 10, marginBottom: 16, border: '1px solid rgba(108,99,255,0.2)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text3)', marginBottom: 6 }}>AI MATCH SCORE</p>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-light)', marginBottom: 4 }}>{selected.aiMatchScore}%</div>
                  {selected.aiMatchReason && <p style={{ fontSize: '0.825rem', color: 'var(--text2)' }}>{selected.aiMatchReason}</p>}
                </div>
              )}

              {selected.interviewDate && (
                <div style={{ padding: 14, background: 'rgba(34,197,94,0.1)', borderRadius: 10, marginBottom: 16, border: '1px solid rgba(34,197,94,0.2)' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--green)', marginBottom: 4 }}>INTERVIEW SCHEDULED</p>
                  <p style={{ fontWeight: 700 }}>{new Date(selected.interviewDate).toLocaleString()}</p>
                </div>
              )}

              {selected.coverLetter && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text3)', marginBottom: 8 }}>COVER LETTER</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.7, maxHeight: 150, overflow: 'auto' }}>{selected.coverLetter}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate(`/jobs/${selected.job?._id}`)}>View Job</button>
                {['applied', 'reviewing'].includes(selected.status) && (
                  <button className="btn btn-danger btn-sm" onClick={() => withdraw(selected._id)}>
                    <Trash2 size={14} /> Withdraw
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{ color: 'var(--text3)', textAlign: 'center', padding: '60px 20px' }}>
              Select an application to view details
            </div>
          )}
        </div>
      )}
    </div>
  );
}
