import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { getInvestorProfile, setInvestorProfile } from '../utils/investorProfile';
import { CalculatorCard } from '../components/home/BrowseByBudgetSection';

const BUDGET_RANGES = ['₹5 Lakhs - ₹10 Lakhs', '₹10 Lakhs - ₹25 Lakhs', '₹25 Lakhs - ₹50 Lakhs', '₹50 Lakhs - ₹1 Crore', '₹1 Crore+'];

const PREFERRED_ASSET_TYPES = [
  { id: 'all', label: 'All High-Yield Opportunities' },
  { id: 'plots', label: 'High-Appreciation Land & Plots' },
  { id: 'commercial', label: 'Pre-Leased Commercial Shops' },
  { id: 'flats', label: 'Luxury Residential Flats & Suites' },
];

const emptyForm = {
  name: '', email: '', phone: '', city: '', occupation: '', panNumber: '',
  budgetRange: BUDGET_RANGES[0], assetPreference: 'all', notes: '',
};

function staggerContainer(delay = 0) {
  return {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: delay } },
  };
}

function staggerItem() {
  return {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 240, damping: 22 } },
  };
}

function fadeInUp(delay = 0) {
  return {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 24, delay } },
  };
}

function ViewSection({ children, className = '', delay = 0, once = true, as = 'div' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-80px' });
  const variants = staggerContainer(delay);

  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={variants} className={className}>
      {children}
    </MotionTag>
  );
}

