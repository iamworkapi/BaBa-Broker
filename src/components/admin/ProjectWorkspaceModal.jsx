import React, { useState } from 'react';
import AdminPageHeader from './AdminPageHeader';
import { rupeesInWords } from '../../utils/numberToWords';

export default function ProjectWorkspaceModal({
  view,
  editingId,
  closeModal,
  saveProperty,
  activeFormTab,
  setActiveFormTab,
  propertyForm,
  setPropertyForm,
  changeProperty,
  handleCoverImageChange,
  handleGalleryPhotosChange,
  handleVideoFileChange,
  triggerToast,
  newInvestorName,
  setNewInvestorName,
  newInvestorShare,
  setNewInvestorShare,
  newInvestorAmount,
  setNewInvestorAmount,
  newInvestorDate,
  setNewInvestorDate,
  addInvestor,
  removeInvestor,
  formatINR,
  setShowProjectModal,
}) {
  const [sellingPriceWords, setSellingPriceWords] = useState(() => rupeesInWords(propertyForm.price));

  const stepsList = view === 'featured'
    ? [
        { id: 'basic', step: '1', title: 'Direct Sale Specs', sub: 'Pricing & Dimensions', icon: 'ri-price-tag-3-line' },
        { id: 'media', step: '2', title: 'Photos & Video', sub: 'Gallery & Brochure', icon: 'ri-image-2-line' },
        { id: 'details', step: '3', title: 'Description', sub: 'Highlights & Tag', icon: 'ri-file-text-line' },
      ]
    : [
        { id: 'financial', step: '1', title: 'Financials & Pool', sub: 'Valuation & ROI', icon: 'ri-pie-chart-2-line' },
        { id: 'basic', step: '2', title: 'Property Specs', sub: 'Category & Details', icon: 'ri-building-line' },
        { id: 'media', step: '3', title: 'Photos & Video', sub: 'Gallery & Brochure', icon: 'ri-image-2-line' },
        { id: 'details', step: '4', title: 'Description', sub: 'Prospectus & Tag', icon: 'ri-file-text-line' },
      ];

  return (
    <div className="space-y-4 animate-fadeIn pb-8 max-w-7xl font-['Inter',sans-serif] text-slate-800 antialiased select-text">
      
      {/* ─── COMPACT PAGE HEADER ─── */}
      <AdminPageHeader
        badge="PROJECT WORKSPACE EDITOR"
        title={
          editingId
            ? view === 'featured'
              ? 'Edit Featured Hot Product'
              : 'Edit Investment Project'
            : view === 'featured'
            ? 'Create New Featured Hot Product'
            : 'Create New Investment Project'
        }
        subtitle={
          view === 'featured'
            ? 'Configure direct sale specifications, photos, and live site details.'
            : 'Configure investment pool financials, projected return rates, and investor rosters.'
        }
        icon={view === 'featured' ? 'ri-fire-line' : 'ri-equalizer-line'}
        iconColor={view === 'featured' ? 'text-amber-600' : 'text-orange-600'}
        iconBg={view === 'featured' ? 'bg-amber-50 border-amber-200/60' : 'bg-orange-50 border-orange-200/60'}
        breadcrumbs={[
          { label: 'Admin Workspace', link: '/admin/dashboard' },
          { label: view === 'featured' ? 'Featured Items' : 'Projects', link: view === 'featured' ? '/admin/featured' : '/admin/projects' },
          { label: editingId ? 'Edit Workspace' : 'Create Workspace' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveProperty}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 via-[#ea580c] to-amber-600 hover:brightness-110 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-orange-500/20 flex items-center gap-1.5 transition cursor-pointer"
            >
              <i className="ri-save-line text-xs" />
              <span>Save Project</span>
            </button>
          </div>
        }
      />

      {/* ─── MAIN WORKSPACE CARD ─── */}
      <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
        
        {/* ─── COMPACT STEPPER TAB BAR ─── */}
        <div className="border-b border-slate-100 bg-slate-50/60 px-4 py-3 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[550px] max-w-4xl mx-auto">
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
                    {/* Step Icon Badge */}
                    <div
                      className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-200 shrink-0 ${
                        isActive
                          ? 'bg-[#ea580c] text-white shadow-md shadow-orange-500/30 ring-2 ring-orange-200 scale-105'
                          : isCompleted
                          ? 'bg-emerald-500 text-white shadow-2xs'
                          : 'bg-white border border-slate-200 text-slate-400 group-hover:border-orange-300'
                      }`}
                    >
                      {isCompleted ? (
                        <i className="ri-check-line text-xs" />
                      ) : (
                        <i className={`${tab.icon} text-xs`} />
                      )}
                    </div>

                    {/* Step Labels */}
                    <div className="text-left">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider block leading-tight ${
                          isActive ? 'text-[#ea580c]' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                      >
                        Step {tab.step}
                      </span>
                      <span
                        className={`text-xs font-black block truncate max-w-[120px] ${
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
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* ════════════ TAB 1: FINANCIALS & INVESTMENT POOL ════════════ */}
          {activeFormTab === 'financial' && (
            <div className="space-y-4">
              
              {/* Project Title & Category Card */}
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
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
                      className="w-full rounded-xl bg-white pl-9 pr-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Display Valuation Text</label>
                    <input
                      name="price"
                      value={propertyForm.price}
                      onChange={changeProperty}
                      placeholder="e.g. ₹ 85,00,000"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c]"
                    />
                  </div>
                </div>
              </div>

              {/* Investment Deal Type Selection */}
              <div>
                <label className="text-[11px] font-extrabold text-slate-700 block mb-1.5">Investment Deal Model *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                        className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? 'border-[#ea580c] bg-orange-50/60 text-[#ea580c] shadow-2xs ring-2 ring-orange-500/20'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`h-7 w-7 rounded-xl flex items-center justify-center text-sm shrink-0 ${
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
                <div className="rounded-2xl border border-orange-200/80 bg-orange-50/30 p-4 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                      <i className="ri-pie-chart-2-fill text-[#ea580c]" /> Fractional Pool Parameters
                    </span>
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-100/80 px-2.5 py-0.5 rounded-full border border-orange-200">
                      Available Equity: {Math.max(0, 100 - (Number(propertyForm.fundedPercentage) || 0))}%
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Total Valuation (₹) *</label>
                      <input
                        required
                        type="number"
                        name="totalValuation"
                        value={propertyForm.totalValuation}
                        onChange={changeProperty}
                        placeholder="e.g. 8500000"
                        className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Min. Investment (₹) *</label>
                      <input
                        required
                        type="number"
                        name="minInvestment"
                        value={propertyForm.minInvestment}
                        onChange={changeProperty}
                        placeholder="e.g. 500000"
                        className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Target Annual ROI % *</label>
                      <input
                        required
                        type="number"
                        step="0.1"
                        name="expectedRoi"
                        value={propertyForm.expectedRoi}
                        onChange={changeProperty}
                        placeholder="e.g. 14.5"
                        className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c]"
                      />
                    </div>
                  </div>

                  {/* Interactive Range Slider */}
                  <div className="pt-2 border-t border-orange-200/60 space-y-2">
                    <div className="flex justify-between items-center text-xs flex-wrap gap-2">
                      <span className="text-slate-700 font-bold">
                        Funded: <strong className="text-emerald-700">{propertyForm.fundedPercentage || 0}%</strong> (₹ {Math.round(((Number(propertyForm.totalValuation) || 0) * (Number(propertyForm.fundedPercentage) || 0)) / 100).toLocaleString('en-IN')})
                      </span>
                      <span className="text-orange-700 font-bold">
                        Remaining: <strong className="text-[#ea580c]">{Math.max(0, 100 - (Number(propertyForm.fundedPercentage) || 0))}%</strong> (₹ {Math.round(((Number(propertyForm.totalValuation) || 0) * Math.max(0, 100 - (Number(propertyForm.fundedPercentage) || 0))) / 100).toLocaleString('en-IN')})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Number(propertyForm.fundedPercentage) || 0}
                      onChange={(e) => {
                        const pct = Number(e.target.value) || 0;
                        const total = Number(propertyForm.totalValuation) || 0;
                        const remainingVal = Math.max(0, total - Math.round((total * pct) / 100));
                        setPropertyForm((prev) => ({
                          ...prev,
                          fundedPercentage: pct,
                          price: total > 0 ? formatINR(remainingVal) : prev.price,
                        }));
                      }}
                      className="w-full accent-[#ea580c] bg-orange-100 h-2 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Co-Investors Pool Roster */}
                  <div className="pt-3 border-t border-orange-200/60 space-y-2.5">
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
                <div className="rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4 space-y-3">
                  <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <i className="ri-home-gear-line text-amber-600" /> Scenario 2: Renovate & Flip Financials
                  </span>

                  <div className="grid grid-cols-2 gap-3">
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

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Target Resale Price (₹)</label>
                      <input
                        type="number"
                        name="expectedSalePrice"
                        value={propertyForm.expectedSalePrice}
                        onChange={changeProperty}
                        placeholder="e.g. 2600000"
                        className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200 focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Holding Period (Months)</label>
                      <input
                        type="number"
                        name="holdingPeriodMonths"
                        value={propertyForm.holdingPeriodMonths}
                        onChange={changeProperty}
                        placeholder="e.g. 6"
                        className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200 focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════ TAB 2: PROPERTY SPECIFICATIONS ════════════ */}
          {activeFormTab === 'basic' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 space-y-3">
                <div>
                  <label className="text-[11px] font-extrabold text-slate-700 flex items-center gap-1 mb-1">
                    <span>Property Title <span className="text-[#ea580c]">*</span></span>
                  </label>
                  <input
                    required
                    name="title"
                    value={propertyForm.title}
                    onChange={changeProperty}
                    placeholder="e.g. Residential Plot on Yamuna Expressway, Jewar"
                    className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none border border-slate-200/90 focus:border-[#ea580c]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Selling Price *</label>
                    <input
                      required
                      name="price"
                      value={propertyForm.price}
                      onChange={changeProperty}
                      onBlur={(e) => setSellingPriceWords(rupeesInWords(e.target.value))}
                      placeholder="e.g. ₹ 40,00,000"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c]"
                    />
                    {sellingPriceWords && (
                      <span className="text-[10px] text-emerald-600 block mt-1 font-bold">{sellingPriceWords}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Location & Landmark *</label>
                    <input
                      required
                      name="location"
                      value={propertyForm.location}
                      onChange={changeProperty}
                      placeholder="e.g. Sector 62, Noida, Delhi NCR"
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Property Category *</label>
                    <select
                      name="propertyType"
                      value={propertyForm.propertyType}
                      onChange={changeProperty}
                      className="w-full rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none border border-slate-200/90 focus:border-[#ea580c] cursor-pointer"
                    >
                      <option value="residential">🏢 Residential Flat / Villa</option>
                      <option value="commercial">🏬 Commercial Shop / Office</option>
                      <option value="plot">🏞️ Plot / Land Property</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Category-Specific Dimension Panels */}
              {propertyForm.propertyType === 'plot' ? (
                <div className="space-y-3 rounded-2xl border border-amber-200/80 bg-amber-50/40 p-4">
                  <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                    <i className="ri-layout-grid-line text-amber-600" /> Plot & Land Dimension Specs
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <input name="plotAreaSqft" value={propertyForm.plotAreaSqft} onChange={changeProperty} placeholder="Plot Area (Sq.Ft)" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-amber-500" />
                    <input name="plotAreaSqm" value={propertyForm.plotAreaSqm} onChange={changeProperty} placeholder="Plot Area (Gaj)" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-amber-500" />
                    <input name="perSqftPrice" value={propertyForm.perSqftPrice} onChange={changeProperty} placeholder="Per Sq.Ft Rate (₹)" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-amber-500" />
                    <input name="ownership" value={propertyForm.ownership} onChange={changeProperty} placeholder="Registry (Freehold)" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-amber-500" />
                  </div>
                </div>
              ) : propertyForm.propertyType === 'commercial' ? (
                <div className="space-y-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-4">
                  <span className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                    <i className="ri-store-2-line text-emerald-600" /> Commercial Shop & Office Specs
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <input name="builtUpArea" value={propertyForm.builtUpArea} onChange={changeProperty} placeholder="Built-Up Area (Sq.Ft)" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-emerald-500" />
                    <input name="carpetArea" value={propertyForm.carpetArea} onChange={changeProperty} placeholder="Carpet Area (Sq.Ft)" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-emerald-500" />
                    <input name="floor" value={propertyForm.floor} onChange={changeProperty} placeholder="Floor Location" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-emerald-500" />
                    <input name="washrooms" value={propertyForm.washrooms} onChange={changeProperty} placeholder="Washroom Facility" className="rounded-xl bg-white px-3 py-2 text-xs outline-none border border-slate-200 focus:border-emerald-500" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 rounded-2xl border border-blue-200/80 bg-blue-50/40 p-4">
                  <span className="text-xs font-black text-blue-900 flex items-center gap-1.5">
                    <i className="ri-home-4-line text-blue-600" /> Residential Flat & Villa Specs
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            </div>
          )}

          {/* ════════════ TAB 3: MEDIA, VIDEO & BROCHURE ════════════ */}
          {activeFormTab === 'media' && (
            <div className="space-y-4">
              {/* Cover Image */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-2">
                <span className="text-xs font-black text-slate-900 block">Main Cover Photo *</span>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-orange-400 bg-slate-50/50 p-4 rounded-xl text-center transition cursor-pointer group">
                  <input type="file" accept="image/*" onChange={handleCoverImageChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                  <div className="flex flex-col items-center gap-1">
                    <i className="ri-upload-cloud-2-line text-2xl text-[#ea580c]" />
                    <span className="text-xs font-bold text-slate-700">Click or Drag Cover Image</span>
                    <span className="text-[10px] text-slate-400">JPG, PNG, WEBP up to 10MB</span>
                  </div>
                </div>

                {propertyForm.image && (
                  <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <img src={propertyForm.image} alt="Cover" className="h-12 w-16 rounded-lg object-cover border shrink-0" />
                    <span className="text-xs font-bold text-slate-800 flex-1 truncate">Cover Photo Uploaded</span>
                    <button type="button" onClick={() => setPropertyForm((prev) => ({ ...prev, image: '' }))} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                      <i className="ri-delete-bin-line text-sm" />
                    </button>
                  </div>
                )}
              </div>

              {/* Gallery Photos */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-2">
                <span className="text-xs font-black text-slate-900 block">Gallery Photos ({(propertyForm.images || []).length} attached)</span>
                <div className="relative border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 p-4 rounded-xl text-center transition cursor-pointer group">
                  <input type="file" accept="image/*" multiple onChange={handleGalleryPhotosChange} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                  <div className="flex flex-col items-center gap-1">
                    <i className="ri-image-add-line text-2xl text-blue-500" />
                    <span className="text-xs font-bold text-slate-700">Add Gallery Photos</span>
                    <span className="text-[10px] text-slate-400">Select multiple image files</span>
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
                          className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-xs text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Video & PDF Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 space-y-1.5">
                  <label className="text-xs font-black text-slate-900 block">Video Presentation (YouTube URL)</label>
                  <input
                    name="videoUrl"
                    value={propertyForm.videoUrl && propertyForm.videoUrl.startsWith('data:') ? '' : (propertyForm.videoUrl || '')}
                    onChange={changeProperty}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium outline-none border border-slate-200 focus:border-[#ea580c]"
                  />
                </div>

                <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 space-y-1.5">
                  <label className="text-xs font-black text-slate-900 block">PDF Brochure Link</label>
                  <input
                    name="pdfUrl"
                    value={propertyForm.pdfUrl && propertyForm.pdfUrl.startsWith('data:') ? '' : (propertyForm.pdfUrl || '')}
                    onChange={changeProperty}
                    placeholder="https://domain.com/brochure.pdf"
                    className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium outline-none border border-slate-200 focus:border-[#ea580c]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ════════════ TAB 4: DESCRIPTION & TAGS ════════════ */}
          {activeFormTab === 'details' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Project Badge / Highlight Tag</label>
                <input
                  name="tag"
                  value={propertyForm.tag}
                  onChange={changeProperty}
                  placeholder="e.g. 2BHK | Net Profit +₹4.0L"
                  className="w-full rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-800 outline-none border border-slate-200 focus:border-[#ea580c]"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-700 block mb-1">Detailed Description *</label>
                <textarea
                  required
                  name="description"
                  value={propertyForm.description}
                  onChange={changeProperty}
                  rows="6"
                  placeholder="Enter detailed project description, terms & highlights..."
                  className="w-full rounded-xl bg-slate-50 p-3 text-xs text-slate-800 leading-relaxed outline-none border border-slate-200 focus:border-[#ea580c]"
                />
              </div>
            </div>
          )}

          {/* ─── FOOTER CONTROLS ─── */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => setShowProjectModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 transition cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              {activeFormTab !== 'financial' && activeFormTab !== stepsList[0].id && (
                <button
                  type="button"
                  onClick={() => {
                    const idx = stepsList.findIndex((t) => t.id === activeFormTab);
                    if (idx > 0) setActiveFormTab(stepsList[idx - 1].id);
                  }}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  ← Previous Step
                </button>
              )}

              {activeFormTab !== stepsList[stepsList.length - 1].id ? (
                <button
                  type="button"
                  onClick={() => {
                    const idx = stepsList.findIndex((t) => t.id === activeFormTab);
                    if (idx < stepsList.length - 1) setActiveFormTab(stepsList[idx + 1].id);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-xs font-bold text-white shadow-md shadow-orange-500/20 transition cursor-pointer"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={saveProperty}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 via-[#ea580c] to-amber-600 text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 hover:brightness-110 transition cursor-pointer"
                >
                  {editingId ? 'Update Investment Project' : 'Publish Investment Project'}
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
