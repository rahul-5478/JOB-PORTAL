import React, { useState, useEffect, useRef } from 'react';
import { companyAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Save, Upload } from 'lucide-react';

export default function CompanyProfile() {
  const { refreshProfile } = useAuth();
  const [company, setCompany] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const logoRef = useRef();

  useEffect(() => {
    companyAPI.getProfile().then(({ data }) => {
      setCompany(data.company);
      setForm({
        companyName: data.company.companyName || '',
        description: data.company.description || '',
        industry: data.company.industry || '',
        size: data.company.size || '1-10',
        founded: data.company.founded || '',
        website: data.company.website || '',
        location: data.company.location || '',
        socialLinks: data.company.socialLinks || {},
      });
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await companyAPI.updateProfile(form);
      await refreshProfile();
      toast.success('Profile saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const uploadLogo = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData(); fd.append('logo', file);
    try {
      const { data } = await companyAPI.uploadLogo(fd);
      await refreshProfile();
      toast.success('Logo updated!');
    } catch { toast.error('Upload failed'); }
  };

  if (!company) return <div className="loader-screen"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <h1 className="page-title">Company Profile</h1>
        <button className="btn btn-primary" onClick={save} disabled={saving}><Save size={16} /> {saving ? 'Saving...' : 'Save'}</button>
      </div>

      {/* Logo */}
      <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          {company.logo
            ? <img src={company.logo} alt="" style={{ width: 80, height: 80, borderRadius: 14, objectFit: 'cover', border: '2px solid var(--border)' }} />
            : <div style={{ width: 80, height: 80, borderRadius: 14, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: 'white' }}>{company.companyName?.[0]}</div>
          }
          <button onClick={() => logoRef.current.click()} style={{ position: 'absolute', bottom: -4, right: -4, width: 26, height: 26, borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Upload size={11} color="white" />
          </button>
          <input type="file" ref={logoRef} accept="image/*" style={{ display: 'none' }} onChange={uploadLogo} />
        </div>
        <div>
          <h3 style={{ fontWeight: 700 }}>{company.companyName}</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.875rem', marginTop: 4 }}>{company.industry || 'Add your industry'}</p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group"><label className="form-label">Company Name</label><input className="form-input" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">Company Description</label><textarea className="form-textarea" style={{ minHeight: 120 }} placeholder="Tell candidates about your company culture, mission, and what makes you special..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Industry</label><input className="form-input" placeholder="e.g. Software, Fintech, EdTech" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Company Size</label>
              <select className="form-select" value={form.size} onChange={e => setForm({ ...form, size: e.target.value })}>
                {['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group"><label className="form-label">Founded Year</label><input className="form-input" type="number" placeholder="2020" value={form.founded} onChange={e => setForm({ ...form, founded: e.target.value })} /></div>
            <div className="form-group"><label className="form-label">Location</label><input className="form-input" placeholder="Mumbai, India" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} /></div>
          </div>
          <div className="form-group"><label className="form-label">Website</label><input className="form-input" placeholder="https://yourcompany.com" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} /></div>
          <div className="form-group"><label className="form-label">LinkedIn</label><input className="form-input" placeholder="https://linkedin.com/company/..." value={form.socialLinks?.linkedin || ''} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })} /></div>
        </div>
      </div>
    </div>
  );
}
