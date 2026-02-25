import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Briefcase, Building2, Users, TrendingUp, Star, ArrowRight, CheckCircle } from 'lucide-react';

const stats = [
  { value: '10K+', label: 'Active Jobs' },
  { value: '5K+', label: 'Companies' },
  { value: '50K+', label: 'Students' },
  { value: '92%', label: 'Placement Rate' },
];

const features = [
  { icon: Sparkles, title: 'AI-Powered Matching', desc: 'Our AI analyzes your profile and matches you with jobs that actually fit your skills and goals.', color: 'var(--primary)' },
  { icon: TrendingUp, title: 'Smart Analytics', desc: 'Track your applications, get interview tips, and see where you stand against other candidates.', color: 'var(--accent)' },
  { icon: CheckCircle, title: 'Instant Apply', desc: 'One-click apply with your stored profile. AI even generates your cover letter.', color: 'var(--green)' },
];

export default function Landing() {
  const navigate = useNavigate();
  return (
    <div>
      {/* Hero */}
      <section style={{ padding: '80px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,99,255,0.1)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 99, padding: '8px 16px', marginBottom: 24 }}>
            <Sparkles size={14} color="var(--primary-light)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 600 }}>AI-Powered Career Platform</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
            Find Jobs That <span className="gradient-text">Actually Match</span> Your Skills
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text2)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Stop applying blindly. Our AI reads your profile, understands your strengths, and connects you with companies that are the perfect fit.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register')}>
              Get Started Free <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => navigate('/jobs')}>
              Browse Jobs <Briefcase size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '40px 24px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg2)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-light)' }}>{s.value}</div>
              <div style={{ color: 'var(--text2)', marginTop: 4, fontSize: '0.9rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 12 }}>Why HireAI?</h2>
            <p style={{ color: 'var(--text2)' }}>Everything you need to land your dream job</p>
          </div>
          <div className="grid-3">
            {features.map((f) => (
              <div className="card card-hover" key={f.title} style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${f.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <f.icon size={24} color={f.color} />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 10 }}>{f.title}</h3>
                <p style={{ color: 'var(--text2)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, rgba(108,99,255,0.1), rgba(255,107,157,0.05))', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: 16 }}>Ready to Start Your Journey?</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 32 }}>Join thousands of students who found their dream jobs through HireAI</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/register?role=student')}>
              <Users size={18} /> Join as Student
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('/register?role=company')}>
              <Building2 size={18} /> Post Jobs as Company
            </button>
          </div>
        </div>
      </section>

      <footer style={{ padding: '32px 24px', textAlign: 'center', borderTop: '1px solid var(--border)', color: 'var(--text3)', fontSize: '0.875rem' }}>
        © 2025 HireAI — Built with ❤️ for students & companies
      </footer>
    </div>
  );
}
