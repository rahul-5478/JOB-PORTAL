import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const PLANS = [
  {
    id: 'free', name: 'Free', price: 0, period: 'forever',
    color: '#888', border: '#2a2a4a',
    bg: 'linear-gradient(135deg,#0d0d1f,#07070f)',
    badge: null,
    features: [
      { ok: true,  text: 'Browse all jobs' },
      { ok: true,  text: 'Apply to 5 jobs/month' },
      { ok: true,  text: 'Basic profile' },
      { ok: true,  text: 'Resume builder (1 template)' },
      { ok: true,  text: 'AI job matches (3/month)' },
      { ok: false, text: 'Priority applicant badge' },
      { ok: false, text: 'Resume display to recruiters' },
      { ok: false, text: 'Unlimited applications' },
      { ok: false, text: 'Advanced AI tools' },
    ],
    cta: 'Get Started Free',
  },
  {
    id: 'basic', name: 'Basic', price: 299, period: 'month',
    color: '#f97316', border: '#f9731644',
    bg: 'linear-gradient(135deg,#1a0800,#07070f)',
    badge: '🔥 Popular',
    features: [
      { ok: true, text: 'Everything in Free' },
      { ok: true, text: 'Apply to 50 jobs/month' },
      { ok: true, text: 'Resume display to recruiters' },
      { ok: true, text: 'AI resume analyzer' },
      { ok: true, text: 'Priority applicant badge' },
      { ok: true, text: 'All resume templates' },
      { ok: true, text: 'Unlimited AI job matches' },
      { ok: true, text: 'Salary predictor' },
      { ok: false, text: 'Featured profile boost' },
    ],
    cta: 'Start Basic Plan',
  },
  {
    id: 'premium', name: 'Premium', price: 699, period: 'month',
    color: '#a78bfa', border: '#a78bfa44',
    bg: 'linear-gradient(135deg,#0a0014,#07070f)',
    badge: '⭐ Best Value',
    features: [
      { ok: true, text: 'Everything in Basic' },
      { ok: true, text: 'Unlimited job applications' },
      { ok: true, text: 'Featured profile boost' },
      { ok: true, text: 'Get recruiter attention' },
      { ok: true, text: 'Direct recruiter messages' },
      { ok: true, text: 'AI cover letter generator' },
      { ok: true, text: 'Career path advisor' },
      { ok: true, text: 'Interview scheduler' },
      { ok: true, text: '24/7 priority support' },
    ],
    cta: 'Go Premium',
  },
];

// ── Load Razorpay script ──────────────────────────────────────
function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

