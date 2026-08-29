import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useToast } from '../../hooks/useToast';

const emptyPropertyForm = () => ({
  title: '',
  status: 'running',
  propertyType: 'residential',
  investmentModel: 'co_investment',
  price: '',
  totalValuation: '',
  minInvestment: '',
  expectedRoi: '',
  fundedPercentage: 0,
  investorsList: [],
  purchasePrice: '',
  renovationCost: '',
  estimatedResale: '',
  flipTimeline: '',
  location: '',
  mapLocation: '',
  bhk: '3bhk',
  sizeSqft: '',
  floor: '',
  parking: '',
  builtUpArea: '',
  carpetArea: '',
  washrooms: '',
  plotAreaSqft: '',
  plotAreaSqm: '',
  perSqftPrice: '',
  ownership: '',
  highlights: '',
  amenities: '',
  image: '',
  images: [],
  videoUrl: '',
  description: '',
  isFeatured: false,
});

export default function CreateInvestmentProjectView() {
  const navigate = useNavigate();
  const toast = useToast();

  const [activeFormTab, setActiveFormTab] = useState('financial');
  const [isSaving, setIsSaving] = useState(false);

  // Comprehensive Investment Property Form State (All fields empty initially)
  const [propertyForm, setPropertyForm] = useState(emptyPropertyForm());

  // Co-Investor Add State
  const [newInvestorName, setNewInvestorName] = useState('');
  const [newInvestorShare, setNewInvestorShare] = useState('');
  const [newInvestorAmount, setNewInvestorAmount] = useState('');

  const changeProperty = (e) => {
    const { name, value, type, checked } = e.target;
    setPropertyForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle Display Valuation text change -> auto-sync totalValuation & minInvestment sync
  const handleDisplayValuationChange = (e) => {
    const val = e.target.value;
    const digits = val.replace(/\D/g, '');
    const num = Number(digits) || 0;
    const formatted = num > 0 ? `₹ ${num.toLocaleString('en-IN')}` : val;

    setPropertyForm((prev) => {
      const totalVal = digits ? String(num) : '';
      const minNum = Number(prev.minInvestment) || 0;
      let minPct = 0;
      if (num > 0 && minNum > 0) {
        minPct = Math.min(100, Math.max(1, Math.round((minNum / num) * 100)));
      }
      const currentFunded = Number(prev.fundedPercentage) || 0;
      const effectiveFunded = Math.max(currentFunded, minPct);

      return {
        ...prev,
        price: formatted,
        totalValuation: totalVal,
        fundedPercentage: effectiveFunded,
      };
    });
  };

  // Handle Min Investment change -> sync with funded percentage & freeze slider minimum
  const handleMinInvestmentChange = (e) => {
    const val = e.target.value;
    const minNum = Number(val) || 0;
    const totalVal = Number(propertyForm.totalValuation) || 0;
    let minPct = 0;
    if (totalVal > 0 && minNum > 0) {
      minPct = Math.min(100, Math.max(1, Math.round((minNum / totalVal) * 100)));
    }

    setPropertyForm((prev) => {
      const currentPct = Number(prev.fundedPercentage) || 0;
      const newPct = minPct > 0 ? Math.max(currentPct, minPct) : currentPct;
      return {
        ...prev,
        minInvestment: val,
        fundedPercentage: newPct,
      };
    });
  };

  // Handle ROI decimal input (strictly decimal, replaces commas with dot)
  const handleRoiChange = (e) => {
    const raw = e.target.value.replace(/,/g, '.');
    // Allow only valid numbers and at most one decimal point
    if (/^\d*\.?\d*$/.test(raw)) {
      setPropertyForm((prev) => ({ ...prev, expectedRoi: raw }));
    }
  };

  const addInvestor = () => {
    if (!newInvestorName.trim() || !newInvestorShare || !newInvestorAmount.trim()) {
      toast({ type: 'error', message: 'Please enter Investor Name, Share %, and Amount.' });
      return;
    }
    const shareNum = Number(newInvestorShare) || 0;
    const currentTotalShare = (propertyForm.investorsList || []).reduce(
      (sum, item) => sum + (Number(item.sharePercentage) || 0),
      0
    );

    if (currentTotalShare + shareNum > 100) {
      toast({ type: 'error', message: `Total investor shares cannot exceed 100%. Current: ${currentTotalShare}%` });
      return;
    }

    const updatedList = [
      ...(propertyForm.investorsList || []),
      {
        name: newInvestorName.trim(),
        sharePercentage: shareNum,
        amount: newInvestorAmount.trim(),
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      },
    ];

    const newFundedPct = updatedList.reduce((sum, item) => sum + (Number(item.sharePercentage) || 0), 0);
    const totalVal = Number(propertyForm.totalValuation) || 0;
    const remainingVal = Math.max(0, totalVal - Math.round((totalVal * newFundedPct) / 100));

    setPropertyForm((prev) => ({
      ...prev,
      investorsList: updatedList,
      fundedPercentage: newFundedPct,
      price: totalVal > 0 ? `₹ ${remainingVal.toLocaleString('en-IN')}` : prev.price,
    }));

    setNewInvestorName('');
    setNewInvestorShare('');
    setNewInvestorAmount('');
    toast({ type: 'success', message: 'Co-investor added to pool!' });
  };

  const removeInvestor = (index) => {
    const updatedList = (propertyForm.investorsList || []).filter((_, idx) => idx !== index);
    const newFundedPct = updatedList.reduce((sum, item) => sum + (Number(item.sharePercentage) || 0), 0);
    const totalVal = Number(propertyForm.totalValuation) || 0;
    const remainingVal = Math.max(0, totalVal - Math.round((totalVal * newFundedPct) / 100));

    setPropertyForm((prev) => ({
      ...prev,
      investorsList: updatedList,
      fundedPercentage: newFundedPct,
      price: totalVal > 0 ? `₹ ${remainingVal.toLocaleString('en-IN')}` : prev.price,
    }));
  };

  const handleLocalCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ type: 'error', message: 'Cover image must be under 5MB.' });
      return;
    }
    setPropertyForm((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    toast({ type: 'success', message: 'Cover photo selected!' });
  };

  const handleLocalGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) return;
      setPropertyForm((prev) => ({ ...prev, images: [...(prev.images || []), URL.createObjectURL(file)] }));
    });
    toast({ type: 'success', message: `Added ${files.length} gallery photos!` });
  };

  // Calculations for live Min Investment & ROI
  const totalValNum = Number(propertyForm.totalValuation) || 0;
  const minInvNum = Number(propertyForm.minInvestment) || 0;
  const roiNum = parseFloat(propertyForm.expectedRoi) || 0;
  const minTicketAnnualGain = minInvNum > 0 && roiNum > 0 ? Math.round((minInvNum * roiNum) / 100) : 0;
  const minTicketTotalExit1Yr = minInvNum + minTicketAnnualGain;
  const totalPoolAnnualYield = totalValNum > 0 && roiNum > 0 ? Math.round((totalValNum * roiNum) / 100) : 0;
  const totalInvestorSlots = minInvNum > 0 && totalValNum > 0 ? Math.floor(totalValNum / minInvNum) : 0;

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!propertyForm.title.trim()) {
      toast({ type: 'error', message: 'Please enter a project title.' });
      setActiveFormTab('financial');
      return;
    }

    if (!propertyForm.price.trim() && !propertyForm.totalValuation) {
      toast({ type: 'error', message: 'Please enter Display Valuation / Total Valuation.' });
      setActiveFormTab('financial');
      return;
    }

    if (!propertyForm.location.trim()) {
      toast({ type: 'error', message: 'Please enter property location.' });
      setActiveFormTab('specs');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...propertyForm,
        price: propertyForm.price?.trim() || (propertyForm.totalValuation ? `₹ ${Number(propertyForm.totalValuation).toLocaleString('en-IN')}` : ''),
        totalValuation: Number(propertyForm.totalValuation) || 0,
        minInvestment: Number(propertyForm.minInvestment) || 0,
        fundedPercentage: Number(propertyForm.fundedPercentage) || 0,
        expectedRoi: parseFloat(propertyForm.expectedRoi) || 0,
        description: propertyForm.description?.trim() || `Prime ${propertyForm.title.trim()} investment deal in ${propertyForm.location.trim()} with attractive capital growth projections.`,
        image: propertyForm.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80',
        highlights: typeof propertyForm.highlights === 'string' ? propertyForm.highlights : (Array.isArray(propertyForm.highlights) ? propertyForm.highlights.join(', ') : ''),
        amenities: typeof propertyForm.amenities === 'string' ? propertyForm.amenities : (Array.isArray(propertyForm.amenities) ? propertyForm.amenities.join(', ') : ''),
      };

      await api('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      toast({ type: 'success', message: '🚀 Investment Project published live!' });
      
      // Clear all fields completely after successful submission
      setPropertyForm(emptyPropertyForm());
      setActiveFormTab('financial');

      setTimeout(() => {
        navigate('/admin/projects');
      }, 700);
    } catch (err) {
      toast({ type: 'error', message: err.message || 'Error saving property' });
    } finally {
      setIsSaving(false);
    }
  };

  const stepsList = [
    { id: 'financial', step: '1', title: 'Financials & Pool', icon: 'ri-money-rupee-circle-line' },
    { id: 'specs', step: '2', title: 'Specifications & Specs', icon: 'ri-ruler-line' },
    { id: 'media', step: '3', title: 'Media & Description', icon: 'ri-image-line' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5 font-['Inter',sans-serif]">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/90 p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Create Investment Project</h1>
            <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
              Co-Investment Pool
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure fractional investment pools, renovate-and-flip deals, and allocate co-investor shares.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setPropertyForm(emptyPropertyForm());
              navigate('/admin/projects');
            }}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition cursor-pointer disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <i className="ri-loader-4-line animate-spin" />
                <span>Publishing…</span>
              </>
            ) : (
              <>
                <i className="ri-rocket-line" />
                <span>Publish Project</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step Progress Navigation Strip */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[500px] max-w-3xl mx-auto">
            {stepsList.map((tab, idx, arr) => {
              const isActive = activeFormTab === tab.id;
              const tabOrder = arr.findIndex((t) => t.id === activeFormTab);
              const isCompleted = idx < tabOrder;

              return (
                <React.Fragment key={tab.id}>
                  {idx > 0 && (
                    <div className="flex-1 px-3 flex items-center">
                      <div
                        className={`w-full border-t-2 transition-all duration-300 ${
                          isCompleted || isActive
                            ? 'border-orange-500 border-solid'
                            : 'border-slate-200 border-dashed'
                        }`}
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setActiveFormTab(tab.id)}
                    className="group flex items-center gap-2.5 cursor-pointer focus:outline-none shrink-0"
                  >
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-200 shrink-0 ${
                        isActive
                          ? 'bg-[#ea580c] text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-200 scale-105'
                          : isCompleted
                          ? 'bg-emerald-500 text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-400 group-hover:border-orange-300'
                      }`}
                    >
                      {isCompleted ? <i className="ri-check-line text-xs" /> : <i className={`${tab.icon} text-xs`} />}
                    </div>

                    <div className="text-left">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider block leading-tight ${
                          isActive ? 'text-[#ea580c]' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      >
                        Step {tab.step}
                      </span>
                      <span
                        className={`text-xs font-black block truncate max-w-[130px] ${
                          isActive ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
                        }`}
                      >
                        {tab.title}
                      </span>
                    </div>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ─── FORM WORKSPACE BODY ─── */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* ════════════ TAB 1: FINANCIALS & INVESTMENT POOL ════════════ */}
          {activeFormTab === 'financial' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Project Title & Category Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5 space-y-3.5">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1">
                    <span>Project Headline / Title <span className="text-[#ea580c]">*</span></span>
                  </label>
                  <div className="relative">
                    <i className="ri-article-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                      required
                      name="title"
                      value={propertyForm.title}
                      onChange={changeProperty}
                      placeholder="e.g. Luxury 3BHK Smart Residency Co-Investment"
                      className="w-full rounded-xl bg-white pl-9 pr-3 py-2.5 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Project Status *</label>
                    <select
                      name="status"
                      value={propertyForm.status}
                      onChange={changeProperty}
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c] cursor-pointer"
                    >
                      <option value="running">🚀 Running (Ongoing)</option>
                      <option value="upcoming">⏳ Upcoming Launch</option>
                      <option value="delivered">✅ Delivered Project</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Property Category *</label>
                    <select
                      name="propertyType"
                      value={propertyForm.propertyType}
                      onChange={changeProperty}
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c] cursor-pointer"
                    >
                      <option value="residential">🏢 Residential</option>
                      <option value="commercial">🏬 Commercial</option>
                      <option value="plot">🏞️ Plot / Land</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-extrabold text-slate-700">Display Valuation Text *</label>
                      <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                        Primary Price
                      </span>
                    </div>
                    <input
                      required
                      name="price"
                      value={propertyForm.price}
                      onChange={handleDisplayValuationChange}
                      placeholder="e.g. ₹ 50,00,000"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Investment Deal Type Selection */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-700 block mb-1.5">Investment Deal Model *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { id: 'co_investment', label: 'Scenario 1: Fractional Co-Investment Pool', icon: 'ri-pie-chart-2-line', desc: 'Pool multiple investors with customized equity percentages.' },
                    { id: 'renovate_flip', label: 'Scenario 2: Renovate & Flip Deal', icon: 'ri-home-gear-line', desc: 'Purchase distressed property, renovate, and sell for targeted profit.' },
                  ].map((m) => {
                    const isSelected = propertyForm.investmentModel === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPropertyForm((prev) => ({ ...prev, investmentModel: m.id }))}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? 'border-[#ea580c] bg-orange-50/60 text-[#ea580c] shadow-2xs ring-2 ring-orange-500/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                          isSelected ? 'bg-[#ea580c] text-white shadow-2xs' : 'bg-slate-100 text-slate-500'
                        }`}>
                          <i className={m.icon} />
                        </div>
                        <div>
                          <span className="text-xs font-black block leading-tight">{m.label}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{m.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scenario 1: Fractional Co-Investment Pool Parameters */}
              {propertyForm.investmentModel === 'co_investment' ? (
                <div className="rounded-2xl border border-orange-200/80 bg-orange-50/30 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <i className="ri-pie-chart-2-fill text-[#ea580c]" /> Fractional Pool Parameters
                    </span>
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full border border-orange-200">
                      Available Equity: {Math.max(0, 100 - (Number(propertyForm.fundedPercentage) || 0))}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    {/* Read-Only Total Valuation synced with Display Valuation */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-extrabold text-slate-700">Total Valuation (₹) *</label>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Auto-Synced
                        </span>
                      </div>
                      <input
                        readOnly
                        type="text"
                        name="totalValuation"
                        value={propertyForm.totalValuation ? `₹ ${Number(propertyForm.totalValuation).toLocaleString('en-IN')}` : ''}
                        placeholder="Synced from Display Valuation"
                        className="w-full rounded-xl bg-slate-100/80 px-3 py-2 text-xs font-bold text-slate-800 outline-none border border-slate-200/90 cursor-not-allowed font-mono select-none"
                      />
                    </div>

                    {/* Min Investment Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-extrabold text-slate-700">Min. Investment (₹) *</label>
                        {minInvNum > 0 && totalValNum > 0 && (
                          <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200">
                            {Math.round((minInvNum / totalValNum) * 100)}% of Pool
                          </span>
                        )}
                      </div>
                      <input
                        required
                        type="number"
                        name="minInvestment"
                        value={propertyForm.minInvestment}
                        onChange={handleMinInvestmentChange}
                        placeholder="e.g. 250000"
                        className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c] font-mono"
                      />
                    </div>

                    {/* Target Annual ROI (Decimal value strictly, no commas) */}
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
                        Target Annual ROI % (Decimal) *
                      </label>
                      <div className="relative">
                        <input
                          required
                          type="text"
                          inputMode="decimal"
                          name="expectedRoi"
                          value={propertyForm.expectedRoi}
                          onChange={handleRoiChange}
                          placeholder="e.g. 18.5"
                          className="w-full rounded-xl bg-white pl-3 pr-7 py-2 text-xs font-bold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c] font-mono"
                        />
                        <span className="absolute right-3 top-2 text-xs font-bold text-slate-400 pointer-events-none">%</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Real-Time Calculations Panel */}
                  {(minInvNum > 0 || totalValNum > 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-white border border-orange-200 shadow-2xs">
                      <div className="p-2 bg-orange-50/60 rounded-xl border border-orange-100">
                        <span className="text-[9px] uppercase font-black text-orange-900 block">Min Ticket Annual Gain</span>
                        <span className="text-xs font-black text-emerald-600 font-mono">
                          {minTicketAnnualGain > 0 ? `+₹ ${minTicketAnnualGain.toLocaleString('en-IN')}` : '₹ 0'}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Total: ₹ {minTicketTotalExit1Yr.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="p-2 bg-orange-50/60 rounded-xl border border-orange-100">
                        <span className="text-[9px] uppercase font-black text-orange-900 block">Total Min Ticket Slots</span>
                        <span className="text-xs font-black text-slate-900 font-mono">
                          {totalInvestorSlots > 0 ? `${totalInvestorSlots} Slots` : '—'}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          @ ₹ {minInvNum.toLocaleString('en-IN')} each
                        </span>
                      </div>

                      <div className="p-2 bg-orange-50/60 rounded-xl border border-orange-100">
                        <span className="text-[9px] uppercase font-black text-orange-900 block">Pool Annual Yield</span>
                        <span className="text-xs font-black text-orange-600 font-mono">
                          {totalPoolAnnualYield > 0 ? `₹ ${totalPoolAnnualYield.toLocaleString('en-IN')}` : '₹ 0'}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          @ {roiNum}% per annum
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Interactive Range Slider (Frozen for Min Investment) */}
                  {(() => {
                    const minTicketPct = totalValNum > 0 && minInvNum > 0 ? Math.min(100, Math.max(1, Math.round((minInvNum / totalValNum) * 100))) : 0;
                    const effectiveFundedPct = Math.max(Number(propertyForm.fundedPercentage) || 0, minTicketPct);

                    return (
                      <div className="pt-2 border-t border-orange-200/60 space-y-2">
                        <div className="flex justify-between items-center text-xs flex-wrap gap-2">
                          <span className="text-slate-700 font-bold">
                            Funded: <strong className="text-emerald-700">{effectiveFundedPct}%</strong> (₹ {Math.round(((Number(propertyForm.totalValuation) || 0) * effectiveFundedPct) / 100).toLocaleString('en-IN')})
                            {minTicketPct > 0 && (
                              <span className="ml-2 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/70 font-semibold">
                                Frozen Min: ≥ {minTicketPct}%
                              </span>
                            )}
                          </span>
                          <span className="text-orange-700 font-bold">
                            Remaining: <strong className="text-[#ea580c]">{Math.max(0, 100 - effectiveFundedPct)}%</strong> (₹ {Math.round(((Number(propertyForm.totalValuation) || 0) * Math.max(0, 100 - effectiveFundedPct)) / 100).toLocaleString('en-IN')})
                          </span>
                        </div>
                        <input
                          type="range"
                          min={minTicketPct}
                          max="100"
                          step={minTicketPct > 0 ? minTicketPct : 1}
                          value={effectiveFundedPct}
                          onChange={(e) => {
                            const rawPct = Number(e.target.value) || 0;
                            const pct = Math.max(rawPct, minTicketPct);
                            const total = Number(propertyForm.totalValuation) || 0;
                            const remainingVal = Math.max(0, total - Math.round((total * pct) / 100));
                            setPropertyForm((prev) => ({
                              ...prev,
                              fundedPercentage: pct,
                              price: total > 0 ? `₹ ${remainingVal.toLocaleString('en-IN')}` : prev.price,
                            }));
                          }}
                          className="w-full accent-[#ea580c] bg-orange-100 h-2 rounded-lg cursor-pointer"
                        />
                      </div>
                    );
                  })()}

                  {/* Co-Investors Pool Roster */}
                  <div className="pt-3 border-t border-orange-200/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <i className="ri-team-line text-[#ea580c]" /> Co-Investors Pool ({(propertyForm.investorsList || []).length})
                      </span>
                    </div>

                    {/* Investors Roster Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(propertyForm.investorsList || []).map((inv, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-2.5 shadow-2xs">
                          <div>
                            <span className="block text-xs font-black text-slate-900">{inv.name}</span>
                            <span className="text-[11px] text-slate-500">
                              Share: <strong className="text-emerald-600">{inv.sharePercentage}%</strong> ({inv.amount}) · {inv.date || 'Recent'}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeInvestor(idx)}
                            className="rounded-lg bg-red-50 hover:bg-red-500 hover:text-white text-red-600 p-1.5 transition cursor-pointer"
                            title="Remove Investor"
                          >
                            <i className="ri-delete-bin-line text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add Investor Row */}
                    <div className="rounded-xl border border-slate-200/80 bg-white p-3 space-y-2">
                      <span className="text-[10px] font-black uppercase text-slate-500 block">+ Add New Co-Investor</span>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="Investor Name"
                          value={newInvestorName}
                          onChange={(e) => setNewInvestorName(e.target.value)}
                          className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 outline-none border border-slate-200 focus:border-[#ea580c]"
                        />
                        <input
                          type="number"
                          placeholder="Share % (e.g. 30)"
                          value={newInvestorShare}
                          onChange={(e) => setNewInvestorShare(e.target.value)}
                          className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 outline-none border border-slate-200 focus:border-[#ea580c]"
                        />
                        <input
                          type="text"
                          placeholder="Amount (e.g. ₹25.5L)"
                          value={newInvestorAmount}
                          onChange={(e) => setNewInvestorAmount(e.target.value)}
                          className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 outline-none border border-slate-200 focus:border-[#ea580c]"
                        />
                        <button
                          type="button"
                          onClick={addInvestor}
                          className="rounded-lg bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-xs py-1.5 px-3 flex items-center justify-center gap-1 transition cursor-pointer shadow-2xs"
                        >
                          <i className="ri-user-add-line text-xs" />
                          <span>Add to Pool</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Scenario 2: Renovate & Flip Parameters */
                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 sm:p-5 space-y-3.5">
                  <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <i className="ri-home-gear-line text-amber-600" /> Scenario 2: Renovate & Flip Financials
                  </span>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Purchase Price (₹)</label>
                      <input
                        type="number"
                        name="purchasePrice"
                        value={propertyForm.purchasePrice}
                        onChange={changeProperty}
                        placeholder="e.g. 2000000"
                        className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Renovation Budget (₹)</label>
                      <input
                        type="number"
                        name="renovationCost"
                        value={propertyForm.renovationCost}
                        onChange={changeProperty}
                        placeholder="e.g. 200000"
                        className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200 focus:border-amber-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Est. Resale Target (₹)</label>
                      <input
                        type="number"
                        name="estimatedResale"
                        value={propertyForm.estimatedResale}
                        onChange={changeProperty}
                        placeholder="e.g. 2800000"
                        className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Flip Timeline</label>
                      <input
                        type="text"
                        name="flipTimeline"
                        value={propertyForm.flipTimeline}
                        onChange={changeProperty}
                        placeholder="e.g. 6 Months"
                        className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200 focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('specs')}
                  className="px-5 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-xl border border-orange-200 transition cursor-pointer"
                >
                  Next: Specifications & Specs →
                </button>
              </div>
            </div>
          )}

          {/* ════════════ TAB 2: SPECIFICATIONS & DIMENSIONS ════════════ */}
          {activeFormTab === 'specs' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Location Input */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5 space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
                      Location / Landmark Address <span className="text-[#ea580c]">*</span>
                    </label>
                    <input
                      required
                      name="location"
                      value={propertyForm.location}
                      onChange={changeProperty}
                      placeholder="e.g. Sector 150, Noida Expressway"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Google Maps Link / Coordinates</label>
                    <input
                      name="mapLocation"
                      value={propertyForm.mapLocation}
                      onChange={changeProperty}
                      placeholder="e.g. https://maps.google.com/..."
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c]"
                    />
                  </div>
                </div>
              </div>

              {/* Category-Specific Dimension Panels */}
              {propertyForm.propertyType === 'plot' ? (
                <div className="space-y-3.5 rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 sm:p-5">
                  <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <i className="ri-layout-grid-line text-amber-600" /> Plot & Land Dimension Specs
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <input name="plotAreaSqft" value={propertyForm.plotAreaSqft} onChange={changeProperty} placeholder="Plot Area (Sq.Ft)" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-amber-500" />
                    <input name="plotAreaSqm" value={propertyForm.plotAreaSqm} onChange={changeProperty} placeholder="Plot Area (Gaj)" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-amber-500" />
                    <input name="perSqftPrice" value={propertyForm.perSqftPrice} onChange={changeProperty} placeholder="Per Sq.Ft Rate (₹)" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-amber-500" />
                    <input name="ownership" value={propertyForm.ownership} onChange={changeProperty} placeholder="Registry (Freehold)" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-amber-500" />
                  </div>
                </div>
              ) : propertyForm.propertyType === 'commercial' ? (
                <div className="space-y-3.5 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-4 sm:p-5">
                  <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                    <i className="ri-store-2-line text-emerald-600" /> Commercial Shop & Office Specs
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <input name="builtUpArea" value={propertyForm.builtUpArea} onChange={changeProperty} placeholder="Built-Up Area (Sq.Ft)" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-emerald-500" />
                    <input name="carpetArea" value={propertyForm.carpetArea} onChange={changeProperty} placeholder="Carpet Area (Sq.Ft)" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-emerald-500" />
                    <input name="floor" value={propertyForm.floor} onChange={changeProperty} placeholder="Floor Location" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-emerald-500" />
                    <input name="washrooms" value={propertyForm.washrooms} onChange={changeProperty} placeholder="Washroom Facility" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-emerald-500" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5 rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4 sm:p-5">
                  <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                    <i className="ri-home-4-line text-blue-600" /> Residential Flat & Villa Specs
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    <select name="bhk" value={propertyForm.bhk} onChange={changeProperty} className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-blue-500">
                      <option value="1bhk">1 BHK Apartment</option>
                      <option value="2bhk">2 BHK Smart Residency</option>
                      <option value="3bhk">3 BHK Luxury Residency</option>
                      <option value="4bhk">4 BHK Premium Villa</option>
                    </select>
                    <input name="sizeSqft" value={propertyForm.sizeSqft} onChange={changeProperty} placeholder="Super Area (Sq.Ft)" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-blue-500" />
                    <input name="floor" value={propertyForm.floor} onChange={changeProperty} placeholder="Floor Level" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-blue-500" />
                    <input name="parking" value={propertyForm.parking} onChange={changeProperty} placeholder="Parking Slots" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-blue-500" />
                  </div>
                </div>
              )}

              {/* Highlights & Amenities */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Key Highlights (Comma-Separated)</label>
                  <input
                    name="highlights"
                    value={propertyForm.highlights}
                    onChange={changeProperty}
                    placeholder="e.g. Corner Plot, Near Metro Station, High Rental Demand"
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium outline-none border border-slate-200 focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Amenities (Comma-Separated)</label>
                  <input
                    name="amenities"
                    value={propertyForm.amenities}
                    onChange={changeProperty}
                    placeholder="e.g. 24x7 Security, Power Backup, Clubhouse, Swimming Pool"
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium outline-none border border-slate-200 focus:border-[#ea580c]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('financial')}
                  className="px-4 py-2.5 bg-white text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                >
                  ← Back: Financials
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFormTab('media')}
                  className="px-5 py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-xl border border-orange-200 transition cursor-pointer"
                >
                  Next: Media & Description →
                </button>
              </div>
            </div>
          )}

          {/* ════════════ TAB 3: MEDIA, VIDEO & BROCHURE ════════════ */}
          {activeFormTab === 'media' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Cover Image */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 space-y-2.5">
                <span className="text-xs font-black text-slate-900 block">Main Cover Photo *</span>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-orange-400 bg-slate-50/50 p-4 rounded-xl text-center transition cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLocalCoverUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <i className="ri-upload-cloud-2-line text-2xl text-[#ea580c]" />
                    <span className="text-xs font-bold text-slate-700">Click or Drag Cover Image</span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, WEBP from your computer</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">OR URL:</span>
                  <input
                    type="url"
                    name="image"
                    value={propertyForm.image}
                    onChange={changeProperty}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>

                {propertyForm.image && (
                  <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <img src={propertyForm.image} alt="Cover" className="h-12 w-16 rounded-lg object-cover border shrink-0" />
                    <span className="text-xs font-bold text-slate-800 flex-1 truncate">Cover Photo Uploaded</span>
                    <button
                      type="button"
                      onClick={() => setPropertyForm((prev) => ({ ...prev, image: '' }))}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    >
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </div>
                )}
              </div>

              {/* Gallery Photos */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 space-y-2.5">
                <span className="text-xs font-black text-slate-900 block">
                  Gallery Photos ({(propertyForm.images || []).length} attached)
                </span>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 p-4 rounded-xl text-center transition cursor-pointer group">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleLocalGalleryUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <i className="ri-image-add-line text-2xl text-blue-500" />
                    <span className="text-xs font-bold text-slate-700">Add Gallery Photos</span>
                    <span className="text-[10px] text-slate-400">Select multiple image files from your computer</span>
                  </div>
                </div>

                {(propertyForm.images || []).length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(propertyForm.images || []).map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Gallery ${idx}`} className="h-14 w-20 rounded-xl object-cover border" />
                        <button
                          type="button"
                          onClick={() => setPropertyForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xs text-xs cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Virtual Tour Video Link */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
                  Virtual Tour / Walkthrough Video URL (YouTube / MP4)
                </label>
                <input
                  name="videoUrl"
                  value={propertyForm.videoUrl}
                  onChange={changeProperty}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium outline-none border border-slate-200 focus:border-[#ea580c]"
                />
              </div>

              {/* PDF Brochure Upload */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 space-y-2.5">
                <span className="text-xs font-black text-slate-900 block">Project Brochure / PDF (Optional)</span>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-red-400 bg-slate-50/50 p-4 rounded-xl text-center transition cursor-pointer group">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 10 * 1024 * 1024) {
                        toast({ type: 'error', message: 'PDF must be under 10MB.' });
                        return;
                      }
                      setPropertyForm((prev) => ({
                        ...prev,
                        pdfUrl: URL.createObjectURL(file),
                      }));
                      toast({ type: 'success', message: 'PDF brochure uploaded!' });
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <i className="ri-file-pdf-2-line text-2xl text-red-500" />
                    <span className="text-xs font-bold text-slate-700">Click or Drag PDF Brochure</span>
                    <span className="text-[10px] text-slate-400">PDF up to 10MB — shown in property details</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase shrink-0">OR URL:</span>
                  <input
                    type="url"
                    name="pdfUrl"
                    value={propertyForm.pdfUrl}
                    onChange={changeProperty}
                    placeholder="https://your-server.com/brochure.pdf"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-red-400 font-mono"
                  />
                </div>

                {propertyForm.pdfUrl && (
                  <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-red-600 text-white">
                      <i className="fa-solid fa-file-pdf text-lg"></i>
                    </div>
                    <span className="text-xs font-bold text-slate-800 flex-1 truncate">PDF Attached</span>
                    <button
                      type="button"
                      onClick={() => setPropertyForm((prev) => ({ ...prev, pdfUrl: '' }))}
                      className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                    >
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-700 block mb-1">
                  Comprehensive Investment Thesis & Project Description
                </label>
                <textarea
                  rows={4}
                  name="description"
                  value={propertyForm.description}
                  onChange={changeProperty}
                  placeholder="Describe the asset valuation upside, rental yield projections, local infrastructure growth, and exit strategy for co-investors..."
                  className="w-full rounded-xl bg-slate-50 p-3 text-xs font-medium outline-none border border-slate-200 focus:border-[#ea580c] resize-none"
                />
              </div>

              <div className="pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('specs')}
                  className="px-4 py-2.5 bg-white text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                >
                  ← Back: Specifications
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? 'Publishing…' : '🚀 Publish Investment Project'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
