import React, { useState } from 'react';
import API from '../../utils/api';
import { TrendingUp, DollarSign, MapPin, Briefcase, Sparkles, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';

const S = {
  page: { minHeight: '100vh', background: '#0f172a', padding: '32px 24px', fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: 1000, margin: '0 auto' },
  label: { display: 'block', fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.5px' },
  input: { width: '100%', padding: '12px 14px', background: '#0f172a', border: '1.5px solid #334155', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' },
  select: { width: '100%', padding: '12px 14px', background: '#0f172a', border: '1.5px solid #334155', borderRadius: 10, color: '#f1f5f9', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', cursor: 'pointer', appearance: 'none' },
  predictBtn: (loading) => ({ width: '100%', padding: '14px', background: loading ? '#334155' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 8 }),
  card: { background: '#1e293b', borderRadius: 16, border: '1px solid #334155', padding: 24 },
};

const fmt = (n) => `₹${(n / 100000).toFixed(1)}L`;

export default function SalaryPredictor() {
  const [form, setForm] = useState({ jobTitle: '', skills: '', experience: '', location: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const predict = async () => {
    if (!form.jobTitle || !form.skills) return toast.error('Job title and skills are required');
    setLoading(true);
    try {
      const { data } = await API.post('/ai/salary-predict', form);
      setResult(data);
      toast.success('Salary prediction ready!');
    } catch {
      toast.error('Prediction failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        .sp-input:focus{border-color:#6366f1!important;}
        .sp-select:focus{border-color:#6366f1!important;}
      `}</style>
      <div style={S.container}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={24} color="#a5b4fc" />
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>Salary Predictor</h1>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>Know your market value before negotiating</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: result ? '420px 1fr' : '560px', gap: 24, justifyContent: result ? 'stretch' : 'center' }}>

          {/* Input Form */}
          <div style={S.card}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 22 }}>Enter Your Details</div>

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Job Title *</label>
              <div style={{ position: 'relative' }}>
                <Briefcase size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input className="sp-input" style={{ ...S.input, paddingLeft: 38 }}
                  placeholder="e.g. Senior React Developer"
                  value={form.jobTitle} onChange={e => setForm({ ...form, jobTitle: e.target.value })} />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Skills *</label>
              <div style={{ position: 'relative' }}>
                <Sparkles size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input className="sp-input" style={{ ...S.input, paddingLeft: 38 }}
                  placeholder="e.g. React, Node.js, TypeScript, MongoDB"
                  value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} />
              </div>
              <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>Separate skills with commas</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              <div>
                <label style={S.label}>Experience</label>
                <div style={{ position: 'relative' }}>
                  <select className="sp-select" style={S.select}
                    value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })}>
                    <option value="">Select...</option>
                    <option value="0">Fresher (0 yrs)</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(y => (
                      <option key={y} value={y}>{y} year{y > 1 ? 's' : ''}</option>
                    ))}
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={S.label}>Location</label>
                <div style={{ position: 'relative' }}>
                  <select className="sp-select" style={S.select}
                    value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}>
                    <option value="">Select city</option>
                    {['Bangalore','Mumbai','Delhi','Hyderabad','Pune','Chennai','Kolkata','Noida','Gurgaon','Ahmedabad','Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button style={S.predictBtn(loading)} onClick={predict} disabled={loading}>
              {loading
                ? <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Predicting...</>
                : <><TrendingUp size={18} /> Predict My Salary</>
              }
            </button>

            {result && (
              <button onClick={() => { setResult(null); setForm({ jobTitle: '', skills: '', experience: '', location: '' }); }}
                style={{ width: '100%', marginTop: 10, padding: '10px', background: 'transparent', border: '1px solid #334155', borderRadius: 10, color: '#64748b', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <RotateCcw size={13} /> Reset
              </button>
            )}
          </div>

          {/* Results */}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, animation: 'fadeIn 0.4s ease' }}>

              {/* Main Salary Card */}
              <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 16, padding: '28px 24px', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, opacity: 0.85, marginBottom: 12, fontSize: 13 }}>
                  <DollarSign size={15} /> Predicted Annual Salary
                </div>
                <div style={{ fontSize: 42, fontWeight: 900, marginBottom: 4 }}>{fmt(result.median)}</div>
                <div style={{ opacity: 0.8, fontSize: 14 }}>Range: {fmt(result.min)} – {fmt(result.max)}</div>
                {result.confidence && (
                  <div style={{ marginTop: 14, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: 'rgba(255,255,255,0.15)', borderRadius: 20, fontSize: 13 }}>
                    <Sparkles size={13} /> {result.confidence}% confidence
                  </div>
                )}
              </div>

              {/* Salary Bar */}
              <div style={S.card}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 18 }}>📊 Salary Distribution</div>
                {[
                  { label: 'Entry Level', val: result.min, color: '#94a3b8' },
                  { label: 'Your Estimate', val: result.median, color: '#6366f1' },
                  { label: 'Senior Level', val: result.max, color: '#4ade80' },
                ].map(({ label, val, color }) => (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: '#94a3b8' }}>{label}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color }}>{fmt(val)}</span>
                    </div>
                    <div style={{ height: 8, background: '#334155', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${(val / result.max) * 100}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 1s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Insights */}
              {result.insights?.length > 0 && (
                <div style={S.card}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 14 }}>💡 Market Insights</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {result.insights.map((insight, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, padding: '10px 14px', background: '#0f172a', borderRadius: 10, border: '1px solid #1e293b' }}>
                        <span style={{ color: '#6366f1', flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{insight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location badge */}
              {form.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b', padding: '8px 14px', background: '#1e293b', borderRadius: 8, border: '1px solid #334155', width: 'fit-content' }}>
                  <MapPin size={12} /> Data for {form.location} market
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}