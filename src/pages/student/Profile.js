import React, { useState, useEffect, useRef } from 'react';
import { studentAPI } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Upload, Plus, X, Save, FileText, User, Trash2 } from 'lucide-react';

const S = {
  page: { minHeight: '100vh', background: '#0f172a', padding: '32px 24px', fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: 900, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 },
  title: { fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: 0 },
  saveBtn: { padding: '10px 24px', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 },
  profileCard: { background: '#1e293b', borderRadius: 16, padding: 28, marginBottom: 24, border: '1px solid #334155' },
  avatarArea: { display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' },
  avatar: { width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white', flexShrink: 0, cursor: 'pointer', position: 'relative', overflow: 'hidden' },
  avatarImg: { width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' },
  userInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: 700, color: '#f1f5f9', marginBottom: 4 },
  userEmail: { fontSize: 13, color: '#64748b', marginBottom: 8 },
  completionBar: { height: 6, background: '#334155', borderRadius: 3, marginTop: 8, maxWidth: 200 },
  completionFill: (pct) => ({ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius: 3 }),
  tabs: { display: 'flex', gap: 4, marginBottom: 24, background: '#1e293b', padding: 6, borderRadius: 12, border: '1px solid #334155', flexWrap: 'wrap' },
  tab: (active) => ({ padding: '8px 18px', borderRadius: 8, border: 'none', background: active ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent', color: active ? 'white' : '#94a3b8', fontWeight: 600, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s' }),
  card: { background: '#1e293b', borderRadius: 16, padding: 24, marginBottom: 20, border: '1px solid #334155' },
  label: { display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' },
  textarea: { width: '100%', padding: '10px 14px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', resize: 'vertical', minHeight: 90, fontFamily: 'inherit', boxSizing: 'border-box' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 },
  fg: { marginBottom: 16 },
  skillChip: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 20, color: '#a5b4fc', fontSize: 12, fontWeight: 600, margin: '3px' },
  chipWrap: { display: 'flex', flexWrap: 'wrap', gap: 4, padding: '8px', background: '#0f172a', border: '1px solid #334155', borderRadius: 10, minHeight: 44, alignItems: 'center' },
  addBtn: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'rgba(99,102,241,0.15)', border: '1px dashed rgba(99,102,241,0.4)', borderRadius: 8, color: '#a5b4fc', fontSize: 13, cursor: 'pointer', fontWeight: 600 },
  subCard: { background: '#0f172a', borderRadius: 12, padding: 18, marginBottom: 14, border: '1px solid #1e293b', position: 'relative' },
  delBtn: { position: 'absolute', top: 14, right: 14, background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: 6, padding: '4px 8px', color: '#f87171', cursor: 'pointer', fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 16 },
  uploadBox: { padding: 20, background: '#0f172a', border: '1px dashed #334155', borderRadius: 12, textAlign: 'center', cursor: 'pointer' },
  uploadBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 20px', background: '#6366f1', border: 'none', borderRadius: 8, color: 'white', fontSize: 13, cursor: 'pointer', fontWeight: 600 },
};

function ChipInput({ values, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const add = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!values.includes(input.trim())) onChange([...values, input.trim()]);
      setInput('');
    }
  };
  return (
    <div style={S.chipWrap}>
      {values.map(v => (
        <span key={v} style={S.skillChip}>{v}<X size={10} style={{ cursor: 'pointer' }} onClick={() => onChange(values.filter(x => x !== v))} /></span>
      ))}
      <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={add} placeholder={values.length === 0 ? placeholder : 'Add more...'} style={{ border: 'none', background: 'transparent', color: '#f1f5f9', fontSize: 13, outline: 'none', minWidth: 120 }} />
    </div>
  );
}

export default function StudentProfile() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
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
    try { await studentAPI.updateProfile(form); await refreshProfile(); toast.success('Profile saved!'); }
    catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  const uploadResume = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('resume', file);
    try { await studentAPI.uploadResume(fd); const { data } = await studentAPI.getProfile(); setProfile(data.student); toast.success('Resume uploaded!'); }
    catch { toast.error('Upload failed'); }
  };

  const uploadAvatar = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append('avatar', file);
    try { await studentAPI.uploadAvatar(fd); await refreshProfile(); toast.success('Avatar updated!'); }
    catch { toast.error('Upload failed'); }
  };

  const addEdu = () => setForm({ ...form, education: [...form.education, { institution: '', degree: '', field: '', grade: '', from: '', to: '' }] });
  const addExp = () => setForm({ ...form, experience: [...form.experience, { company: '', title: '', description: '', from: '', to: '' }] });
  const addProj = () => setForm({ ...form, projects: [...form.projects, { title: '', description: '', technologies: [], link: '' }] });

  const updEdu = (i, f, v) => setForm({ ...form, education: form.education.map((e, idx) => idx === i ? { ...e, [f]: v } : e) });
  const updExp = (i, f, v) => setForm({ ...form, experience: form.experience.map((e, idx) => idx === i ? { ...e, [f]: v } : e) });
  const updProj = (i, f, v) => setForm({ ...form, projects: form.projects.map((p, idx) => idx === i ? { ...p, [f]: v } : p) });

  const completion = profile ? Math.min(100, [profile.headline, profile.bio, profile.phone, profile.location, (profile.skills?.length > 0), profile.resumeUrl].filter(Boolean).length * 17) : 0;

  if (!profile) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0f172a' }}><div style={{ width: 40, height: 40, border: '3px solid #6366f1', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div style={S.page}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}} input:focus,textarea:focus{border-color:#6366f1!important;}`}</style>
      <div style={S.container}>
        <div style={S.header}>
          <div>
            <h1 style={S.title}>My Profile</h1>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{completion}% complete</div>
            <div style={{ ...S.completionBar, maxWidth: 180, marginTop: 8 }}>
              <div style={S.completionFill(completion)} />
            </div>
          </div>
          <button onClick={save} disabled={saving} style={S.saveBtn}>
            <Save size={16} />{saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* Profile Card */}
        <div style={S.profileCard}>
          <div style={S.avatarArea}>
            <div style={S.avatar} onClick={() => avatarRef.current?.click()}>
              {(user?.avatar || profile?.avatar) ? <img src={user?.avatar || profile?.avatar} alt="" style={S.avatarImg} /> : (user?.name?.[0] || 'U')}
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', fontSize: 9, textAlign: 'center', padding: '3px 0', color: '#ccc' }}>EDIT</div>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={uploadAvatar} />
            <div style={S.userInfo}>
              <div style={S.userName}>{user?.name}</div>
              <div style={S.userEmail}>{user?.email}</div>
              {form.headline && <div style={{ fontSize: 13, color: '#94a3b8' }}>{form.headline}</div>}
            </div>
            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#a5b4fc', fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
                <FileText size={14} /> View Resume
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={S.tabs}>
          {['basic','education','experience','projects','resume'].map(t => (
            <button key={t} style={S.tab(tab === t)} onClick={() => setTab(t)}>{t.charAt(0).toUpperCase() + t.slice(1)}</button>
          ))}
        </div>

        {/* Basic Tab */}
        {tab === 'basic' && (
          <div style={S.card}>
            <div style={S.sectionTitle}>Basic Information</div>
            <div style={S.fg}>
              <label style={S.label}>Professional Headline</label>
              <input style={S.input} value={form.headline || ''} onChange={e => setForm({ ...form, headline: e.target.value })} placeholder="e.g. Full Stack Developer | React & Node.js" />
            </div>
            <div style={S.fg}>
              <label style={S.label}>Bio</label>
              <textarea style={S.textarea} value={form.bio || ''} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Tell employers about yourself..." />
            </div>
            <div style={S.row}>
              <div>
                <label style={S.label}>Phone</label>
                <input style={S.input} value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
              </div>
              <div>
                <label style={S.label}>Location</label>
                <input style={S.input} value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City, Country" />
              </div>
            </div>
            <div style={S.fg}>
              <label style={S.label}>Skills</label>
              <ChipInput values={form.skills || []} onChange={v => setForm({ ...form, skills: v })} placeholder="Type a skill and press Enter" />
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Press Enter to add</div>
            </div>
            <div style={S.row}>
              <div>
                <label style={S.label}>LinkedIn</label>
                <input style={S.input} value={form.socialLinks?.linkedin || ''} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })} placeholder="https://linkedin.com/in/..." />
              </div>
              <div>
                <label style={S.label}>GitHub</label>
                <input style={S.input} value={form.socialLinks?.github || ''} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, github: e.target.value } })} placeholder="https://github.com/..." />
              </div>
            </div>
            <div style={S.fg}>
              <label style={S.label}>Portfolio Website</label>
              <input style={S.input} value={form.socialLinks?.portfolio || ''} onChange={e => setForm({ ...form, socialLinks: { ...form.socialLinks, portfolio: e.target.value } })} placeholder="https://yourportfolio.com" />
            </div>
          </div>
        )}

        {/* Education Tab */}
        {tab === 'education' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={S.sectionTitle}>Education</div>
              <button onClick={addEdu} style={S.addBtn}><Plus size={14} /> Add Education</button>
            </div>
            {form.education?.map((edu, i) => (
              <div key={i} style={S.subCard}>
                <button onClick={() => setForm({ ...form, education: form.education.filter((_, idx) => idx !== i) })} style={S.delBtn}><Trash2 size={12} /></button>
                <div style={S.row}>
                  <div><label style={S.label}>Institution</label><input style={S.input} value={edu.institution} onChange={e => updEdu(i, 'institution', e.target.value)} placeholder="University name" /></div>
                  <div><label style={S.label}>Degree</label><input style={S.input} value={edu.degree} onChange={e => updEdu(i, 'degree', e.target.value)} placeholder="B.Tech, MBA..." /></div>
                </div>
                <div style={S.row3}>
                  <div><label style={S.label}>Field</label><input style={S.input} value={edu.field || ''} onChange={e => updEdu(i, 'field', e.target.value)} placeholder="Computer Science" /></div>
                  <div><label style={S.label}>From</label><input style={S.input} value={edu.from || ''} onChange={e => updEdu(i, 'from', e.target.value)} placeholder="2018" /></div>
                  <div><label style={S.label}>To</label><input style={S.input} value={edu.to || ''} onChange={e => updEdu(i, 'to', e.target.value)} placeholder="2022" /></div>
                </div>
                <div><label style={S.label}>Grade / CGPA</label><input style={{ ...S.input, maxWidth: 180 }} value={edu.grade || ''} onChange={e => updEdu(i, 'grade', e.target.value)} placeholder="8.5 CGPA" /></div>
              </div>
            ))}
            {form.education?.length === 0 && <div style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>No education added yet. Click "Add Education" above.</div>}
          </div>
        )}

        {/* Experience Tab */}
        {tab === 'experience' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={S.sectionTitle}>Work Experience</div>
              <button onClick={addExp} style={S.addBtn}><Plus size={14} /> Add Experience</button>
            </div>
            {form.experience?.map((exp, i) => (
              <div key={i} style={S.subCard}>
                <button onClick={() => setForm({ ...form, experience: form.experience.filter((_, idx) => idx !== i) })} style={S.delBtn}><Trash2 size={12} /></button>
                <div style={S.row}>
                  <div><label style={S.label}>Company</label><input style={S.input} value={exp.company} onChange={e => updExp(i, 'company', e.target.value)} placeholder="Company name" /></div>
                  <div><label style={S.label}>Job Title</label><input style={S.input} value={exp.title} onChange={e => updExp(i, 'title', e.target.value)} placeholder="Software Engineer" /></div>
                </div>
                <div style={S.row}>
                  <div><label style={S.label}>From</label><input style={S.input} value={exp.from || ''} onChange={e => updExp(i, 'from', e.target.value)} placeholder="Jan 2022" /></div>
                  <div><label style={S.label}>To</label><input style={S.input} value={exp.to || ''} onChange={e => updExp(i, 'to', e.target.value)} placeholder="Present" /></div>
                </div>
                <div><label style={S.label}>Description</label><textarea style={S.textarea} value={exp.description || ''} onChange={e => updExp(i, 'description', e.target.value)} placeholder="Describe your role and achievements..." /></div>
              </div>
            ))}
            {form.experience?.length === 0 && <div style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>No experience added yet.</div>}
          </div>
        )}

        {/* Projects Tab */}
        {tab === 'projects' && (
          <div style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={S.sectionTitle}>Projects</div>
              <button onClick={addProj} style={S.addBtn}><Plus size={14} /> Add Project</button>
            </div>
            {form.projects?.map((proj, i) => (
              <div key={i} style={S.subCard}>
                <button onClick={() => setForm({ ...form, projects: form.projects.filter((_, idx) => idx !== i) })} style={S.delBtn}><Trash2 size={12} /></button>
                <div style={S.row}>
                  <div><label style={S.label}>Project Title</label><input style={S.input} value={proj.title} onChange={e => updProj(i, 'title', e.target.value)} placeholder="Project name" /></div>
                  <div><label style={S.label}>Live Link</label><input style={S.input} value={proj.link || ''} onChange={e => updProj(i, 'link', e.target.value)} placeholder="https://..." /></div>
                </div>
                <div style={S.fg}><label style={S.label}>Technologies</label><ChipInput values={proj.technologies || []} onChange={v => updProj(i, 'technologies', v)} placeholder="React, Node.js..." /></div>
                <div><label style={S.label}>Description</label><textarea style={S.textarea} value={proj.description || ''} onChange={e => updProj(i, 'description', e.target.value)} placeholder="Describe the project..." /></div>
              </div>
            ))}
            {form.projects?.length === 0 && <div style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>No projects added yet.</div>}
          </div>
        )}

        {/* Resume Tab */}
        {tab === 'resume' && (
          <div style={S.card}>
            <div style={S.sectionTitle}>Resume / CV</div>
            <div style={S.uploadBox} onClick={() => resumeRef.current?.click()}>
              <FileText size={40} color="#6366f1" style={{ marginBottom: 12 }} />
              <div style={{ color: '#f1f5f9', fontWeight: 600, marginBottom: 6 }}>{profile?.resumeUrl ? 'Update Resume' : 'Upload Resume'}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>PDF, DOC, DOCX up to 5MB</div>
              <button style={S.uploadBtn}><Upload size={14} /> Choose File</button>
            </div>
            <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={uploadResume} />
            {profile?.resumeUrl && (
              <div style={{ marginTop: 16, padding: 14, background: 'rgba(99,102,241,0.1)', borderRadius: 10, border: '1px solid rgba(99,102,241,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><FileText size={18} color="#6366f1" /><span style={{ color: '#a5b4fc', fontSize: 13 }}>Resume uploaded ✓</span></div>
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" style={{ color: '#6366f1', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>View →</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}