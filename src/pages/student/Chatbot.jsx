import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

const QUICK_PROMPTS = [
  { icon: '💼', label: 'Interview Tips', text: 'Give me top 5 interview tips for a software developer role' },
  { icon: '📝', label: 'Resume Help', text: 'How should I structure my resume as a fresher?' },
  { icon: '💰', label: 'Salary Advice', text: 'How do I negotiate salary for my first job?' },
  { icon: '🚀', label: 'Career Path', text: 'What is the career path for a React developer?' },
  { icon: '🤝', label: 'HR Questions', text: 'What are common HR interview questions and best answers?' },
  { icon: '🔍', label: 'Job Search', text: 'What are the best strategies to find a job quickly in India?' },
];

const SYSTEM_PROMPT = `You are an expert AI Career Assistant for HireAI, a job portal in India. Help students with interview prep, resume tips, career advice, salary negotiation, and job search. Be friendly, practical, concise. Use bullet points and emojis.`;

export default function Chatbot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: `Hi ${user?.name?.split(' ')[0] || 'there'}! 👋 I'm your AI Career Assistant.\n\nI can help you with:\n• Interview preparation & tips\n• Resume writing advice\n• Career path guidance\n• Salary negotiation\n• Job search strategies\n\nWhat would you like to know today?`,
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;
    setInput('');
    setError('');
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const { data } = await API.post('/chat/ai', {
        messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        systemPrompt: SYSTEM_PROMPT,
      });
      if (!data.success) throw new Error(data.message || 'Failed');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Something went wrong. Try again.');
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const fmt = (text) => text.split('\n').map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
  ));

  return (
    <div style={S.page}>
      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-7px)} }
        .qbtn:hover{background:#1a1a3a!important;border-color:#7c6fff!important;color:#c4b5fd!important}
      `}</style>

      {/* Header */}
      <div style={S.header}>
        <div style={S.hLeft}>
          <div style={{ position: 'relative' }}>
            <span style={{ fontSize: 34 }}>🤖</span>
            <span style={S.dot} />
          </div>
          <div>
            <h1 style={S.hTitle}>AI Career Assistant</h1>
            <p style={S.hSub}>Powered by Claude AI • Always ready</p>
          </div>
        </div>
        <button onClick={() => { setMessages([{ role: 'assistant', content: 'Chat cleared! How can I help?' }]); setError(''); }} style={S.clearBtn}>
          🗑 Clear
        </button>
      </div>

      {/* Quick Prompts */}
      <div style={{ padding: '12px 24px', borderBottom: '1px solid #1a1a3a' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {QUICK_PROMPTS.map((p) => (
            <button key={p.label} className="qbtn" onClick={() => sendMessage(p.text)} disabled={loading} style={S.qBtn}>
              {p.icon} {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={S.msgs}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 14, alignItems: 'flex-end', gap: 8 }}>
            {m.role === 'assistant' && <div style={S.botAv}>🤖</div>}
            <div style={m.role === 'user' ? S.userBubble : S.botBubble}>{fmt(m.content)}</div>
            {m.role === 'user' && <div style={S.userAv}>{user?.name?.[0]?.toUpperCase() || 'U'}</div>}
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 14 }}>
            <div style={S.botAv}>🤖</div>
            <div style={{ background: '#11112a', border: '1px solid #1e1e3a', padding: '14px 18px', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: 6 }}>
              {[0, 0.2, 0.4].map((d, i) => (
                <span key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#7c6fff', display: 'inline-block', animation: `bounce 1.2s infinite ${d}s` }} />
              ))}
            </div>
          </div>
        )}
        {error && (
          <div style={S.errBox}>
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 16 }}>✕</button>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 10, padding: '0 24px', alignItems: 'flex-end' }}>
        <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKey}
          placeholder="Ask about interviews, resume, career, salary..." style={S.textarea} rows={2} disabled={loading} />
        <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
          style={{ ...S.sendBtn, opacity: !input.trim() || loading ? 0.5 : 1 }}>
          {loading ? '⏳' : '➤'}
        </button>
      </div>
      <p style={{ textAlign: 'center', fontSize: 11, color: '#2a2a3a', margin: '8px 0 4px' }}>Enter to send • Shift+Enter for new line</p>
    </div>
  );
}

const S = {
  page: { minHeight: '100vh', background: '#07070f', color: '#e0e0e0', display: 'flex', flexDirection: 'column', maxWidth: 820, margin: '0 auto', fontFamily: "'Sora',sans-serif" },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #1a1a3a', background: '#0a0a1a', position: 'sticky', top: 0, zIndex: 10 },
  hLeft: { display: 'flex', alignItems: 'center', gap: 12 },
  dot: { position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: '50%', background: '#22c55e', border: '2px solid #0a0a1a' },
  hTitle: { margin: 0, fontSize: 18, fontWeight: 700, color: '#fff' },
  hSub: { margin: '2px 0 0', fontSize: 12, color: '#7c6fff' },
  clearBtn: { background: 'transparent', border: '1px solid #1e1e3a', color: '#666', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12 },
  qBtn: { background: '#0e0e22', border: '1px solid #252545', color: '#9090b0', padding: '7px 14px', borderRadius: 20, cursor: 'pointer', fontSize: 12, transition: 'all 0.2s' },
  msgs: { flex: 1, overflowY: 'auto', padding: '20px 24px', minHeight: 380 },
  botAv: { width: 34, height: 34, borderRadius: '50%', background: '#13132a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  userAv: { width: 34, height: 34, borderRadius: '50%', background: '#7c6fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 },
  botBubble: { background: '#11112a', border: '1px solid #1e1e3a', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', maxWidth: '75%', fontSize: 13, lineHeight: 1.75, color: '#cccce0' },
  userBubble: { background: 'linear-gradient(135deg,#7c6fff,#5a4dcc)', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', maxWidth: '75%', fontSize: 13, lineHeight: 1.75, color: '#fff' },
  errBox: { background: '#200808', border: '1px solid #ef4444', borderRadius: 10, padding: '10px 14px', color: '#f87171', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  textarea: { flex: 1, background: '#11112a', border: '1px solid #252545', borderRadius: 14, padding: '12px 16px', color: '#fff', fontSize: 13, resize: 'none', outline: 'none', fontFamily: "'Sora',sans-serif", lineHeight: 1.6 },
  sendBtn: { width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg,#7c6fff,#5a4dcc)', border: 'none', color: '#fff', fontSize: 18, cursor: 'pointer', flexShrink: 0 },
};