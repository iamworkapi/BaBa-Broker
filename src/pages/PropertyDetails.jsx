import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { safeEmbedUrl } from '../utils/sanitize';

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
  image: 'https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg',
  images: [
    'https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg',
    'https://realtyhunting.com/wp-content/uploads/2026/03/Gemini_Generated_Image_2btgk62btgk62btg.png',
  ],
  videoUrl: '',
  description: 'Prime 3BHK modern luxury flat with automated smart home features. 60% funded by co-investors, 40% remaining available for investment. Projected 22% ROI per annum with guaranteed transparent legal title.',
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
  if (typeof val === 'number') return '₹' + val.toLocaleString('en-IN');
  const str = String(val).trim();
  const digits = str.replace(/[^\d]/g, '');
  if (digits && Number(digits) > 0) return '₹' + Number(digits).toLocaleString('en-IN');
  return str.startsWith('₹') ? str : `₹${str}`;
}

function AnimatedNumber({ value, duration = 1.4, prefix = '', suffix = '', className = '', format = false }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (!isInView) return;
    const target = Number(value) || 0;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      setDisplay(format ? `₹${current.toLocaleString('en-IN')}` : `${prefix}${current}${suffix}`);
      if (progress < 1) requestAnimationFrame(step);
    };
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [isInView, value, duration, prefix, suffix, format]);

  return <span ref={ref} className={className}>{display}</span>;
}

const sectionMotion = {
  hidden: { opacity: 0, y: 36 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 26, mass: 0.9, delay: i * 0.07 },
  }),
};

