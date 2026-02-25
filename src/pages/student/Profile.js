import React, { useState, useEffect, useRef } from 'react';
import { studentAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Upload, Plus, X, Save, FileText, Link, User } from 'lucide-react';

function ChipInput({ label, values, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const addChip = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!values.includes(input.trim())) onChange([...values, input.trim()]);
      setInput('');
    }
  };
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="chip-input-wrapper">
        {values.map(v => (
          <span key={v} className="skill-tag">
            {v}
            <X size={12} className="remove" onClick={() => onChange(values.filter(x => x !== v))} />
          </span>
        ))}
        <input className="chip-input" placeholder={values.length === 0 ? placeholder : 'Add more...'} value={input} onChange={e => setInput(e.target.value)} onKeyDown={addChip} />
      </div>
      <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>Press Enter to add</span>
    </div>
  );
}

export default function StudentProfile() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState('basic');
  const resumeRef = useRef();
  const avatarRef = useRef();

  useEffect(() => {
    studentAPI.getProfile().then(({ data }) => {
      setProfile(data.student);
      setForm({
        headline: data.student.headline || '',
        bio: data.student.bio || '',
        phone: data.student.phone || '',
        location: data.student.location || '',
        skills: data.student.skills || [],
        education: data.student.education || [],
        experience: data.student.experience || [],
        projects: data.student.projects || [],
        socialLinks: data.student.socialLinks || {},
        jobPreferences: data.student.jobPreferences || { jobType: [], preferredLocations: [] },
      });
    });
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await studentAPI.updateProfile(form);
      await refreshProfile();
      toast.success('Profile saved!');
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData(); fd.append('resume', file);
    setUploading(true);
    try {
      await studentAPI.uploadResume(fd);
      const { data } = await studentAPI.getProfile();
      setProfile(data.student);
      toast.success('Resume uploaded!');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData(); fd.append('avatar', file);
    try {
      await studentAPI.uploadAvatar(fd);
      await refreshProfile();
      toast.success('Avatar updated!');
    } catch { toast.error('Upload failed'); }
  };

  const addEducation = () => setForm({ ...form, education: [...form.education, { institution: '', degree: '', field: '', grade: '', from: '', to: '', current: false }] });
  const addExperience = () => setForm({ ...form, experience: [...form.experience, { company: '', title: '', description: '', from: '', to: '', current: false }] });
  const addProject = () => setForm({ ...form, projects: [...form.projects, { title: '', description: '', technologies: [], link: '' }] });

  if (!profile) return <div className="loader-screen"><div className="spinner" /></div>;

  const TABS = ['basic', 'education', 'experience', 'projects', 'resume'];

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title">My Profile</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
            <div className="progress-bar" style={{ width: 150 }}>
              <div className="progress-fill" style={{ width: `${profile.profileScore}%` }} />
            </div>
            <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{profile.profileScore}% complete</span>
          </div>
        </div>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Avatar Section */}
      <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          {user.avatar
            ? <img src={user.avatar} alt="" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
            : <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, color: 'white', border: '3px solid var(--primary-dark)' }}>{user.name[0]}</div>
          }
          <button onClick={() => avatarRef.current.click()} style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: '50%', background: 'var(--primary)', border: '2px solid var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Upload size={11} color="white" />
          </button>
          <input type="file" ref={avatarRef} accept="image/*" style={{ display: 'none' }} onChange={uploadAvatar} />
        </div>
        <div>
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{user.name}</h3>
          <p style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{form.headline || 'Add a headline...'}</p>
          <p style={{ color: 'var(--text3)', fontSize: '0.8rem', marginTop: 4 }}>{user.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 24 }}>
        {TABS.map(t => <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>)}
      </div>

      {/* Tab Content */}
      {tab === 'basic' && (
        <div className="card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Professional Headline</label>
              <input className="form-input" placeholder="e.g. Full Stack Developer | React & Node.js" value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea className="form-textarea" placeholder="Tell employers about yourself..." value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            </div>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input className="form-input" placeholder="City, Country" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
              </div>
            </div>
            <ChipInput label="Skills" values={form.skills} onChange={v => setForm({ ...form, skills: v })} placeholder="Type a skill and press Enter" />
            <div className="form-group">
              <label className="form-label">LinkedIn</label>
              <input className="form-input" placeholder="https://linkedin.com/in/..." value={form.socialLinks?.linkedin || ''} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })} />
            </div>
            <div className="form-group">
              <label className="form-label">GitHub</label>
              <input className="form-input" placeholder="https://github.com/..." value={form.socialLinks?.github || ''} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, github: e.target.value } })} />
            </div>
            <div className="form-group">
              <label className="form-label">Portfolio Website</label>
              <input className="form-input" placeholder="https://yourportfolio.com" value={form.socialLinks?.portfolio || ''} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, portfolio: e.target.value } })} />
            </div>
          </div>
        </div>
      )}

      {tab === 'education' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {form.education.map((edu, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontWeight: 600, color: 'var(--text2)' }}>Education #{i + 1}</span>
                <button className="btn btn-sm btn-danger" onClick={() => setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) })}><X size={14} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><label className="form-label">Institution</label><input className="form-input" placeholder="University Name" value={edu.institution} onChange={e => { const ed = [...form.education]; ed[i].institution = e.target.value; setForm({ ...form, education: ed }); }} /></div>
                <div className="form-group"><label className="form-label">Degree</label><input className="form-input" placeholder="B.Tech, MBA..." value={edu.degree} onChange={e => { const ed = [...form.education]; ed[i].degree = e.target.value; setForm({ ...form, education: ed }); }} /></div>
                <div className="form-group"><label className="form-label">Field of Study</label><input className="form-input" placeholder="Computer Science" value={edu.field} onChange={e => { const ed = [...form.education]; ed[i].field = e.target.value; setForm({ ...form, education: ed }); }} /></div>
                <div className="form-group"><label className="form-label">Grade/CGPA</label><input className="form-input" placeholder="8.5/10" value={edu.grade} onChange={e => { const ed = [...form.education]; ed[i].grade = e.target.value; setForm({ ...form, education: ed }); }} /></div>
                <div className="form-group"><label className="form-label">From</label><input className="form-input" type="date" value={edu.from?.split('T')[0] || ''} onChange={e => { const ed = [...form.education]; ed[i].from = e.target.value; setForm({ ...form, education: ed }); }} /></div>
                <div className="form-group"><label className="form-label">To</label><input className="form-input" type="date" value={edu.to?.split('T')[0] || ''} disabled={edu.current} onChange={e => { const ed = [...form.education]; ed[i].to = e.target.value; setForm({ ...form, education: ed }); }} /></div>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={addEducation}><Plus size={16} /> Add Education</button>
        </div>
      )}

      {tab === 'experience' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {form.experience.map((exp, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontWeight: 600, color: 'var(--text2)' }}>Experience #{i + 1}</span>
                <button className="btn btn-sm btn-danger" onClick={() => setForm({ ...form, experience: form.experience.filter((_, idx) => idx !== i) })}><X size={14} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group"><label className="form-label">Company</label><input className="form-input" placeholder="Company Name" value={exp.company} onChange={e => { const ex = [...form.experience]; ex[i].company = e.target.value; setForm({ ...form, experience: ex }); }} /></div>
                <div className="form-group"><label className="form-label">Job Title</label><input className="form-input" placeholder="Software Engineer" value={exp.title} onChange={e => { const ex = [...form.experience]; ex[i].title = e.target.value; setForm({ ...form, experience: ex }); }} /></div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Description</label><textarea className="form-textarea" placeholder="Describe what you did..." value={exp.description} onChange={e => { const ex = [...form.experience]; ex[i].description = e.target.value; setForm({ ...form, experience: ex }); }} /></div>
                <div className="form-group"><label className="form-label">From</label><input className="form-input" type="date" value={exp.from?.split('T')[0] || ''} onChange={e => { const ex = [...form.experience]; ex[i].from = e.target.value; setForm({ ...form, experience: ex }); }} /></div>
                <div className="form-group"><label className="form-label">To</label><input className="form-input" type="date" value={exp.to?.split('T')[0] || ''} onChange={e => { const ex = [...form.experience]; ex[i].to = e.target.value; setForm({ ...form, experience: ex }); }} /></div>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={addExperience}><Plus size={16} /> Add Experience</button>
        </div>
      )}

      {tab === 'projects' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {form.projects.map((proj, i) => (
            <div key={i} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontWeight: 600, color: 'var(--text2)' }}>Project #{i + 1}</span>
                <button className="btn btn-sm btn-danger" onClick={() => setForm({ ...form, projects: form.projects.filter((_, idx) => idx !== i) })}><X size={14} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div className="form-group"><label className="form-label">Project Title</label><input className="form-input" placeholder="My Awesome Project" value={proj.title} onChange={e => { const p = [...form.projects]; p[i].title = e.target.value; setForm({ ...form, projects: p }); }} /></div>
                <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={proj.description} onChange={e => { const p = [...form.projects]; p[i].description = e.target.value; setForm({ ...form, projects: p }); }} /></div>
                <div className="form-group"><label className="form-label">Live Link / GitHub</label><input className="form-input" placeholder="https://..." value={proj.link} onChange={e => { const p = [...form.projects]; p[i].link = e.target.value; setForm({ ...form, projects: p }); }} /></div>
              </div>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={addProject}><Plus size={16} /> Add Project</button>
        </div>
      )}

      {tab === 'resume' && (
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 20 }}>Resume / CV</h3>
          {profile.resume?.url ? (
            <div style={{ marginBottom: 24, padding: 20, background: 'var(--bg3)', borderRadius: 12, display: 'flex', gap: 16, alignItems: 'center' }}>
              <FileText size={32} color="var(--primary)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Resume Uploaded ✓</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text2)' }}>Uploaded {new Date(profile.resume.uploadedAt).toLocaleDateString()}</div>
              </div>
              <a href={profile.resume.url} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm">View</a>
            </div>
          ) : (
            <div className="alert alert-warning" style={{ marginBottom: 24 }}>
              ⚠️ No resume uploaded. Uploading a resume is required to apply for jobs.
            </div>
          )}
          <div className="file-upload-zone" onClick={() => resumeRef.current.click()}>
            <Upload size={32} color="var(--text3)" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontWeight: 600, marginBottom: 4 }}>{uploading ? 'Uploading...' : profile.resume?.url ? 'Replace Resume' : 'Upload Resume'}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text3)' }}>PDF, DOC, DOCX — Max 10MB</p>
            <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={uploadResume} />
          </div>
        </div>
      )}
    </div>
  );
}
