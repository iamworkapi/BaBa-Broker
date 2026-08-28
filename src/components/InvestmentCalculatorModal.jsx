import React, { useState } from 'react';
import { safeEmbedUrl } from '../utils/sanitize';

export default function InvestmentCalculatorModal({ project, onClose }) {
  const defaultMin = project?.minInvestment > 0 ? project.minInvestment : 100000;
  const [investAmount, setInvestAmount] = useState(defaultMin);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);

  if (!project) return null;

  const {
    title = '',
    location = '',
    image = '',
    images = [],
    videoUrl = '',
    status = 'running',
    propertyType = 'residential',
    bhk = '2bhk',
    investmentModel = 'co_investment',
    description = '',
    totalValuation = 0,
    fundedPercentage = 0,
    investorsCount = 0,
    minInvestment = 500000,
    expectedRoi = 20,
    purchasePrice = 2000000,
    renovationCost = 200000,
    expectedSalePrice = 2600000,
    holdingPeriodMonths = 6,
  } = project;

  const galleryList = Array.isArray(images) && images.length > 0 ? images : image ? [image] : [];


  const remainingPercentage = Math.max(0, 100 - fundedPercentage);
  const totalFlipOutlay = purchasePrice + renovationCost;
  const flipProfit = expectedSalePrice - totalFlipOutlay;
  const flipRoi = totalFlipOutlay > 0 ? ((flipProfit / totalFlipOutlay) * 100).toFixed(1) : 0;

  // Profit calculation based on investment amount
  const projectedProfitScenario1 = ((investAmount * expectedRoi) / 100).toFixed(0);
  const projectedReturnScenario1 = Number(investAmount) + Number(projectedProfitScenario1);

  const flipSharePercentage = totalFlipOutlay > 0 ? (investAmount / totalFlipOutlay) * 100 : 0;
  const projectedProfitScenario2 = ((flipProfit * flipSharePercentage) / 100).toFixed(0);
  const projectedReturnScenario2 = Number(investAmount) + Number(projectedProfitScenario2);

  const whatsappMessage = encodeURIComponent(
    `Hello Baba Broker! I am interested in investing in your project:\n\n*${title}*\nLocation: ${location}\nStatus: ${status.toUpperCase()}\nMy Planned Investment: ₹${(
      investAmount / 100000
    ).toFixed(2)} Lakhs\n\nPlease share details!`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl text-slate-100 my-8">
        {/* Header Media Bar & Gallery Carousel */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden bg-slate-950">
          <img
            src={
              galleryList[activeImageIndex] ||
              image ||
              'https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg'
            }
            alt={title}
            className="h-full w-full object-cover opacity-70 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-slate-950/80 text-slate-300 hover:bg-orange-500 hover:text-white transition-colors z-10"
          >
            <i className="fa-solid fa-xmark text-base"></i>
          </button>

          {/* Video Player CTA Badge if Video exists */}
          {videoUrl && (
            <button
              onClick={() => setShowVideoModal(true)}
              className="absolute left-4 top-4 flex items-center gap-2 rounded-xl bg-red-600/90 border border-red-500 px-3.5 py-1.5 text-xs font-black uppercase text-white shadow-lg backdrop-blur-sm hover:bg-red-500 transition-all z-10"
            >
              <i className="fa-solid fa-circle-play text-sm"></i> Watch Project Video
            </button>
          )}

          {/* Title & Info Overlay */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="rounded-md bg-orange-500 px-2.5 py-0.5 text-[10px] font-black uppercase text-white">
                {status}
              </span>
              <span className="rounded-md bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-[10px] font-bold uppercase text-slate-300">
                {propertyType === 'residential' ? bhk.toUpperCase() : propertyType}
              </span>
              {galleryList.length > 1 && (
                <span className="rounded-md bg-slate-950/80 border border-slate-700 px-2.5 py-0.5 text-[10px] font-bold text-orange-400">
                  Photo {activeImageIndex + 1} of {galleryList.length}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{title}</h2>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-1">
              <i className="fa-solid fa-location-dot text-orange-500"></i>
              {location}
            </p>
          </div>
        </div>

        {/* Multi-photo Thumbnails Selector */}
        {galleryList.length > 1 && (
          <div className="flex items-center gap-2 bg-slate-950 px-6 py-3 overflow-x-auto border-b border-slate-800">
            {galleryList.map((imgUrl, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative h-12 w-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx ? 'border-orange-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={imgUrl} alt={`Thumb ${idx}`} loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Project Details Summary */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-500 mb-2">
              Project Overview & Description
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
          </div>

          {/* Investment Scenarios Breakdown */}
          {investmentModel === 'renovate_flip' ? (
            /* Scenario 2 Details Breakdown */
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                  Scenario 2: Renovate & Flip Financial Model
                </span>
                <span className="rounded-lg bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                  Expected ROI: +{flipRoi}%
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-4">
                <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 font-semibold">Purchase Price</span>
                  <span className="text-sm font-black text-white">₹{(purchasePrice / 100000).toFixed(2)}L</span>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 font-semibold">Renovation Budget</span>
                  <span className="text-sm font-black text-white">₹{(renovationCost / 100000).toFixed(2)}L</span>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 font-semibold">Target Resale Price</span>
                  <span className="text-sm font-black text-emerald-400">₹{(expectedSalePrice / 100000).toFixed(2)}L</span>
                </div>
                <div className="rounded-xl bg-amber-500/20 p-3 border border-amber-500/40">
                  <span className="block text-[10px] text-amber-300 font-semibold">Total Net Profit</span>
                  <span className="text-sm font-black text-amber-400">+₹{(flipProfit / 100000).toFixed(2)}L</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-300 italic">
                * Example Scenario: Property acquired at ₹{(purchasePrice / 100000).toFixed(1)} Lakhs, renovated with ₹{(renovationCost / 100000).toFixed(1)} Lakhs investment, projected for resale at ₹{(expectedSalePrice / 100000).toFixed(1)} Lakhs in {holdingPeriodMonths} months.
              </p>
            </div>
          ) : (
            /* Scenario 1 Details Breakdown */
            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-orange-400">
                  Scenario 1: Co-Investment Pool Status
                </span>
                <span className="text-xs font-bold text-slate-300">
                  {fundedPercentage}% Funded | <span className="text-orange-400 font-extrabold">{remainingPercentage}% Available</span>
                </span>
              </div>

              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800 mb-4 p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400"
                  style={{ width: `${Math.max(5, fundedPercentage)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 font-semibold">Total Valuation</span>
                  <span className="text-sm font-black text-white">₹{((totalValuation || 0) / 100000).toFixed(2)}L</span>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 font-semibold">Current Investors</span>
                  <span className="text-sm font-black text-white">{investorsCount} Co-Investors</span>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-3 border border-slate-800">
                  <span className="block text-[10px] text-slate-400 font-semibold">Min. Ticket</span>
                  <span className="text-sm font-black text-white">₹{(minInvestment / 100000).toFixed(2)}L</span>
                </div>
                <div className="rounded-xl bg-orange-500/20 p-3 border border-orange-500/40">
                  <span className="block text-[10px] text-orange-300 font-semibold">Projected Annual ROI</span>
                  <span className="text-sm font-black text-amber-400">+{expectedRoi}% p.a.</span>
                </div>
              </div>
            </div>
          )}

          {/* Interactive Calculator Slider */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase text-white tracking-wider">
                <i className="fa-solid fa-calculator text-orange-500 mr-2"></i>
                Calculate Your Projected Profit
              </h3>
              <span className="text-lg font-black text-orange-400">
                ₹{(investAmount / 100000).toFixed(2)} Lakhs
              </span>
            </div>

            <input
              type="range"
              min={defaultMin}
              max={totalValuation > 0 ? totalValuation : 10000000}
              step={50000}
              value={investAmount}
              onChange={(e) => setInvestAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />

            {/* Quick Preset Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] font-semibold text-slate-400 mr-1">Quick Presets:</span>
              {[500000, 1000000, 2500000, 5000000].map((presetAmt) => (
                <button
                  key={presetAmt}
                  type="button"
                  onClick={() => setInvestAmount(presetAmt)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    investAmount === presetAmt
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20 border border-orange-400'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                >
                  ₹{(presetAmt / 100000).toFixed(0)} Lakhs
                </button>
              ))}
            </div>

            {/* Profit Results Card */}
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-center">
                <span className="block text-xs font-semibold text-slate-400">Projected Net Profit</span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">
                  +₹{((investmentModel === 'renovate_flip' ? projectedProfitScenario2 : projectedProfitScenario1) / 100000).toFixed(2)} Lakhs
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  ({investmentModel === 'renovate_flip' ? `${flipRoi}% Flip Return in ${holdingPeriodMonths} mo` : `${expectedRoi}% Annualized Return`})
                </span>
              </div>

              <div className="rounded-xl border border-orange-500/30 bg-orange-500/10 p-4 text-center">
                <span className="block text-xs font-semibold text-orange-300">Total Expected Payout</span>
                <span className="text-xl font-black text-orange-400 mt-1 block">
                  ₹{((investmentModel === 'renovate_flip' ? projectedReturnScenario2 : projectedReturnScenario1) / 100000).toFixed(2)} Lakhs
                </span>
                <span className="text-[10px] text-orange-200/80 font-medium">Initial Principal + Profits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="border-t border-slate-800 bg-slate-950 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-800 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
          >
            Close Calculator
          </button>

          <a
            href={`https://wa.me/919586505111?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all duration-300 cursor-pointer transform active:scale-95"
          >
            <i className="fa-brands fa-whatsapp text-lg"></i>
            Enquire & Invest via WhatsApp
          </a>
        </div>
      </div>

      {/* EMBEDDED VIDEO MODAL */}
      {showVideoModal && videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl p-4">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-slate-800 text-white z-10 hover:bg-red-600"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
              {(() => {
                const embedSrc = safeEmbedUrl(videoUrl);
                if (embedSrc) {
                  return (
                    <iframe
                      src={embedSrc}
                      title="Project Video"
                      className="h-full w-full border-0"
                      allowFullScreen
                    ></iframe>
                  );
                }
                return <video src={videoUrl} controls className="h-full w-full object-contain"></video>;
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
