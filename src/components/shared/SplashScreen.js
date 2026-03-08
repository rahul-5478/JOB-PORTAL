import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2200);
    const t2 = setTimeout(() => onDone(), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#07070f',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: phase === 1 ? 0 : 1,
      transition: 'opacity 0.6s ease',
      pointerEvents: 'none',
    }}>
      <style>{`
        @keyframes splashLogo{0%{transform:scale(0.6);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}
        @keyframes splashText{0%{opacity:0;transform:translateY(16px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes splashBar{0%{width:0%}100%{width:100%}}
        @keyframes splashPulse{0%,100%{box-shadow:0 0 30px #f9731655}50%{box-shadow:0 0 60px #f9731699}}
      `}</style>

      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #f9731610 0%, transparent 70%)' }} />

      {/* Logo */}
      <div style={{
        width: 100, height: 100, borderRadius: 28,
        background: 'linear-gradient(135deg,#f97316,#ea580c)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 52, marginBottom: 24,
        animation: 'splashLogo 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards, splashPulse 2s ease-in-out infinite',
        boxShadow: '0 20px 60px #f9731644',
      }}>
        ⚡
      </div>

      {/* Name */}
      <h1 style={{
        fontSize: 36, fontWeight: 900, margin: '0 0 6px',
        fontFamily: "'Sora',sans-serif",
        animation: 'splashText 0.5s ease 0.4s both',
      }}>
        <span style={{ color: '#fff' }}>Hire</span><span style={{ color: '#f97316' }}>AI</span>
      </h1>
      <p style={{
        color: '#555', fontSize: 13, fontWeight: 600,
        fontFamily: "'Sora',sans-serif", letterSpacing: 2,
        textTransform: 'uppercase', margin: '0 0 48px',
        animation: 'splashText 0.5s ease 0.55s both',
      }}>
        AI Powered Jobs
      </p>

      {/* Loading bar */}
      <div style={{ width: 180, height: 3, background: '#1a1a2e', borderRadius: 2, overflow: 'hidden', animation: 'splashText 0.3s ease 0.6s both' }}>
        <div style={{ height: '100%', background: 'linear-gradient(90deg,#f97316,#a78bfa)', borderRadius: 2, animation: 'splashBar 1.8s ease 0.3s both' }} />
      </div>
    </div>
  );
}