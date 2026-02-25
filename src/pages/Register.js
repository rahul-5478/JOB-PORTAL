import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Briefcase, Users, Building2 } from 'lucide-react';

export default function Register() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: params.get('role') || 'student', companyName: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (form.role === 'company' && !form.companyName) return toast.error('Company name is required');
    setLoading(true);
    try {
      const user = await register(form);
      toast.success('Account created! Welcome to HireAI 🎉');
      navigate(user.role === 'company' ? '/company/dashboard' : '/student/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
            <Briefcase size={28} color="var(--primary)" />
            <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>Hire<span style={{ color: 'var(--primary)' }}>AI</span></span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 8 }}>Create your account</h1>
          <p style={{ color: 'var(--text2)' }}>Start your journey today</p>
        </div>

        {/* Role toggle */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          {[
            { value: 'student', icon: Users, label: 'I\'m a Student' },
            { value: 'company', icon: Building2, label: 'I\'m a Company' },
          ].map(({ value, icon: Icon, label }) => (
            <button key={value} type="button" onClick={() => setForm({ ...form, role: value })}
              style={{ flex: 1, padding: '14px', borderRadius: 12, border: `2px solid ${form.role === value ? 'var(--primary)' : 'var(--border)'}`, background: form.role === value ? 'rgba(108,99,255,0.1)' : 'var(--bg3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: form.role === value ? 'var(--primary-light)' : 'var(--text2)', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s' }}>
              <Icon size={18} /> {label}
            </button>
          ))}
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">{form.role === 'company' ? 'Contact Person Name' : 'Full Name'}</label>
              <input className="form-input" placeholder="Your full name" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            {form.role === 'company' && (
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input className="form-input" placeholder="Acme Corp" value={form.companyName}
                  onChange={e => setForm({ ...form, companyName: e.target.value })} required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Min. 6 characters" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: 13 }}>
              {loading ? 'Creating account...' : `Create ${form.role === 'company' ? 'Company' : 'Student'} Account`}
            </button>
          </form>
          <div style={{ marginTop: 20, textAlign: 'center', color: 'var(--text2)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
