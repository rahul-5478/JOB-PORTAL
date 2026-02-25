import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobAPI, aiAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import { Sparkles, Plus, X } from 'lucide-react';

export default function PostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [genLoading, setGenLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    title: '', description: '', jobType: 'full-time', location: '',
    skills: [],
    salary: { min: '', max: '', currency: 'INR', period: 'yearly' },
    experience: { min: 0, max: 3 },
    education: "Bachelor's", openings: 1, deadline: '',
    requirements: [''], responsibilities: [''],
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!form.skills.includes(skillInput.trim())) set('skills', [...form.skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const generateDesc = async () => {
    if (!form.title) return toast.error('Enter a job title first');
    setGenLoading(true);
    try {
      const { data } = await aiAPI.generateJobDescription({ title: form.title, skills: form.skills.join(', '), jobType: form.jobType, experience: `${form.experience.min}-${form.experience.max} years` });
      set('description', data.description);
      toast.success('Description generated! ✨');
    } catch { toast.error('AI generation failed'); }
    finally { setGenLoading(false); }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.location) return toast.error('Fill in required fields');
    setLoading(true);
    try {
      const payload = {
        ...form,
        salary: { ...form.salary, min: Number(form.salary.min), max: Number(form.salary.max) },
        requirements: form.requirements.filter(Boolean),
        responsibilities: form.responsibilities.filter(Boolean),
      };
      await jobAPI.create(payload);
      toast.success('Job posted successfully! 🎉');
      navigate('/company/jobs');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to post job'); }
    finally { setLoading(false); }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Post a New Job</h1>
        <p className="page-subtitle">Find the perfect candidate with AI-powered matching</p>
      </div>

      <form onSubmit={submit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Basic Info */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Job Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="form-group">
                <label className="form-label">Job Title *</label>
                <input className="form-input" placeholder="e.g. Senior React Developer" value={form.title} onChange={e => set('title', e.target.value)} required />
              </div>
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <label className="form-label">Job Description *</label>
                  <button type="button" className="btn btn-sm btn-secondary" onClick={generateDesc} disabled={genLoading}>
                    <Sparkles size={14} /> {genLoading ? 'Generating...' : 'AI Generate'}
                  </button>
                </div>
                <textarea className="form-textarea" style={{ minHeight: 160 }} placeholder="Describe the role, team, and what makes this opportunity exciting..." value={form.description} onChange={e => set('description', e.target.value)} required />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Job Type</label>
                  <select className="form-select" value={form.jobType} onChange={e => set('jobType', e.target.value)}>
                    {['full-time', 'part-time', 'internship', 'remote', 'hybrid', 'contract'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input className="form-input" placeholder="Mumbai, India" value={form.location} onChange={e => set('location', e.target.value)} required />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Required Skills</h3>
            <div className="chip-input-wrapper">
              {form.skills.map(s => (
                <span key={s} className="skill-tag">
                  {s} <X size={12} className="remove" onClick={() => set('skills', form.skills.filter(x => x !== s))} />
                </span>
              ))}
              <input className="chip-input" placeholder="Type skill and press Enter..." value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={addSkill} />
            </div>
          </div>

          {/* Salary & Experience */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Compensation & Requirements</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Min Salary (₹/year)</label>
                  <input className="form-input" type="number" placeholder="600000" value={form.salary.min} onChange={e => set('salary', { ...form.salary, min: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Salary (₹/year)</label>
                  <input className="form-input" type="number" placeholder="1200000" value={form.salary.max} onChange={e => set('salary', { ...form.salary, max: e.target.value })} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Min Experience (years)</label>
                  <input className="form-input" type="number" min="0" value={form.experience.min} onChange={e => set('experience', { ...form.experience, min: Number(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Experience (years)</label>
                  <input className="form-input" type="number" min="0" value={form.experience.max} onChange={e => set('experience', { ...form.experience, max: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Number of Openings</label>
                  <input className="form-input" type="number" min="1" value={form.openings} onChange={e => set('openings', Number(e.target.value))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Application Deadline</label>
                  <input className="form-input" type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Requirements</h3>
            {form.requirements.map((req, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input className="form-input" placeholder={`Requirement ${i + 1}`} value={req} onChange={e => { const r = [...form.requirements]; r[i] = e.target.value; set('requirements', r); }} />
                {form.requirements.length > 1 && <button type="button" className="btn btn-danger btn-sm" onClick={() => set('requirements', form.requirements.filter((_, idx) => idx !== i))}><X size={14} /></button>}
              </div>
            ))}
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => set('requirements', [...form.requirements, ''])}><Plus size={14} /> Add</button>
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/company/jobs')}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Posting...' : 'Post Job 🚀'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
