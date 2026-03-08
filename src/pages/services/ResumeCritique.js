import React, { useState } from 'react';
import { Link } from 'react-router-dom';
export default function ResumeCritique() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div style={S.page}>
      <div style={S.hero}>
        <span style={S.tag}>🔍 Resume Critique</span>
        <h1 style={S.title}>Get Expert Resume Feedback</h1>
        <p style={S.sub}>Our AI reviews your resume and gives detailed improvement suggestions</p>
      </div>
      <div style={S.center}>
        {!submitted ? (
          <div style={S.card}>
            <h3 style={{color:'#fff',margin:'0 0 20px',fontSize:18}}>Submit Your Resume for Review</h3>
            <textarea placeholder="Paste your resume text here..." style={S.textarea} rows={8}/>
            <button onClick={()=>setSubmitted(true)} style={S.btn}>Get Free Critique →</button>
            <p style={{color:'#555',fontSize:12,textAlign:'center',marginTop:12}}>Or use our <Link to="/student/resume-analyzer" style={{color:'#7c6fff'}}>AI Resume Analyzer</Link> for instant results</p>
          </div>
        ) : (
          <div style={{...S.card,textAlign:'center'}}>
            <div style={{fontSize:56,marginBottom:16}}>✅</div>
            <h3 style={{color:'#fff',margin:'0 0 8px'}}>Submitted Successfully!</h3>
            <p style={{color:'#666',marginBottom:24}}>For instant AI feedback, try our Resume Analyzer</p>
            <Link to="/student/resume-analyzer" style={S.btn}>Go to Resume Analyzer →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
const S = {
  page:{minHeight:'100vh',background:'#07070f',fontFamily:"'Sora',sans-serif",paddingBottom:80},
  hero:{textAlign:'center',padding:'80px 24px 40px'},
  tag:{display:'inline-block',background:'#1a1535',border:'1px solid #7c6fff44',color:'#a78bfa',padding:'6px 18px',borderRadius:20,fontSize:13,marginBottom:20},
  title:{margin:'0 0 16px',fontSize:40,fontWeight:800,color:'#fff'},
  sub:{margin:0,color:'#666',fontSize:16},
  center:{maxWidth:560,margin:'40px auto',padding:'0 24px'},
  card:{background:'#0d0d1f',border:'1px solid #1e1e3a',borderRadius:16,padding:'32px'},
  textarea:{width:'100%',background:'#12122a',border:'1px solid #2a2a4a',borderRadius:10,padding:'14px',color:'#fff',fontSize:13,resize:'vertical',outline:'none',boxSizing:'border-box',marginBottom:16,fontFamily:"'Sora',sans-serif"},
  btn:{display:'block',textAlign:'center',padding:'13px',background:'linear-gradient(135deg,#7c6fff,#5a4dcc)',borderRadius:10,color:'#fff',fontSize:15,fontWeight:700,textDecoration:'none',border:'none',cursor:'pointer',width:'100%'},
};