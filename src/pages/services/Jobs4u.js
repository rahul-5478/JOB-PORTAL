import React from 'react';
import { Link } from 'react-router-dom';
export default function Jobs4u() {
  return (
    <div style={S.page}>
      <div style={S.hero}>
        <span style={S.tag}>🎯 Jobs4u</span>
        <h1 style={S.title}>Jobs Matched Just For You</h1>
        <p style={S.sub}>AI analyzes your profile and shows only the jobs you're most likely to get</p>
        <Link to="/student/ai-matches" style={S.cta}>See My Matched Jobs →</Link>
      </div>
      <div style={S.steps}>
        {[['1','Complete Your Profile','Add skills, experience, and education'],['2','AI Analyzes You','Our AI studies your profile in seconds'],['3','Get Matched','See jobs with match % scores'],['4','Apply Instantly','One-click apply to matched jobs']].map(([n,t,d])=>(
          <div key={n} style={S.step}>
            <div style={S.stepNum}>{n}</div>
            <h4 style={{color:'#fff',margin:'0 0 6px'}}>{t}</h4>
            <p style={{color:'#666',fontSize:13,margin:0}}>{d}</p>
          </div>
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
  steps:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:20,maxWidth:900,margin:'0 auto',padding:'0 24px'},
  step:{background:'#0d0d1f',border:'1px solid #1e1e3a',borderRadius:16,padding:'28px 24px',textAlign:'center'},
  stepNum:{width:48,height:48,borderRadius:'50%',background:'linear-gradient(135deg,#7c6fff,#5a4dcc)',color:'#fff',fontSize:20,fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px'},
};