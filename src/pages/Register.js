import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Users, Building2 } from 'lucide-react';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const pwdStrength = (p) => {
    if (!p) return { score: 0, label: '', color: '#333' };
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    const labels = ['','Weak','Fair','Good','Strong','Very Strong'];
    const colors = ['#333','#ef4444','#f59e0b','#eab308','#22c55e','#a78bfa'];
    return { score: s, label: labels[s] || 'Strong', color: colors[Math.min(s,5)] };
  };

  const strength = pwdStrength(form.password);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) { toast.error('Fill all fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      // AuthContext: register(formData) takes a SINGLE object — exact match
      const user = await register({ name: form.name, email: form.email, password: form.password, role: form.role });
      toast.success('Account created! Welcome 🎉');
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#07070f', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px', fontFamily:"'Sora',sans-serif", overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px #f9731630}50%{box-shadow:0 0 40px #f9731660}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .reg-input:focus{ border-color:#f97316 !important; box-shadow:0 0 0 3px #f9731620 !important; outline:none !important; }
        .reg-btn:active{ transform:scale(0.98) !important; }
        .role-card{ transition:all 0.2s !important; cursor:pointer; }
        .role-card:hover{ transform:translateY(-2px) !important; }
        @media(max-width:480px){
          .reg-card{ padding:24px 16px !important; border-radius:16px !important; }
          .reg-title{ font-size:20px !important; }
        }
      `}</style>

      <div style={{ width:'100%', maxWidth:420, animation:'fadeUp 0.4s ease' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:24 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#f97316,#ea580c)', fontSize:26, marginBottom:10, animation:'float 3s ease-in-out infinite', boxShadow:'0 8px 28px #f9731640' }}>⚡</div>
          <h1 style={{ margin:0, fontSize:20, fontWeight:800, color:'#fff' }}>HireAI</h1>
          <p style={{ margin:'3px 0 0', color:'#555', fontSize:12 }}>Start your AI-powered job search</p>
        </div>

        {/* Card */}
        <div className="reg-card" style={{ background:'#0d0d1f', border:'1px solid #1e1e2e', borderRadius:20, padding:'26px 22px' }}>
          <h2 className="reg-title" style={{ margin:'0 0 4px', fontSize:22, fontWeight:800, color:'#fff', textAlign:'center' }}>Create Account 🚀</h2>
          <p style={{ margin:'0 0 20px', color:'#555', fontSize:12, textAlign:'center' }}>Join 1M+ job seekers on HireAI</p>

          {/* Role Toggle */}
          <div style={{ marginBottom:18 }}>
            <label style={{ display:'block', color:'#888', fontSize:11, fontWeight:700, marginBottom:8, textTransform:'uppercase', letterSpacing:0.5 }}>I am a</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
              <div className="role-card" onClick={()=>setForm({...form, role:'student'})}
                style={{ background:form.role==='student'?'#f9731615':'#07070f', border:`2px solid ${form.role==='student'?'#f97316':'#2a2a4a'}`, borderRadius:12, padding:'12px 8px', textAlign:'center' }}>
                <Users size={20} style={{ color:form.role==='student'?'#f97316':'#555', margin:'0 auto 6px', display:'block' }} />
                <p style={{ margin:0, fontSize:13, fontWeight:700, color:form.role==='student'?'#f97316':'#555' }}>Job Seeker</p>
                <p style={{ margin:'2px 0 0', fontSize:10, color:'#444' }}>Find jobs</p>
              </div>
              <div className="role-card" onClick={()=>setForm({...form, role:'company'})}
                style={{ background:form.role==='company'?'#a78bfa15':'#07070f', border:`2px solid ${form.role==='company'?'#a78bfa':'#2a2a4a'}`, borderRadius:12, padding:'12px 8px', textAlign:'center' }}>
                <Building2 size={20} style={{ color:form.role==='company'?'#a78bfa':'#555', margin:'0 auto 6px', display:'block' }} />
                <p style={{ margin:0, fontSize:13, fontWeight:700, color:form.role==='company'?'#a78bfa':'#555' }}>Company</p>
                <p style={{ margin:'2px 0 0', fontSize:10, color:'#444' }}>Hire talent</p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div style={{ marginBottom:12 }}>
            <label style={{ display:'block', color:'#888', fontSize:11, fontWeight:700, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>
              {form.role === 'company' ? 'Company Name' : 'Full Name'}
            </label>
            <input
              className="reg-input"
              type="text"
              value={form.name}
              onChange={e=>setForm({...form, name:e.target.value})}
              placeholder={form.role === 'company' ? 'Acme Corp' : 'Your full name'}
              autoComplete="name"
              style={{ width:'100%', background:'#07070f', border:'1px solid #2a2a4a', borderRadius:12, padding:'13px 16px', color:'#fff', fontSize:16, fontFamily:"'Sora',sans-serif", transition:'all 0.2s' }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom:12 }}>
            <label style={{ display:'block', color:'#888', fontSize:11, fontWeight:700, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>Email Address</label>
            <input
              className="reg-input"
              type="email"
              value={form.email}
              onChange={e=>setForm({...form, email:e.target.value})}
              placeholder="your@email.com"
              autoComplete="email"
              style={{ width:'100%', background:'#07070f', border:'1px solid #2a2a4a', borderRadius:12, padding:'13px 16px', color:'#fff', fontSize:16, fontFamily:"'Sora',sans-serif", transition:'all 0.2s' }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom:18 }}>
            <label style={{ display:'block', color:'#888', fontSize:11, fontWeight:700, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>Password</label>
            <div style={{ position:'relative' }}>
              <input
                className="reg-input"
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={e=>setForm({...form, password:e.target.value})}
                placeholder="Min 6 characters"
                autoComplete="new-password"
                style={{ width:'100%', background:'#07070f', border:'1px solid #2a2a4a', borderRadius:12, padding:'13px 48px 13px 16px', color:'#fff', fontSize:16, fontFamily:"'Sora',sans-serif", transition:'all 0.2s' }}
              />
              <button onClick={()=>setShowPwd(!showPwd)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#555', cursor:'pointer', padding:4, display:'flex' }}>
                {showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            {form.password.length > 0 && (
              <div style={{ marginTop:8 }}>
                <div style={{ display:'flex', gap:4, marginBottom:4 }}>
                  {[1,2,3,4,5].map(i=>(
                    <div key={i} style={{ flex:1, height:3, borderRadius:2, background:i<=strength.score?strength.color:'#1a1a2e', transition:'all 0.3s' }} />
                  ))}
                </div>
                <p style={{ margin:0, fontSize:11, color:strength.color, fontWeight:600 }}>{strength.label}</p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            className="reg-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width:'100%', background:'linear-gradient(135deg,#f97316,#ea580c)', border:'none', color:'#fff', padding:'15px', borderRadius:12, fontSize:16, fontWeight:700, cursor:'pointer', fontFamily:"'Sora',sans-serif", transition:'all 0.2s', animation:'glow 3s infinite', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:14 }}>
            {loading ? (
              <>
                <div style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid white', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                Creating...
              </>
            ) : `Create ${form.role === 'company' ? 'Company' : ''} Account →`}
          </button>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

          <p style={{ textAlign:'center', fontSize:11, color:'#333', margin:'0 0 14px' }}>
            By signing up you agree to our Terms of Service
          </p>

          <div style={{ textAlign:'center', fontSize:13, color:'#555' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#f97316', fontWeight:700, textDecoration:'none' }}>Sign In</Link>
          </div>
        </div>

        {/* Footer links */}
        <div style={{ textAlign:'center', marginTop:18, display:'flex', justifyContent:'center', gap:16 }}>
          <Link to="/" style={{ color:'#333', fontSize:12, textDecoration:'none' }}>← Home</Link>
          <Link to="/pricing" style={{ color:'#333', fontSize:12, textDecoration:'none' }}>Pricing</Link>
        </div>
      </div>
    </div>
  );
}