import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobAPI, applicationAPI, aiAPI, studentAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MapPin, Clock, DollarSign, Users, Bookmark, BookmarkCheck, Sparkles, ArrowLeft, Building2, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [generatingCover, setGeneratingCover] = useState(false);
  const [saved, setSaved] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  useEffect(() => {
    const fetch = async () => {
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
    fetch();
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

  if (loading) return <div className="loader-screen"><div className="spinner" /></div>;
  if (!job) return null;

  return (
    <div className="page">
      <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: 24 }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div className="sidebar-layout" style={{ gridTemplateColumns: '1fr 360px' }}>
        {/* Main */}
        <div>
          {/* Header */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', marginBottom: 20 }}>
              {job.company?.logo
                ? <img src={job.company.logo} alt="" style={{ width: 72, height: 72, borderRadius: 14, objectFit: 'cover' }} />
                : <div style={{ width: 72, height: 72, borderRadius: 14, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'white' }}>{job.company?.companyName?.[0]}</div>
              }
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 6 }}>{job.title}</h1>
                <div style={{ color: 'var(--text2)', marginBottom: 12, fontSize: '1rem' }}>{job.company?.companyName}</div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', color: 'var(--text2)', fontSize: '0.875rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={14} />{job.location}</span>
                  {job.salary?.min && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={14} />₹{(job.salary.min / 100000).toFixed(1)}L – ₹{(job.salary.max / 100000).toFixed(1)}L</span>}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={14} />{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={14} />{job.totalApplications} applicants</span>
                </div>
              </div>
              <span className={`badge ${job.jobType === 'remote' ? 'badge-green' : 'badge-primary'}`}>{job.jobType}</span>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {user?.role === 'student' && (
                alreadyApplied
                  ? <button className="btn btn-secondary" disabled>✓ Applied</button>
                  : <button className="btn btn-primary btn-lg" onClick={() => setShowModal(true)}>Apply Now</button>
              )}
              {user?.role === 'student' && (
                <button className="btn btn-secondary" onClick={toggleSave}>
                  {saved ? <BookmarkCheck size={16} color="var(--primary)" /> : <Bookmark size={16} />}
                  {saved ? 'Saved' : 'Save Job'}
                </button>
              )}
              {!user && <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>Login to Apply</button>}
            </div>
          </div>

          {/* Skills */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Required Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {job.skills?.map(s => <span key={s} className="skill-tag">{s}</span>)}
            </div>
          </div>

          {/* Description */}
          <div className="card" style={{ marginBottom: 24 }}>
            <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Job Description</h2>
            <div style={{ color: 'var(--text2)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.description}</div>
          </div>

          {job.requirements?.length > 0 && (
            <div className="card" style={{ marginBottom: 24 }}>
              <h2 style={{ fontWeight: 700, marginBottom: 16 }}>Requirements</h2>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {job.requirements.map((r, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, color: 'var(--text2)', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }}>◆</span>{r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Building2 size={18} /> About Company
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.875rem', color: 'var(--text2)' }}>
              <div><span style={{ color: 'var(--text3)' }}>Industry:</span> {job.company?.industry || 'N/A'}</div>
              <div><span style={{ color: 'var(--text3)' }}>Location:</span> {job.company?.location}</div>
              {job.company?.website && (
                <a href={job.company.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ExternalLink size={13} /> Visit Website
                </a>
              )}
              {job.company?.description && <p style={{ marginTop: 4, lineHeight: 1.6 }}>{job.company.description.substring(0, 200)}...</p>}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Job Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.875rem' }}>
              {[
                ['Experience', `${job.experience?.min}–${job.experience?.max} years`],
                ['Education', job.education],
                ['Openings', `${job.openings} position(s)`],
                ['Deadline', job.deadline ? new Date(job.deadline).toLocaleDateString() : 'Open until filled'],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text3)' }}>{k}:</span>
                  <span style={{ fontWeight: 500 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Apply for {job.title}</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text2)', cursor: 'pointer', fontSize: '1.5rem' }}>×</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label className="form-label">Cover Letter (optional)</label>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={generateCover} disabled={generatingCover}>
                    <Sparkles size={14} /> {generatingCover ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
                <textarea className="form-textarea" style={{ minHeight: 180 }} placeholder="Write a compelling cover letter or use AI to generate one..."
                  value={coverLetter} onChange={e => setCoverLetter(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleApply} disabled={applying}>
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
