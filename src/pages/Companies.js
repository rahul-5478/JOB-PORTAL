import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { companyAPI } from '../utils/api';
import { Search, Building2, MapPin, Globe } from 'lucide-react';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await companyAPI.getAll({ search }); setCompanies(data.companies); }
      catch {} finally { setLoading(false); }
    };
    fetch();
  }, [search]);

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Companies</h1>
        <p className="page-subtitle">Find the right company culture for you</p>
      </div>

      <div style={{ position: 'relative', maxWidth: 500, marginBottom: 32 }}>
        <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text3)' }} />
        <input className="form-input" style={{ paddingLeft: 40 }} placeholder="Search companies..."
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
      ) : (
        <div className="grid-3">
          {companies.map(co => (
            <div key={co._id} className="card card-hover" style={{ cursor: 'pointer' }} onClick={() => navigate(`/companies/${co._id}`)}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                {co.logo
                  ? <img src={co.logo} alt="" style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} />
                  : <div style={{ width: 56, height: 56, borderRadius: 12, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>{co.companyName[0]}</div>
                }
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{co.companyName}</h3>
                  <div style={{ color: 'var(--text2)', fontSize: '0.825rem' }}>{co.industry || 'Technology'}</div>
                </div>
              </div>
              {co.description && <p style={{ color: 'var(--text2)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: 16 }}>{co.description.substring(0, 120)}...</p>}
              <div style={{ display: 'flex', gap: 16, fontSize: '0.8rem', color: 'var(--text3)' }}>
                {co.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{co.location}</span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Building2 size={12} />{co.size} employees</span>
              </div>
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)', fontSize: '0.825rem', color: 'var(--primary-light)', fontWeight: 600 }}>
                {co.totalJobs} active jobs →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
