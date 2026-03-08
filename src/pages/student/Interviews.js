import React, { useState, useEffect } from 'react';
import API from '../../utils/api';
import { Calendar, Clock, Video, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/interviews/my').then(({ data }) => {
      setInterviews(data.interviews || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const typeIcon = (type) => {
    if (type === 'video') return <Video size={14} />;
    if (type === 'phone') return <Phone size={14} />;
    return <MapPin size={14} />;
  };

  const statusColor = { scheduled: 'var(--primary)', completed: '#22c55e', cancelled: '#ef4444', rescheduled: '#f59e0b' };

  if (loading) return <div className="page"><div className="spinner" style={{ margin: '60px auto' }} /></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">📅 My Interviews</h1>
        <p className="page-subtitle">{interviews.length} interview{interviews.length !== 1 ? 's' : ''} scheduled</p>
      </div>

      {interviews.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>No interviews yet</h3>
          <p style={{ color: 'var(--text2)' }}>Keep applying! Interviews will appear here when scheduled.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {interviews.map(iv => (
            <div key={iv._id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{iv.job?.title}</h3>
                  <div style={{ display: 'flex', gap: 16, color: 'var(--text2)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={13} />{new Date(iv.scheduledAt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} />{new Date(iv.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ({iv.duration} min)</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{typeIcon(iv.type)}{iv.type}</span>
                  </div>
                  {iv.notes && <p style={{ marginTop: 8, color: 'var(--text2)', fontSize: '0.875rem' }}>{iv.notes}</p>}
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span className="badge" style={{ background: `${statusColor[iv.status]}22`, color: statusColor[iv.status] }}>{iv.status}</span>
                  {iv.meetLink && (
                    <a href={iv.meetLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ExternalLink size={13} /> Join
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
