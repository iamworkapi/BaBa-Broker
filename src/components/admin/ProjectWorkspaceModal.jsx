import React, { useState } from 'react';
import AdminPageHeader from './AdminPageHeader';
import { rupeesInWords } from '../../lib/numberToWords';

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

  return (
    <div className="space-y-4 animate-fadeIn pb-12">
      {/* Page Top Header Bar */}
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
        icon={view === 'featured' ? 'fa-solid fa-fire' : 'fa-solid fa-sliders'}
        iconColor={view === 'featured' ? 'text-amber-400' : 'text-orange-400'}
        iconBg={view === 'featured' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-orange-500/10 border-orange-500/20'}
        breadcrumbs={[
          { label: 'Admin Workspace', link: '/admin/dashboard' },
          { label: view === 'featured' ? 'Featured Items' : 'Projects', link: view === 'featured' ? '/admin/featured' : '/admin/projects' },
          { label: editingId ? 'Edit Workspace' : 'Create Workspace' }
        ]}
        actions={
          <>
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={saveProperty}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-xs font-bold uppercase tracking-wide text-white shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <i className="fa-solid fa-floppy-disk text-xs"></i> Save Project
            </button>
          </>
        }
      />

      {/* Dedicated Page Workspace Container */}
      <div className="space-y-4">

        <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-xl overflow-hidden">
          {/* Step-by-Step Dotted Link Stepper Tabbing */}
          <div className="border-b border-slate-800 bg-slate-950/95 p-4 sm:p-5 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[650px] max-w-4xl mx-auto px-4">
              {(view === 'featured'
                ? [
                    { id: 'basic', step: '1', title: 'Direct Sale Specs', sub: 'Pricing & Dimensions', icon: 'fa-tag' },
                    { id: 'media', step: '2', title: 'Photos & Video', sub: 'Gallery & Brochure', icon: 'fa-photo-film' },
                    { id: 'details', step: '3', title: 'Description', sub: 'Highlights & Tag', icon: 'fa-align-left' },
                  ]
                : [
                    { id: 'financial', step: '1', title: 'Financials & Pool', sub: 'Valuation & ROI', icon: 'fa-chart-pie' },
                    { id: 'basic', step: '2', title: 'Property Specs', sub: 'Category & Details', icon: 'fa-sliders' },
                    { id: 'media', step: '3', title: 'Photos & Video', sub: 'Gallery & Brochure', icon: 'fa-photo-film' },
                    { id: 'details', step: '4', title: 'Description', sub: 'Prospectus & Tag', icon: 'fa-align-left' },
                  ]
              ).map((tab, idx, arr) => {
                const isActive = activeFormTab === tab.id;
                const tabOrder = arr.findIndex((t) => t.id === activeFormTab);
                const isCompleted = idx < tabOrder;

                return (
                  <React.Fragment key={tab.id}>
                    {/* Dotted Connecting Line before each step (except 1st) */}
                    {idx > 0 && (
                      <div className="flex-1 px-2 flex items-center">
                        <div
                          className={`w-full border-t-2 border-dashed transition-all duration-300 ${
                            isCompleted || isActive
                              ? 'border-orange-500/80 shadow-orange-500/20'
                              : 'border-slate-800'
                          }`}
                        ></div>
                      </div>
                    )}

                    {/* Step Item Button */}
                    <button
                      type="button"
                      onClick={() => setActiveFormTab(tab.id)}
                      className="group flex items-center gap-3 cursor-pointer focus:outline-none shrink-0"
                    >
                      {/* Step Number Circle */}
                      <div
                        className={`relative h-10 w-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 group-hover:scale-105 shrink-0 ${
                          isActive
                            ? 'bg-gradient-to-tr from-orange-500 to-amber-400 text-slate-950 shadow-lg shadow-orange-500/30 ring-4 ring-orange-500/20'
                            : isCompleted
                            ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 group-hover:border-slate-700'
                        }`}
                      >
                        {isCompleted ? (
                          <i className="fa-solid fa-check text-xs"></i>
                        ) : (
                          <i className={`fa-solid ${tab.icon} text-xs`}></i>
                        )}
                      </div>

                      {/* Step Labels */}
                      <div className="text-left">
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider block leading-tight ${
                            isActive
                              ? 'text-orange-400'
                              : isCompleted
                              ? 'text-emerald-400'
                              : 'text-slate-400'
                          }`}
                        >
                          Step {tab.step}
                        </span>
                        <span
                          className={`text-xs font-bold block truncate max-w-[130px] ${
                            isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'
                          }`}
                        >
                          {tab.title}
                        </span>
                        <span className="text-[9px] text-slate-400 block font-normal truncate max-w-[120px]">
                          {tab.sub}
                        </span>
                      </div>
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Form Workspace Body */}
          <div className="p-4 sm:p-6 space-y-4 font-normal">
            {/* TAB 1: INVESTMENT FINANCIALS & POOL (ONLY FOR INVESTMENT PROJECTS) */}
            {activeFormTab === 'financial' && (
              <div className="space-y-4 font-normal">
                {/* Top Title & Category Bar */}
                <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <label className="block text-xs font-medium text-slate-300">
                    Project Title *
                    <input
                      required
                      name="title"
                      value={propertyForm.title}
                      onChange={changeProperty}
                      placeholder="e.g. Luxury 3BHK Smart Residency Co-Investment"
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white outline-none focus:border-orange-500 font-normal"
                    />
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="block text-xs font-medium text-slate-300">
                      Project Status *
                      <select
                        name="status"
                        value={propertyForm.status}
                        onChange={changeProperty}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white font-normal"
                      >
                        <option value="running">🚀 Running (Ongoing)</option>
                        <option value="upcoming">⏳ Upcoming Launch</option>
                        <option value="delivered">✅ Delivered Project</option>
                      </select>
                    </label>

                    <label className="block text-xs font-medium text-slate-300">
                      Property Category *
                      <select
                        name="propertyType"
                        value={propertyForm.propertyType}
                        onChange={changeProperty}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white font-normal"
                      >
                        <option value="residential">🏢 Residential</option>
                        <option value="commercial">🏬 Commercial</option>
                        <option value="plot">🏞️ Plot / Land</option>
                      </select>
                    </label>

                    <label className="block text-xs font-medium text-slate-300">
                      Display Valuation Text
                      <input
                        name="price"
                        value={propertyForm.price}
                        onChange={changeProperty}
                        placeholder="e.g. ₹ 85,00,000"
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2 text-xs text-white font-normal"
                      />
                    </label>
                  </div>
                </div>

                <label className="block text-xs font-medium text-slate-300">
                  Investment Deal Type *
                  <select
                    name="investmentModel"
                    value={propertyForm.investmentModel}
                    onChange={changeProperty}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-normal"
                  >
                    <option value="co_investment">Scenario 1: Fractional Co-Investment Pool</option>
                    <option value="renovate_flip">Scenario 2: Renovate & Flip Deal</option>
                  </select>
                </label>

                {propertyForm.investmentModel === 'renovate_flip' ? (
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                    <h4 className="text-xs font-medium uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-house-circle-check text-xs"></i> Scenario 2 Parameters (Buy, Renovate & Flip)
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block text-xs font-medium text-slate-300">
                        Purchase Price (₹)
                        <input
                          type="number"
                          name="purchasePrice"
                          value={propertyForm.purchasePrice}
                          onChange={changeProperty}
                          placeholder="e.g. 2000000"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white font-normal"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Renovation Cost Budget (₹)
                        <input
                          type="number"
                          name="renovationCost"
                          value={propertyForm.renovationCost}
                          onChange={changeProperty}
                          placeholder="e.g. 200000"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white font-normal"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="block text-xs font-medium text-slate-300">
                        Target Resale Price (₹)
                        <input
                          type="number"
                          name="expectedSalePrice"
                          value={propertyForm.expectedSalePrice}
                          onChange={changeProperty}
                          placeholder="e.g. 2600000"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white font-normal"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Holding Period (Months)
                        <input
                          type="number"
                          name="holdingPeriodMonths"
                          value={propertyForm.holdingPeriodMonths}
                          onChange={changeProperty}
                          placeholder="e.g. 6"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2 text-xs text-white font-normal"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4 space-y-4 font-normal">
                    <h4 className="text-xs font-medium uppercase tracking-wider text-orange-400 flex items-center justify-between flex-wrap gap-2">
                      <span className="flex items-center gap-1.5">
                        <i className="fa-solid fa-chart-pie text-xs"></i> Scenario 1 Parameters (Fractional Co-Investment)
                      </span>
                      <span className="text-[11px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                        Remaining Available Equity: {Math.max(0, 100 - (Number(propertyForm.fundedPercentage) || 0))}%
                        {Number(propertyForm.totalValuation) > 0 && (
                          <span className="ml-1 text-orange-300">
                            (₹ {Math.round(((Number(propertyForm.totalValuation) || 0) * Math.max(0, 100 - (Number(propertyForm.fundedPercentage) || 0))) / 100).toLocaleString('en-IN')})
                          </span>
                        )}
                      </span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="block text-xs font-medium text-slate-300">
                        Total Valuation (₹) *
                        <input
                          required
                          type="number"
                          name="totalValuation"
                          value={propertyForm.totalValuation}
                          onChange={changeProperty}
                          placeholder="e.g. 8500000"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-semibold outline-none focus:border-orange-500"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Min. Investment Amount (₹) *
                        <input
                          required
                          type="number"
                          name="minInvestment"
                          value={propertyForm.minInvestment}
                          onChange={changeProperty}
                          placeholder="e.g. 500000"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-normal outline-none focus:border-orange-500"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Target Annual ROI % *
                        <input
                          required
                          type="number"
                          step="0.1"
                          name="expectedRoi"
                          value={propertyForm.expectedRoi}
                          onChange={changeProperty}
                          placeholder="e.g. 14.5"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-normal outline-none focus:border-orange-500"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <label className="block text-xs font-medium text-slate-300">
                        Funded Percentage (%)
                        <input
                          type="number"
                          min="0"
                          max="100"
                          name="fundedPercentage"
                          value={propertyForm.fundedPercentage}
                          onChange={changeProperty}
                          placeholder="e.g. 60"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-normal outline-none focus:border-orange-500"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Funded Amount (₹)
                        <input
                          type="number"
                          value={Math.round(((Number(propertyForm.totalValuation) || 0) * (Number(propertyForm.fundedPercentage) || 0)) / 100)}
                          onChange={(e) => {
                            const amt = Number(e.target.value) || 0;
                            const total = Number(propertyForm.totalValuation) || 0;
                            if (total > 0) {
                              const pct = Math.min(100, Math.max(0, Math.round((amt / total) * 100)));
                              const remainingVal = Math.max(0, total - amt);
                              setPropertyForm((prev) => ({
                                ...prev,
                                fundedPercentage: pct,
                                price: formatINR(remainingVal)
                              }));
                            }
                          }}
                          placeholder="e.g. 5100000"
                          className="mt-1 w-full rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-2.5 text-xs text-emerald-300 font-medium outline-none focus:border-emerald-500"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Display Valuation Text
                        <input
                          name="price"
                          value={propertyForm.price}
                          onChange={changeProperty}
                          placeholder="e.g. ₹ 34,00,000"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-normal outline-none focus:border-orange-500"
                        />
                      </label>
                    </div>

                    {/* Interactive Range Slider */}
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <div className="flex justify-between items-center text-[11px] flex-wrap gap-2">
                        <span className="text-slate-300 font-medium">
                          Funded: <strong className="text-emerald-400">{propertyForm.fundedPercentage || 0}%</strong> (₹ {Math.round(((Number(propertyForm.totalValuation) || 0) * (Number(propertyForm.fundedPercentage) || 0)) / 100).toLocaleString('en-IN')})
                        </span>
                        <span className="text-amber-400 font-medium">
                          Remaining Available Equity: <strong className="text-orange-400">{Math.max(0, 100 - (Number(propertyForm.fundedPercentage) || 0))}%</strong> (₹ {Math.round(((Number(propertyForm.totalValuation) || 0) * Math.max(0, 100 - (Number(propertyForm.fundedPercentage) || 0))) / 100).toLocaleString('en-IN')})
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
                          const fundedAmt = Math.round((total * pct) / 100);
                          const remainingVal = Math.max(0, total - fundedAmt);
                          setPropertyForm((prev) => ({
                            ...prev,
                            fundedPercentage: pct,
                            price: total > 0 ? formatINR(remainingVal) : prev.price
                          }));
                        }}
                        className="w-full accent-orange-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Co-Investors Pool Management */}
                    <div className="pt-4 border-t border-slate-800/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                          <i className="fa-solid fa-users text-xs"></i> Manage Co-Investors Pool
                        </h4>
                        <span className="text-[11px] font-bold text-slate-300">
                          Active Investors: <strong className="text-amber-400">{(propertyForm.investorsList || []).length}</strong>
                        </span>
                      </div>

                      {/* Existing Investors Roster Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(propertyForm.investorsList || []).map((inv, idx) => (
                          <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-3 shadow-md">
                            <div>
                              <span className="block text-xs font-bold text-white flex items-center gap-1.5">
                                <i className="fa-solid fa-user-tie text-blue-400 text-xs"></i> {inv.name}
                              </span>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                Share: <strong className="text-emerald-400">{inv.sharePercentage}%</strong> ({inv.amount}) · {inv.date}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeInvestor(idx)}
                              className="rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-1.5 transition-colors cursor-pointer"
                              title="Remove Investor"
                            >
                              <i className="fa-solid fa-trash-can text-xs"></i>
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add New Investor Form Bar */}
                      <div className="rounded-xl border border-slate-800/80 bg-slate-950 p-3 space-y-2">
                        <span className="block text-[11px] font-bold uppercase text-slate-400">
                          + Add New Co-Investor
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                          <input
                            type="text"
                            placeholder="Investor Name"
                            value={newInvestorName}
                            onChange={(e) => setNewInvestorName(e.target.value)}
                            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-white outline-none focus:border-orange-500 font-normal"
                          />
                          <input
                            type="number"
                            placeholder="Share % (e.g. 30)"
                            value={newInvestorShare}
                            onChange={(e) => setNewInvestorShare(e.target.value)}
                            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-white outline-none focus:border-orange-500 font-normal"
                          />
                          <input
                            type="text"
                            placeholder="Amount (e.g. ₹25.5L)"
                            value={newInvestorAmount}
                            onChange={(e) => setNewInvestorAmount(e.target.value)}
                            className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-white outline-none focus:border-orange-500 font-normal"
                          />
                          <button
                            type="button"
                            onClick={addInvestor}
                            className="rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs p-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                          >
                            <i className="fa-solid fa-plus text-xs"></i> Add Investor
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PRODUCT PRICING & SPECIFICATIONS */}
            {activeFormTab === 'basic' && (
              <div className="space-y-4">
                {/* Top Basic Info & Pricing Bar */}
                <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <label className="block text-xs font-bold text-white">
                    Hot Product / Project Title *
                    <input
                      required
                      name="title"
                      value={propertyForm.title}
                      onChange={changeProperty}
                      placeholder="e.g. Residential Plot on Yamuna Expressway, Jewar"
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white outline-none focus:border-orange-500 font-normal"
                    />
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="block text-xs font-medium text-slate-300">
                      Total Selling Price *
                      <input
                        required
                        name="price"
                        value={propertyForm.price}
                        onChange={changeProperty}
                        onBlur={(e) => setSellingPriceWords(rupeesInWords(e.target.value))}
                        placeholder="e.g. ₹ 40,00,000"
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white outline-none focus:border-orange-500 font-normal"
                      />
                      {sellingPriceWords ? (
                        <span className="text-[10px] text-emerald-400 block mt-1 font-medium">{sellingPriceWords}</span>
                      ) : (
                        <span className="text-[10px] text-slate-400 block mt-1 font-normal">(Total Selling Price)</span>
                      )}
                    </label>

                    <label className="block text-xs font-medium text-slate-300">
                      Location & Landmark *
                      <div className="relative mt-1">
                        <i className="fa-solid fa-location-dot absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 text-xs"></i>
                        <input
                          required
                          name="location"
                          value={propertyForm.location}
                          onChange={changeProperty}
                          placeholder="e.g. Sector 62, Noida, Delhi NCR"
                          className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-8 pr-3 py-2.5 text-xs text-white outline-none focus:border-orange-500 font-normal"
                        />
                      </div>
                    </label>

                    <label className="block text-xs font-medium text-slate-300">
                      Property Category *
                      <select
                        name="propertyType"
                        value={propertyForm.propertyType}
                        onChange={changeProperty}
                        className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-white font-normal"
                      >
                        <option value="residential">🏢 Residential Flat / Villa</option>
                        <option value="commercial">🏬 Commercial Shop / Office</option>
                        <option value="plot">🏞️ Plot / Land Property</option>
                      </select>
                    </label>
                  </div>
                </div>

                {/* CATEGORY SPECIFIC INPUT PANELS */}
                {propertyForm.propertyType === 'plot' ? (
                  <div className="space-y-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-vector-square text-xs"></i> Plot & Land Dimension Specs
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <label className="block text-xs font-medium text-slate-300">
                        Plot Area (Sq.Ft)
                        <input
                          name="plotAreaSqft"
                          value={propertyForm.plotAreaSqft}
                          onChange={changeProperty}
                          placeholder="e.g. 1800"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-amber-500 font-normal"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Plot Area (Sq.Yards / Gaj)
                        <input
                          name="plotAreaSqm"
                          value={propertyForm.plotAreaSqm}
                          onChange={changeProperty}
                          placeholder="e.g. 200 Gaj"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-amber-500 font-normal"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Per Sq.Ft Rate (₹)
                        <input
                          name="perSqftPrice"
                          value={propertyForm.perSqftPrice}
                          onChange={changeProperty}
                          placeholder="e.g. ₹ 4,500 / sqft"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-amber-500 font-normal"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Plot Facing Direction
                        <select
                          name="facing"
                          value={propertyForm.facing}
                          onChange={changeProperty}
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-normal"
                        >
                          <option value="">Select Facing</option>
                          <option value="East">East Facing (Vaastu Compliant)</option>
                          <option value="North">North Facing</option>
                          <option value="North-East">North-East Facing</option>
                          <option value="West">West Facing</option>
                          <option value="South">South Facing</option>
                        </select>
                      </label>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <label className="block text-xs font-medium text-slate-300">
                        Road Width Facing Plot
                        <input
                          name="roadWidthFeet"
                          value={propertyForm.roadWidthFeet}
                          onChange={changeProperty}
                          placeholder="e.g. 40 Feet Wide Road"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-amber-500 font-normal"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Gated Society?
                        <select
                          name="gatedSociety"
                          value={propertyForm.gatedSociety}
                          onChange={changeProperty}
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-normal"
                        >
                          <option value="YES">YES — 24/7 Gated Security</option>
                          <option value="NO">NO — Open Sector / Colony</option>
                        </select>
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Boundary Wall Constructed?
                        <select
                          name="boundaryWall"
                          value={propertyForm.boundaryWall}
                          onChange={changeProperty}
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-normal"
                        >
                          <option value="YES">YES — Constructed</option>
                          <option value="NO">NO — Open Boundary</option>
                        </select>
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Ownership Registry
                        <input
                          name="ownership"
                          value={propertyForm.ownership}
                          onChange={changeProperty}
                          placeholder="e.g. Freehold / Authority Allotted"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-amber-500 font-normal"
                        />
                      </label>
                    </div>
                  </div>
                ) : propertyForm.propertyType === 'commercial' ? (
                  <div className="space-y-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-store text-xs"></i> Commercial Space & Shop Specifications
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <label className="block text-xs font-medium text-slate-300">
                        Built-Up Area (Sq.Ft)
                        <input
                          name="builtUpArea"
                          value={propertyForm.builtUpArea}
                          onChange={changeProperty}
                          placeholder="e.g. 650 sqft"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500 font-normal"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Carpet Area (Sq.Ft)
                        <input
                          name="carpetArea"
                          value={propertyForm.carpetArea}
                          onChange={changeProperty}
                          placeholder="e.g. 480 sqft"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500 font-normal"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Floor Location
                        <input
                          name="floor"
                          value={propertyForm.floor}
                          onChange={changeProperty}
                          placeholder="e.g. Ground Floor Shop"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500 font-normal"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Washroom Facilities
                        <input
                          name="washrooms"
                          value={propertyForm.washrooms}
                          onChange={changeProperty}
                          placeholder="e.g. 1 Private + Public Complex"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-emerald-500 font-normal"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-house-chimney text-xs"></i> Residential Flat & Villa Specifications
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <label className="block text-xs font-medium text-slate-300">
                        BHK Configuration
                        <select
                          name="bhk"
                          value={propertyForm.bhk}
                          onChange={changeProperty}
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-normal"
                        >
                          <option value="1bhk">1 BHK Apartment</option>
                          <option value="2bhk">2 BHK Smart Residency</option>
                          <option value="3bhk">3 BHK Luxury Residency</option>
                          <option value="4bhk">4 BHK Premium Villa / Penthouse</option>
                        </select>
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Carpet / Super Area
                        <input
                          name="sizeSqft"
                          value={propertyForm.sizeSqft}
                          onChange={changeProperty}
                          placeholder="e.g. 1450 sqft"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500 font-normal"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Floor Number
                        <input
                          name="floor"
                          value={propertyForm.floor}
                          onChange={changeProperty}
                          placeholder="e.g. 7th Floor (of 14)"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500 font-normal"
                        />
                      </label>

                      <label className="block text-xs font-medium text-slate-300">
                        Parking Allocated
                        <input
                          name="parking"
                          value={propertyForm.parking}
                          onChange={changeProperty}
                          placeholder="e.g. 1 Covered Car + Bike"
                          className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-blue-500 font-normal"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Highlights & Amenities Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block text-xs font-medium text-slate-300">
                    Key Highlights (Comma-Separated)
                    <input
                      name="highlights"
                      value={propertyForm.highlights}
                      onChange={changeProperty}
                      placeholder="e.g. Corner Plot, Near Metro Station, High Rental Demand"
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-orange-500 font-normal"
                    />
                  </label>

                  <label className="block text-xs font-medium text-slate-300">
                    Amenities (Comma-Separated)
                    <input
                      name="amenities"
                      value={propertyForm.amenities}
                      onChange={changeProperty}
                      placeholder="e.g. 24x7 Security, Power Backup, Clubhouse, Swimming Pool"
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white outline-none focus:border-orange-500 font-normal"
                    />
                  </label>
                </div>
              </div>
            )}

            {/* TAB 3: PHOTOS, VIDEO & BROCHURE */}
            {activeFormTab === 'media' && (
              <div className="space-y-4">
                {/* 1. Main Cover Image Dropzone */}
                <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                      <i className="fa-solid fa-image text-orange-400"></i> Main Cover Photo *
                    </label>
                    <span className="text-[10px] text-slate-400 font-normal">Shown as primary thumbnail on live card</span>
                  </div>

                  {/* Drag & Drop Cover Image Upload Area */}
                  <div className="relative border-2 border-dashed border-slate-800 hover:border-orange-500/60 bg-slate-900/60 hover:bg-slate-900 p-4 rounded-2xl text-center transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5 py-2">
                      <div className="h-10 w-10 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-cloud-arrow-up text-lg"></i>
                      </div>
                      <p className="text-xs font-semibold text-white">Click or Drag & Drop Cover Photo here</p>
                      <p className="text-[10px] text-slate-400">Supports JPG, PNG, WEBP files up to 10MB</p>
                    </div>
                  </div>

                  {/* Cover Image Preview Card if loaded */}
                  {propertyForm.image && (
                    <div className="relative mt-2 flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 p-2.5">
                      <img src={propertyForm.image} alt="Cover Preview" className="h-14 w-20 rounded-lg object-cover border border-slate-800 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full inline-block mb-1">
                          {propertyForm.image.startsWith('data:') ? '📁 Uploaded File' : '🌐 Image URL'}
                        </span>
                        <p className="text-xs font-semibold text-white truncate">Main Property Cover Photo</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPropertyForm((prev) => ({ ...prev, image: '' }))}
                        className="rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white p-2 transition-colors shrink-0 cursor-pointer"
                        title="Remove Cover Photo"
                      >
                        <i className="fa-solid fa-trash-can text-xs"></i>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Gallery Photos Upload Dropzone */}
                <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                      <i className="fa-solid fa-images text-blue-400"></i> Gallery Photos (Multiple Files)
                    </label>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {(propertyForm.images || []).length} photos attached
                    </span>
                  </div>

                  <div className="relative border-2 border-dashed border-slate-800 hover:border-blue-500/60 bg-slate-900/60 hover:bg-slate-900 p-4 rounded-2xl text-center transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryPhotosChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <div className="flex flex-col items-center justify-center gap-1.5 py-2">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-photo-film text-lg"></i>
                      </div>
                      <p className="text-xs font-semibold text-white">Click or Drag & Drop Multiple Gallery Photos</p>
                      <p className="text-[10px] text-slate-400">Select multiple files at once</p>
                    </div>
                  </div>

                  {/* Gallery Thumbnails List */}
                  {(propertyForm.images || []).length > 0 && (
                    <div className="flex flex-wrap gap-2.5 pt-2">
                      {(propertyForm.images || []).map((img, idx) => (
                        <div key={idx} className="relative group/thumb shrink-0">
                          <img src={img} alt={`Gallery ${idx}`} className="h-16 w-24 rounded-xl object-cover border border-slate-800" />
                          <button
                            type="button"
                            onClick={() =>
                              setPropertyForm((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== idx),
                              }))
                            }
                            className="absolute -top-1.5 -right-1.5 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-90 hover:opacity-100 shadow-md text-[10px] cursor-pointer"
                            title="Remove Photo"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Video Upload & Presentation Link */}
                <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                      <i className="fa-solid fa-video text-red-400"></i> Video Presentation
                    </label>
                    <span className="text-[10px] text-slate-400 font-normal">MP4 Upload or YouTube Link</span>
                  </div>

                  <div className="relative border-2 border-dashed border-slate-800 hover:border-red-500/60 bg-slate-900/60 hover:bg-slate-900 p-3 rounded-xl text-center transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <div className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-file-video text-red-400 text-base"></i>
                      <span className="text-xs font-semibold text-white">Upload Video File (.mp4, .mov)</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] text-slate-400 font-medium">
                      Or Paste YouTube Embed / Video Web Link:
                    </label>
                    <div className="relative">
                      <i className="fa-solid fa-link absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                      <input
                        name="videoUrl"
                        value={propertyForm.videoUrl && propertyForm.videoUrl.startsWith('data:') ? '' : (propertyForm.videoUrl || '')}
                        onChange={changeProperty}
                        placeholder={propertyForm.videoUrl && propertyForm.videoUrl.startsWith('data:') ? '🎥 Uploaded video file attached' : 'e.g. https://www.youtube.com/watch?v=...'}
                        className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-red-500 font-normal"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. PDF Brochure Upload */}
                <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-white flex items-center gap-1.5">
                      <i className="fa-solid fa-file-pdf text-amber-400"></i> Project PDF Brochure
                    </label>
                    <span className="text-[10px] text-slate-400 font-normal">Brochure link or PDF upload</span>
                  </div>

                  <div className="relative">
                    <i className="fa-solid fa-file-arrow-up absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 text-xs"></i>
                    <input
                      name="pdfUrl"
                      value={propertyForm.pdfUrl && propertyForm.pdfUrl.startsWith('data:') ? '' : (propertyForm.pdfUrl || '')}
                      onChange={changeProperty}
                      placeholder={propertyForm.pdfUrl && propertyForm.pdfUrl.startsWith('data:') ? '📄 PDF File Attached' : 'e.g. https://domain.com/brochure.pdf'}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 pl-8 pr-3 py-2 text-xs text-white outline-none focus:border-amber-500 font-normal"
                    />
                  </div>

                  <div className="relative border-2 border-dashed border-slate-800 hover:border-amber-500/60 bg-slate-900/60 hover:bg-slate-900 p-2.5 rounded-xl text-center transition-all cursor-pointer group">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 4 * 1024 * 1024) {
                          if (typeof triggerToast === 'function') {
                            triggerToast('PDF brochure must be under 4MB. Please use a smaller/compressed file, or paste a hosted brochure link above instead.', 'error', 'PDF Too Large');
                          }
                          e.target.value = '';
                          return;
                        }
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => setPropertyForm((prev) => ({ ...prev, pdfUrl: reader.result }));
                        e.target.value = '';
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                    />
                    <div className="flex items-center justify-center gap-2">
                      <i className="fa-solid fa-cloud-arrow-up text-amber-400 text-sm"></i>
                      <span className="text-xs font-semibold text-white">Click to Upload PDF Brochure File</span>
                    </div>
                  </div>

                  {propertyForm.pdfUrl && (
                    <div className="flex items-center justify-between rounded-xl bg-amber-500/10 border border-amber-500/20 px-3 py-1.5">
                      <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1.5">
                        <i className="fa-solid fa-file-pdf"></i> Brochure Attached
                      </span>
                      <button
                        type="button"
                        onClick={() => setPropertyForm((prev) => ({ ...prev, pdfUrl: '' }))}
                        className="text-[10px] text-red-400 hover:text-red-300 font-medium cursor-pointer"
                      >
                        Clear PDF
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: DESCRIPTION & TAG */}
            {activeFormTab === 'details' && (
              <div className="space-y-4 font-normal">
                <label className="block text-xs font-medium text-slate-300">
                  Project Tag / Highlight Badge
                  <input
                    name="tag"
                    value={propertyForm.tag}
                    onChange={changeProperty}
                    placeholder="e.g. 2BHK | Net Profit +₹4.0L"
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-300">
                  Detailed Description *
                  <textarea
                    required
                    name="description"
                    value={propertyForm.description}
                    onChange={changeProperty}
                    rows="8"
                    placeholder="Enter detailed project description, terms & highlights..."
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white font-mono leading-relaxed"
                  />
                </label>
              </div>
            )}

            {/* Form Footer Controls */}
            <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-4">
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-normal text-slate-400 hover:text-white cursor-pointer"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                {activeFormTab !== 'financial' && (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveFormTab(
                        activeFormTab === 'details'
                          ? 'media'
                          : activeFormTab === 'media'
                          ? 'basic'
                          : 'financial'
                      )
                    }
                    className="px-4 py-2 rounded-xl border border-slate-800 text-xs font-normal text-slate-300 cursor-pointer"
                  >
                    Back
                  </button>
                )}

                {activeFormTab !== 'details' ? (
                  <button
                    type="button"
                    onClick={() =>
                      setActiveFormTab(
                        activeFormTab === 'financial'
                          ? 'basic'
                          : activeFormTab === 'basic'
                          ? 'media'
                          : 'details'
                      )
                    }
                    className="px-5 py-2 rounded-xl bg-orange-500 text-xs font-medium text-white hover:bg-orange-600 shadow-sm cursor-pointer"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={saveProperty}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-xs font-medium uppercase tracking-wide text-white shadow-md shadow-orange-500/20 hover:from-orange-600 hover:to-amber-600 transition-all cursor-pointer"
                  >
                    {editingId ? 'Update Investment Project' : 'Publish Investment Project'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
