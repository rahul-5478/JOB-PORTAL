import React from 'react';
import { useParams, Link } from 'react-router-dom';

const CATEGORY_DATA = {
  unicorn: { title: '🦄 Unicorn Companies', desc: 'Indian startups valued at $1 billion or more', color: '#a78bfa' },
  mnc: { title: '🏢 MNC Companies', desc: 'Multinational corporations hiring in India', color: '#60a5fa' },
  startup: { title: '🚀 Startups', desc: 'Fast-growing startups with exciting opportunities', color: '#34d399' },
  'product-based': { title: '💻 Product Based', desc: 'Companies building their own products', color: '#f59e0b' },
  internet: { title: '🌐 Internet Companies', desc: 'Top internet and tech companies', color: '#f472b6' },
  'top-companies': { title: '⭐ Top Companies', desc: 'Most sought-after employers in India', color: '#fbbf24' },
  'it-companies': { title: '💻 IT Companies', desc: 'Leading IT services and software companies', color: '#60a5fa' },
  'fintech-companies': { title: '💳 Fintech Companies', desc: 'Financial technology innovators', color: '#34d399' },
};

export default function CompanyCategory() {
  const { category } = useParams();
  const data = CATEGORY_DATA[category] || { title: '🏢 Companies', desc: 'Browse companies', color: '#7c6fff' };

  return (
    <div style={S.page}>
      <div style={S.hero}>
        <span style={{ ...S.tag, borderColor: data.color + '44', color: data.color }}>{data.title}</span>
        <h1 style={S.title}>{data.title}</h1>
        <p style={S.sub}>{data.desc}</p>
        <Link to="/companies" style={{ ...S.cta, background: `linear-gradient(135deg,${data.color},${data.color}cc)` }}>
          Browse All Companies →
        </Link>
      </div>
      <div style={S.placeholder}>
        <p style={{ color: '#555', fontSize: 14, textAlign: 'center' }}>
          Showing companies in this category. <Link to="/companies" style={{ color: '#7c6fff' }}>View all companies →</Link>
        </p>
      </div>
    </div>
  );
}
const S = {
  page:{minHeight:'100vh',background:'#07070f',fontFamily:"'Sora',sans-serif",paddingBottom:80},
  hero:{textAlign:'center',padding:'80px 24px 40px',maxWidth:700,margin:'0 auto'},
  tag:{display:'inline-block',background:'#1a1535',border:'1px solid #7c6fff44',padding:'6px 18px',borderRadius:20,fontSize:13,marginBottom:20},
  title:{margin:'0 0 16px',fontSize:40,fontWeight:800,color:'#fff'},
  sub:{margin:'0 0 32px',color:'#666',fontSize:16},
  cta:{display:'inline-block',color:'#fff',padding:'14px 32px',borderRadius:12,fontSize:16,fontWeight:700,textDecoration:'none'},
  placeholder:{maxWidth:900,margin:'32px auto',padding:'0 24px',background:'#0d0d1f',border:'1px solid #1e1e3a',borderRadius:16,padding:'32px'},
};