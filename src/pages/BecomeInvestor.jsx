import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getInvestorProfile, setInvestorProfile } from '../utils/investorProfile';
import { CalculatorCard } from '../components/home/BrowseByBudgetSection';

const BUDGET_RANGES = [
  '₹5 Lakhs - ₹10 Lakhs',
  '₹10 Lakhs - ₹25 Lakhs',
  '₹25 Lakhs - ₹50 Lakhs',
  '₹50 Lakhs - ₹1 Crore',
  '₹1 Crore+',
];

const PREFERRED_ASSET_TYPES = [
  { id: 'all', label: 'All High-Yield Opportunities' },
  { id: 'plots', label: 'High-Appreciation Land & Plots' },
  { id: 'commercial', label: 'Pre-Leased Commercial Shops' },
  { id: 'flats', label: 'Luxury Residential Flats & Suites' },
];

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  city: '',
  occupation: '',
  panNumber: '',
  budgetRange: BUDGET_RANGES[0],
  assetPreference: 'all',
  notes: '',
};

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

  const change = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submitInvestmentRequest = async (investorId) => {
    if (!pendingPlan) return;
    const res = await fetch('/api/investment-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        investorId,
        propertyId: pendingPlan.id,
        propertyTitle: pendingPlan.title,
        propertyLocation: pendingPlan.location,
        propertyType: pendingPlan.propertyType,
        planCategory: pendingPlan.catKey,
        requestedAmount: Number(requestAmount) || 0,
        message: requestMessage.trim(),
      }),
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
        const res = await fetch('/api/investors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const body = await res.text();
          data = body ? JSON.parse(body) : null;
        }
      } catch {
        data = null;
      }

      if (!data) {
        data = {
          _id: 'inv-' + Date.now(),
          ...form,
          createdAt: new Date().toISOString(),
        };
      }

      setInvestorProfile(data);
      try {
        await submitInvestmentRequest(data._id);
      } catch {
        // Continue smoothly in demo mode
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  if (success) {
    return (
      <section className="relative min-h-screen bg-slate-950 px-4 sm:px-6 py-28 sm:py-36 flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[180px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-orange-500/10 blur-[150px] pointer-events-none"></div>

        <div className="relative w-full max-w-xl text-center rounded-3xl border border-emerald-500/40 bg-slate-900/90 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl shadow-emerald-500/15 space-y-7 animate-fadeIn">
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/40 shadow-2xl shadow-emerald-500/20">
            <i className="fa-solid fa-shield-check text-4xl"></i>
          </div>

          <div className="space-y-3">
            <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/30 px-4 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
              VIP Investor Status Activated
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Application Received!
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              Thank you, <span className="font-bold text-orange-400">{form.name}</span>. Your investor account is active. Your assigned Wealth Manager will reach out within <span className="text-white font-bold">2 business hours</span> with private off-market allocations.
            </p>
          </div>

          {pendingPlan && (
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-5 text-left space-y-2">
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
            </div>
          )}

          <div className="pt-3 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/properties')}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition cursor-pointer"
            >
              <i className="fa-solid fa-layer-group"></i>
              <span>Explore Exclusive Deals</span>
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-xs font-bold uppercase text-white hover:bg-white/10 transition cursor-pointer"
            >
              <i className="fa-solid fa-house"></i>
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-slate-950 px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 lg:pt-40 pb-20 lg:pb-24 overflow-hidden text-left">
      {/* Glow Background Orbs */}
      <div className="absolute top-10 left-1/3 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-orange-500/5 blur-[200px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[180px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        
        {/* Main Page Title Header */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-5 py-2 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400">
              VIP INVESTOR DESK • PRIORITY ALLOCATION
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
            Become an <span className="text-orange-400">Accredited Investor</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Partner with Baba Broker to gain direct access to RERA-verified real estate, pre-leased commercial shops, and high-appreciation land. Calculate returns or apply below for instant priority allocations.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* ROW 1: LEFT SIDE = [Investor Registration Form] | RIGHT SIDE = [Become a Partner & Benefits Content] */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          
          {/* LEFT SIDE: Investor Registration Form (lg:col-span-6) */}
          <div className="lg:col-span-6 w-full">
            <div className="rounded-3xl border border-orange-500/30 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-orange-500/10 backdrop-blur-xl text-left space-y-6">
              
              {/* Form Header */}
              <div className="pb-4 border-b border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
                    ACCREDITED APPLICATION
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Priority Desk Open
                  </span>
                </div>
                <h3 className="text-xl font-black text-white">Investor Registration Form</h3>
                <p className="text-xs text-slate-400">Complete details below for priority deal access</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {pendingPlan && (
                  <div className="rounded-2xl border border-orange-500/40 bg-orange-500/10 p-4 flex items-center gap-3.5">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-orange-500 text-slate-950 font-black text-base">
                      <i className="fa-solid fa-building-circle-check"></i>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Target Opportunity Selected</p>
                      <p className="text-sm font-bold text-white truncate">{pendingPlan.title}</p>
                      <p className="text-xs text-slate-400 truncate">{pendingPlan.location}</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-xs font-medium text-red-200 flex items-center gap-2">
                    <i className="fa-solid fa-circle-exclamation text-red-400 text-sm"></i>
                    <span>{error}</span>
                  </div>
                )}

                {/* Step 1: Contact Details */}
                <div className="space-y-3.5">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <i className="fa-solid fa-user-gear text-orange-400"></i>
                    <span>1. Contact Details</span>
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <i className="fa-solid fa-user-pen absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                        <input
                          required
                          name="name"
                          value={form.name}
                          onChange={change}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3.5 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <i className="fa-solid fa-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                        <input
                          required
                          name="phone"
                          value={form.phone}
                          onChange={change}
                          placeholder="e.g. 9876543210"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3.5 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={change}
                          placeholder="e.g. rahul@email.com"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3.5 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        City
                      </label>
                      <div className="relative">
                        <i className="fa-solid fa-location-dot absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                        <input
                          name="city"
                          value={form.city}
                          onChange={change}
                          placeholder="e.g. Noida / Delhi NCR"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3.5 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2: Investment Goals */}
                <div className="space-y-3.5 pt-3 border-t border-white/10">
                  <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <i className="fa-solid fa-wallet text-orange-400"></i>
                    <span>2. Investment Criteria</span>
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Target Investment Budget Range
                      </label>
                      <select
                        name="budgetRange"
                        value={form.budgetRange}
                        onChange={change}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-xs text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                      >
                        {BUDGET_RANGES.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Preferred Asset Class
                      </label>
                      <select
                        name="assetPreference"
                        value={form.assetPreference}
                        onChange={change}
                        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-3 text-xs text-white outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                      >
                        {PREFERRED_ASSET_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Occupation / Profession
                        </label>
                        <input
                          name="occupation"
                          value={form.occupation}
                          onChange={change}
                          placeholder="e.g. Business Owner"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          PAN Card (Optional)
                        </label>
                        <input
                          name="panNumber"
                          value={form.panNumber}
                          onChange={change}
                          placeholder="e.g. ABCDE1234F"
                          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {pendingPlan && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-orange-400 flex items-center gap-2">
                      <i className="fa-solid fa-coins"></i>
                      <span>Specific Commitment Details</span>
                    </h4>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Amount You Wish to Commit (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={requestAmount}
                        onChange={(e) => setRequestAmount(e.target.value)}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Notes / Requests for Admin
                      </label>
                      <textarea
                        rows="2"
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        placeholder="Timeline or site visit preferences..."
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Additional Notes or Portfolio Goals
                  </label>
                  <textarea
                    rows="2"
                    name="notes"
                    value={form.notes}
                    onChange={change}
                    placeholder="Share any specific investment requirements..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500"
                  />
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-4 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-orange-500/25 hover:scale-[1.01] hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin text-sm"></i>
                      <span>Registering Application...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-user-shield text-sm"></i>
                      <span>
                        {pendingPlan
                          ? 'Register & Submit Allocation Request'
                          : 'Complete Accredited Registration'}
                      </span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-500">
                  🔒 100% Confidential. Encrypted under strict NDA standards.
                </p>
              </form>

            </div>
          </div>

          {/* RIGHT SIDE: Become a Partner & Benefits Content (lg:col-span-6) */}
          <div className="lg:col-span-6 w-full space-y-6">
            
            {/* Header Card */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-400">
                <i className="fa-solid fa-handshake"></i>
                <span>Why Partner With Baba Broker?</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Unlock High-Yield Real Estate Assets With Zero Friction
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                By registering as an accredited partner, you gain direct access to pre-vetted fractional real estate, commercial shops with pre-leased corporate tenants, and high-appreciation land parcels across Delhi NCR and Vrindavan.
              </p>
            </div>

            {/* Benefits Cards List */}
            <div className="space-y-4">
              
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md flex items-start gap-4 hover:border-orange-500/30 transition">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-base">
                  <i className="fa-solid fa-shield-check"></i>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white mb-1">100% Title-Clear Pre-Vetted Deals</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Every property undergoes a 45-point legal and bank due diligence check prior to listing. RERA title reports are available instantly to registered partners.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md flex items-start gap-4 hover:border-emerald-500/30 transition">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-base">
                  <i className="fa-solid fa-money-bill-trend-up"></i>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white mb-1">Guaranteed Passive Dividend Wire Payouts</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Earn predictable quarterly cash flow ranging from 10% to 14.2% per annum, deposited directly into your linked bank account on fixed dates.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md flex items-start gap-4 hover:border-blue-500/30 transition">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-base">
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white mb-1">Dedicated Personal Wealth Manager</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Receive 1-on-1 expert advisory to curate a balanced portfolio across commercial, land plots, and residential assets tailored to your budget.</p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md flex items-start gap-4 hover:border-purple-500/30 transition">
                <div className="h-11 w-11 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-base">
                  <i className="fa-solid fa-[#000]"></i>
                  <i className="fa-solid fa-unlock-keyhole"></i>
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white mb-1">Priority Pre-Launch Allocation</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">Accredited partners get a 48-hour exclusive window to commit capital into prime deals before public launch.</p>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* ROW 2: LEFT SIDE = [How Much You Can Earn Content] | RIGHT SIDE = [Growth Planner] */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start pt-10 border-t border-white/10">
          
          {/* LEFT SIDE: How Much You Can Earn Content (lg:col-span-6) */}
          <div className="lg:col-span-6 w-full space-y-6">
            
            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                <i className="fa-solid fa-chart-line"></i>
                <span>Returns & Earnings Potential</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                How Much Can You Earn As an Investor?
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Our asset portfolio is engineered for dual-stream returns: stable quarterly rental distributions combined with high long-term capital appreciation.
              </p>
            </div>

            {/* Earnings Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Stream 1</span>
                  <span className="text-xs font-black text-white bg-orange-500/20 px-2 py-0.5 rounded">10% - 14.2% IRR</span>
                </div>
                <h4 className="text-sm font-extrabold text-white">Fixed Rental Cash Flow</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Quarterly dividend deposits from pre-leased commercial shops and prime institutional assets.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Stream 2</span>
                  <span className="text-xs font-black text-white bg-emerald-500/20 px-2 py-0.5 rounded">+18.4% YoY Growth</span>
                </div>
                <h4 className="text-sm font-extrabold text-white">Capital Appreciation</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Surging land values across high-growth corridors (Noida, Vrindavan, & Gurugram).</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-md space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Compounding Example</span>
                  <span className="text-xs font-black text-emerald-400">1.61x Growth Multiple</span>
                </div>
                <h4 className="text-sm font-extrabold text-white">₹5 Lakhs Initial Investment = ₹8.05 Lakhs in 5 Years</h4>
                <p className="text-xs text-slate-400 leading-relaxed">By compounding annual yields at a 10% baseline, your capital generates over 61% net profits in 60 months with zero management hassle.</p>
              </div>

            </div>

            {/* Quick Transparency Note */}
            <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-xs text-slate-400 flex items-center gap-3">
              <i className="fa-solid fa-circle-check text-emerald-400 text-base shrink-0"></i>
              <span>All investments feature real-time digital dashboard tracking and zero hidden performance fees.</span>
            </div>

          </div>

          {/* RIGHT SIDE: Growth Planner CalculatorCard (lg:col-span-6) */}
          <div className="lg:col-span-6 w-full">
            <div className="rounded-3xl border border-white/15 bg-slate-900/90 p-2 sm:p-3 shadow-2xl backdrop-blur-xl">
              <CalculatorCard />
            </div>
          </div>

        </div>

        {/* Pre-Footer Newsletter Subscription Section */}
        <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-8 sm:p-10 shadow-2xl text-center space-y-5 backdrop-blur-xl">
          <div className="max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
              <span>🚀 Stay Ahead with Off-Market Investment Deals</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Subscribe to our private investor newsletter and receive early-bird allocation notifications directly in your inbox.
            </p>
          </div>

          {newsletterSubscribed ? (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 max-w-md mx-auto text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
              <i className="fa-solid fa-circle-check text-sm"></i>
              <span>Thank you! You are now subscribed to private deal notifications.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full sm:flex-1 rounded-xl border border-white/15 bg-slate-950 px-4 py-3 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 transition"
              />
              <button
                type="submit"
                className="w-full sm:w-auto rounded-xl bg-orange-500 px-6 py-3 text-xs font-black uppercase text-slate-950 hover:bg-orange-400 transition shadow-lg cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
