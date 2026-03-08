import React from 'react';
import { Link } from 'react-router-dom';
const TEMPLATES = [
  {name:'Modern Dark',color:'#7c6fff',desc:'Sleek dark theme with purple accents'},
  {name:'Creative Bold',color:'#f59e0b',desc:'Stand out with bold typography'},
  {name:'Classic Pro',color:'#22c55e',desc:'Clean and professional layout'},
];
export default function VisualResume() {
  return (
    <div style={S.page}>
      <div style={S.hero}>
        <span style={S.tag}>🎨 Visual Resume</span>
        <h1 style={S.title}>Eye-Catching Visual Resumes</h1>
        <p style={S.sub}>Choose from beautiful templates that make recruiters stop and look</p>
      </div>
      <div style={S.grid}>
        {TEMPLATES.map((t)=>(
          <div key={t.name} style={{...S.card,borderColor:t.color+'44'}}>
            <div style={{height:180,background:`linear-gradient(135deg,${t.color}22,#0d0d20)`,borderRadius:12,marginBottom:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:48}}>📋</div>
            <h3 style={{color:'#fff',margin:'0 0 6px'}}>{t.name}</h3>
            <p style={{color:'#666',fontSize:13,margin:'0 0 16px'}}>{t.desc}</p>
            <Link to="/student/resume-builder" style={{...S.btn,background:`linear-gradient(135deg,${t.color},${t.color}cc)`}}>Use Template</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
const S = {
  page:{minHeight:'100vh',background:'#07070f',fontFamily:"'Sora',sans-serif",paddingBottom:80},
  hero:{textAlign:'center',padding:'80px 24px 56px'},
  tag:{display:'inline-block',background:'#1a1535',border:'1px solid #7c6fff44',color:'#a78bfa',padding:'6px 18px',borderRadius:20,fontSize:13,marginBottom:20},
  title:{margin:'0 0 16px',fontSize:40,fontWeight:800,color:'#fff'},
  sub:{margin:0,color:'#666',fontSize:16},
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24,maxWidth:900,margin:'0 auto',padding:'0 24px'},
  card:{background:'#0d0d1f',border:'1px solid #1e1e3a',borderRadius:16,padding:'24px'},
  btn:{display:'block',textAlign:'center',padding:'11px',borderRadius:10,color:'#fff',fontSize:14,fontWeight:600,textDecoration:'none'},
};