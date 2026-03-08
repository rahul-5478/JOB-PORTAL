import React from 'react';
import { Link } from 'react-router-dom';
export default function PriorityApplicant() {
  return (
    <div style={S.page}>
      <div style={S.hero}>
        <div style={S.badge}>⭐ Priority Applicant</div>
        <h1 style={S.title}>Get Noticed First</h1>
        <p style={S.sub}>Priority Applicants appear at the TOP of recruiter's list — 5x more likely to get called</p>
        <Link to="/pricing" style={S.cta}>Upgrade to Priority →</Link>
      </div>
      <div style={S.grid}>
        {[['🔝','Top of List','Your application shows first to every recruiter'],['👁️','Profile Views','Recruiters actively seek out priority profiles'],['📞','Faster Response','Get calls 5x faster than regular applicants'],['✅','Verified Badge','Priority badge builds instant trust with companies']].map(([i,t,d])=>(
          <div key={t} style={S.card}><span style={{fontSize:36,marginBottom:12,display:'block'}}>{i}</span><h3 style={{color:'#fff',margin:'0 0 8px',fontSize:16}}>{t}</h3><p style={{color:'#666',fontSize:13,margin:0,lineHeight:1.6}}>{d}</p></div>
        ))}
      </div>
    </div>
  );
}
const S = {
  page:{minHeight:'100vh',background:'#07070f',fontFamily:"'Sora',sans-serif",paddingBottom:80},
  hero:{textAlign:'center',padding:'80px 24px 56px',maxWidth:700,margin:'0 auto'},
  badge:{display:'inline-block',background:'linear-gradient(135deg,#f59e0b22,#1a1535)',border:'1px solid #f59e0b44',color:'#f59e0b',padding:'6px 18px',borderRadius:20,fontSize:13,marginBottom:20},
  title:{margin:'0 0 16px',fontSize:40,fontWeight:800,color:'#fff'},
  sub:{margin:'0 0 32px',color:'#666',fontSize:16,lineHeight:1.6},
  cta:{display:'inline-block',background:'linear-gradient(135deg,#f59e0b,#d97706)',color:'#fff',padding:'14px 32px',borderRadius:12,fontSize:16,fontWeight:700,textDecoration:'none'},
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:20,maxWidth:900,margin:'0 auto',padding:'0 24px'},
  card:{background:'#0d0d1f',border:'1px solid #1e1e3a',borderRadius:16,padding:'28px 24px',textAlign:'center'},
};