import React from 'react';
import { Link } from 'react-router-dom';
export default function ResumeDisplay() {
  return (
    <div style={S.page}>
      <div style={S.hero}>
        <span style={S.tag}>📌 Resume Display</span>
        <h1 style={S.title}>Let Recruiters Find You</h1>
        <p style={S.sub}>Your resume gets displayed to 10,000+ active recruiters searching for candidates like you</p>
        <Link to="/pricing" style={S.cta}>Enable Resume Display →</Link>
      </div>
      <div style={S.stats}>
        {[['10K+','Active Recruiters'],['3x','More Profile Views'],['48hrs','Average Response Time'],['500+','Companies Hiring']].map(([n,l])=>(
          <div key={l} style={S.stat}><p style={{margin:'0 0 4px',fontSize:36,fontWeight:800,color:'#a78bfa'}}>{n}</p><p style={{margin:0,color:'#666',fontSize:13}}>{l}</p></div>
        ))}
      </div>
    </div>
  );
}
const S = {
  page:{minHeight:'100vh',background:'#07070f',fontFamily:"'Sora',sans-serif",paddingBottom:80},
  hero:{textAlign:'center',padding:'80px 24px 56px',maxWidth:700,margin:'0 auto'},
  tag:{display:'inline-block',background:'#1a1535',border:'1px solid #7c6fff44',color:'#a78bfa',padding:'6px 18px',borderRadius:20,fontSize:13,marginBottom:20},
  title:{margin:'0 0 16px',fontSize:40,fontWeight:800,color:'#fff'},
  sub:{margin:'0 0 32px',color:'#666',fontSize:16,lineHeight:1.6},
  cta:{display:'inline-block',background:'linear-gradient(135deg,#7c6fff,#5a4dcc)',color:'#fff',padding:'14px 32px',borderRadius:12,fontSize:16,fontWeight:700,textDecoration:'none'},
  stats:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:20,maxWidth:700,margin:'0 auto',padding:'0 24px'},
  stat:{background:'#0d0d1f',border:'1px solid #1e1e3a',borderRadius:16,padding:'32px 24px',textAlign:'center'},
};