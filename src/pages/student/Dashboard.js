import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, applicationAPI } from '../../utils/api';
import { Briefcase, Sparkles, User, TrendingUp, Clock, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

const STATUS_COLOR = { applied: 'badge-gray', reviewing: 'badge-yellow', shortlisted: 'badge-primary', interview: 'badge-primary', offered: 'badge-green', hired: 'badge-green', rejected: 'badge-red' };

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [pRes, aRes] = await Promise.all([studentAPI.getProfile(), applicationAPI.getMyApplications()]);
        setProfile(pRes.data.student);
        setApplications(aRes.data.applications);
      } catch {} finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return <div className="loader-screen"><div className="spinner" /></div>;

  const stats = [
    { label: 'Total Applications', value: applications.length, icon: Briefcase, color: 'var(--primary)', bg: 'rgba(108,99,255,0.15)' },
    { label: 'In Review', value: applications.filter(a => ['reviewing', 'shortlisted'].includes(a.status)).length, icon: Clock, color: 'var(--yellow)', bg: 'rgba(245,158,11,0.15)' },
    { label: 'Interviews', value: applications.filter(a => a.status === 'interview').length, icon: TrendingUp, color: 'var(--accent)', bg: 'rgba(255,107,157,0.15)' },
    { label: 'Profile Score', value: `${profile?.profileScore || 0}%`, icon: User, color: 'var(--green)', bg: 'rgba(34,197,94,0.15)' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user.name.split(' ')[0]}! 👋</h1>
        <p className="page-subtitle">Here's your career overview</p>
      </div>

      {/* Profile Completion Alert */}
      {(profile?.profileScore || 0) < 60 && (
        <div className="alert alert-warning" style={{ marginBottom: 24 }}>
          <Sparkles size={18} color="var(--yellow)" />
          <div>
            <strong>Complete your profile to get better AI matches!</strong>
            <p style={{ fontSize: '0.875rem', color: 'var(--text2)', marginTop: 4 }}>
              Your profile is {profile?.profileScore || 0}% complete. Add skills, education, and upload your resume.
            </p>
            <button className="btn btn-sm btn-secondary" style={{ marginTop: 10 }} onClick={() => navigate('/student/profile')}>
              Complete Profile →
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 32 }}>
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
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(108,99,255,0.15), rgba(108,99,255,0.05))', border: '1px solid rgba(108,99,255,0.3)', cursor: 'pointer' }} onClick={() => navigate('/student/ai-matches')}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={26} color="var(--primary-light)" />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 4 }}>AI Job Matches</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>See jobs AI picked just for you</p>
            </div>
            <ChevronRight size={20} color="var(--text3)" style={{ marginLeft: 'auto' }} />
          </div>
        </div>
        <div className="card" style={{ cursor: 'pointer' }} onClick={() => navigate('/jobs')}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(255,107,157,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Briefcase size={26} color="var(--accent)" />
            </div>
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 4 }}>Browse All Jobs</h3>
              <p style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>Explore thousands of opportunities</p>
            </div>
            <ChevronRight size={20} color="var(--text3)" style={{ marginLeft: 'auto' }} />
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Recent Applications</h2>
          <button className="btn btn-sm btn-secondary" onClick={() => navigate('/student/applications')}>View All</button>
        </div>
        {applications.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={40} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
            <p>You haven't applied to any jobs yet</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => navigate('/jobs')}>Find Jobs</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {applications.slice(0, 5).map((app) => (
              <div key={app._id} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>{app.job?.title}</div>
                  <div style={{ color: 'var(--text2)', fontSize: '0.825rem' }}>{app.job?.company?.companyName}</div>
                </div>
                <span className={`badge ${STATUS_COLOR[app.status] || 'badge-gray'}`}>{app.status}</span>
                {app.aiMatchScore > 0 && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600 }}>
                    <Sparkles size={12} style={{ display: 'inline', marginRight: 4 }} />
                    {app.aiMatchScore}% match
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile Progress */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontWeight: 700 }}>Profile Completeness</h3>
          <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{profile?.profileScore || 0}%</span>
        </div>
        <div className="progress-bar" style={{ marginBottom: 20 }}>
          <div className="progress-fill" style={{ width: `${profile?.profileScore || 0}%` }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['Headline', !!profile?.headline],
            ['Bio', !!profile?.bio],
            ['Skills', (profile?.skills?.length || 0) > 0],
            ['Education', (profile?.education?.length || 0) > 0],
            ['Experience', (profile?.experience?.length || 0) > 0],
            ['Resume', !!profile?.resume?.url],
          ].map(([label, done]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.875rem', color: done ? 'var(--green)' : 'var(--text3)' }}>
              {done ? <CheckCircle size={15} /> : <XCircle size={15} />}
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
