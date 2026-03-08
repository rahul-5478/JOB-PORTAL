import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building2 } from 'lucide-react';
import { companyAPI } from '../utils/api';

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await companyAPI.getAll({ search });
        setCompanies(data.companies);
      } catch {}
      finally { setLoading(false); }
    };
    fetchData();
  }, [search]);

  return (
    <div style={{ minHeight: '100vh', background: '#07070f', padding: '40px 24px 80px', fontFamily: "'Sora',sans-serif" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .cocard{background:#0d0d1f;border:1px solid #1e1e2e;border-radius:16px;padding:20px;cursor:pointer;transition:all 0.22s}
        .cocard:hover{transform:translateY(-4px);border-color:#f9731644;box-shadow:0 12px 32px rgba(249,115,22,0.1)}
        .co-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px}
        .search-wrap{position:relative;max-width:500px;margin-bottom:32px}
        .search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#555}
        .search-in{width:100%;background:#0d0d1f;border:1px solid #2a2a4a;border-radius:12px;padding:12px 16px 12px 42px;color:#fff;font-size:14px;font-family:'Sora',sans-serif;outline:none;transition:border-color 0.2s}
        .search-in:focus{border-color:#f9731655}
        .search-in::placeholder{color:#444}
        @media(max-width:768px){
          .co-grid{grid-template-columns:1fr !important}
          .page-wrap{padding:24px 14px 60px !important}
          .page-title{font-size:26px !important}
          .search-wrap{max-width:100% !important}
        }
        @media(max-width:480px){
          .cocard{padding:14px !important}
        }
      `}</style>

      <div className="page-wrap" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* ── Header ── */}
        <div style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease' }}>
          <h1 className="page-title" style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
            🏢 Companies
          </h1>
          <p style={{ color: '#555', fontSize: 14 }}>Find the right company culture for you</p>
        </div>

        {/* ── Search ── */}
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            className="search-in"
            placeholder="Search companies..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* ── Loading ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 40, height: 40, border: '3px solid #1a1a2e', borderTopColor: '#f97316', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#555', fontSize: 13 }}>Loading companies...</p>
          </div>
        ) : companies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🏢</div>
            <p style={{ color: '#555', fontSize: 15 }}>No companies found</p>
          </div>
        ) : (
          <>
            <p style={{ color: '#444', fontSize: 13, marginBottom: 20 }}>
              Showing <span style={{ color: '#f97316', fontWeight: 700 }}>{companies.length}</span> companies
            </p>

            {/* ── Grid ── */}
            <div className="co-grid">
              {companies.map((co, i) => (
                <div
                  key={co._id}
                  className="cocard"
                  onClick={() => navigate(`/companies/${co._id}`)}
                  style={{ animationDelay: `${i * 0.06}s`, animation: 'fadeUp 0.4s ease both' }}
                >
                  {/* Top bar accent */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg,#f97316,#a78bfa)', borderRadius: '16px 16px 0 0', display: 'none' }} />

                  {/* Company Info */}
                  <div style={{ display: 'flex', gap: 14, marginBottom: 14, alignItems: 'flex-start' }}>
                    {co.logo
                      ? <img src={co.logo} alt="" style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', flexShrink: 0, border: '1px solid #2a2a4a' }} />
                      : <div style={{ width: 52, height: 52, borderRadius: 12, background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                          {co.companyName?.[0]?.toUpperCase()}
                        </div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontWeight: 700, color: '#fff', fontSize: 15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {co.companyName}
                      </h3>
                      <span style={{ background: '#f9731618', border: '1px solid #f9731633', color: '#f97316', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
                        {co.industry || 'Technology'}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  {co.description && (
                    <p style={{ color: '#666', fontSize: 13, lineHeight: 1.6, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {co.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#555', marginBottom: 14, flexWrap: 'wrap' }}>
                    {co.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} style={{ color: '#f97316' }} />
                        {co.location}
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Building2 size={12} style={{ color: '#a78bfa' }} />
                      {co.size || '1-10'} employees
                    </span>
                  </div>

                  {/* Footer */}
                  <div style={{ paddingTop: 12, borderTop: '1px solid #1a1a2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#34d399', fontSize: 12, fontWeight: 700 }}>
                      💼 {co.totalJobs || 0} active jobs
                    </span>
                    <span style={{ color: '#f97316', fontSize: 12, fontWeight: 700 }}>View →</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}