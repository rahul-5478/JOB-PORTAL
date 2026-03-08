import React, { useState } from 'react';
import API from '../../utils/api';
import { Upload, CheckCircle, AlertCircle, TrendingUp, FileText, Sparkles, RotateCcw, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

const S = {
  page: { minHeight: '100vh', background: '#0f172a', padding: '32px 24px', fontFamily: "'Inter', sans-serif" },
  container: { maxWidth: 900, margin: '0 auto' },
  card: { background: '#1e293b', borderRadius: 16, border: '1px solid #334155', padding: 24, marginBottom: 20 },
  label: { fontSize: 11, fontWeight: 700, color: '#64748b', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 8, display: 'block' },
  textarea: { width: '100%', minHeight: 280, padding: '16px', background: '#0f172a', border: '1.5px solid #334155', borderRadius: 12, color: '#f1f5f9', fontSize: 14, fontFamily: "'Inter', sans-serif", resize: 'vertical', outline: 'none', lineHeight: 1.7, boxSizing: 'border-box', transition: 'border-color 0.2s' },
  analyzeBtn: (loading) => ({ padding: '13px 32px', background: loading ? '#334155' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', border: 'none', borderRadius: 10, color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 10 }),
  scoreRing: (score) => {
    const color = score >= 75 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171';
    return { position: 'relative', width: 100, height: 100, flexShrink: 0 };
  },
  pill: (color) => ({ display: 'inline-block', padding: '4px 12px', background: `${color}20`, border: `1px solid ${color}40`, borderRadius: 20, fontSize: 12, color, fontWeight: 600, margin: '3px' }),
};

function ScoreRing({ score, size = 100, label }) {
  const color = score >= 75 ? '#4ade80' : score >= 50 ? '#fbbf24' : '#f87171';
  const r = (size / 2) - 8;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size, margin: '0 auto 8px' }}>
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#334155" strokeWidth="7" />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="7"
            strokeDasharray={c} strokeDashoffset={c - (score / 100) * c}
            strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: size > 80 ? 22 : 16, fontWeight: 900, color, lineHeight: 1 }}>{score}</span>
          <span style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>/100</span>
        </div>
      </div>
      {label && <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{label}</div>}
    </div>
  );
}