export default function PropertyDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const project = location.state?.project || defaultFallbackProject;
  const headerRef = useRef(null);
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 200], [0, -30]);
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.6]);

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
    expectedRoi: roi = 20,
    purchasePrice = 0,
    renovationCost = 0,
    expectedSalePrice = 0,
    holdingPeriodMonths = 6,
    investorsList = [],
  } = project;

  const galleryList = Array.isArray(images) && images.length > 0 ? images : image ? [image] : [];
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState(videoUrl ? 'video' : 'photos');
  const defaultMin = minInvestment > 0 ? minInvestment : 100000;
  const [investAmount, setInvestAmount] = useState(defaultMin);

  const activeInvestorsCount = Array.isArray(investorsList) && investorsList.length > 0 ? investorsList.length : investorsCount || 0;
  const calculatedFundedPct = Array.isArray(investorsList) && investorsList.length > 0
    ? investorsList.reduce((sum, item) => sum + (Number(item.sharePercentage) || 0), 0)
    : fundedPercentage || 0;
  const activeFundedPercentage = Math.min(100, Math.max(0, calculatedFundedPct));
  const remainingPercentage = Math.max(0, 100 - activeFundedPercentage);
  const totalFlipOutlay = (purchasePrice || 0) + (renovationCost || 0);
  const flipProfit = (expectedSalePrice || 0) - totalFlipOutlay;
  const flipRoi = totalFlipOutlay > 0 ? ((flipProfit / totalFlipOutlay) * 100).toFixed(1) : 0;
  const projectedProfitScenario1 = Math.round((investAmount * roi) / 100);
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
    `Hello Baba Broker Team!\n\nI am interested in investing in your project:\n📌 *${title}*\n📍 Location: ${itemLocation}\n⚡ Planned Investment: ₹${(investAmount / 100000).toFixed(2)} Lakhs\n📈 Projected Return: ₹${(activeProjectedReturn / 100000).toFixed(2)} Lakhs\n\nPlease share complete details & schedule a site visit.`
  );

  const formatLakhs = (amt) => {
    const num = Number(amt) || 0;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    return `₹${(num / 100000).toFixed(2)} Lakhs`;
  };

  const statusBadgeColors = {
    delivered: 'bg-emerald-500 shadow-emerald-500/40',
    upcoming: 'bg-blue-600 shadow-blue-600/40',
    running: 'bg-orange-500 shadow-orange-500/40',
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-['Roboto',sans-serif] pt-24 pb-24 selection:bg-orange-500 selection:text-white overflow-hidden">
      <div className="fixed top-20 left-10 h-[450px] w-[450px] rounded-full bg-orange-600/10 blur-[150px] pointer-events-none" />
      <div className="fixed bottom-20 right-10 h-[450px] w-[450px] rounded-full bg-amber-500/10 blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* ── Breadcrumb ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          className="mb-6 flex items-center justify-between"
        >
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
        </motion.div>

        {/* ── Hero Header ── */}
        <motion.div
          ref={headerRef}
          style={{ y: headerY, opacity: headerOpacity }}
          className="mb-8 rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              <motion.div className="flex flex-wrap items-center gap-2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, type: 'spring' }}>
                <span className={`rounded-lg px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm ${statusBadgeColors[status] || statusBadgeColors.running}`}>
                  {status === 'running' ? '🚀 ' : status === 'delivered' ? '✅ ' : '⏳ '}{status.toUpperCase()}
                </span>
                <span className="rounded-lg bg-slate-950 border border-slate-800 px-3 py-1 text-[11px] font-semibold uppercase text-slate-300">
                  {propertyType === 'residential' ? bhk.toUpperCase() : propertyType.toUpperCase()}
                </span>
                <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[11px] font-semibold uppercase text-amber-400">
                  {investmentModel === 'renovate_flip' ? 'Buy, Renovate & Flip' : 'Fractional Co-Investment'}
                </span>
                {tag && <span className="rounded-lg bg-orange-500/10 border border-orange-500/20 px-3 py-1 text-[11px] font-semibold text-orange-400">{tag}</span>}
              </motion.div>

              <motion.h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                {title}
              </motion.h1>

              <motion.p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 font-normal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                <i className="fa-solid fa-location-dot text-orange-500"></i>
                <span>{itemLocation}</span>
              </motion.p>
            </motion.div>

            <motion.div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 shrink-0 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shadow-xl" initial={{ opacity: 0, scale: 0.9, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}>
              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 lg:text-right">Total Project Valuation</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-amber-500 block">
                  {formatCommaPrice(totalValuation || price)}
                </span>
                <span className="block text-[10px] font-normal text-slate-400 lg:text-right mt-0.5">(Total Selling Price)</span>
              </div>
              <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                +{investmentModel === 'renovate_flip' ? `${flipRoi}% Net Profit` : `${roi}% Annual ROI`}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* ── 4-Key Metrics ── */}
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }} initial="hidden" animate="visible" viewport={{ once: true, margin: '-40px' }}>
          {[
            { label: 'Target Annual ROI', value: `+${roi}%`, sub: 'p.a.', icon: 'fa-solid fa-arrow-trend-up', color: 'text-amber-400', bg: '' },
            { label: 'Co-Investor Funded', value: `${activeFundedPercentage}%`, sub: 'Funded', icon: 'fa-solid fa-chart-pie', color: 'text-white', accent: 'text-orange-500', bg: '' },
            { label: 'Min. Entry Investment', value: formatLakhs(minInvestment || 500000), sub: '', icon: 'fa-solid fa-wallet', color: 'text-emerald-400', bg: '' },
            { label: 'Available Equity', value: `${remainingPercentage}%`, sub: 'Available', icon: 'fa-solid fa-lock-open', color: 'text-orange-400', bg: '' },
          ].map((metric, idx) => (
            <motion.div key={metric.label} variants={sectionMotion} custom={idx} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-lg hover:border-orange-500/20 transition-colors duration-300">
              <span className="text-[11px] font-medium uppercase text-slate-400 block mb-1.5">{metric.label}</span>
              <div className={`text-lg sm:text-xl font-extrabold ${metric.color} flex items-center gap-1.5`}>
                <i className={`${metric.icon} text-xs ${metric.accent || ''}`}></i>
                {metric.label.includes('ROI') || metric.label.includes('Entry') || metric.label.includes('Min') ? (
                  metric.value
                ) : (
                  <AnimatedNumber value={metric.value.replace(/[^0-9]/g, '')} suffix={`${metric.sub === 'p.a.' ? '% p.a.' : metric.sub === 'Funded' ? '% Funded' : metric.sub === 'Available' ? '% Available' : metric.sub}`} duration={1.2} />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Main Grid ── */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            {/* Media Gallery */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ type: 'spring', stiffness: 180, damping: 22 }} className="rounded-3xl border border-slate-800 bg-slate-900 p-4 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  {['photos', 'video'].filter(t => t === 'photos' || videoUrl).map((tab) => (
                    <button key={tab} onClick={() => setActiveMediaTab(tab)} className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeMediaTab === tab ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30' : 'bg-slate-950 text-slate-400 hover:text-white'}`}>
                      <i className={`${tab === 'photos' ? 'fa-solid fa-images' : 'fa-solid fa-circle-play'} text-xs mr-1.5`}></i>
                      {tab === 'photos' ? `Photo Gallery (${galleryList.length})` : 'Video Presentation'}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">Interactive High-Res Media</span>
              </div>

              {activeMediaTab === 'video' && videoUrl ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="aspect-video w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800">
                  {(() => {
                    const embedSrc = safeEmbedUrl(videoUrl);
                    if (embedSrc) return <iframe src={embedSrc} title="Project Video Tour" className="h-full w-full border-0" allowFullScreen />;
                    return <video src={videoUrl} controls className="h-full w-full object-contain" />;
                  })()}
                </motion.div>
              ) : (
                <div className="space-y-3">
                  <motion.div whileHover={{ scale: 1.005 }} transition={{ type: 'spring', stiffness: 300 }} className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 group cursor-pointer">
                    <img
                      src={galleryList[activeImgIndex] || 'https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg'}
                      alt={title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute bottom-3 left-3 rounded-lg bg-slate-950/80 border border-slate-800 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                      Photo {activeImgIndex + 1} of {galleryList.length}
                    </span>
                  </motion.div>

                  {galleryList.length > 1 && (
                    <motion.div className="flex items-center gap-2.5 overflow-x-auto py-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                      {galleryList.map((imgUrl, idx) => (
                        <motion.button key={idx} onClick={() => { setActiveImgIndex(idx); setActiveMediaTab('photos'); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`relative h-16 w-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${activeImgIndex === idx && activeMediaTab === 'photos' ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-slate-800 opacity-60 hover:opacity-100'}`}>
                          <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} loading="lazy" className="h-full w-full object-cover" />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Specifications */}
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ type: 'spring', stiffness: 180, damping: 22 }} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-orange-400">Property Parameters & Architecture</span>
                  <motion.h3 className="text-xl font-bold text-white mt-0.5" initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>Specifications & Features</motion.h3>
                </div>
                {investmentModel === 'renovate_flip' && (
                  <motion.div initial={{ scale: 0.8, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                    <span className="block text-[10px] font-semibold uppercase text-emerald-400">Target Net Profit</span>
                    <strong className="text-base font-extrabold text-emerald-300">+₹{flipProfit > 0 ? (flipProfit / 100000).toFixed(2) : '4.0'} Lakhs</strong>
                  </motion.div>
                )}
              </div>

              {/* Spec Cards Grid */}
              {propertyType === 'commercial' ? (
                <motion.div className="space-y-4" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
                  {[
                    { label: 'Plot Area', value: project.plotAreaSqft || '264 sqyd (220.74 sq.m.)', accent: true },
                    { label: 'Built-up Area', value: project.builtUpArea || '264 sqyd (220.74 sq.m.)', accent: false },
                    { label: 'Carpet Area', value: project.carpetArea || '235 sqyd (196.49 sq.m.)', accent: true },
                    { label: 'Per Sqyd Rate', value: project.perSqydPrice || '₹ 5,30,303 per sqyd', accent: 'emerald' },
                    { label: 'Configuration', value: project.configuration || 'Commercial Office/Space', accent: 'orange' },
                    { label: 'Washrooms', value: project.washrooms || '5 Washrooms', accent: false },
                    { label: 'Property Age', value: project.propertyAge || '1 to 5 Year Old', accent: false },
                    { label: 'Transaction Type', value: project.transactionType || 'Resale', accent: false },
                    { label: 'Property Ownership', value: project.ownership || 'Freehold', accent: 'emerald' },
                  ].map((item) => (
                    <motion.div key={item.label} variants={sectionMotion} className={`rounded-2xl border ${item.accent === true ? 'border-amber-500/30 bg-slate-950' : item.accent === 'emerald' ? 'border-emerald-500/30 bg-slate-950' : item.accent === 'orange' ? 'border-orange-500/30 bg-slate-950' : 'border-slate-800 bg-slate-950'} p-4`}>
                      <span className={`block text-[10px] font-semibold uppercase ${item.accent === true || item.accent === 'orange' ? 'text-amber-400' : item.accent === 'emerald' ? 'text-emerald-400' : 'text-slate-400'}`}>{item.label}</span>
                      <strong className="text-sm font-bold text-white mt-1 block">{item.value}</strong>
                    </motion.div>
                  ))}
                  <motion.div variants={sectionMotion} className="rounded-2xl border border-emerald-500/30 bg-slate-950 p-5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5"><i className="fa-solid fa-building-flag text-xs"></i> Commercial Building Amenities</span>
                    <div className="flex flex-wrap gap-2 pt-1">{(project.amenities || 'Service / Goods Lift, Centrally Air Conditioned, Banquet Hall, Bar / Lounge, Conference room, Private Garden / Terrace, Intercom Facility, Lift(s), Water Storage, Piped-gas').split(',').map((it, idx) => (
                      <motion.span key={idx} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.04 }} className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-check text-[10px] text-emerald-400"></i>{it.trim()}
                      </motion.span>
                    ))}</div>
                  </motion.div>
                </motion.div>
              ) : propertyType === 'plot' ? (
                <motion.div className="space-y-4" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }}>
                  {[
                    { label: 'Plot Dimensions', value: `${project.plotAreaSqft || '5381.96 sqft'} (${project.plotAreaSqm || '500 sq.m.'})`, accent: true },
                    { label: 'Per Sqft Price Rate', value: project.perSqftPrice || '₹ 2,323 per sqft', accent: 'emerald' },
                    { label: 'Plot Facing', value: project.facing || 'North-East', accent: 'orange' },
                    { label: 'Gated Society', value: project.gatedSociety || 'YES', accent: 'emerald' },
                    { label: 'Road Width', value: project.roadWidthFeet || '66.0 Feet', accent: false },
                    { label: 'Boundary Wall', value: project.boundaryWall || 'YES', accent: 'emerald' },
                    { label: 'No. of Open Sides', value: project.openSides || '1', accent: 'amber' },
                    { label: 'Overlooking', value: project.overlooking || 'Pool', accent: 'blue' },
                    { label: 'Possession', value: project.possession || 'Immediate', accent: 'emerald' },
                    { label: 'Transaction Type', value: project.transactionType || 'Resale', accent: false },
                    { label: 'Property Ownership', value: project.ownership || 'Freehold', accent: 'emerald' },
                  ].map((item) => (
                    <motion.div key={item.label} variants={sectionMotion} className={`rounded-2xl border ${item.accent === true ? 'border-amber-500/30' : item.accent === 'emerald' ? 'border-emerald-500/30' : item.accent === 'amber' ? 'border-amber-500/30' : item.accent === 'blue' ? 'border-blue-500/30' : 'border-slate-800'} bg-slate-950 p-4`}>
                      <span className={`block text-[10px] font-semibold uppercase ${item.accent === true ? 'text-amber-400' : item.accent === 'emerald' ? 'text-emerald-400' : item.accent === 'amber' ? 'text-amber-400' : item.accent === 'blue' ? 'text-blue-400' : 'text-slate-400'}`}>{item.label}</span>
                      <strong className="text-sm font-bold text-white mt-1 block">{item.value}</strong>
                    </motion.div>
                  ))}
                  <motion.div variants={sectionMotion} className="rounded-2xl border border-amber-500/30 bg-slate-950 p-5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5"><i className="fa-solid fa-star text-xs"></i> Key Highlights of Property</span>
                    <div className="flex flex-wrap gap-2 pt-1">{(project.highlights || 'Gated Society, On 66 ft Wide Road, Overlooking Swimming Pool, North-East Facing').split(',').map((it, idx) => (
                      <motion.span key={idx} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.04 }} className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                        <i className="fa-solid fa-circle-check text-[10px] text-amber-400"></i>{it.trim()}
                      </motion.span>
                    ))}</div>
                  </motion.div>
                  <motion.div variants={sectionMotion} className="rounded-2xl border border-emerald-500/30 bg-slate-950 p-5 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5"><i className="fa-solid fa-shield-halved text-xs"></i> Plot Amenities</span>
                    <div className="flex flex-wrap gap-2 pt-1">{(project.amenities || 'Gated Society, Water Storage, Rain Water Harvesting').split(',').map((it, idx) => (
                      <motion.span key={idx} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.04 }} className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                        <i className="fa-solid fa-droplet text-[10px] text-emerald-400"></i>{it.trim()}
                      </motion.span>
                    ))}</div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } }} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  {[
                    { label: 'Construction Year', value: project.constructionYear || '2016', color: '' },
                    { label: 'BHK Category', value: bhk.toUpperCase(), color: 'text-orange-400' },
                    { label: 'Total Flat Size', value: project.sizeSqft || '1200 sqft', color: '' },
                    { label: 'Floor Level', value: project.floor || '2nd Floor', color: 'text-amber-400' },
                    { label: 'Lift Facility', value: project.lift || 'YES', color: 'text-emerald-400' },
                    { label: 'Parking Space', value: project.parking || 'CAR + BIKE', color: '' },
                  ].map((item) => (
                    <motion.div key={item.label} variants={sectionMotion} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                      <span className="block text-[10px] font-semibold uppercase text-slate-400">{item.label}</span>
                      <strong className={`text-sm font-bold ${item.color || 'text-white'} mt-1 block`}>{item.value}</strong>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {investmentModel === 'renovate_flip' && (
                <motion.div initial={{ opacity: 0, height: 0 }} whileInView={{ opacity: 1, height: 'auto' }} transition={{ delay: 0.2 }} className="rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">Scenario 2: Financial Outlay Breakdown</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                    {[
                      { label: 'Purchase Price:', value: `₹${(purchasePrice > 0 ? purchasePrice / 100000 : 20).toFixed(2)} Lakhs` },
                      { label: 'Renovation Cost:', value: `₹${(renovationCost > 0 ? renovationCost / 100000 : 2).toFixed(2)} Lakhs` },
                      { label: 'Target Resale Price:', value: `₹${(expectedSalePrice > 0 ? expectedSalePrice / 100000 : 26).toFixed(2)} Lakhs`, accent: true },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between sm:flex-col border-b sm:border-b-0 sm:border-r border-slate-800 pb-2 sm:pb-0 sm:pr-3">
                        <span className="text-slate-400">{row.label}</span>
                        <strong className={`font-bold text-sm sm:mt-1 ${row.accent ? 'text-emerald-400' : 'text-white'}`}>{row.value}</strong>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* PDF Card */}
            {project.pdfUrl && (
              <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ type: 'spring', stiffness: 180 }} className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl hover:border-emerald-400/50 transition-colors">
                <div className="flex items-center gap-3">
                  <motion.div whileHover={{ rotate: -5, scale: 1.1 }} className="grid h-12 w-12 place-items-center rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 shrink-0">
                    <i className="fa-solid fa-file-pdf text-2xl"></i>
                  </motion.div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Official Project Brochure (PDF)</h4>
                    <p className="text-xs text-slate-300">Download complete layout plans, title verification & financial schedule.</p>
                  </div>
                </div>
                <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} href={project.pdfUrl} download target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-lg shadow-emerald-600/20 transition-all">
                  <i className="fa-solid fa-download"></i> Download PDF
                </motion.a>
              </motion.div>
            )}

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ type: 'spring', stiffness: 180 }} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                <i className="fa-solid fa-file-lines text-orange-500 text-sm"></i> About This Property
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-normal">
                {description || "Residential plot is spread across land on Yamuna Expressway and situated close to education, residential and commercial hubs of the city. The preferential location plot is facing the green belt with planned airport in Jewar, mall and large integrated townships nearby. The USP of the property is its strategic location with schools, research institutes, ATMs, banks and retail outlets in close proximity."}
              </p>
            </motion.div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">
            <div className="sticky top-28 space-y-6">
              {(investmentModel === 'co_investment' || investmentModel === 'renovate_flip') ? (
                <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ type: 'spring', stiffness: 180, damping: 22 }} className="rounded-3xl border border-slate-800 bg-slate-900 p-6 space-y-6 shadow-2xl backdrop-blur-xl">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-orange-400">Interactive ROI Calculator</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{investmentModel === 'renovate_flip' ? 'Scenario 2: Flip Return' : 'Scenario 1: Co-Investment Pool'}</h3>
                  </div>

                  {investmentModel === 'renovate_flip' ? (
                    <motion.div className="space-y-3 text-xs" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                      {[
                        { label: 'Total Purchase & Renovation:', value: formatLakhs(totalFlipOutlay || 2200000) },
                        { label: 'Target Resale Price:', value: formatLakhs(expectedSalePrice || 2600000), accent: true },
                        { label: 'Target Net Profit:', value: `+₹${flipProfit > 0 ? (flipProfit / 100000).toFixed(2) : '4.0'} Lakhs (${flipRoi}%)`, accent: 'amber' },
                      ].map((row) => (
                        <motion.div key={row.label} variants={sectionMotion} className={`flex justify-between border-b border-slate-800 pb-2 ${row.accent === 'amber' ? 'font-bold text-sm pt-1' : ''}`}>
                          <span className="text-slate-400">{row.label}</span>
                          <span className={`font-bold ${row.accent === true ? 'text-emerald-400' : row.accent === 'amber' ? 'text-amber-400' : 'text-white'}`}>{row.value}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div className="space-y-3 text-xs" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                      {[
                        { label: 'Total Project Valuation:', value: price || formatLakhs(totalValuation) },
                        { label: 'Min. Entry Ticket:', value: formatLakhs(minInvestment || 500000) },
                        { label: 'Projected Annual ROI:', value: `+${roi}% p.a.`, accent: true },
                      ].map((row) => (
                        <motion.div key={row.label} variants={sectionMotion} className={`flex justify-between border-b border-slate-800 pb-2 ${row.accent ? 'font-bold text-sm pt-1' : ''}`}>
                          <span className="text-slate-400">{row.label}</span>
                          <span className={`font-bold ${row.accent ? 'text-amber-400' : 'text-white'}`}>{row.value}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-4">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-400">Select Investment Amount:</span>
                      <motion.span key={investAmount} initial={{ scale: 1.2, color: '#fbbf24' }} animate={{ scale: 1, color: '#fb923c' }} transition={{ type: 'spring', stiffness: 300 }} className="text-orange-400 text-sm font-extrabold">{formatLakhs(investAmount)}</motion.span>
                    </div>
                    <input type="range" min={defaultMin} max={totalValuation > 0 ? totalValuation : 10000000} step={50000} value={investAmount} onChange={(e) => setInvestAmount(Number(e.target.value))} className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">Projected Net Profit:</span>
                        <span className="font-bold text-emerald-400">+₹{(activeProjectedProfit / 100000).toFixed(2)} Lakhs</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold pt-1 border-t border-slate-800/60">
                        <span className="text-slate-200">Total Estimated Return:</span>
                        <AnimatedNumber value={Math.round(activeProjectedReturn / 100000) * 100000} prefix="₹" suffix=" Lakhs" duration={0.8} />
                      </div>
                    </div>
                  </motion.div>

                  <motion.a href={`https://wa.me/919586505111?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer">
                    <i className="fa-brands fa-whatsapp text-lg"></i> Enquire & Invest via WhatsApp
                  </motion.a>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ type: 'spring', stiffness: 180, damping: 22 }} className="rounded-3xl border border-orange-500/30 bg-slate-900 p-6 space-y-6 shadow-2xl backdrop-blur-xl">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400 flex items-center gap-1.5"><i className="fa-solid fa-fire text-orange-500 text-xs"></i> HOT PRODUCT FOR SALE</span>
                    <h3 className="text-xl font-bold text-white mt-1">Direct Property Booking</h3>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                    <span className="block text-[11px] font-semibold uppercase text-slate-400">Total Purchase Price</span>
                    <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-amber-500 block">{price || '₹ 1.25 Crore'}</span>
                    <span className="text-xs font-semibold text-emerald-400 block">{project.perSqftPrice || project.perSqydPrice || 'Best Negotiable Market Price'}</span>
                  </motion.div>

                  <motion.div className="space-y-3" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">Included Facilities & Specifications</span>
                    {[
                      { label: 'Plot / Total Area:', value: project.plotAreaSqft || project.builtUpArea || '264 sqyd (220.74 sq.m.)', color: 'text-white' },
                      { label: 'Facing / Config:', value: project.facing || project.configuration || 'North-East', color: 'text-amber-400' },
                      { label: 'Possession / Age:', value: project.possession || project.propertyAge || 'Immediate', color: 'text-emerald-400' },
                      { label: 'Ownership Type:', value: project.ownership || 'Freehold', color: 'text-emerald-400' },
                    ].map((row) => (
                      <motion.div key={row.label} variants={sectionMotion} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-slate-400 font-normal text-xs">{row.label}</span>
                        <strong className={`text-xs ${row.color}`}>{row.value}</strong>
                      </motion.div>
                    ))}
                  </motion.div>

                  <div className="space-y-3 pt-2">
                    <motion.a href={`https://wa.me/919586505111?text=${encodeURIComponent(`Hi Baba Broker! I am interested in buying this property:\n*${title}*\n📍 ${itemLocation}\n💰 Price: ${price || '₹ 1.25 Crore'}\n\nPlease contact me with site visit & booking schedule.`)}`} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer">
                      <i className="fa-brands fa-whatsapp text-lg"></i> Enquire & Book via WhatsApp
                    </motion.a>
                    <motion.a href="tel:+919586505111" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} className="w-full py-3.5 rounded-xl border border-slate-700 bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer">
                      <i className="fa-solid fa-phone text-orange-400"></i> Call Sales Desk Directly
                    </motion.a>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
