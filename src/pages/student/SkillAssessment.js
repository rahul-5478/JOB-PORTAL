import React, { useState } from 'react';
import API from '../../utils/api';
import { Award, Brain, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SKILLS = ['JavaScript', 'React', 'Node.js', 'Python', 'TypeScript', 'MongoDB', 'SQL', 'CSS', 'Git', 'Docker'];

export default function SkillAssessment() {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [phase, setPhase] = useState('select'); // select | quiz | result

  const startQuiz = async (skill) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/ai/skill-quiz/${skill}`);
      setQuestions(data.questions);
      setSelectedSkill(skill);
      setAnswers({});
      setCurrent(0);
      setResult(null);
      setPhase('quiz');
    } catch (err) {
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (qIndex, aIndex) => {
    setAnswers(prev => ({ ...prev, [qIndex]: aIndex }));
  };

  const submitQuiz = () => {
    let correct = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct) correct++; });
    const score = Math.round((correct / questions.length) * 100);
    setResult({ correct, total: questions.length, score });
    setPhase('result');
  };

  const getBadge = (score) => {
    if (score >= 80) return { label: '🏆 Expert', color: '#f59e0b' };
    if (score >= 60) return { label: '⭐ Proficient', color: 'var(--primary)' };
    if (score >= 40) return { label: '📚 Learning', color: '#22c55e' };
    return { label: '🌱 Beginner', color: '#94a3b8' };
  };

  if (phase === 'select') return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🧠 Skill Assessment</h1>
        <p className="page-subtitle">Test your knowledge and earn verified skill badges</p>
      </div>
      <div className="grid-3">
        {SKILLS.map(skill => (
          <div key={skill} className="card" style={{ padding: 24, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}
            onClick={() => startQuiz(skill)}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
            <Brain size={32} style={{ margin: '0 auto 12px', color: 'var(--primary)' }} />
            <h3 style={{ fontWeight: 700, marginBottom: 6 }}>{skill}</h3>
            <p style={{ color: 'var(--text3)', fontSize: '0.8rem', marginBottom: 12 }}>5 questions • ~3 minutes</p>
            <span className="badge badge-primary">Start Quiz →</span>
          </div>
        ))}
      </div>
      {loading && <div style={{ textAlign: 'center', marginTop: 32 }}><div className="spinner" style={{ margin: '0 auto' }} /></div>}
    </div>
  );

  if (phase === 'quiz') {
    const q = questions[current];
    return (
      <div className="page" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800 }}>{selectedSkill} Quiz</h2>
          <span style={{ color: 'var(--text2)', fontSize: '0.875rem' }}>{current + 1} / {questions.length}</span>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 4, marginBottom: 28 }}>
          <div style={{ width: `${((current + 1) / questions.length) * 100}%`, height: '100%', background: 'var(--primary)', borderRadius: 4, transition: 'width 0.3s' }} />
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 24, lineHeight: 1.6 }}>{q.question}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map((opt, i) => (
              <div key={i} onClick={() => selectAnswer(current, i)}
                style={{ padding: '14px 18px', borderRadius: 10, border: `2px solid ${answers[current] === i ? 'var(--primary)' : 'var(--border)'}`, background: answers[current] === i ? 'rgba(124,111,255,0.1)' : 'var(--bg2)', cursor: 'pointer', transition: 'all 0.15s', fontWeight: answers[current] === i ? 600 : 400 }}>
                <span style={{ color: 'var(--text3)', marginRight: 10 }}>{String.fromCharCode(65 + i)}.</span>{opt}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
            <button className="btn btn-ghost" onClick={() => setCurrent(c => Math.max(0, c - 1))} disabled={current === 0}>← Prev</button>
            {current < questions.length - 1
              ? <button className="btn btn-primary" onClick={() => setCurrent(c => c + 1)} disabled={answers[current] === undefined}>Next →</button>
              : <button className="btn btn-primary" onClick={submitQuiz} disabled={Object.keys(answers).length < questions.length}>Submit Quiz</button>}
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const badge = getBadge(result.score);
    return (
      <div className="page" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="card" style={{ padding: 32, textAlign: 'center', marginBottom: 24 }}>
          <Award size={56} style={{ margin: '0 auto 16px', color: badge.color }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: 4 }}>{result.score}%</h2>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: badge.color, marginBottom: 8 }}>{badge.label}</div>
          <p style={{ color: 'var(--text2)' }}>{result.correct} out of {result.total} correct in {selectedSkill}</p>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Answer Review</h3>
          {questions.map((q, i) => {
            const isCorrect = answers[i] === q.correct;
            return (
              <div key={i} style={{ marginBottom: 20, padding: 16, background: 'var(--bg3)', borderRadius: 10 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  {isCorrect ? <CheckCircle size={18} color="#22c55e" /> : <XCircle size={18} color="#ef4444" />}
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{q.question}</span>
                </div>
                <div style={{ fontSize: '0.825rem', color: isCorrect ? '#22c55e' : '#ef4444', marginBottom: 4 }}>
                  Your answer: {q.options[answers[i]] || 'Not answered'}
                </div>
                {!isCorrect && <div style={{ fontSize: '0.825rem', color: '#22c55e', marginBottom: 4 }}>Correct: {q.options[q.correct]}</div>}
                <div style={{ fontSize: '0.8rem', color: 'var(--text3)', fontStyle: 'italic' }}>💡 {q.explanation}</div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={() => startQuiz(selectedSkill)}>Retake Quiz</button>
          <button className="btn btn-ghost" onClick={() => setPhase('select')}>Choose Another Skill</button>
        </div>
      </div>
    );
  }
}
