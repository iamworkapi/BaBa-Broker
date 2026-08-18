import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { safeEmbedUrl } from '../lib/sanitize';

const defaultFallbackProject = {
  _id: 'demo-1',
  status: 'running',
  propertyType: 'residential',
  bhk: '3bhk',
  investmentModel: 'co_investment',
  title: 'Luxury 3BHK Smart Residency Co-Investment',
  location: 'Sector 150, Noida Expressway',
  price: '₹ 85,00,000',
  tag: 'High Growth Pool',
  image:
    'https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg',
  images: [
    'https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg',
    'https://realtyhunting.com/wp-content/uploads/2026/03/Gemini_Generated_Image_2btgk62btgk62btg.png',
  ],
  videoUrl: '',
  description:
    'Prime 3BHK modern luxury flat with automated smart home features. 60% funded by co-investors, 40% remaining available for investment. Projected 22% ROI per annum with guaranteed transparent legal title.',
  totalValuation: 8500000,
  fundedPercentage: 60,
  investorsCount: 2,
  minInvestment: 500000,
  expectedRoi: 22,
  purchasePrice: 0,
  renovationCost: 0,
  expectedSalePrice: 0,
  holdingPeriodMonths: 6,
  investorsList: [
    { name: 'Rahul Sharma', sharePercentage: 30, amount: '₹25.5 Lakhs', date: '12 Jan 2026' },
    { name: 'Amit Verma', sharePercentage: 30, amount: '₹25.5 Lakhs', date: '04 Feb 2026' },
  ],
};

function formatCommaPrice(val) {
  if (val === null || val === undefined || val === '') return '₹0';
  if (typeof val === 'number') {
    return '₹' + val.toLocaleString('en-IN');
  }
  const str = String(val).trim();
  const digits = str.replace(/[^\d]/g, '');
  if (digits && Number(digits) > 0) {
    return '₹' + Number(digits).toLocaleString('en-IN');
  }
  return str.startsWith('₹') ? str : `₹${str}`;
}

