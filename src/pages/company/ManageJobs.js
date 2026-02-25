import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Briefcase, Plus, Eye, Users, Trash2, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    jobAPI.getMyJobs().then(({ data }) => setJobs(data.jobs)).finally(() => setLoading(false));
  }, []);

  const toggleStatus = async (job) => {
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      await jobAPI.update(job._id, { status: newStatus });
      setJobs(prev => prev.map(j => j._id === job._id ? { ...j, status: newStatus } : j));
      toast.success(`Job ${newStatus === 'active' ? 'activated' : 'closed'}`);
    } catch { toast.error('Failed to update status'); }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Delete this job? This cannot be undone.')) return;
    try {
      await jobAPI.delete(id);
      setJobs(prev => prev.filter(j => j._id !== id));
      toast.success('Job deleted');
    } catch { toast.error('Failed to delete'); }
  };

  if (loading) return <div className="loader-screen"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">Manage Jobs</h1>
          <p className="page-subtitle">{jobs.length} job postings</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/company/post-job')}>
          <Plus size={16} /> Post New Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="empty-state">
          <Briefcase size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
          <h3>No jobs posted yet</h3>
          <p style={{ marginBottom: 20 }}>Start attracting talent by posting your first job</p>
          <button className="btn btn-primary" onClick={() => navigate('/company/post-job')}>Post First Job</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {jobs.map(job => (
            <div key={job._id} className="card animate-fade">
              <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                    <h3 style={{ fontWeight: 700 }}>{job.title}</h3>
                    <span className={`badge ${job.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{job.status}</span>
                    <span className="badge badge-primary">{job.jobType}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 20, color: 'var(--text2)', fontSize: '0.825rem', flexWrap: 'wrap' }}>
                    <span>📍 {job.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={13} /> {job.totalApplications} applicants</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={13} /> {job.views} views</span>
                    <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center', flexWrap: 'wrap' }}>
                  <button className="btn btn-sm btn-secondary" onClick={() => navigate(`/company/applications/${job._id}`)}>
                    <Users size={14} /> Applications ({job.totalApplications})
                  </button>
                  <button className="btn btn-sm btn-secondary" onClick={() => toggleStatus(job)}>
                    {job.status === 'active' ? <ToggleRight size={14} color="var(--green)" /> : <ToggleLeft size={14} />}
                    {job.status === 'active' ? 'Close' : 'Activate'}
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteJob(job._id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
