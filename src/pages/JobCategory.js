import React from 'react';
import { useParams, Link } from 'react-router-dom';

const JOB_DATA = {
  'fresher-jobs':{ title:'🎓 Fresher Jobs', desc:'Entry level jobs for fresh graduates', color:'#7c6fff' },
  'mnc-jobs':{ title:'🏢 MNC Jobs', desc:'Jobs at top multinational companies', color:'#60a5fa' },
  'remote-jobs':{ title:'🌐 Remote Jobs', desc:'Work from anywhere jobs', color:'#34d399' },
  'work-from-home':{ title:'🏠 Work From Home', desc:'Complete WFH opportunities', color:'#f59e0b' },
  'walk-in-jobs':{ title:'🚶 Walk-in Jobs', desc:'Direct walk-in interview opportunities', color:'#f472b6' },
  'part-time-jobs':{ title:'⏰ Part-time Jobs', desc:'Flexible part-time work opportunities', color:'#a78bfa' },
  'it-jobs':{ title:'💻 IT Jobs', desc:'Software and technology jobs', color:'#60a5fa' },
  'sales-jobs':{ title:'📈 Sales Jobs', desc:'Sales and business development roles', color:'#f59e0b' },
  'marketing-jobs':{ title:'📣 Marketing Jobs', desc:'Marketing and growth roles', color:'#f472b6' },
  'data-science-jobs':{ title:'📊 Data Science Jobs', desc:'Data science and analytics roles', color:'#34d399' },
  'hr-jobs':{ title:'👥 HR Jobs', desc:'Human resources and people ops roles', color:'#a78bfa' },
  'engineering-jobs':{ title:'⚙️ Engineering Jobs', desc:'Core engineering roles', color:'#fbbf24' },
  'delhi-jobs':{ title:'📍 Jobs in Delhi', desc:'Top job opportunities in Delhi NCR', color:'#7c6fff' },
  'mumbai-jobs':{ title:'📍 Jobs in Mumbai', desc:'Jobs in the financial capital', color:'#60a5fa' },
  'bangalore-jobs':{ title:'📍 Jobs in Bangalore', desc:'Jobs in the Silicon Valley of India', color:'#34d399' },
  'hyderabad-jobs':{ title:'📍 Jobs in Hyderabad', desc:'Opportunities in Cyberabad', color:'#f59e0b' },
  'chennai-jobs':{ title:'📍 Jobs in Chennai', desc:'Jobs in the Detroit of India', color:'#f472b6' },
  'pune-jobs':{ title:'📍 Jobs in Pune', desc:'Jobs in the Oxford of the East', color:'#a78bfa' },
};

export default function JobCategory() {
  const { category } = useParams();
  const data = JOB_DATA[category] || { title:'💼 Jobs', desc:'Browse all jobs', color:'#7c6fff' };
  return (
    <div style={S.page}>
      <div style={S.hero}>
        <h1 style={S.title}>{data.title}</h1>
        <p style={S.sub}>{data.desc}</p>
        <Link to="/jobs" style={{...S.cta, background:`linear-gradient(135deg,${data.color},${data.color}cc)`}}>
          Browse All Jobs →
        </Link>
      </div>
    </div>
  );
}
const S = {
  page:{minHeight:'100vh',background:'#07070f',fontFamily:"'Sora',sans-serif"},
  hero:{textAlign:'center',padding:'120px 24px',maxWidth:700,margin:'0 auto'},
  title:{margin:'0 0 16px',fontSize:44,fontWeight:800,color:'#fff'},
  sub:{margin:'0 0 32px',color:'#666',fontSize:16},
  cta:{display:'inline-block',color:'#fff',padding:'14px 32px',borderRadius:12,fontSize:16,fontWeight:700,textDecoration:'none'},
};