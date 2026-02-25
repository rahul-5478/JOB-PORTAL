import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companyAPI, jobAPI } from '../utils/api';
import { MapPin, Globe, Users, Briefcase, Calendar, ArrowLeft } from 'lucide-react';

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await companyAPI.getById(id);
        setCompany(data.company);
        // Fetch jobs for this company
        const jobsRes = await jobAPI.getAll({ company: id, limit: 20 });
        setJobs(jobsRes.data.jobs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="spinner" />
    </div>
  );

  if (!company) return (
    <div className="page">
      <div className="empty-state">
        <h3>Company not found</h3>
        <button className="btn btn-primary" onClick={() => navigate('/companies')}>Back to Companies</button>
      </div>
    </div>
  );

  const initial = company.companyName?.[0]?.toUpperCase() || 'C';

  return (
    <div className="page">
      {/* Back button */}
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/companies')}
        style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
        <ArrowLeft size={16} /> Back to Companies
      </button>

      {/* Company Header */}
      <div className="card" style={{ padding: 32, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {company.logo
            ? <img src={company.logo} alt={company.companyName} style={{ width: 90, height: 90, borderRadius: 18, objectFit: 'cover' }} />
            : <div style={{ width: 90, height: 90, borderRadius: 18, background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem', fontWeight: 900, color: 'white', flexShrink: 0 }}>{initial}</div>
          }
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>{company.companyName}</h1>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', color: 'var(--text2)', fontSize: '0.875rem', marginBottom: 16 }}>
              {company.industry && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Briefcase size={14} />{company.industry}</span>}
              {company.location && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><MapPin size={14} />{company.location}</span>}
              {company.size && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Users size={14} />{company.size} employees</span>}
              {company.founded && <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={14} />Founded {company.founded}</span>}
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Globe size={14} /> Website
                </a>
              )}
              <span className="badge badge-primary">{jobs.length} open positions</span>
            </div>
          </div>
        </div>

        {company.description && (
          <>
            <div style={{ height: 1, background: 'var(--border)', margin: '24px 0' }} />
            <div>
              <h3 style={{ fontWeight: 700, marginBottom: 10 }}>About</h3>
              <p style={{ color: 'var(--text2)', lineHeight: 1.8, fontSize: '0.925rem' }}>{company.description}</p>
            </div>
          </>
        )}
      </div>

      {/* Open Positions */}
      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 16 }}>Open Positions ({jobs.length})</h2>

      {jobs.length === 0 ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <Briefcase size={40} style={{ margin: '0 auto 12px', opacity: 0.2 }} />
          <p style={{ color: 'var(--text2)' }}>No open positions right now</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {jobs.map((job) => (
            <div key={job._id} className="card" style={{ padding: 22, cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => navigate(`/jobs/${job._id}`)}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{job.title}</h3>
                  <div style={{ display: 'flex', gap: 16, color: 'var(--text2)', fontSize: '0.825rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={13} />{job.location}</span>
                    {job.salary?.min && <span>₹{(job.salary.min / 100000).toFixed(1)}L – ₹{(job.salary.max / 100000).toFixed(1)}L</span>}
                    <span>{job.experience?.min}–{job.experience?.max} yrs</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span className={`badge ${job.jobType === 'remote' ? 'badge-green' : job.jobType === 'internship' ? 'badge-yellow' : 'badge-primary'}`}>
                    {job.jobType}
                  </span>
                  <button className="btn btn-primary btn-sm">View →</button>
                </div>
              </div>
              {job.skills?.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                  {job.skills.slice(0, 5).map(s => <span key={s} className="skill-tag">{s}</span>)}
                  {job.skills.length > 5 && <span className="badge badge-gray">+{job.skills.length - 5}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}