import React, { useState } from "react";

export const projectsData = [
  {
    id: "flat",
    name: "Premium Flat (Delhi)",
    location: "Okhla, New Delhi",
    minInvestment: 500000,
    maxInvestment: 10000000,
    defaultInvestment: 1500000,
    stepInvestment: 100000,
    desc: "Invest in secure residential flats in South Delhi with guaranteed capital growth.",
    bgGlow: "rgba(246, 129, 34, 0.12)",
    themeColor: "#F68122",
  },
  {
    id: "plot",
    name: "Residential Plot (Vrindavan)",
    location: "Raman Reti, Vrindavan",
    minInvestment: 800000,
    maxInvestment: 10000000,
    defaultInvestment: 2000000,
    stepInvestment: 100000,
    desc: "Secure high-appreciation residential land plots in the sacred cultural hub of Vrindavan.",
    bgGlow: "rgba(59, 130, 246, 0.12)",
    themeColor: "#3b82f6",
  },
  {
    id: "building",
    name: "Commercial Building (Delhi)",
    location: "Connaught Place, New Delhi",
    minInvestment: 1500000,
    maxInvestment: 15000000,
    defaultInvestment: 4000000,
    stepInvestment: 200000,
    desc: "Premium commercial building shares in prime business districts of New Delhi.",
    bgGlow: "rgba(34, 197, 94, 0.12)",
    themeColor: "#22c55e",
  },
];

