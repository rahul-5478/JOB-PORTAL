import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { companyAPI, jobAPI } from '../utils/api';
import { MapPin, Users, Globe, Building2, Briefcase, ArrowLeft, DollarSign, Clock } from 'lucide-react';

const S = {
  page: { minHeight: '100vh', background: '#0f172a', fontFamily: "'Inter', sans-serif" },
  back: { padding: '16px 28px', display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 13, cursor: 'pointer', background: 'transparent', border: 'none', fontFamily: 'inherit' },
  hero: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1px solid #334155', padding: '40px 28px 0', marginBottom: 0 },
  heroInner: { maxWidth: 1000, margin: '0 auto' },
  logoRow: { display: 'flex', alignItems: 'flex-end', gap: 24, marginBottom: 24, flexWrap: 'wrap' },
  logo: { width: 90, height: 90, borderRadius: 18, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, color: 'white', border: '3px solid #334155', flexShrink: 0 },
  name: { fontSize: 30, fontWeight: 900, color: '#f1f5f9', marginBottom: 6 },
  industry: { fontSize: 14, color: '#94a3b8', marginBottom: 12 },
  metaRow: { display: 'flex', gap: 20, flexWrap: 'wrap' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#64748b' },
  tabs: { display: 'flex', gap: 0, borderTop: '1px solid #334155', marginTop: 24, paddingTop: 0 },
  tab: (a) => ({ padding: '14px 24px', border: 'none', background: 'transparent', color: a ? '#a5b4fc' : '#64748b', fontWeight: a ? 700 : 500, fontSize: 14, cursor: 'pointer', borderBottom: a ? '2px solid #6366f1' : '2px solid transparent', fontFamily: 'inherit', transition: 'all 0.15s' }),
  body: { maxWidth: 1000, margin: '0 auto', padding: '32px 28px' },
  section: { background: '#1e293b', borderRadius: 16, padding: 24, marginBottom: 20, border: '1px solid #334155' },
  sTitle: { fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 },
  desc: { color: '#94a3b8', lineHeight: 1.8, fontSize: 14 },
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 },
  statCard: { background: '#0f172a', borderRadius: 12, padding: 16, border: '1px solid #1e293b', textAlign: 'center' },
  statNum: { fontSize: 24, fontWeight: 800, color: '#6366f1', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' },
  jobCard: { background: '#0f172a', borderRadius: 12, border: '1px solid #1e293b', marginBottom: 12, overflow: 'hidden' },
  jobHeader: { padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 },
  jobTitle: { fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 },
  jobMeta: { display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, color: '#64748b' },
  jobFooter: { padding: '12px 20px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0f1a' },
  badge: { padding: '4px 10px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 6, fontSize: 11, color: '#a5b4fc', fontWeight: 600 },
  viewBtn: { padding: '7px 18px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 },
  skillPill: { padding: '3px 10px', background: '#1e293b', border: '1px solid #334155', borderRadius: 20, fontSize: 11, color: '#94a3b8', display: 'inline-block', margin: '3px' },
  websiteLink: { display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6366f1', fontSize: 13, textDecoration: 'none', fontWeight: 600, marginTop: 8 },
};

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await companyAPI.getById(id);
        setCompany(data.company);
        const jRes = await jobAPI.getAll({ company: id, limit: 20 });
        setJobs(jRes.data.jobs || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, [id]);

  const fmtSal = (s) => {
    if (!s) return null;
    const l = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString()}`;
    return `${l(s.min)}–${l(s.max)}`;
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #6366f1', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!company) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a', color: '#64748b' }}>Company not found</div>;

  return (
    <div style={S.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

      <div style={S.hero}>
        <div style={S.heroInner}>
          <button style={S.back} onClick={() => navigate('/companies')}>
            <ArrowLeft size={16} /> Back to Companies
          </button>
          <div style={S.logoRow}>
            <div style={S.logo}>
              {company.logo ? <img src={company.logo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 15 }} /> : company.companyName?.[0]}
            </div>
            <div>
              <div style={S.name}>{company.companyName}</div>
              <div style={S.industry}>{company.industry || 'Technology'}</div>
              <div style={S.metaRow}>
                {company.location && <span style={S.metaItem}><MapPin size={13} />{company.location}</span>}
                {company.size && <span style={S.metaItem}><Users size={13} />{company.size} employees</span>}
                <span style={S.metaItem}><Briefcase size={13} />{jobs.length} open positions</span>
              </div>
            </div>
          </div>
          <div style={S.tabs}>
            {['overview', 'jobs'].map(t => (
              <button key={t} style={S.tab(tab === t)} onClick={() => setTab(t)}>
                {t === 'overview' ? 'Overview' : `Open Positions (${jobs.length})`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={S.body}>
        {tab === 'overview' && (
          <>
            {/* Stats */}
            <div style={S.section}>
              <div style={S.statGrid}>
                <div style={S.statCard}><div style={S.statNum}>{jobs.length}</div><div style={S.statLabel}>Open Positions</div></div>
                <div style={S.statCard}><div style={S.statNum}>{company.size || '1-10'}</div><div style={S.statLabel}>Employees</div></div>
                <div style={S.statCard}><div style={S.statNum}>{company.industry || 'Tech'}</div><div style={S.statLabel}>Industry</div></div>
                <div style={S.statCard}><div style={S.statNum}>{company.location?.split(',')[0] || '—'}</div><div style={S.statLabel}>Location</div></div>
              </div>
            </div>

            {/* About */}
            {company.description && (
              <div style={S.section}>
                <div style={S.sTitle}>About {company.companyName}</div>
                <div style={S.desc}>{company.description}</div>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" style={S.websiteLink}>
                    <Globe size={14} /> {company.website}
                  </a>
                )}
              </div>
            )}
          </>
        )}

        {tab === 'jobs' && (
          <div>
            {jobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', background: '#1e293b', borderRadius: 16, border: '1px solid #334155' }}>
                <Briefcase size={48} color="#334155" style={{ marginBottom: 16 }} />
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', marginBottom: 8 }}>No open positions</div>
                <div style={{ color: '#64748b' }}>Check back later for new opportunities</div>
              </div>
            ) : (
              jobs.map(job => (
                <div key={job._id} style={S.jobCard}>
                  <div style={S.jobHeader}>
                    <div>
                      <div style={S.jobTitle}>{job.title}</div>
                      <div style={S.jobMeta}>
                        {job.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={11} />{job.location}</span>}
                        {job.salary && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><DollarSign size={11} />{fmtSal(job.salary)}</span>}
                        {job.experience && <span>{job.experience.min}–{job.experience.max} yrs</span>}
                      </div>
                      {job.skills?.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                          {job.skills.slice(0, 5).map(s => <span key={s} style={S.skillPill}>{s}</span>)}
                          {job.skills.length > 5 && <span style={S.skillPill}>+{job.skills.length - 5}</span>}
                        </div>
                      )}
                    </div>
                    <span style={S.badge}>{job.jobType || 'full-time'}</span>
                  </div>
                  <div style={S.jobFooter}>
                    <span style={{ fontSize: 11, color: '#475569', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} /> {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ''}
                    </span>
                    <button style={S.viewBtn} onClick={() => navigate(`/jobs/${job._id}`)}>
                      View → 
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}