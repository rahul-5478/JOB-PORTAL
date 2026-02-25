import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, Users, Eye, Plus, ChevronRight, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function CompanyDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dash, setDash] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    companyAPI.getDashboard()
      .then(({ data }) => setDash(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loader-screen"><div className="spinner" /></div>;

  const stats = [
    { label: 'Total Jobs Posted', value: dash?.stats.totalJobs || 0, icon: Briefcase, color: 'var(--primary)', bg: 'rgba(108,99,255,0.15)' },
    { label: 'Active Jobs', value: dash?.stats.activeJobs || 0, icon: Eye, color: 'var(--green)', bg: 'rgba(34,197,94,0.15)' },
    { label: 'Total Applications', value: dash?.stats.totalApplications || 0, icon: Users, color: 'var(--accent)', bg: 'rgba(255,107,157,0.15)' },
  ];

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">Welcome, {user.name}!</h1>
          <p className="page-subtitle">Manage your job postings and applications</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/company/post-job')}>
          <Plus size={18} /> Post New Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 32 }}>
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}><s.icon size={22} color={s.color} /></div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid-2" style={{ marginBottom: 32 }}>
        {[
          { label: 'Manage Jobs', desc: 'Edit, close or view your job postings', path: '/company/jobs', color: 'var(--primary)' },
          { label: 'Update Profile', desc: 'Complete your company profile to attract candidates', path: '/company/profile', color: 'var(--accent)' },
        ].map(a => (
          <div key={a.label} className="card card-hover" style={{ cursor: 'pointer' }} onClick={() => navigate(a.path)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 6, color: a.color }}>{a.label}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{a.desc}</p>
              </div>
              <ChevronRight size={20} color="var(--text3)" />
            </div>
          </div>
        ))}
      </div>

      {/* Recent Applications */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Recent Applications</h2>
        </div>
        {!dash?.recentApplications?.length ? (
          <div className="empty-state">
            <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
            <p>No applications yet. Post a job to start receiving applications!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dash.recentApplications.map((app) => (
              <div key={app._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px' }}>
                {app.student?.user?.avatar
                  ? <img src={app.student.user.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  : <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', flexShrink: 0 }}>{app.student?.user?.name?.[0]}</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{app.student?.user?.name}</div>
                  <div style={{ color: 'var(--text2)', fontSize: '0.825rem' }}>Applied for: {app.job?.title}</div>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={12} />{formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                </span>
                <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/company/applications/${app.job?._id}`)}>Review</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
