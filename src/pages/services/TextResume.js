import React from 'react';
import { Link } from 'react-router-dom';
export default function TextResume() {
  return (
    <div style={S.page}>
      <div style={S.hero}>
        <span style={S.tag}>📄 Text Resume</span>
        <h1 style={S.title}>Professional Text Resume Builder</h1>
        <p style={S.sub}>Create ATS-friendly text resumes that pass automated screening systems</p>
        <Link to="/student/resume-builder" style={S.cta}>Build My Resume →</Link>
      </div>
      <div style={S.grid}>
        {[['⚡','ATS Optimized','Passes all major applicant tracking systems used by top companies'],['🎯','Keyword Rich','AI suggests the right keywords for your target role'],['📊','Quality Score','Get instant feedback on your resume strength'],['🔄','Easy Edit','Update anytime with our simple editor']].map(([icon,title,desc])=>(
          <div key={title} style={S.card}><span style={{fontSize:32,marginBottom:12,display:'block'}}>{icon}</span><h3 style={{color:'#fff',margin:'0 0 8px'}}>{title}</h3><p style={{color:'#666',fontSize:13,lineHeight:1.6,margin:0}}>{desc}</p></div>
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
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:20,maxWidth:900,margin:'0 auto',padding:'0 24px'},
  card:{background:'#0d0d1f',border:'1px solid #1e1e3a',borderRadius:16,padding:'28px 24px'},
};