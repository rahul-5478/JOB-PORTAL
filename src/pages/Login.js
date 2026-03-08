import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) { toast.error('Fill all fields'); return; }
    setLoading(true);
    try {
      // AuthContext: login(email, password) — exact match
      const user = await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  const quickFill = (email, password) => setForm({ email, password });

  return (
    <div style={{ minHeight:'100vh', background:'#07070f', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px', fontFamily:"'Sora',sans-serif", overflowX:'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px #f9731630}50%{box-shadow:0 0 40px #f9731660}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .login-input:focus{ border-color:#f97316 !important; box-shadow:0 0 0 3px #f9731620 !important; outline:none !important; }
        .login-btn:active{ transform:scale(0.98) !important; }
        .demo-btn{ background:#0d0d1f; border:1px solid #2a2a4a; color:#888; padding:10px 14px; border-radius:10px; font-size:13px; cursor:pointer; font-family:'Sora',sans-serif; width:100%; text-align:left; transition:all 0.15s; }
        .demo-btn:hover{ border-color:#f9731644; color:#f97316; background:#1a0a00; }
        @media(max-width:480px){
          .login-card{ padding:24px 16px !important; border-radius:16px !important; }
          .login-title{ font-size:22px !important; }
        }
      `}</style>

      <div style={{ width:'100%', maxWidth:420, animation:'fadeUp 0.4s ease' }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:60, height:60, borderRadius:18, background:'linear-gradient(135deg,#f97316,#ea580c)', fontSize:28, marginBottom:12, animation:'float 3s ease-in-out infinite', boxShadow:'0 8px 32px #f9731640' }}>⚡</div>
          <h1 style={{ margin:0, fontSize:22, fontWeight:800, color:'#fff' }}>HireAI</h1>
          <p style={{ margin:'4px 0 0', color:'#555', fontSize:13 }}>Your AI Career Partner</p>
        </div>

        {/* Card */}
        <div className="login-card" style={{ background:'#0d0d1f', border:'1px solid #1e1e2e', borderRadius:20, padding:'28px 24px' }}>
          <h2 className="login-title" style={{ margin:'0 0 6px', fontSize:24, fontWeight:800, color:'#fff', textAlign:'center' }}>Welcome Back 👋</h2>
          <p style={{ margin:'0 0 24px', color:'#555', fontSize:13, textAlign:'center' }}>Sign in to continue your job search</p>

          {/* Email */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', color:'#888', fontSize:12, fontWeight:600, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>Email Address</label>
            <input
              className="login-input"
              type="email"
              value={form.email}
              onChange={e=>setForm({...form, email:e.target.value})}
              onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
              placeholder="your@email.com"
              autoComplete="email"
              style={{ width:'100%', background:'#07070f', border:'1px solid #2a2a4a', borderRadius:12, padding:'14px 16px', color:'#fff', fontSize:16, fontFamily:"'Sora',sans-serif", transition:'all 0.2s' }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', color:'#888', fontSize:12, fontWeight:600, marginBottom:6, textTransform:'uppercase', letterSpacing:0.5 }}>Password</label>
            <div style={{ position:'relative' }}>
              <input
                className="login-input"
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={e=>setForm({...form, password:e.target.value})}
                onKeyDown={e=>e.key==='Enter'&&handleSubmit()}
                placeholder="Enter password"
                autoComplete="current-password"
                style={{ width:'100%', background:'#07070f', border:'1px solid #2a2a4a', borderRadius:12, padding:'14px 48px 14px 16px', color:'#fff', fontSize:16, fontFamily:"'Sora',sans-serif", transition:'all 0.2s' }}
              />
              <button onClick={()=>setShowPwd(!showPwd)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#555', cursor:'pointer', padding:4, display:'flex' }}>
                {showPwd ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            className="login-btn"
            onClick={handleSubmit}
            disabled={loading}
            style={{ width:'100%', background:'linear-gradient(135deg,#f97316,#ea580c)', border:'none', color:'#fff', padding:'15px', borderRadius:12, fontSize:16, fontWeight:700, cursor:'pointer', fontFamily:"'Sora',sans-serif", transition:'all 0.2s', animation:'glow 3s infinite', display:'flex', alignItems:'center', justifyContent:'center', gap:8, marginBottom:16 }}>
            {loading ? (
              <>
                <div style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTop:'2px solid white', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
                Signing in...
              </>
            ) : 'Sign In →'}
          </button>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>

          <div style={{ textAlign:'center', fontSize:13, color:'#555', marginBottom:20 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color:'#f97316', fontWeight:700, textDecoration:'none' }}>Create one</Link>
          </div>

          {/* Demo Accounts */}
          <div style={{ background:'#07070f', borderRadius:12, border:'1px solid #1a1a2e', padding:'16px' }}>
            <p style={{ margin:'0 0 10px', fontSize:11, fontWeight:700, color:'#444', textTransform:'uppercase', letterSpacing:1, textAlign:'center' }}>Quick Demo Login</p>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <button className="demo-btn" onClick={()=>quickFill('student@demo.com','demo1234')}>
                👤 Student Demo — <span style={{ color:'#555' }}>student@demo.com</span>
              </button>
              <button className="demo-btn" onClick={()=>quickFill('google@demo.com','demo1234')}>
                🏢 Company Demo — <span style={{ color:'#555' }}>google@demo.com</span>
              </button>
            </div>
            <p style={{ margin:'10px 0 0', fontSize:11, color:'#333', textAlign:'center' }}>Password: <span style={{ color:'#f97316' }}>demo1234</span></p>
          </div>
        </div>

        {/* Footer links */}
        <div style={{ textAlign:'center', marginTop:20, display:'flex', justifyContent:'center', gap:16 }}>
          <Link to="/" style={{ color:'#333', fontSize:12, textDecoration:'none' }}>← Home</Link>
          <Link to="/pricing" style={{ color:'#333', fontSize:12, textDecoration:'none' }}>Pricing</Link>
          <Link to="/contact" style={{ color:'#333', fontSize:12, textDecoration:'none' }}>Contact</Link>
        </div>
      </div>
    </div>
  );
}