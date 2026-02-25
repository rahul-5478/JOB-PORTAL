import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { aiAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Sparkles, MapPin, DollarSign, Clock, ChevronRight, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function ScoreRing({ score }) {
  const r = 28; const c = 2 * Math.PI * r;
  const color = score >= 70 ? 'var(--green)' : score >= 50 ? 'var(--yellow)' : 'var(--red)';
  return (
    <div className="score-ring" style={{ width: 72, height: 72 }}>
      <svg width="72" height="72"><circle cx="36" cy="36" r={r} fill="none" stroke="var(--border)" strokeWidth="5" /><circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="5" strokeDasharray={c} strokeDashoffset={c - (score / 100) * c} strokeLinecap="round" /></svg>
      <div className="score-ring-text" style={{ fontSize: '1rem', color }}>{score}</div>
    </div>
  );
}

export default function AIMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const { data } = await aiAPI.getJobMatches();
      setMatches(data.matches);
      setLoaded(true);
      if (data.matches.length === 0) toast('No matches found. Try adding more skills to your profile!', { icon: '💡' });
      else toast.success(`Found ${data.matches.length} AI-matched jobs!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI matching failed. Check your profile has skills added.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={24} color="var(--primary-light)" />
          </div>
          <div>
            <h1 className="page-title" style={{ marginBottom: 0 }}>AI Job Matches</h1>
          </div>
        </div>
        <p className="page-subtitle">Our AI analyzes your complete profile and finds jobs where you're most likely to succeed</p>
      </div>

      {!loaded && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 40px', marginBottom: 24 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🤖</div>
          <h2 style={{ fontWeight: 800, marginBottom: 12 }}>Let AI Find Your Perfect Job</h2>
          <p style={{ color: 'var(--text2)', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.7 }}>
            HireAI reads your skills, experience, and preferences, then scores every active job to find your best matches. It takes about 10 seconds.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            {['Skills Analysis', 'Experience Match', 'Preference Fit', 'AI Scoring'].map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text2)' }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'white' }}>{i + 1}</div>
                {step}
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-lg" onClick={fetchMatches} disabled={loading}>
            {loading ? (
              <><div className="loading-dots"><span /><span /><span /></div> Analyzing Profile...</>
            ) : (
              <><Sparkles size={20} /> Find My Matches</>
            )}
          </button>
        </div>
      )}

      {loaded && (
        <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ color: 'var(--text2)' }}>{matches.length} jobs matched for you</p>
          <button className="btn btn-secondary btn-sm" onClick={fetchMatches} disabled={loading}>
            <Sparkles size={14} /> Refresh Matches
          </button>
        </div>
      )}

      {loading && loaded && (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text2)' }}>AI is analyzing your profile...</p>
        </div>
      )}

      {matches.length > 0 && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {matches.map(({ job, score, reason }, i) => (
            <div key={job._id} className="card animate-fade" style={{ display: 'flex', gap: 20, alignItems: 'flex-start', animationDelay: `${i * 0.05}s` }}>
              <div style={{ flexShrink: 0 }}>
                <ScoreRing score={score} />
                <div style={{ textAlign: 'center', marginTop: 4, fontSize: '0.7rem', color: 'var(--text3)' }}>match</div>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                  {job.company?.logo
                    ? <img src={job.company.logo} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: 'cover' }} />
                    : <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', flexShrink: 0 }}>{job.company?.companyName?.[0]}</div>
                  }
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 2 }}>{job.title}</h3>
                    <p style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{job.company?.companyName}</p>
                  </div>
                  <span className={`badge ${job.jobType === 'remote' ? 'badge-green' : 'badge-primary'}`}>{job.jobType}</span>
                </div>

                <div style={{ padding: '10px 14px', background: 'rgba(108,99,255,0.08)', borderRadius: 8, marginBottom: 12, borderLeft: '3px solid var(--primary)' }}>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text2)', lineHeight: 1.6 }}>
                    <Sparkles size={12} style={{ display: 'inline', marginRight: 6, color: 'var(--primary-light)' }} />
                    {reason}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 16, color: 'var(--text3)', fontSize: '0.8rem', marginBottom: 12 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{job.location}</span>
                  {job.salary?.min && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={12} />₹{(job.salary.min / 100000).toFixed(1)}L+</span>}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} />{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
                  {job.skills?.slice(0, 5).map(s => <span key={s} className="skill-tag">{s}</span>)}
                </div>

                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/jobs/${job._id}`)}>
                  View Job <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {loaded && matches.length === 0 && !loading && (
        <div className="empty-state">
          <AlertCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <h3>No matches found</h3>
          <p style={{ marginBottom: 20 }}>Add more skills and experience to your profile for better AI matching</p>
          <button className="btn btn-primary" onClick={() => navigate('/student/profile')}>Update Profile</button>
        </div>
      )}
    </div>
  );
}