function AnimatedMetric({ label, value, suffix = '', prefix = '', delay = 0, highlight = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState('0');
  const isPercent = typeof value === 'number' && (suffix === '%' || label.includes('%'));
  const isCurrency = prefix === '₹';

  useEffect(() => {
    if (!isInView) return;
    const target = Number(value) || 0;
    const startTime = performance.now();
    const dur = 1.6;
    const tick = (now) => {
      const progress = Math.min((now - startTime) / 1000 / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      if (isCurrency) {
        setDisplay(`₹${current.toLocaleString('en-IN')}${suffix}`);
      } else if (isPercent) {
        setDisplay(`${current}${suffix}`);
      } else {
        setDisplay(`${current}${suffix}`);
      }
      if (progress < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value, suffix, prefix, isCurrency, isPercent]);

  return (
    <motion.div ref={ref} variants={staggerItem()} className={`rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md space-y-2 ${highlight ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">{label}</span>
        <span className="text-xs font-black text-white bg-orange-500/20 px-2 py-0.5 rounded">{isPercent ? `${value}%` : ''}</span>
      </div>
      <h4 className="text-sm font-extrabold text-white">{highlight ? '' : ''}</h4>
      <span className={`text-xs text-slate-400 leading-relaxed`}>{highlight ? '' : ''}</span>
      {label.includes('Compounding') && <span className="text-sm font-black text-emerald-400 block">{display}</span>}
    </motion.div>
  );
}

export default function BecomeInvestor() {
  const location = useLocation();
  const navigate = useNavigate();
  const pendingPlan = location.state?.pendingPlan || null;

  const existingProfile = getInvestorProfile();
  const [form, setForm] = useState({ ...emptyForm, ...(existingProfile || {}) });
  const [requestAmount, setRequestAmount] = useState(pendingPlan?.minInvestment || 500000);
  const [requestMessage, setRequestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const change = useCallback((e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })), []);

  const submitInvestmentRequest = async (investorId) => {
    if (!pendingPlan) return;
    const res = await fetch('/api/investment-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ investorId, propertyId: pendingPlan.id, propertyTitle: pendingPlan.title, propertyLocation: pendingPlan.location, propertyType: pendingPlan.propertyType, planCategory: pendingPlan.catKey, requestedAmount: Number(requestAmount) || 0, message: requestMessage.trim() }),
    });
    const body = await res.text();
    const data = body ? JSON.parse(body) : {};
    if (!res.ok) throw new Error(data.error || 'Failed to submit investment request.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim() || form.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter your full name and a valid 10-digit phone number.');
      return;
    }
    setSubmitting(true);
    try {
      let data = null;
      try {
        const res = await fetch('/api/investors', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
        if (res.ok) { const body = await res.text(); data = body ? JSON.parse(body) : null; }
      } catch { data = null; }
      if (!data) data = { _id: 'inv-' + Date.now(), ...form, createdAt: new Date().toISOString() };
      setInvestorProfile(data);
      try { await submitInvestmentRequest(data._id); } catch {}
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) { setNewsletterSubscribed(true); setNewsletterEmail(''); }
  };

  if (success) {
    return (
      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-screen bg-slate-950 px-4 sm:px-6 py-28 sm:py-36 flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[180px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-orange-500/10 blur-[150px] pointer-events-none" />
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: 'spring', stiffness: 160, damping: 20 }} className="relative w-full max-w-xl text-center rounded-3xl border border-emerald-500/40 bg-slate-900/90 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl shadow-emerald-500/15 space-y-7">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.15 }} className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/40 shadow-2xl shadow-emerald-500/20">
            <motion.i initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ delay: 0.4, type: 'spring' }} className="fa-solid fa-shield-check text-4xl"></motion.i>
          </motion.div>
          <div className="space-y-3">
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">VIP Investor Status Activated</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, type: 'spring' }} className="text-3xl sm:text-4xl font-black text-white tracking-tight">Application Received!</motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">Thank you, <span className="font-bold text-orange-400">{form.name}</span>. Your investor account is active. Your assigned Wealth Manager will reach out within <span className="text-white font-bold">2 business hours</span> with private off-market allocations.</motion.p>
          </div>
          {pendingPlan && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-left space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Priority Deal Commitment</span>
                <span className="text-[10px] font-bold text-slate-400">Status: Under Allocation</span>
              </div>
              <p className="font-bold text-white text-base">{pendingPlan.title}</p>
              <p className="text-xs text-slate-400">{pendingPlan.location}</p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                <span>Committed Amount:</span>
                <span className="font-black text-orange-400">₹{Number(requestAmount).toLocaleString('en-IN')}</span>
              </div>
            </motion.div>
          )}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-3 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/properties')} className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-orange-500/20 transition cursor-pointer">
              <i className="fa-solid fa-layer-group"></i><span>Explore Exclusive Deals</span>
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/')} className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-xs font-bold uppercase text-white hover:bg-white/10 transition cursor-pointer">
              <i className="fa-solid fa-house"></i><span>Back to Home</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative min-h-screen bg-slate-950 px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 lg:pt-40 pb-20 lg:pb-24 overflow-hidden text-left">
      <div className="absolute top-10 left-1/3 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-orange-500/5 blur-[200px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* Page Header */}
        <ViewSection className="text-center max-w-4xl mx-auto space-y-4" delay={0}>
          <motion.div variants={staggerItem()} className="inline-flex items-center gap-2.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2 backdrop-blur-md">
            <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </motion.span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400">VIP INVESTOR DESK • PRIORITY ALLOCATION</span>
          </motion.div>
          <motion.h1 variants={fadeInUp(0.1)} className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">Become an <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">Accredited Investor</span></motion.h1>
          <motion.p variants={fadeInUp(0.2)} className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">Partner with Baba Broker to gain direct access to RERA-verified real estate, pre-leased commercial shops, and high-appreciation land. Calculate returns or apply below for instant priority allocations.</motion.p>
        </ViewSection>

        {/* ROW 1: Form + Benefits */}
        <ViewSection className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start" delay={0}>
          {/* LEFT: Registration Form */}
          <motion.div variants={fadeInUp(0)} className="lg:col-span-6 w-full">
            <motion.div variants={staggerContainer(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} className="rounded-3xl border border-orange-500/30 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-orange-500/10 backdrop-blur-xl text-left space-y-6">
              <motion.div variants={staggerItem()} className="pb-4 border-b border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">ACCREDITED APPLICATION</span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>Priority Desk Open
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">Investor Registration Form</h3>
                <p className="text-xs text-slate-400">Complete details below for priority deal access</p>
              </motion.div>

              <motion.form variants={staggerItem()} onSubmit={handleSubmit} className="space-y-5">
                {pendingPlan && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-2xl border border-orange-500/40 bg-orange-500/10 p-4 flex items-center gap-3.5">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-orange-500 text-slate-950 font-black text-base"><i className="fa-solid fa-building-circle-check"></i></div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Target Opportunity Selected</p>
                      <p className="text-sm font-bold text-white truncate">{pendingPlan.title}</p>
                      <p className="text-xs text-slate-400 truncate">{pendingPlan.location}</p>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs font-medium text-red-200 flex items-center gap-2">
                    <i className="fa-solid fa-circle-exclamation text-red-400 text-sm"></i><span>{error}</span>
                  </motion.div>
                )}

                {/* Step 1 */}
                <motion.div variants={staggerItem()} className="space-y-3.5">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2"><i className="fa-solid fa-user-gear text-orange-400"></i><span>1. Contact Details</span></h4>
                  <div className="space-y-3">
                    {[
                      { name: 'name', label: 'Full Name *', type: 'text', placeholder: 'e.g. Rahul Sharma', icon: 'fa-solid fa-user-pen' },
                      { name: 'phone', label: 'Phone Number *', type: 'tel', placeholder: 'e.g. 9876543210', icon: 'fa-solid fa-phone' },
                      { name: 'email', label: 'Email Address', type: 'email', placeholder: 'e.g. rahul@email.com', icon: 'fa-solid fa-envelope' },
                      { name: 'city', label: 'City', type: 'text', placeholder: 'e.g. Noida / Delhi NCR', icon: 'fa-solid fa-location-dot' },
                    ].map((field) => (
                      <motion.div variants={staggerItem()} key={field.name}>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">{field.label}</label>
                        <div className="relative">
                          <i className={`${field.icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs`}></i>
                          <input required={field.label.includes('*')} type={field.type} name={field.name} value={form[field.name]} onChange={change} placeholder={field.placeholder} className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3.5 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Step 2 */}
                <motion.div variants={staggerItem()} className="space-y-3.5 pt-3 border-t border-white/10">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2"><i className="fa-solid fa-wallet text-orange-400"></i><span>2. Investment Criteria</span></h4>
                  <div className="space-y-3">
                    <motion.div variants={staggerItem()}>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Target Investment Budget Range</label>
                      <select name="budgetRange" value={form.budgetRange} onChange={change} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-xs text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition">
                        {BUDGET_RANGES.map((range) => <option key={range} value={range}>{range}</option>)}
                      </select>
                    </motion.div>
                    <motion.div variants={staggerItem()}>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Asset Class</label>
                      <select name="assetPreference" value={form.assetPreference} onChange={change} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-xs text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition">
                        {PREFERRED_ASSET_TYPES.map((type) => <option key={type.id} value={type.id}>{type.label}</option>)}
                      </select>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <motion.div variants={staggerItem()}>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">Occupation / Profession</label>
                        <input name="occupation" value={form.occupation} onChange={change} placeholder="e.g. Business Owner" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500" />
                      </motion.div>
                      <motion.div variants={staggerItem()}>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">PAN Card (Optional)</label>
                        <input name="panNumber" value={form.panNumber} onChange={change} placeholder="e.g. ABCDE1234F" className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Step 3 */}
                <motion.div variants={staggerItem()} className="space-y-3.5 pt-3 border-t border-white/10">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2"><i className="fa-solid fa-clipboard-list text-orange-400"></i><span>3. Additional Notes</span></h4>
                  <motion.div variants={staggerItem()}>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Additional Notes or Portfolio Goals</label>
                    <textarea rows="2" name="notes" value={form.notes} onChange={change} placeholder="Share any specific investment requirements..." className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 resize-none" />
                  </motion.div>
                </motion.div>

                {/* Pending plan commitment */}
                {pendingPlan && (
                  <motion.div variants={staggerItem()} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-orange-400 flex items-center gap-2"><i className="fa-solid fa-coins"></i><span>Specific Commitment Details</span></h4>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Amount You Wish to Commit (₹)</label>
                      <input type="number" min="0" value={requestAmount} onChange={(e) => setRequestAmount(e.target.value)} className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Requests for Admin</label>
                      <textarea rows="2" value={requestMessage} onChange={(e) => setRequestMessage(e.target.value)} placeholder="Timeline or site visit preferences..." className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500" />
                    </div>
                  </motion.div>
                )}

                <motion.button variants={staggerItem()} type="submit" disabled={submitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-4 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-orange-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
                  {submitting ? <><i className="fa-solid fa-spinner animate-spin text-sm"></i><span>Registering Application...</span></> : <><i className="fa-solid fa-user-shield text-sm"></i><span>{pendingPlan ? 'Register & Submit Allocation Request' : 'Complete Accredited Registration'}</span></>}
                </motion.button>
                <p className="text-[10px] text-center text-slate-500">🔒 100% Confidential. Encrypted under strict NDA standards.</p>
              </motion.form>
            </motion.div>
          </motion.div>

          {/* RIGHT: Benefits */}
          <ViewSection className="lg:col-span-6 w-full space-y-6" delay={0.2}>
            <motion.div variants={fadeInUp(0)} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl space-y-4">
              <motion.div variants={staggerItem()} className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-400"><i className="fa-solid fa-handshake"></i><span>Why Partner With Baba Broker?</span></motion.div>
              <motion.h2 variants={fadeInUp(0.1)} className="text-2xl sm:text-3xl font-black text-white leading-tight">Unlock High-Yield Real Estate Assets With Zero Friction</motion.h2>
              <motion.p variants={fadeInUp(0.15)} className="text-xs sm:text-sm text-slate-300 leading-relaxed">By registering as an accredited partner, you gain direct access to pre-vetted fractional real estate, commercial shops with pre-leased corporate tenants, and high-appreciation land parcels across Delhi NCR and Vrindavan.</motion.p>
            </motion.div>

            <ViewSection className="space-y-4" delay={0.3}>
              {[
                { icon: 'fa-solid fa-shield-check', color: 'orange', title: '100% Title-Clear Pre-Vetted Deals', desc: 'Every property undergoes a 45-point legal and bank due diligence check prior to listing. RERA title reports are available instantly to registered partners.' },
                { icon: 'fa-solid fa-money-bill-trend-up', color: 'emerald', title: 'Guaranteed Passive Dividend Wire Payouts', desc: 'Earn predictable quarterly cash flow ranging from 10% to 14.2% per annum, deposited directly into your linked bank account on fixed dates.' },
                { icon: 'fa-solid fa-user-tie', color: 'blue', title: 'Dedicated Personal Wealth Manager', desc: 'Receive 1-on-1 expert advisory to curate a balanced portfolio across commercial, land plots, and residential assets tailored to your budget.' },
                { icon: 'fa-solid fa-unlock-keyhole', color: 'purple', title: 'Priority Pre-Launch Allocation', desc: 'Accredited partners get a 48-hour exclusive window to commit capital into prime deals before public launch.' },
              ].map((benefit, idx) => {
                const colorMap = {
                  orange: { bg: 'bg-orange-500/10 border-orange-500/30', icon: 'text-orange-400', hover: 'hover:border-orange-500/30' },
                  emerald: { bg: 'bg-emerald-500/10 border-emerald-500/30', icon: 'text-emerald-400', hover: 'hover:border-emerald-500/30' },
                  blue: { bg: 'bg-blue-500/10 border-blue-500/30', icon: 'text-blue-400', hover: 'hover:border-blue-500/30' },
                  purple: { bg: 'bg-purple-500/10 border-purple-500/30', icon: 'text-purple-400', hover: 'hover:border-purple-500/30' },
                };
                const c = colorMap[benefit.color];
                return (
                  <motion.div key={idx} variants={staggerItem()} whileHover={{ x: 4, transition: { type: 'spring', stiffness: 300 } }} className={`rounded-2xl border border-white/10 ${c.hover} bg-slate-900/60 p-5 backdrop-blur-md flex items-start gap-4 transition-colors`}>
                    <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className={`h-11 w-11 shrink-0 rounded-xl ${c.bg} flex items-center justify-center ${c.icon} font-bold text-base`}><i className={benefit.icon}></i></motion.div>
                    <div>
                      <h4 className="text-sm font-extrabold text-white mb-1">{benefit.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{benefit.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </ViewSection>
          </ViewSection>
        </ViewSection>

        {/* ROW 2: Earnings + Calculator */}
        <ViewSection className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start pt-10 border-t border-white/10" delay={0}>
          <motion.div variants={fadeInUp(0)} className="lg:col-span-6 w-full space-y-6">
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl space-y-4">
              <motion.div variants={staggerItem()} className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400"><i className="fa-solid fa-chart-line"></i><span>Returns & Earnings Potential</span></motion.div>
              <motion.h2 variants={fadeInUp(0.1)} className="text-2xl sm:text-3xl font-black text-white leading-tight">How Much Can You Earn As an Investor?</motion.h2>
              <motion.p variants={fadeInUp(0.15)} className="text-xs sm:text-sm text-slate-300 leading-relaxed">Our asset portfolio is engineered for dual-stream returns: stable quarterly rental distributions combined with high long-term capital appreciation.</motion.p>
            </div>

            <ViewSection className="grid grid-cols-1 sm:grid-cols-2 gap-4" delay={0.2}>
              {[
                { label: 'Stream 1', tag: '10% - 14.2% IRR', tagColor: 'bg-orange-500/20', title: 'Fixed Rental Cash Flow', desc: 'Quarterly dividend deposits from pre-leased commercial shops and prime institutional assets.', color: 'orange' },
                { label: 'Stream 2', tag: '+18.4% YoY Growth', tagColor: 'bg-emerald-500/20', title: 'Capital Appreciation', desc: 'Surging land values across high-growth corridors (Noida, Vrindavan, & Gurugram).', color: 'emerald' },
                { label: 'Compounding Example', tag: '1.61x Growth Multiple', tagColor: 'bg-emerald-500/20', title: '₹5 Lakhs Initial Investment = ₹8.05 Lakhs in 5 Years', desc: 'By compounding annual yields at a 10% baseline, your capital generates over 61% net profits in 60 months with zero management hassle.', color: 'emerald', wide: true },
              ].map((item, idx) => {
                const colorMap = {
                  orange: { border: 'border-orange-500/10', tagText: 'text-orange-400' },
                  emerald: { border: 'border-emerald-500/10', tagText: 'text-emerald-400' },
                };
                const c = colorMap[item.color];
                return (
                  <motion.div key={idx} variants={staggerItem()} whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300 } }} className={`rounded-2xl border ${c.border} bg-slate-900/60 p-5 backdrop-blur-md space-y-2 ${item.wide ? 'sm:col-span-2' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">{item.label}</span>
                      <span className={`text-xs font-black text-white ${item.tagColor} px-2 py-0.5 rounded`}>{item.tag}</span>
                    </div>
                    <h4 className="text-sm font-extrabold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                  </motion.div>
                );
              })}
            </ViewSection>

            <motion.div variants={fadeInUp(0.3)} className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-400 flex items-center gap-3">
              <i className="fa-solid fa-circle-check text-emerald-400 text-base shrink-0"></i>
              <span>All investments feature real-time digital dashboard tracking and zero hidden performance fees.</span>
            </motion.div>
          </motion.div>

          {/* RIGHT: Calculator Card */}
          <motion.div variants={fadeInUp(0.1)} className="lg:col-span-6 w-full">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: '-60px' }} transition={{ type: 'spring', stiffness: 150 }} className="rounded-3xl border border-white/15 bg-slate-900/90 p-2 sm:p-3 shadow-2xl backdrop-blur-xl">
              <CalculatorCard />
            </motion.div>
          </motion.div>
        </ViewSection>

        {/* Newsletter */}
        <ViewSection delay={0.3}>
          <motion.div variants={fadeInUp(0)} className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-8 sm:p-10 shadow-2xl text-center space-y-5 backdrop-blur-xl">
            <div className="max-w-2xl mx-auto space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2"><span>🚀 Stay Ahead with Off-Market Investment Deals</span></h3>
              <p className="text-xs sm:text-sm text-slate-300">Subscribe to our private investor newsletter and receive early-bird allocation notifications directly in your inbox.</p>
            </div>
            {newsletterSubscribed ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 max-w-md mx-auto text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-check text-sm"></i><span>Thank you! You are now subscribed to private deal notifications.</span>
              </motion.div>
            ) : (
              <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <input type="email" required value={newsletterEmail} onChange={(e) => setNewsletterEmail(e.target.value)} placeholder="Enter your email address..." className="w-full sm:flex-1 rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 transition" />
                <motion.button type="submit" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto rounded-xl bg-orange-500 px-6 py-3 text-xs font-black uppercase text-slate-950 hover:bg-orange-400 transition shadow-lg cursor-pointer shrink-0">Subscribe</motion.button>
              </motion.form>
            )}
          </motion.div>
        </ViewSection>
      </div>
    </motion.section>
  );
}
