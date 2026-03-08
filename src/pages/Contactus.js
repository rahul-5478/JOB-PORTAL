import React, { useState } from 'react';
export default function ContactUs() {
  const [form, setForm] = useState({name:'',email:'',subject:'',message:''});
  const [sent, setSent] = useState(false);
  const submit = (e) => { e.preventDefault(); if(form.name&&form.email&&form.message) setSent(true); };
  return (
    <div style={S.page}>
      <div style={S.hero}>
        <span style={S.tag}>📬 Contact Us</span>
        <h1 style={S.title}>Get in Touch</h1>
        <p style={S.sub}>We're here to help. Reach out for any queries, feedback, or support.</p>
      </div>
      <div style={S.layout}>
        <div style={S.info}>
          {[['📧','Email','support@hireai.in'],['📞','Phone','+91 98765 43210'],['🕐','Hours','Mon-Fri, 9AM - 6PM IST'],['📍','Office','Bangalore, India']].map(([i,l,v])=>(
            <div key={l} style={S.infoItem}><span style={{fontSize:24}}>{i}</span><div><p style={{margin:'0 0 2px',color:'#888',fontSize:12,textTransform:'uppercase'}}>{l}</p><p style={{margin:0,color:'#fff',fontSize:14}}>{v}</p></div></div>
          ))}
        </div>
        <div style={S.formCard}>
          {sent ? (
            <div style={{textAlign:'center',padding:'40px 0'}}>
              <div style={{fontSize:56,marginBottom:16}}>✅</div>
              <h3 style={{color:'#fff',margin:'0 0 8px'}}>Message Sent!</h3>
              <p style={{color:'#666'}}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              <h3 style={{color:'#fff',margin:'0 0 20px',fontSize:18}}>Send us a message</h3>
              {[['Name','name','text'],['Email','email','email'],['Subject','subject','text']].map(([l,k,t])=>(
                <div key={k} style={{marginBottom:14}}>
                  <label style={{display:'block',color:'#888',fontSize:12,marginBottom:6}}>{l}</label>
                  <input type={t} value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} style={S.input}/>
                </div>
              ))}
              <label style={{display:'block',color:'#888',fontSize:12,marginBottom:6}}>Message</label>
              <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} style={{...S.input,height:120,resize:'vertical'}} rows={5}/>
              <button onClick={submit} style={S.btn}>Send Message →</button>
            </>
          )}
        </div>
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
  layout:{display:'flex',gap:32,maxWidth:900,margin:'40px auto',padding:'0 24px',flexWrap:'wrap'},
  info:{display:'flex',flexDirection:'column',gap:20,flex:'0 0 240px'},
  infoItem:{display:'flex',gap:14,alignItems:'flex-start',background:'#0d0d1f',border:'1px solid #1e1e3a',borderRadius:12,padding:'16px'},
  formCard:{flex:1,background:'#0d0d1f',border:'1px solid #1e1e3a',borderRadius:16,padding:'28px',minWidth:280},
  input:{width:'100%',background:'#12122a',border:'1px solid #2a2a4a',borderRadius:10,padding:'12px 14px',color:'#fff',fontSize:13,outline:'none',boxSizing:'border-box',fontFamily:"'Sora',sans-serif",display:'block'},
  btn:{width:'100%',marginTop:16,padding:'13px',background:'linear-gradient(135deg,#7c6fff,#5a4dcc)',border:'none',borderRadius:10,color:'#fff',fontSize:15,fontWeight:700,cursor:'pointer'},
};