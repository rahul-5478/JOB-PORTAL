import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';

const SUGGESTIONS = [
  { icon: '🔍', text: 'How to find the best jobs?', color: '#f97316' },
  { icon: '📄', text: 'Tips to write a great resume', color: '#a78bfa' },
  { icon: '🎯', text: 'How to prepare for interviews?', color: '#34d399' },
  { icon: '💰', text: 'Salary negotiation tips', color: '#60a5fa' },
  { icon: '🏢', text: 'Top hiring companies in India', color: '#f59e0b' },
  { icon: '🌟', text: 'Career path for developers', color: '#ec4899' },
];

const QUICK_LINKS = [
  { icon: '🤖', label: 'AI Job Matches', link: '/student/ai-matches' },
  { icon: '📊', label: 'Resume Analyzer', link: '/student/resume-analyzer' },
  { icon: '💰', label: 'Salary Predictor', link: '/student/salary-predictor' },
  { icon: '🔍', label: 'Browse Jobs', link: '/real-jobs' },
];

function formatMessage(text) {
  // Bold **text**
  let t = text.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#fff">$1</strong>');
  // Bullet points
  t = t.replace(/^• (.*)/gm, '<li>$1</li>');
  t = t.replace(/(<li>.*<\/li>)/s, '<ul style="margin:8px 0 8px 16px;padding:0;list-style:none">$1</ul>');
  // Line breaks
  t = t.replace(/\n\n/g, '<br/><br/>');
  t = t.replace(/\n/g, '<br/>');
  return t;
}

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 **Hello! I\'m TalentBridge AI** — your personal career assistant!\n\nI can help you with job search, resume writing, interview preparation, salary guidance, career planning and more.\n\nWhat would you like help with today?',
      time: new Date(),
    }
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [typing, setTyping]     = useState(false);
  const bottomRef               = useRef();
  const inputRef                = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg, time: new Date() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setLoading(true);
    setTyping(true);

    try {
      const apiMessages = newMsgs
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }));

      const { data } = await API.post('/chatbot/message', { messages: apiMessages });

      setTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        time: new Date(),
        demo: data.demo,
      }]);
    } catch {
      setTyping(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Sorry, I\'m having trouble connecting. Please try again in a moment.',
        time: new Date(),
        error: true,
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const fmtTime = d => d?.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes blink{0%,100%{opacity:0.3}50%{opacity:1}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
        .sugg:hover{background:#1a1508!important;border-color:#f9731655!important;transform:translateY(-2px)!important}
        .sugg{transition:all 0.2s!important}
        .ql:hover{background:#1a1a2e!important;transform:translateY(-2px)!important}
        .ql{transition:all 0.2s!important}
        .send:hover{opacity:0.85;transform:scale(1.05)}
        .send{transition:all 0.15s}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-track{background:#0a0a14}
        ::-webkit-scrollbar-thumb{background:#2a2a4a;border-radius:2px}
        ul li::before{content:"• ";color:#f97316}
      `}</style>

      <div style={S.layout}>
        {/* ── LEFT SIDEBAR ── */}
        <div style={S.sidebar}>
          {/* Bot Avatar */}
          <div style={{ textAlign: 'center', padding: '32px 20px 24px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#a78bfa)', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, animation: 'float 3s ease-in-out infinite', boxShadow: '0 8px 32px #f9731633' }}>
              🤖
            </div>
            <h2 style={{ margin: '0 0 4px', color: '#fff', fontSize: 18, fontWeight: 800 }}>TalentBridge AI</h2>
            <p style={{ margin: '0 0 12px', color: '#666', fontSize: 12 }}>Your Personal Career Assistant</p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#052e16', border: '1px solid #16a34a44', borderRadius: 20, padding: '4px 12px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
              <span style={{ color: '#22c55e', fontSize: 11, fontWeight: 600 }}>Online 24/7</span>
            </div>
          </div>

          <div style={{ height: 1, background: '#1a1a2e', margin: '0 20px' }} />

          {/* Capabilities */}
          <div style={{ padding: '20px' }}>
            <p style={{ margin: '0 0 12px', color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>I Can Help With</p>
            {[
              ['🔍', 'Job Search', '#f97316'],
              ['📄', 'Resume Tips', '#a78bfa'],
              ['🎯', 'Interview Prep', '#34d399'],
              ['💰', 'Salary Guidance', '#60a5fa'],
              ['🏢', 'Company Info', '#f59e0b'],
              ['🌟', 'Career Planning', '#ec4899'],
            ].map(([icon, label, color]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, marginBottom: 4 }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{icon}</div>
                <span style={{ color: '#888', fontSize: 13 }}>{label}</span>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: '#1a1a2e', margin: '0 20px' }} />

          {/* Quick Links */}
          <div style={{ padding: '20px' }}>
            <p style={{ margin: '0 0 12px', color: '#444', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>Quick Links</p>
            {QUICK_LINKS.map(q => (
              <Link key={q.label} to={q.link} className="ql"
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 10, marginBottom: 4, textDecoration: 'none', background: '#0d0d1f', border: '1px solid #1a1a2e' }}>
                <span style={{ fontSize: 16 }}>{q.icon}</span>
                <span style={{ color: '#ccc', fontSize: 13 }}>{q.label}</span>
                <span style={{ marginLeft: 'auto', color: '#444', fontSize: 12 }}>→</span>
              </Link>
            ))}
          </div>

          {/* OpenAI Badge */}
          <div style={{ margin: '0 20px 20px', background: '#0d0d1f', border: '1px solid #1a1a2e', borderRadius: 12, padding: '12px', textAlign: 'center' }}>
            <p style={{ margin: '0 0 4px', color: '#555', fontSize: 11 }}>Powered by</p>
            <p style={{ margin: 0, color: '#fff', fontSize: 13, fontWeight: 700 }}>OpenAI GPT</p>
            <p style={{ margin: '4px 0 0', color: '#444', fontSize: 10 }}>256-bit encrypted</p>
          </div>
        </div>

        {/* ── MAIN CHAT AREA ── */}
        <div style={S.chatArea}>
          {/* Header */}
          <div style={S.chatHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🤖</div>
              <div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: 16, fontWeight: 700 }}>TalentBridge AI Assistant</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                  <span style={{ color: '#22c55e', fontSize: 12 }}>Always online • Replies instantly</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setMessages([{ role: 'assistant', content: '👋 **Hello again!** How can I help you today?', time: new Date() }])}
                style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', color: '#888', padding: '8px 14px', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
                🗑 Clear Chat
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={S.messages}>
            {/* Suggestion chips — show only at start */}
            {messages.length === 1 && (
              <div style={{ padding: '20px 24px 0' }}>
                <p style={{ color: '#444', fontSize: 12, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Suggested Questions</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>
                  {SUGGESTIONS.map(s => (
                    <button key={s.text} className="sugg" onClick={() => send(s.text)}
                      style={{ background: '#0d0d1f', border: `1px solid ${s.color}33`, borderRadius: 12, padding: '12px 14px', cursor: 'pointer', textAlign: 'left', display: 'flex', gap: 10, alignItems: 'center', fontFamily: "'Sora',sans-serif" }}>
                      <span style={{ fontSize: 20 }}>{s.icon}</span>
                      <span style={{ color: '#ccc', fontSize: 13, lineHeight: 1.4 }}>{s.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message list */}
            <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeUp 0.3s ease' }}>
                  {msg.role === 'assistant' && (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, marginTop: 4 }}>🤖</div>
                  )}
                  <div style={{ maxWidth: '72%' }}>
                    <div style={{
                      background: msg.role === 'user' ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#0d0d1f',
                      border: msg.role === 'user' ? 'none' : '1px solid #1e1e2e',
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                      padding: '14px 18px',
                      color: '#e0e0e0',
                      fontSize: 14,
                      lineHeight: 1.7,
                    }}>
                      {msg.role === 'assistant'
                        ? <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
                        : <span>{msg.content}</span>
                      }
                    </div>
                    <p style={{ margin: '4px 8px 0', color: '#333', fontSize: 10, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                      {fmtTime(msg.time)}
                      {msg.demo && <span style={{ color: '#555', marginLeft: 6 }}>• Demo mode</span>}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1a1a2e', border: '1px solid #2a2a4a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, marginTop: 4 }}>👤</div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', animation: 'fadeUp 0.3s ease' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🤖</div>
                  <div style={{ background: '#0d0d1f', border: '1px solid #1e1e2e', borderRadius: '4px 18px 18px 18px', padding: '16px 20px', display: 'flex', gap: 5, alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#f97316', display: 'inline-block', animation: `blink 1.2s infinite ${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Input Area */}
          <div style={S.inputArea}>
            {/* Quick suggestion pills */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', paddingBottom: 4 }}>
              {['Resume tips', 'Interview prep', 'Salary in India', 'Remote jobs', 'Career switch'].map(t => (
                <button key={t} onClick={() => send(t)}
                  style={{ background: '#0d0d1f', border: '1px solid #2a2a4a', color: '#888', padding: '5px 14px', borderRadius: 20, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Sora',sans-serif", flexShrink: 0, transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.target.style.borderColor = '#f9731655'; e.target.style.color = '#f97316'; }}
                  onMouseLeave={e => { e.target.style.borderColor = '#2a2a4a'; e.target.style.color = '#888'; }}>
                  {t}
                </button>
              ))}
            </div>

            {/* Text input */}
            <div style={S.inputBox}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask me anything about jobs, resume, interviews, salary..."
                rows={1}
                style={S.textarea}
              />
              <button className="send" onClick={() => send()} disabled={loading || !input.trim()}
                style={{ ...S.sendBtn, opacity: (loading || !input.trim()) ? 0.4 : 1, cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer' }}>
                {loading ? '⏳' : '🚀'}
              </button>
            </div>
            <p style={{ margin: '8px 0 0', color: '#333', fontSize: 11, textAlign: 'center' }}>
              Press Enter to send • Shift+Enter for new line • Powered by OpenAI GPT
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: '#07070f', fontFamily: "'Sora',sans-serif", display: 'flex', flexDirection: 'column' },
  layout: { display: 'flex', flex: 1, maxWidth: 1300, margin: '0 auto', width: '100%', padding: '24px', gap: 20, height: 'calc(100vh - 64px)' },
  sidebar: { width: 260, flexShrink: 0, background: '#0a0a14', border: '1px solid #1a1a2e', borderRadius: 20, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  chatArea: { flex: 1, background: '#0a0a14', border: '1px solid #1a1a2e', borderRadius: 20, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  chatHeader: { padding: '18px 24px', borderBottom: '1px solid #1a1a2e', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0d0d1f', borderRadius: '20px 20px 0 0' },
  messages: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  inputArea: { padding: '16px 24px 20px', borderTop: '1px solid #1a1a2e', background: '#0d0d1f', borderRadius: '0 0 20px 20px' },
  inputBox: { display: 'flex', gap: 10, background: '#07070f', border: '1px solid #2a2a4a', borderRadius: 14, padding: '4px 4px 4px 16px', alignItems: 'flex-end' },
  textarea: { flex: 1, background: 'none', border: 'none', color: '#fff', fontSize: 14, outline: 'none', resize: 'none', fontFamily: "'Sora',sans-serif", padding: '10px 0', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto' },
  sendBtn: { width: 44, height: 44, borderRadius: 10, background: 'linear-gradient(135deg,#f97316,#ea580c)', border: 'none', color: '#fff', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
};