function TipBox({ icon, title, items, color }) {
  return (
    <div style={{ background: '#1e293b', borderRadius: 14, border: `1px solid ${color}30`, padding: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        {icon}
        <span style={{ fontSize: 15, fontWeight: 700, color }}>{title}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items?.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 12px', background: `${color}08`, borderRadius: 8, border: `1px solid ${color}15` }}>
            <span style={{ color, fontSize: 14, flexShrink: 0, marginTop: 1 }}>
              {color === '#4ade80' ? '✓' : '→'}
            </span>
            <span style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.6 }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const wordCount = resumeText.trim().split(/\s+/).filter(Boolean).length;

  const analyze = async () => {
    if (!resumeText.trim()) return toast.error('Please paste your resume text first');
    if (wordCount < 50) return toast.error('Resume text seems too short. Add more content.');
    setLoading(true);
    try {
      const { data } = await API.post('/ai/analyze-resume', { resumeText });
      setAnalysis(data.analysis);
      toast.success('Resume analyzed successfully!');
    } catch (err) {
      toast.error('Analysis failed. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={S.page}>
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        .ra-textarea:focus{border-color:#6366f1!important;}
      `}</style>
      <div style={S.container}>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={24} color="#a5b4fc" />
            </div>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: '#f1f5f9', margin: 0 }}>AI Resume Analyzer</h1>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 3 }}>Get instant AI-powered feedback and ATS score for your resume</p>
            </div>
          </div>
        </div>

        {!analysis ? (
          <>
            {/* How it works */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
              {[
                { icon: '📋', title: 'Paste Resume', desc: 'Copy-paste your complete resume text' },
                { icon: '🤖', title: 'AI Analysis', desc: 'GPT-4 analyzes every section in detail' },
                { icon: '📊', title: 'Get Score', desc: 'ATS score, strengths & improvement tips' },
              ].map((step, i) => (
                <div key={i} style={{ background: '#1e293b', borderRadius: 12, border: '1px solid #334155', padding: '16px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 24 }}>{step.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', marginBottom: 3 }}>{step.title}</div>
                    <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Card */}
            <div style={S.card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <FileText size={18} color="#6366f1" />
                <span style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9' }}>Paste Your Resume Text</span>
              </div>
              <textarea
                className="ra-textarea"
                style={S.textarea}
                placeholder={"Paste your complete resume text here...\n\nInclude all sections:\n• Contact Information (Name, Email, Phone)\n• Professional Summary\n• Work Experience\n• Education\n• Skills\n• Projects & Certifications"}
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                  <span style={{ color: wordCount > 100 ? '#4ade80' : '#64748b' }}>
                    {wordCount} words {wordCount > 100 ? '✓' : '(need 100+)'}
                  </span>
                  {wordCount > 0 && (
                    <button onClick={() => setResumeText('')} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 12, padding: 0 }}>Clear</button>
                  )}
                </div>
                <button style={S.analyzeBtn(loading)} onClick={analyze} disabled={loading}>
                  {loading ? (
                    <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Analyzing...</>
                  ) : (
                    <><Sparkles size={18} /> Analyze Resume</>
                  )}
                </button>
              </div>
            </div>

            {/* Tips */}
            <div style={{ padding: '14px 18px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, fontSize: 13, color: '#94a3b8' }}>
              💡 <strong style={{ color: '#a5b4fc' }}>Tip:</strong> Include your actual resume content for best results. The more complete your resume, the more accurate the analysis.
            </div>
          </>
        ) : (
          <div style={{ animation: 'fadeIn 0.4s ease' }}>

            {/* Score Overview */}
            <div style={{ ...S.card, background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>📊 Overall Score Breakdown</div>
              <div style={{ display: 'flex', gap: 32, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
                <ScoreRing score={analysis.overallScore || 0} size={110} label="Overall Score" />
                <ScoreRing score={analysis.atsScore || 0} size={110} label="ATS Score" />
                <ScoreRing score={analysis.sections?.skills || 0} size={85} label="Skills" />
                <ScoreRing score={analysis.sections?.experience || 0} size={85} label="Experience" />
                <ScoreRing score={analysis.sections?.contact || 0} size={85} label="Contact" />
              </div>

              {/* Score Labels */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
                {[['#4ade80', '75+', 'Excellent'], ['#fbbf24', '50-74', 'Good'], ['#f87171', '<50', 'Needs Work']].map(([color, range, label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block' }} />
                    {range} = {label}
                  </div>
                ))}
              </div>

              {/* Verdict */}
              {analysis.verdict && (
                <div style={{ padding: '14px 18px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', borderRadius: 12, fontSize: 14, color: '#a5b4fc', lineHeight: 1.7 }}>
                  💡 {analysis.verdict}
                </div>
              )}
            </div>

            {/* Strengths + Improvements */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <TipBox
                icon={<CheckCircle size={18} color="#4ade80" />}
                title="Strengths"
                items={analysis.strengths}
                color="#4ade80"
              />
              <TipBox
                icon={<AlertCircle size={18} color="#fbbf24" />}
                title="Improvements"
                items={analysis.improvements}
                color="#fbbf24"
              />
            </div>

            {/* Keywords */}
            {analysis.keywords?.length > 0 && (
              <div style={S.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <TrendingUp size={18} color="#6366f1" />
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>Add These Keywords</span>
                </div>
                <p style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>Adding these keywords will improve your ATS matching score:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {analysis.keywords.map((k, i) => (
                    <span key={i} style={S.pill('#a5b4fc')}>{k}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Section Tips */}
            {analysis.sectionTips && (
              <div style={S.card}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9', marginBottom: 14 }}>📝 Section-by-Section Tips</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(analysis.sectionTips).map(([section, tip]) => (
                    <div key={section} style={{ display: 'flex', gap: 12, padding: '12px 16px', background: '#0f172a', borderRadius: 10, border: '1px solid #1e293b' }}>
                      <ChevronRight size={15} color="#6366f1" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#a5b4fc', textTransform: 'capitalize' }}>{section}: </span>
                        <span style={{ fontSize: 13, color: '#94a3b8' }}>{tip}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Redo Button */}
            <button
              onClick={() => { setAnalysis(null); setResumeText(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', background: '#1e293b', border: '1px solid #334155', borderRadius: 10, color: '#94a3b8', fontSize: 14, cursor: 'pointer', fontWeight: 600 }}>
              <RotateCcw size={15} /> Analyze Another Resume
            </button>
          </div>
        )}
      </div>
    </div>
  );
}