export const formatCurrency = (value) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} Lakh`;
  return `₹${value.toLocaleString("en-IN")}`;
};

import ScrollReveal from "../ScrollReveal";

const INVESTMENT_TICKETS = [
  { label: "₹2.5L", value: "2.5 Lakhs" },
  { label: "₹5L", value: "5 Lakhs" },
  { label: "₹10L", value: "10 Lakhs" },
  { label: "₹25L+", value: "25 Lakhs+" },
];

// Exported Growth Planner Calculator for Investor pages
export const CalculatorCard = () => {
  const [selectedProjectId, setSelectedProjectId] = useState("flat");
  const [investmentState, setInvestmentState] = useState({
    flat: 1500000,
    plot: 2000000,
    building: 4000000,
  });
  const [years, setYears] = useState(5);
  const fixedRoi = 10;

  const currentProject =
    projectsData.find((p) => p.id === selectedProjectId) || projectsData[0];

  const rawInvestment = investmentState[selectedProjectId];
  const investment = Math.max(
    currentProject.minInvestment,
    Math.min(currentProject.maxInvestment, rawInvestment),
  );

  const maturityValue = Math.round(
    investment * Math.pow(1 + fixedRoi / 100, years),
  );

  const handleInvestmentChange = (val) => {
    const clamped = Math.max(
      currentProject.minInvestment,
      Math.min(currentProject.maxInvestment, val),
    );
    setInvestmentState((prev) => ({ ...prev, [selectedProjectId]: clamped }));
  };

  const getSliderProgress = (val, min, max) =>
    ((val - min) / (max - min)) * 100;

  return (
    <div className="w-full relative">
      <div
        className="absolute -inset-2 rounded-[32px] blur-3xl opacity-40 transition-all duration-700 pointer-events-none"
        style={{ background: currentProject.bgGlow }}
      ></div>

      <div className="relative w-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 lg:p-8 shadow-2xl z-10 text-left">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-white text-base sm:text-lg font-bold flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: currentProject.themeColor }}
              ></span>
              Growth Planner
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              One-Time Secure Payout
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-200 tracking-wide flex items-center gap-1.5 shadow-sm">
            <i className="fa-solid fa-percent text-orange-400"></i>
            10% Fixed returns p.a.
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-2">
            Select Asset Class
          </label>
          <div className="grid grid-cols-3 gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/5">
            {projectsData.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setSelectedProjectId(proj.id)}
                className={`text-[11px] font-bold py-2.5 px-1 rounded-lg transition-all duration-300 text-center truncate ${
                  selectedProjectId === proj.id
                    ? "bg-white/10 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                }`}
                style={
                  selectedProjectId === proj.id
                    ? { borderLeft: `3px solid ${proj.themeColor}` }
                    : {}
                }
              >
                {proj.id === "flat"
                  ? "Premium Flat"
                  : proj.id === "plot"
                    ? "Land Plot"
                    : "Commercial"}
              </button>
            ))}
          </div>
          <div className="flex justify-between items-center mt-3 bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2">
            <span className="text-xs font-semibold text-white truncate">
              {currentProject.name}
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md flex-shrink-0 font-medium ml-2">
              {currentProject.location}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                Investment Amount
              </span>
              <div className="flex items-center gap-2 bg-slate-950/60 border border-white/10 rounded-lg p-0.5">
                <button
                  onClick={() =>
                    handleInvestmentChange(
                      investment - currentProject.stepInvestment,
                    )
                  }
                  className="w-6 h-6 rounded bg-white/5 text-slate-300 hover:bg-white/10 text-xs active:scale-90 transition-transform flex items-center justify-center"
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <span className="text-white text-sm sm:text-base font-black px-1 min-w-[90px] text-center">
                  {formatCurrency(investment)}
                </span>
                <button
                  onClick={() =>
                    handleInvestmentChange(
                      investment + currentProject.stepInvestment,
                    )
                  }
                  className="w-6 h-6 rounded bg-white/5 text-slate-300 hover:bg-white/10 text-xs active:scale-90 transition-transform flex items-center justify-center"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <input
              type="range"
              min={currentProject.minInvestment}
              max={currentProject.maxInvestment}
              step={currentProject.stepInvestment}
              value={investment}
              onChange={(e) => handleInvestmentChange(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10"
              style={{
                accentColor: currentProject.themeColor,
                background: `linear-gradient(to right, ${currentProject.themeColor} 0%, ${currentProject.themeColor} ${getSliderProgress(investment, currentProject.minInvestment, currentProject.maxInvestment)}%, rgba(255,255,255,0.1) ${getSliderProgress(investment, currentProject.minInvestment, currentProject.maxInvestment)}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-1.5 font-bold uppercase tracking-wider">
              <span>Min: {formatCurrency(currentProject.minInvestment)}</span>
              <span>Max: {formatCurrency(currentProject.maxInvestment)}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                Time Horizon
              </span>
              <div className="flex items-center gap-2 bg-slate-950/60 border border-white/10 rounded-lg p-0.5">
                <button
                  onClick={() => setYears((prev) => Math.max(1, prev - 1))}
                  className="w-6 h-6 rounded bg-white/5 text-slate-300 hover:bg-white/10 text-xs flex items-center justify-center active:scale-90 transition-transform"
                >
                  <i className="fa-solid fa-minus"></i>
                </button>
                <span className="text-white text-sm sm:text-base font-black px-2 min-w-[60px] text-center">
                  {years} {years === 1 ? "Year" : "Years"}
                </span>
                <button
                  onClick={() => setYears((prev) => Math.min(10, prev + 1))}
                  className="w-6 h-6 rounded bg-white/5 text-slate-300 hover:bg-white/10 text-xs flex items-center justify-center active:scale-90 transition-transform"
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-white/10"
              style={{
                accentColor: currentProject.themeColor,
                background: `linear-gradient(to right, ${currentProject.themeColor} 0%, ${currentProject.themeColor} ${getSliderProgress(years, 1, 10)}%, rgba(255,255,255,0.1) ${getSliderProgress(years, 1, 10)}%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-1.5 font-bold uppercase tracking-wider">
              <span>1 Year</span>
              <span>10 Years</span>
            </div>
          </div>
        </div>

        {/* Maturity Value Output & Growth Breakdown */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Estimated Maturity Value</span>
              <p className="text-2xl font-black text-white">{formatCurrency(maturityValue)}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">Projected Net Profit</span>
              <p className="text-lg font-extrabold text-emerald-400">+{formatCurrency(maturityValue - investment)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-xs">
            <div className="bg-slate-950/60 rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold">Fixed IRR:</span>
              <span className="font-bold text-orange-400">10% p.a.</span>
            </div>
            <div className="bg-slate-950/60 rounded-xl p-2.5 border border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-semibold">Growth Multiple:</span>
              <span className="font-bold text-emerald-400">{(maturityValue / investment).toFixed(2)}x</span>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 text-center mt-4 font-medium leading-relaxed">
          * Projections calculated at a fixed compounding baseline of 10% per annum. Assets are 100% compliant under RERA bylaws.
        </p>
      </div>
    </div>
  );
};

const BrowseByBudgetSection = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    budget: "5 Lakhs",
    assetType: "Land & Plots",
  });

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSubmitted(true);
  };

  return (
    <section
      id="investment-goals"
      className="scroll-mt-20 py-24 relative bg-slate-950 overflow-hidden"
    >
      <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-orange-500/[0.03] rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/[0.03] rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Fast-Track Investment Access Form (Replaces Growth Planner here) */}
          <div className="lg:col-span-6 w-full">
            <div className="relative w-full bg-slate-900/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-left">
              <div className="mb-5 pb-3 border-b border-white/15">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 px-3 py-1 text-[11px] font-black uppercase text-orange-400 mb-2">
                  <i className="fa-solid fa-bolt text-orange-400"></i>
                  <span>Fast-Track Investment Access</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Get Customized Investment Proposals
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Connect with our senior real estate manager to receive verified RERA deal sheets & projected IRR breakdowns.
                </p>
              </div>

              {!formSubmitted ? (
                <form onSubmit={handleLeadSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full rounded-xl border border-white/15 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Mobile Number / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded-xl border border-white/15 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Planned Investment Ticket
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {INVESTMENT_TICKETS.map((t) => (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, budget: t.value })}
                          className={`rounded-lg py-2 text-xs font-bold transition border ${
                            formData.budget === t.value
                              ? "bg-orange-500 text-white border-orange-400 shadow-md"
                              : "bg-slate-950 text-slate-300 border-white/10 hover:bg-slate-800"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Asset Preference
                    </label>
                    <select
                      value={formData.assetType}
                      onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2.5 text-xs text-slate-200 outline-none focus:border-orange-500 transition"
                    >
                      <option value="Land & Plots">Land & Plots (High Appreciation)</option>
                      <option value="Commercial Shop">Pre-Leased Commercial Shop (Monthly Rent)</option>
                      <option value="Fractional Token">Fractional Real Estate (Min ₹2.5L)</option>
                      <option value="Flats & Suites">Luxury Flats & Suites</option>
                    </select>
                  </div>

                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 flex items-center justify-between text-xs">
                    <span className="font-medium text-emerald-300 flex items-center gap-1.5">
                      <i className="fa-solid fa-chart-pie text-emerald-400"></i> Expected Annual Yield
                    </span>
                    <span className="font-black text-emerald-400 text-sm">
                      ~14.2% - 15.4% IRR
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 py-3.5 text-xs font-black uppercase tracking-wider text-white shadow-xl transition hover:brightness-110 active:scale-95"
                  >
                    <span>Request Priority Investment Access</span>
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </button>

                  <p className="text-[10px] text-center text-slate-400 font-medium">
                    🔒 100% Confidential. Instant response from senior advisor.
                  </p>
                </form>
              ) : (
                <div className="bg-slate-950/80 p-8 rounded-2xl border border-green-500/30 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-green-400 border border-green-500/40">
                    <i className="fa-solid fa-check text-2xl"></i>
                  </div>
                  <h4 className="text-lg font-bold text-white">Inquiry Sent Successfully!</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Our senior manager will contact <span className="text-white font-bold">{formData.name}</span> at <span className="text-white font-bold">{formData.phone}</span> with <span className="text-amber-400 font-bold">{formData.assetType}</span> proposals shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs text-orange-400 hover:underline pt-2 font-bold"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Browse By Investment Goal Header & Asset Profile Cards */}
          <div className="lg:col-span-6 flex flex-col justify-center text-left">
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full w-max mb-5 shadow-sm">
              <i className="fa-solid fa-filter text-orange-400 text-xs"></i>
              <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Portfolio Strategy
              </p>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight leading-none">
              Browse By{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">
                Investment Goal
              </span>
            </h2>

            <p className="text-slate-400 text-base leading-7 mb-8 border-l-2 border-orange-500/60 pl-4">
              Finding the right property that aligns with your financial targets
              is key to building wealth. Whether you're seeking stable monthly
              passive income, high capital appreciation, or fractional
              ownership, our curated categories streamline your investment
              journey.
            </p>

            <p className="text-white text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-3">
              Select Asset Profile{" "}
              <span className="flex-1 h-px bg-white/10"></span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href="#properties"
                className="relative p-5 rounded-2xl bg-slate-900 border border-white/5 overflow-hidden group hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <i className="fa-solid fa-chart-line text-lg"></i>
                  </div>
                  <h4 className="font-bold text-white text-base mb-1 group-hover:text-orange-400 transition-colors">
                    High Rental Yield
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    8-12% Annual Returns
                  </p>
                </div>
              </a>

              <a
                href="#properties"
                className="relative p-5 rounded-2xl bg-slate-900 border border-white/5 overflow-hidden group hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 shadow-md"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                    <i className="fa-solid fa-map-location-dot text-lg"></i>
                  </div>
                  <h4 className="font-bold text-white text-base mb-1 group-hover:text-blue-400 transition-colors">
                    Capital Appreciation
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    High Growth Corridors
                  </p>
                </div>
              </a>

              <a
                href="#properties"
                className="relative p-5 rounded-2xl bg-slate-900 border border-white/5 overflow-hidden group hover:border-green-500/50 transition-all duration-300 hover:-translate-y-1 shadow-md sm:col-span-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 group-hover:scale-110 transition-transform duration-300">
                      <i className="fa-solid fa-building-circle-check text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base mb-0.5 group-hover:text-green-400 transition-colors">
                        Pre-Leased Commercial Assets
                      </h4>
                      <p className="text-xs text-slate-400 font-medium">
                        Stable Fractional Passive Income Streams
                      </p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-slate-400 group-hover:bg-green-500 group-hover:text-white group-hover:border-green-500 transition-all duration-300">
                    <i className="fa-solid fa-arrow-right text-xs"></i>
                  </div>
                </div>
              </a>
            </div>
          </div>

        </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default BrowseByBudgetSection;