// ── Payment Modal ─────────────────────────────────────────────
function PaymentModal({ plan, billing, onClose, onSuccess }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState('confirm'); // confirm | processing | success | error
  const [errMsg, setErrMsg]   = useState('');
  const [txnId, setTxnId]     = useState('');

  const price  = billing === 'yearly' ? Math.round(plan.price * 0.75) : plan.price;
  const total  = billing === 'yearly' ? price * 12 : price;
  const saving = billing === 'yearly' ? (plan.price - price) * 12 : 0;

  const handlePay = async () => {
    setLoading(true);
    setErrMsg('');

    try {
      // Step 1: Create order on backend
      const { data } = await API.post('/payment/create-order', {
        amount: total,
        planId: plan.id,
        billing,
      });

      if (!data.success) throw new Error(data.message || 'Order creation failed');

      // Step 2: Demo mode
      if (data.demo) {
        setStep('processing');
        setTimeout(() => {
          setTxnId('DEMO_' + Date.now().toString().slice(-8));
          setStep('success');
          onSuccess(plan);
        }, 2500);
        setLoading(false);
        return;
      }

      // Step 3: Load Razorpay
      const loaded = await loadRazorpay();
      if (!loaded) throw new Error('Razorpay failed to load. Check internet connection.');

      setLoading(false);

      // Step 4: Open Razorpay checkout
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: 'INR',
        name: 'TalentBridge',
        description: `${plan.name} Plan — ${billing}`,
        order_id: data.order.id,
        prefill: {
          name:  user?.name  || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: { color: plan.color },
        modal: {
          ondismiss: () => setLoading(false),
        },
        handler: async (response) => {
          setStep('processing');
          try {
            // Step 5: Verify payment on backend
            const { data: vData } = await API.post('/payment/verify', {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              planId: plan.id,
            });

            if (vData.success) {
              setTxnId(response.razorpay_payment_id);
              setStep('success');
              onSuccess(plan);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (e) {
            setErrMsg(e.message);
            setStep('error');
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        setErrMsg(resp.error.description || 'Payment failed');
        setStep('error');
      });
      rzp.open();

    } catch (err) {
      setErrMsg(err.response?.data?.message || err.message || 'Something went wrong');
      setStep('error');
      setLoading(false);
    }
  };

  // ── Success Screen ──
  if (step === 'success') return (
    <div style={M.overlay} onClick={onClose}>
      <div style={{ ...M.modal, textAlign: 'center', padding: '52px 36px' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
        <h2 style={{ color: '#fff', margin: '0 0 8px', fontSize: 24, fontWeight: 800 }}>Payment Successful!</h2>
        <p style={{ color: '#888', margin: '0 0 24px' }}>Welcome to TalentBridge {plan.name} Plan!</p>
        <div style={{ background: '#052e16', border: '1px solid #16a34a44', borderRadius: 16, padding: '20px 24px', marginBottom: 28, textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ color: '#666', fontSize: 13 }}>Plan</span>
            <span style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>TalentBridge {plan.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ color: '#666', fontSize: 13 }}>Amount Paid</span>
            <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 700 }}>₹{total}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#666', fontSize: 13 }}>Transaction ID</span>
            <span style={{ color: '#888', fontSize: 12, fontFamily: 'monospace' }}>{txnId}</span>
          </div>
        </div>
        <button onClick={onClose}
          style={{ ...M.btn, background: 'linear-gradient(135deg,#22c55e,#16a34a)', width: '100%' }}>
          Go to Dashboard →
        </button>
      </div>
    </div>
  );

  // ── Processing Screen ──
  if (step === 'processing') return (
    <div style={M.overlay}>
      <div style={{ ...M.modal, textAlign: 'center', padding: '56px 36px' }}>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes bar{0%{width:0}100%{width:100%}}`}</style>
        <div style={{ width: 64, height: 64, border: '4px solid #1a1a3a', borderTop: `4px solid ${plan.color}`, borderRadius: '50%', margin: '0 auto 24px', animation: 'spin 0.8s linear infinite' }} />
        <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: 18 }}>Verifying Payment...</h3>
        <p style={{ color: '#666', margin: '0 0 24px', fontSize: 13 }}>Please do not close this window</p>
        <div style={{ height: 4, background: '#1a1a3a', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: `linear-gradient(90deg,${plan.color},${plan.color}cc)`, borderRadius: 2, animation: 'bar 2.5s ease forwards' }} />
        </div>
      </div>
    </div>
  );

  // ── Error Screen ──
  if (step === 'error') return (
    <div style={M.overlay} onClick={onClose}>
      <div style={{ ...M.modal, textAlign: 'center', padding: '48px 36px' }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>❌</div>
        <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: 20 }}>Payment Failed</h3>
        <p style={{ color: '#888', margin: '0 0 24px', fontSize: 14 }}>{errMsg}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setStep('confirm')} style={{ ...M.btn, flex: 1, background: `linear-gradient(135deg,${plan.color},${plan.color}cc)` }}>
            Try Again
          </button>
          <button onClick={onClose} style={{ ...M.btn, flex: 1, background: 'transparent', border: '1px solid #2a2a4a', color: '#888' }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  // ── Confirm Screen ──
  return (
    <div style={M.overlay} onClick={onClose}>
      <div style={M.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff' }}>Confirm Payment</h2>
            <p style={{ margin: '4px 0 0', color: '#666', fontSize: 13 }}>Powered by Razorpay • 100% Secure</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#555', fontSize: 22, cursor: 'pointer' }}>✕</button>
        </div>

        {/* Plan Summary */}
        <div style={{ background: '#080816', border: `1px solid ${plan.border}`, borderRadius: 16, padding: '20px', marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: billing === 'yearly' ? 12 : 0 }}>
            <div>
              <p style={{ margin: '0 0 4px', color: plan.color, fontWeight: 700, fontSize: 16 }}>TalentBridge {plan.name}</p>
              <p style={{ margin: 0, color: '#555', fontSize: 12 }}>
                {billing === 'yearly' ? 'Annual billing (25% off)' : 'Monthly billing • Cancel anytime'}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, color: '#fff', fontSize: 28, fontWeight: 800 }}>₹{total}</p>
              <p style={{ margin: 0, color: '#555', fontSize: 11 }}>{billing === 'yearly' ? 'per year' : 'per month'}</p>
            </div>
          </div>
          {billing === 'yearly' && saving > 0 && (
            <div style={{ paddingTop: 12, borderTop: '1px solid #1a1a2a', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#666', fontSize: 12 }}>You save</span>
              <span style={{ color: '#22c55e', fontWeight: 700, fontSize: 13 }}>₹{saving}/year 🎉</span>
            </div>
          )}
        </div>

        {/* What you get */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ margin: '0 0 12px', color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>What you get</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {plan.features.filter(f => f.ok).slice(0, 6).map(f => (
              <div key={f.text} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ color: '#22c55e', fontSize: 12, flexShrink: 0 }}>✓</span>
                <span style={{ color: '#888', fontSize: 12 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods info */}
        <div style={{ background: '#080816', border: '1px solid #1a1a2a', borderRadius: 12, padding: '14px 16px', marginBottom: 22 }}>
          <p style={{ margin: '0 0 10px', color: '#666', fontSize: 12, fontWeight: 600 }}>ACCEPTED PAYMENT METHODS</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['💳 Cards', '📱 UPI', '🏦 Net Banking', '💰 Wallets', '🏷 EMI'].map(m => (
              <span key={m} style={{ background: '#12122a', border: '1px solid #2a2a4a', color: '#888', padding: '4px 10px', borderRadius: 6, fontSize: 11 }}>{m}</span>
            ))}
          </div>
          <p style={{ margin: '10px 0 0', color: '#555', fontSize: 11 }}>
            💡 Razorpay securely handles your payment — card details never stored on our servers
          </p>
        </div>

        {/* Pay Button */}
        <button onClick={handlePay} disabled={loading}
          style={{ ...M.btn, width: '100%', background: `linear-gradient(135deg,${plan.color},${plan.color}cc)`, opacity: loading ? 0.7 : 1, fontSize: 16 }}>
          {loading ? '⏳ Opening Payment...' : `🔒 Pay ₹${total} with Razorpay`}
        </button>

        {/* Trust */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
          {['🔐 256-bit SSL', '✅ RBI Approved', '↩️ Cancel Anytime'].map(b => (
            <span key={b} style={{ color: '#444', fontSize: 11 }}>{b}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Pricing Page ─────────────────────────────────────────
export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billing, setBilling]       = useState('monthly');
  const [selectedPlan, setSelected] = useState(null);
  const [activePlan, setActive]     = useState('free');

  const getPrice = p => billing === 'yearly' ? Math.round(p.price * 0.75) : p.price;

  const handleSelect = plan => {
    if (plan.id === 'free') { navigate('/register'); return; }
    if (!user) { navigate('/login'); return; }
    setSelected(plan);
  };

  return (
    <div style={P.page}>
      <style>{`
        .pcard:hover{transform:translateY(-6px)!important}
        .pcard{transition:transform 0.25s!important}
        @keyframes glow{0%,100%{box-shadow:0 0 20px #f9731622}50%{box-shadow:0 0 40px #f9731644}}
      `}</style>

      {/* Header */}
      <div style={P.header}>
        <span style={P.badge}>💎 Simple Pricing</span>
        <h1 style={P.title}>Invest in Your Career</h1>
        <p style={P.sub}>Join 1M+ job seekers who landed their dream job with TalentBridge</p>

        {/* Razorpay badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#080816', border: '1px solid #1a1a2a', borderRadius: 20, padding: '8px 18px', marginBottom: 28 }}>
          <span style={{ fontSize: 14 }}>🔒</span>
          <span style={{ color: '#888', fontSize: 13 }}>Secured by <strong style={{ color: '#fff' }}>Razorpay</strong> • Accepts UPI, Cards, NetBanking</span>
        </div>

        {/* Billing Toggle */}
        <div style={P.toggle}>
          <button onClick={() => setBilling('monthly')} style={{ ...P.tBtn, ...(billing === 'monthly' ? P.tActive : {}) }}>Monthly</button>
          <button onClick={() => setBilling('yearly')} style={{ ...P.tBtn, ...(billing === 'yearly' ? P.tActive : {}) }}>
            Yearly <span style={{ color: '#22c55e', fontSize: 11, marginLeft: 6 }}>Save 25%</span>
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div style={P.grid}>
        {PLANS.map(plan => (
          <div key={plan.id} className="pcard"
            style={{ background: plan.bg, border: `1px solid ${plan.border}`, borderRadius: 22, padding: '32px 28px', position: 'relative', ...(plan.id === 'basic' ? { animation: 'glow 3s infinite' } : {}) }}>
            {plan.badge && (
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg,${plan.color},${plan.color}cc)`, color: '#fff', padding: '5px 20px', borderRadius: 20, fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>
                {plan.badge}
              </div>
            )}

            <p style={{ margin: '0 0 6px', color: plan.color, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{plan.name}</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 44, fontWeight: 800, color: '#fff' }}>
                {plan.price === 0 ? 'Free' : `₹${getPrice(plan)}`}
              </span>
              {plan.price > 0 && <span style={{ color: '#555', fontSize: 14 }}>/mo</span>}
            </div>

            {billing === 'yearly' && plan.price > 0 ? (
              <p style={{ margin: '0 0 24px', fontSize: 12, color: '#22c55e' }}>
                ₹{getPrice(plan) * 12}/year — Save ₹{(plan.price - getPrice(plan)) * 12}!
              </p>
            ) : <div style={{ marginBottom: 24 }} />}

            <div style={{ marginBottom: 28 }}>
              {plan.features.map(f => (
                <div key={f.text} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 13, color: f.ok ? '#22c55e' : '#333', flexShrink: 0, marginTop: 1 }}>{f.ok ? '✓' : '✕'}</span>
                  <span style={{ fontSize: 13, color: f.ok ? '#ccc' : '#444', lineHeight: 1.4 }}>{f.text}</span>
                </div>
              ))}
            </div>

            <button onClick={() => handleSelect(plan)}
              style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: plan.price === 0 ? '#1a1a2a' : `linear-gradient(135deg,${plan.color},${plan.color}cc)`, color: plan.price === 0 ? '#888' : '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'Sora',sans-serif" }}>
              {activePlan === plan.id ? '✅ Current Plan' : plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ textAlign: 'center', color: '#fff', marginBottom: 28, fontSize: 22 }}>Frequently Asked Questions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
          {[
            ['Can I cancel anytime?', 'Yes! Cancel anytime from your dashboard. No questions asked, no hidden charges.'],
            ['Is payment secure?', 'Yes, 100%. Razorpay handles all payments with RBI-approved 256-bit SSL encryption. We never store card details.'],
            ['Which payment methods work?', 'All cards (Visa, Mastercard, RuPay, Amex), UPI (GPay, PhonePe, Paytm, BHIM), Net Banking (50+ banks), and Wallets.'],
            ['Can I get a refund?', 'Full refund within 7 days if you are not satisfied. Contact support@talentbridge.in'],
          ].map(([q, a]) => (
            <div key={q} style={{ background: '#0d0d1f', border: '1px solid #1e1e3a', borderRadius: 14, padding: '20px' }}>
              <p style={{ margin: '0 0 8px', color: '#fff', fontWeight: 600, fontSize: 14 }}>❓ {q}</p>
              <p style={{ margin: 0, color: '#666', fontSize: 13, lineHeight: 1.6 }}>{a}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedPlan && (
        <PaymentModal
          plan={selectedPlan}
          billing={billing}
          onClose={() => setSelected(null)}
          onSuccess={plan => { setActive(plan.id); setSelected(null); }}
        />
      )}
    </div>
  );
}

const P = {
  page: { minHeight: '100vh', background: '#07070f', fontFamily: "'Sora',sans-serif" },
  header: { textAlign: 'center', padding: '64px 24px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  badge: { display: 'inline-block', background: '#1a0800', border: '1px solid #f9731633', color: '#f97316', padding: '6px 18px', borderRadius: 20, fontSize: 13, fontWeight: 600, marginBottom: 16 },
  title: { margin: '0 0 12px', fontSize: 44, fontWeight: 800, color: '#fff' },
  sub: { margin: '0 0 20px', color: '#666', fontSize: 16, maxWidth: 500 },
  toggle: { display: 'inline-flex', background: '#0d0d1f', border: '1px solid #1e1e3a', borderRadius: 12, padding: 4, gap: 4 },
  tBtn: { padding: '9px 22px', borderRadius: 8, border: 'none', background: 'transparent', color: '#666', cursor: 'pointer', fontSize: 14, fontFamily: "'Sora',sans-serif", display: 'flex', alignItems: 'center' },
  tActive: { background: '#1a0800', color: '#f97316', fontWeight: 600 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, maxWidth: 1000, margin: '0 auto', padding: '0 24px 56px' },
};

const M = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20, backdropFilter: 'blur(8px)' },
  modal: { background: '#0d0d20', border: '1px solid #2a2a4a', borderRadius: 22, padding: '28px', width: '100%', maxWidth: 460, fontFamily: "'Sora',sans-serif", maxHeight: '92vh', overflowY: 'auto' },
  btn: { padding: '15px 24px', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: "'Sora',sans-serif", transition: 'opacity 0.2s' },
};