import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI } from '../utils/api';
import { Search, MapPin, Clock, DollarSign, Filter, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const JOB_TYPES = ['', 'full-time', 'part-time', 'internship', 'remote', 'hybrid', 'contract'];

function JobCard({ job, onClick }) {
  return (
    <div className="job-card animate-fade" onClick={onClick}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
        {job.company?.logo
          ? <img src={job.company.logo} alt="" className="company-logo" />
          : <div className="company-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem', background: 'var(--primary)', color: 'white' }}>{job.company?.companyName?.[0] || 'C'}</div>
        }
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 2, fontSize: '1rem' }}>{job.title}</h3>
          <div style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{job.company?.companyName}</div>
        </div>
        <span className={`badge ${job.jobType === 'remote' ? 'badge-green' : job.jobType === 'internship' ? 'badge-yellow' : 'badge-primary'}`}>
          {job.jobType}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 16, color: 'var(--text2)', fontSize: '0.825rem', marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} />{job.location}</span>
        {job.salary?.min && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={13} />₹{(job.salary.min / 100000).toFixed(1)}L - ₹{(job.salary.max / 100000).toFixed(1)}L</span>}
        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} />{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {job.skills?.slice(0, 4).map((s) => <span key={s} className="skill-tag">{s}</span>)}
        {job.skills?.length > 4 && <span className="badge badge-gray">+{job.skills.length - 4}</span>}
      </div>

      <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem', color: 'var(--text3)' }}>
        <span>{job.totalApplications} applicant{job.totalApplications !== 1 ? 's' : ''}</span>
        <span>{job.views} views</span>
      </div>
    </div>
  );
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: '', jobType: '', location: '', skills: '' });
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await jobAPI.getAll({ ...filters, page, limit: 12 });
      setJobs(data.jobs);
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchJobs(); };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Find Your Next Role</h1>
        <p className="page-subtitle">{total.toLocaleString()} jobs available right now</p>
      </div>

      {/* Search + Filters */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: 200, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
          <input className="form-input" style={{ paddingLeft: 40 }} placeholder="Search job title or skill..."
            value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
        </div>
        <div style={{ flex: 1, minWidth: 150, position: 'relative' }}>
          <MapPin size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
          <input className="form-input" style={{ paddingLeft: 40 }} placeholder="Location..."
            value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />
        </div>
        <select className="form-select" style={{ flex: 1, minWidth: 140 }} value={filters.jobType}
          onChange={e => setFilters({ ...filters, jobType: e.target.value })}>
          <option value="">All Types</option>
          {JOB_TYPES.filter(Boolean).map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <button className="btn btn-primary" type="submit"><Search size={16} /> Search</button>
      </form>

      {/* Jobs Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <Briefcase size={48} style={{ margin: '0 auto 16px', opacity: 0.2 }} />
          <h3>No jobs found</h3>
          <p>Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid-3">
          {jobs.map((job) => <JobCard key={job._id} job={job} onClick={() => navigate(`/jobs/${job._id}`)} />)}
        </div>
      )}

      {/* Pagination */}
      {total > 12 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
          {Array.from({ length: Math.ceil(total / 12) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className="btn btn-sm"
              style={{ background: p === page ? 'var(--primary)' : 'var(--bg3)', color: p === page ? 'white' : 'var(--text2)', border: 'none' }}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