export default function PropertyDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const project = location.state?.project || defaultFallbackProject;

  const {
    title = '',
    location: itemLocation = '',
    price = '',
    image = '',
    images = [],
    videoUrl = '',
    status = 'running',
    propertyType = 'residential',
    bhk = '2bhk',
    investmentModel = 'co_investment',
    description = '',
    tag = '',
    totalValuation = 0,
    fundedPercentage = 0,
    investorsCount = 0,
    minInvestment = 500000,
    expectedRoi = 20,
    purchasePrice = 0,
    renovationCost = 0,
    expectedSalePrice = 0,
    holdingPeriodMonths = 6,
    investorsList = [
      { name: 'Rahul Sharma', sharePercentage: 30, amount: `₹${((totalValuation * 0.3) / 100000).toFixed(1)}L`, date: '12 Jan 2026' },
      { name: 'Amit Verma', sharePercentage: 30, amount: `₹${((totalValuation * 0.3) / 100000).toFixed(1)}L`, date: '04 Feb 2026' },
    ],
  } = project;

  const galleryList = Array.isArray(images) && images.length > 0 ? images : image ? [image] : [];
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState(videoUrl ? 'video' : 'photos');

  // Interactive Calculator State
  const defaultMin = minInvestment > 0 ? minInvestment : 100000;
  const [investAmount, setInvestAmount] = useState(defaultMin);

  // Financial & Investor Pool Calculations
  const activeInvestorsCount = Array.isArray(investorsList) && investorsList.length > 0 ? investorsList.length : investorsCount || 0;
  const calculatedFundedPct = Array.isArray(investorsList) && investorsList.length > 0
    ? investorsList.reduce((sum, item) => sum + (Number(item.sharePercentage) || 0), 0)
    : fundedPercentage || 0;
  const activeFundedPercentage = Math.min(100, Math.max(0, calculatedFundedPct));
  const remainingPercentage = Math.max(0, 100 - activeFundedPercentage);

  const totalFlipOutlay = (purchasePrice || 0) + (renovationCost || 0);
  const flipProfit = (expectedSalePrice || 0) - totalFlipOutlay;
  const flipRoi = totalFlipOutlay > 0 ? ((flipProfit / totalFlipOutlay) * 100).toFixed(1) : 0;

  const projectedProfitScenario1 = Math.round((investAmount * expectedRoi) / 100);
  const projectedReturnScenario1 = Number(investAmount) + Number(projectedProfitScenario1);

  const flipSharePercentage = totalFlipOutlay > 0 ? (investAmount / totalFlipOutlay) * 100 : 0;
  const projectedProfitScenario2 = Math.round((flipProfit * flipSharePercentage) / 100);
  const projectedReturnScenario2 = Number(investAmount) + Number(projectedProfitScenario2);

  const activeProjectedProfit = investmentModel === 'renovate_flip' ? projectedProfitScenario2 : projectedProfitScenario1;
  const activeProjectedReturn = investmentModel === 'renovate_flip' ? projectedReturnScenario2 : projectedReturnScenario1;

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = `${title} | Baba Broker Investment Details`;
  }, [title]);

  const whatsappMessage = encodeURIComponent(
    `Hello Baba Broker Team!\n\nI am interested in investing in your project:\n📌 *${title}*\n📍 Location: ${itemLocation}\n⚡ Planned Investment: ₹${(
      investAmount / 100000
    ).toFixed(2)} Lakhs\n📈 Projected Return: ₹${(activeProjectedReturn / 100000).toFixed(2)} Lakhs\n\nPlease share complete details & schedule a site visit.`
  );

  const formatLakhs = (amt) => {
    const num = Number(amt) || 0;
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(num / 100000).toFixed(2)} Lakhs`;
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-['Roboto',sans-serif] pt-24 pb-24 selection:bg-orange-500 selection:text-white">
      {/* Background Ambient Glow Effects */}
      <div className="fixed top-20 left-10 h-[450px] w-[450px] rounded-full bg-orange-600/10 blur-[150px] pointer-events-none"></div>
      <div className="fixed bottom-20 right-10 h-[450px] w-[450px] rounded-full bg-amber-500/10 blur-[150px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:border-orange-500/50 hover:bg-slate-900 transition-all backdrop-blur-md cursor-pointer"
          >
            <i className="fa-solid fa-arrow-left text-orange-400"></i> Back to Investment Directory
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Verified Deal
            </span>
          </div>
        </div>

        {/* Hero Title & Primary Metric Header */}
        <div className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm ${
                    status === 'delivered'
                      ? 'bg-emerald-500'
                      : status === 'upcoming'
                      ? 'bg-blue-600'
                      : 'bg-orange-500'
                  }`}
                >
                  🚀 {status.toUpperCase()}
                </span>

                <span className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1 text-[11px] font-semibold uppercase text-slate-300">
                  {propertyType === 'residential' ? bhk.toUpperCase() : propertyType.toUpperCase()}
                </span>

                <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[11px] font-semibold uppercase text-amber-400">
                  {investmentModel === 'renovate_flip' ? 'Buy, Renovate & Flip' : 'Fractional Co-Investment'}
                </span>

                {tag && (
                  <span className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-[11px] font-semibold text-orange-400">
                    {tag}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 font-normal">
                <i className="fa-solid fa-location-dot text-orange-500"></i>
                <span>{itemLocation}</span>
              </p>
            </div>

            {/* Price / Valuation Metric Box */}
            <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shadow-xl">
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 lg:text-right">
                  Total Project Valuation
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-amber-500 block">
                  {formatCommaPrice(totalValuation || price)}
                </span>
                <span className="block text-[10px] font-normal text-slate-400 lg:text-right mt-0.5">
                  (Total Selling Price)
                </span>
              </div>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                +{investmentModel === 'renovate_flip' ? `${flipRoi}% Net Profit` : `${expectedRoi}% Annual ROI`}
              </span>
            </div>
          </div>
        </div>

        {/* 4-Key Metrics Quick Overview Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <span className="text-[11px] font-medium uppercase text-slate-400 block mb-1">Target Annual ROI</span>
            <div className="text-lg sm:text-xl font-extrabold text-amber-400 flex items-center gap-1.5">
              <i className="fa-solid fa-arrow-trend-up text-xs"></i>
              +{expectedRoi}% p.a.
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <span className="text-[11px] font-medium uppercase text-slate-400 block mb-1">Co-Investor Funded</span>
            <div className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-1.5">
              <i className="fa-solid fa-chart-pie text-xs text-orange-500"></i>
              {fundedPercentage}% Funded
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <span className="text-[11px] font-medium uppercase text-slate-400 block mb-1">Min. Entry Investment</span>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-400 flex items-center gap-1.5">
              <i className="fa-solid fa-wallet text-xs"></i>
              {formatLakhs(minInvestment || 500000)}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg">
            <span className="text-[11px] font-medium uppercase text-slate-400 block mb-1">Available Equity</span>
            <div className="text-lg sm:text-xl font-extrabold text-orange-400 flex items-center gap-1.5">
              <i className="fa-solid fa-lock-open text-xs"></i>
              {remainingPercentage}% Available
            </div>
          </div>
        </div>

        {/* Main Content Layout Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column (Showcase Media, Specifications, Description & Investor Roster) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Interactive Showcase Media Container */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-4 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveMediaTab('photos')}
                    className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      activeMediaTab === 'photos'
                        ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    <i className="fa-solid fa-images text-xs mr-1.5"></i> Photo Gallery ({galleryList.length})
                  </button>

                  {videoUrl && (
                    <button
                      onClick={() => setActiveMediaTab('video')}
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        activeMediaTab === 'video'
                          ? 'bg-red-600 text-white shadow-sm shadow-red-500/30'
                          : 'bg-slate-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <i className="fa-solid fa-circle-play text-xs mr-1.5"></i> Video Presentation
                    </button>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                  Interactive High-Res Media
                </span>
              </div>

              {/* Main Display Area */}
              {activeMediaTab === 'video' && videoUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
                  {(() => {
                    const embedSrc = safeEmbedUrl(videoUrl);
                    if (embedSrc) {
                      return (
                        <iframe
                          src={embedSrc}
                          title="Project Video Tour"
                          className="h-full w-full border-0"
                          allowFullScreen
                        ></iframe>
                      );
                    }
                    return <video src={videoUrl} controls className="h-full w-full object-contain"></video>;
                  })()}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group">
                    <img
                      src={
                        galleryList[activeImgIndex] ||
                        'https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg'
                      }
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none"></div>
                    <span className="absolute bottom-3 left-3 rounded-lg bg-slate-950/80 border border-slate-800 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      Photo {activeImgIndex + 1} of {galleryList.length}
                    </span>
                  </div>

                  {/* Thumbnail Selector Strip */}
                  {galleryList.length > 1 && (
                    <div className="flex items-center gap-2.5 overflow-x-auto py-1">
                      {galleryList.map((imgUrl, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveImgIndex(idx);
                            setActiveMediaTab('photos');
                          }}
                          className={`relative h-16 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            activeImgIndex === idx && activeMediaTab === 'photos'
                              ? 'border-orange-500 ring-2 ring-orange-500/30 scale-105'
                              : 'border-slate-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} loading="lazy" className="h-full w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Property Specification Details Grid */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-orange-400">
                    Property Parameters & Architecture
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">Specifications & Features</h3>
                </div>

                {investmentModel === 'renovate_flip' && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                    <span className="block text-[10px] font-semibold uppercase text-emerald-400">Target Net Profit</span>
                    <strong className="text-base font-extrabold text-emerald-300">
                      +₹{flipProfit > 0 ? (flipProfit / 100000).toFixed(2) : '4.0'} Lakhs
                    </strong>
                  </div>
                )}
              </div>

              {/* Specification Grid Cards */}
              {propertyType === 'commercial' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-amber-400">Plot Area</span>
                      <strong className="text-sm font-bold text-white mt-1 block">
                        {project.plotAreaSqft || '264 sqyd (220.74 sq.m.)'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Built-up Area</span>
                      <strong className="text-sm font-bold text-white mt-1 block">
                        {project.builtUpArea || '264 sqyd (220.74 sq.m.)'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Carpet Area</span>
                      <strong className="text-sm font-bold text-amber-400 mt-1 block">
                        {project.carpetArea || '235 sqyd (196.49 sq.m.)'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Per Sqyd Rate</span>
                      <strong className="text-sm font-bold text-emerald-400 mt-1 block">
                        {project.perSqydPrice || '₹ 5,30,303 per sqyd'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Configuration</span>
                      <strong className="text-sm font-bold text-orange-400 mt-1 block">
                        {project.configuration || 'Commercial Office/Space'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Washrooms</span>
                      <strong className="text-sm font-bold text-white mt-1 block">
                        {project.washrooms || '5 Washrooms'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Property Age</span>
                      <strong className="text-sm font-bold text-white mt-1 block">
                        {project.propertyAge || '1 to 5 Year Old'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Transaction Type</span>
                      <strong className="text-sm font-bold text-white mt-1 block">
                        {project.transactionType || 'Resale'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Property Ownership</span>
                      <strong className="text-sm font-bold text-emerald-400 mt-1 block">
                        {project.ownership || 'Freehold'}
                      </strong>
                    </div>
                  </div>

                  {/* Commercial Amenities */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-slate-950 p-5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-building-flag text-xs"></i> Commercial Building Amenities
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(project.amenities || 'Service / Goods Lift, Centrally Air Conditioned, Banquet Hall, Bar / Lounge, Conference room, Private Garden / Terrace, Intercom Facility, Lift(s), Water Storage, Piped-gas').split(',').map((item, idx) => (
                        <span key={idx} className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                          <i className="fa-solid fa-circle-check text-[10px] text-emerald-400"></i> {item.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : propertyType === 'plot' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                    <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-amber-400">Plot Dimensions</span>
                      <strong className="text-sm font-bold text-white mt-1 block">
                        {project.plotAreaSqft || '5381.96 sqft'} ({project.plotAreaSqm || '500 sq.m.'})
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Per Sqft Price Rate</span>
                      <strong className="text-sm font-bold text-emerald-400 mt-1 block">
                        {project.perSqftPrice || '₹ 2,323 per sqft'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Plot Facing</span>
                      <strong className="text-sm font-bold text-orange-400 mt-1 block">
                        {project.facing || 'North-East'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Gated Society</span>
                      <strong className="text-sm font-bold text-emerald-400 mt-1 block">
                        {project.gatedSociety || 'YES'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Road Width</span>
                      <strong className="text-sm font-bold text-white mt-1 block">
                        {project.roadWidthFeet || '66.0 Feet'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Boundary Wall</span>
                      <strong className="text-sm font-bold text-emerald-400 mt-1 block">
                        {project.boundaryWall || 'YES'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">No. of Open Sides</span>
                      <strong className="text-sm font-bold text-amber-400 mt-1 block">
                        {project.openSides || '1'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Overlooking</span>
                      <strong className="text-sm font-bold text-blue-400 mt-1 block">
                        {project.overlooking || 'Pool'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Possession</span>
                      <strong className="text-sm font-bold text-emerald-400 mt-1 block">
                        {project.possession || 'Immediate'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Transaction Type</span>
                      <strong className="text-sm font-bold text-white mt-1 block">
                        {project.transactionType || 'Resale'}
                      </strong>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">Property Ownership</span>
                      <strong className="text-sm font-bold text-emerald-400 mt-1 block">
                        {project.ownership || 'Freehold'}
                      </strong>
                    </div>
                  </div>

                  {/* Key Highlights */}
                  <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-star text-xs"></i> Key Highlights of Property
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(project.highlights || 'Gated Society, On 66 ft Wide Road, Overlooking Swimming Pool, North-East Facing').split(',').map((item, idx) => (
                        <span key={idx} className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                          <i className="fa-solid fa-circle-check text-[10px] text-amber-400"></i> {item.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Plot Amenities */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-slate-950 p-5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-shield-halved text-xs"></i> Plot Amenities
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(project.amenities || 'Gated Society, Water Storage, Rain Water Harvesting').split(',').map((item, idx) => (
                        <span key={idx} className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                          <i className="fa-solid fa-droplet text-[10px] text-emerald-400"></i> {item.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">Construction Year</span>
                    <strong className="text-sm font-bold text-white mt-1 block">
                      {project.constructionYear || '2016'}
                    </strong>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">BHK Category</span>
                    <strong className="text-sm font-bold text-orange-400 mt-1 block">
                      {bhk.toUpperCase()}
                    </strong>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">Total Flat Size</span>
                    <strong className="text-sm font-bold text-white mt-1 block">
                      {project.sizeSqft || '1200 sqft'}
                    </strong>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">Floor Level</span>
                    <strong className="text-sm font-bold text-amber-400 mt-1 block">
                      {project.floor || '2nd Floor'}
                    </strong>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">Lift Facility</span>
                    <strong className="text-sm font-bold text-emerald-400 mt-1 block">
                      {project.lift || 'YES'}
                    </strong>
                  </div>

                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                    <span className="block text-[10px] font-semibold uppercase text-slate-400">Parking Space</span>
                    <strong className="text-sm font-bold text-white mt-1 block">
                      {project.parking || 'CAR + BIKE'}
                    </strong>
                  </div>
                </div>
              )}

              {/* Financial Outlay Breakdown Box */}
              {investmentModel === 'renovate_flip' && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                    Scenario 2: Financial Outlay Breakdown
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                    <div className="flex justify-between sm:flex-col border-b sm:border-b-0 sm:border-r border-slate-800 pb-2 sm:pb-0 sm:pr-3">
                      <span className="text-slate-400">Purchase Price:</span>
                      <strong className="text-white font-bold text-sm sm:mt-1">
                        ₹{purchasePrice > 0 ? (purchasePrice / 100000).toFixed(2) : '20.0'} Lakhs
                      </strong>
                    </div>

                    <div className="flex justify-between sm:flex-col border-b sm:border-b-0 sm:border-r border-slate-800 pb-2 sm:pb-0 sm:pr-3">
                      <span className="text-slate-400">Renovation Cost:</span>
                      <strong className="text-white font-bold text-sm sm:mt-1">
                        ₹{renovationCost > 0 ? (renovationCost / 100000).toFixed(2) : '2.0'} Lakhs
                      </strong>
                    </div>

                    <div className="flex justify-between sm:flex-col">
                      <span className="text-slate-400">Target Resale Price:</span>
                      <strong className="text-emerald-400 font-extrabold text-sm sm:mt-1">
                        ₹{expectedSalePrice > 0 ? (expectedSalePrice / 100000).toFixed(2) : '26.0'} Lakhs
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Official PDF Brochure Download Card (If available) */}
            {project.pdfUrl && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 shrink-0">
                    <i className="fa-solid fa-file-pdf text-2xl"></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Official Project Brochure (PDF)</h4>
                    <p className="text-xs text-slate-300">Download complete layout plans, title verification & financial schedule.</p>
                  </div>
                </div>

                <a
                  href={project.pdfUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-600/20 transition-all"
                >
                  <i className="fa-solid fa-download"></i> Download PDF
                </a>
              </div>
            )}

            {/* Project Overview & Description */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <i className="fa-solid fa-file-lines text-orange-500 text-sm"></i> About This Property
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                {description || "Residential plot is spread across land on Yamuna Expressway and situated close to education, residential and commercial hubs of the city. The preferential location plot is facing the green belt with planned airport in Jewar, mall and large integrated townships nearby. The USP of the property is its strategic location with schools, research institutes, ATMs, banks and retail outlets in close proximity."}
              </p>
            </div>
          </div>

          {/* Right Column (Dynamic Sidebar: Interactive ROI Calculator for Investment Deals OR Direct Booking Card for Hot Deals) */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              {(investmentModel === 'co_investment' || investmentModel === 'renovate_flip') ? (
                /* Scenario-Based Financial Return Card */
                <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-6 shadow-2xl backdrop-blur-xl">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-orange-400">
                      Interactive ROI Calculator
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      {investmentModel === 'renovate_flip' ? 'Scenario 2: Flip Return' : 'Scenario 1: Co-Investment Pool'}
                    </h3>
                  </div>

                  {/* Key Deal Numbers */}
                  {investmentModel === 'renovate_flip' ? (
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Total Purchase & Renovation:</span>
                        <span className="font-bold text-white">{formatLakhs(totalFlipOutlay || 2200000)}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Target Resale Price:</span>
                        <span className="font-bold text-emerald-400">{formatLakhs(expectedSalePrice || 2600000)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-sm text-amber-400 pt-1">
                        <span>Target Net Profit:</span>
                        <span>+₹{flipProfit > 0 ? (flipProfit / 100000).toFixed(2) : '4.0'} Lakhs ({flipRoi}%)</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Total Project Valuation:</span>
                        <span className="font-bold text-white">{price || formatLakhs(totalValuation)}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span className="text-slate-400">Min. Entry Ticket:</span>
                        <span className="font-bold text-white">{formatLakhs(minInvestment || 500000)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-sm text-amber-400 pt-1">
                        <span>Projected Annual ROI:</span>
                        <span>+{expectedRoi}% p.a.</span>
                      </div>
                    </div>
                  )}

                  {/* Live Interactive Investment Range Slider & Return Display */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-400">Select Investment Amount:</span>
                      <span className="text-orange-400 text-sm font-extrabold">{formatLakhs(investAmount)}</span>
                    </div>

                    <input
                      type="range"
                      min={defaultMin}
                      max={totalValuation > 0 ? totalValuation : 10000000}
                      step={50000}
                      value={investAmount}
                      onChange={(e) => setInvestAmount(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    />

                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Projected Net Profit:</span>
                        <span className="font-bold text-emerald-400">+₹{(activeProjectedProfit / 100000).toFixed(2)} Lakhs</span>
                      </div>

                      <div className="flex justify-between text-sm font-extrabold pt-1 border-t border-slate-800/60">
                        <span className="text-slate-200">Total Estimated Return:</span>
                        <span className="text-emerald-300">₹{(activeProjectedReturn / 100000).toFixed(2)} Lakhs</span>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Action Button */}
                  <a
                    href={`https://wa.me/919586505111?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer transform active:scale-95"
                  >
                    <i className="fa-brands fa-whatsapp text-lg"></i>
                    Enquire & Invest via WhatsApp
                  </a>
                </div>
              ) : (
                /* Direct Sale Price & Booking Card */
                <div className="rounded-3xl border border-orange-500/30 bg-slate-900 p-6 space-y-6 shadow-2xl backdrop-blur-xl">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400 flex items-center gap-1.5">
                      <i className="fa-solid fa-fire text-orange-500 text-xs"></i> HOT PRODUCT FOR SALE
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">Direct Property Booking</h3>
                  </div>

                  {/* Price Display */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                    <span className="block text-[11px] font-semibold uppercase text-slate-400">Total Purchase Price</span>
                    <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-amber-500 block">
                      {price || '₹ 1.25 Crore'}
                    </span>
                    <span className="text-xs font-semibold text-emerald-400 block">
                      {project.perSqftPrice || project.perSqydPrice || 'Best Negotiable Market Price'}
                    </span>
                  </div>

                  {/* Facilities List */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                      Included Facilities & Specifications
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 font-normal">Plot / Total Area:</span>
                        <strong className="text-white">{project.plotAreaSqft || project.builtUpArea || '264 sqyd (220.74 sq.m.)'}</strong>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 font-normal">Facing / Config:</span>
                        <strong className="text-amber-400">{project.facing || project.configuration || 'North-East'}</strong>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 font-normal">Possession / Age:</span>
                        <strong className="text-emerald-400">{project.possession || project.propertyAge || 'Immediate'}</strong>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 font-normal">Ownership Type:</span>
                        <strong className="text-emerald-400">{project.ownership || 'Freehold'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Direct Action Buttons */}
                  <div className="space-y-3 pt-2">
                    <a
                      href={`https://wa.me/919586505111?text=${encodeURIComponent(`Hi Baba Broker! I am interested in buying this property:\n*${title}*\n📍 ${itemLocation}\n💰 Price: ${price || '₹ 1.25 Crore'}\n\nPlease contact me with site visit & booking schedule.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer transform active:scale-95"
                    >
                      <i className="fa-brands fa-whatsapp text-lg"></i>
                      Enquire & Book via WhatsApp
                    </a>

                    <a
                      href="tel:+919586505111"
                      className="w-full py-3.5 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <i className="fa-solid fa-phone text-orange-400"></i>
                      Call Sales Desk Directly
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
