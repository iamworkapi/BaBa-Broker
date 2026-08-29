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
  const headerY = useTransform(scrollY, [0, 300], [0, 100]);
  const headerOpacity = useTransform(scrollY, [0, 300], [1, 0.4]);

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
    minInvestment = 500000,
    expectedRoi: roi = 20,
    purchasePrice = 0,
    renovationCost = 0,
    expectedSalePrice = 0,
    investorsList = [],
  } = project;

  const galleryList = Array.isArray(images) && images.length > 0 ? images : image ? [image] : [];
  const [activeMediaTab, setActiveMediaTab] = useState(videoUrl ? 'video' : 'photos');
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const defaultMin = minInvestment > 0 ? minInvestment : 100000;
  const [investAmount, setInvestAmount] = useState(defaultMin);

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
    document.title = `${title} | Baba Broker Premium Investments`;
  }, [title]);

  const whatsappMessage = encodeURIComponent(
    `Hello Baba Broker Team!\n\nI am interested in investing in your premium project:\n📌 *${title}*\n📍 Location: ${itemLocation}\n⚡ Planned Investment: ₹${(investAmount / 100000).toFixed(2)} Lakhs\n📈 Projected Return: ₹${(activeProjectedReturn / 100000).toFixed(2)} Lakhs\n\nPlease share complete details & schedule a private discussion.`
  );

  const formatLakhs = (amt) => {
    const num = Number(amt) || 0;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    return `₹${(num / 100000).toFixed(2)} Lakhs`;
  };

  const statusBadgeColors = {
    delivered: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    upcoming: 'bg-blue-600/20 text-blue-400 border border-blue-600/30',
    running: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  };

  return (
    <div className="bg-[#020617] min-h-screen text-slate-100 font-['Roboto',sans-serif] selection:bg-orange-500 selection:text-white pb-24 overflow-x-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[600px] bg-orange-600/10 rounded-full blur-[160px] pointer-events-none mix-blend-screen" />
      
      {/* Navbar Spacing */}
      <div className="h-20 w-full" />

      {/* --- IMMERSIVE HERO SECTION --- */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between relative z-20"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-700/50 bg-slate-900/60 px-5 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-orange-500/50 hover:bg-slate-800 transition-all backdrop-blur-md cursor-pointer"
          >
            <i className="fa-solid fa-arrow-left text-orange-400"></i> Back to Directory
          </button>
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-full backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_#34d399]"></span> Premium Verified
          </span>
        </motion.div>

        <motion.div 
          ref={headerRef}
          style={{ y: headerY, opacity: headerOpacity }}
          className="relative w-full h-[55vh] min-h-[450px] max-h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800/60 group"
        >
          <img 
            src={galleryList[0] || image || 'https://via.placeholder.com/1200x800'} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/50 to-transparent opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617]/80 via-transparent to-transparent opacity-80" />
          
          <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 flex flex-col justify-end">
            <motion.div className="flex flex-wrap items-center gap-3 mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <span className={`rounded-lg px-3.5 py-1.5 text-[10px] font-extrabold uppercase tracking-widest shadow-lg backdrop-blur-md ${statusBadgeColors[status] || statusBadgeColors.running}`}>
                {status === 'running' ? '🚀 Active Funding' : status === 'delivered' ? '✅ Delivered' : '⏳ Upcoming'}
              </span>
              <span className="rounded-lg bg-slate-900/60 border border-slate-700/50 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-200 backdrop-blur-md">
                {propertyType === 'residential' ? bhk : propertyType}
              </span>
              <span className="rounded-lg bg-orange-500/20 border border-orange-500/30 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-orange-400 backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.15)]">
                {investmentModel === 'renovate_flip' ? 'Buy, Renovate & Flip' : 'Fractional Co-Investment'}
              </span>
              {tag && <span className="rounded-lg bg-amber-500/20 border border-amber-500/30 px-3.5 py-1.5 text-[10px] font-bold tracking-widest text-amber-400 backdrop-blur-md">{tag}</span>}
            </motion.div>

            <motion.h1 
              className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight mb-3 drop-shadow-xl" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h1>

            <motion.div 
              className="flex items-center gap-2 text-sm sm:text-base text-slate-300 font-medium drop-shadow-md" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.3 }}
            >
              <div className="w-8 h-8 rounded-full bg-slate-800/60 border border-slate-600/50 flex items-center justify-center backdrop-blur-md">
                <i className="fa-solid fa-location-dot text-orange-400 text-xs"></i>
              </div>
              {itemLocation}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* --- CONTENT GRID --- */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 mt-8 lg:-mt-16">
        
        {/* Floating 4-Metrics Bar (Pulled up over the hero slightly on LG) */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } } }} 
          initial="hidden" 
          animate="visible"
        >
          {[
            { label: 'Target Annual ROI', value: `+${roi}%`, sub: 'p.a.', icon: 'fa-solid fa-arrow-trend-up', color: 'from-orange-400 to-amber-400' },
            { label: 'Total Valuation', value: formatLakhs(totalValuation || price), sub: 'Value', icon: 'fa-solid fa-gem', color: 'from-blue-400 to-indigo-400' },
            { label: 'Min. Investment', value: formatLakhs(minInvestment || 500000), sub: 'Entry', icon: 'fa-solid fa-wallet', color: 'from-emerald-400 to-teal-400' },
            { label: 'Available Equity', value: `${remainingPercentage}%`, sub: 'Open', icon: 'fa-solid fa-lock-open', color: 'from-orange-400 to-red-400' },
          ].map((metric, idx) => (
            <motion.div 
              key={metric.label} 
              variants={sectionMotion} 
              className="group rounded-[1.5rem] bg-slate-900/80 border border-slate-800/80 p-5 backdrop-blur-xl shadow-xl hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] hover:border-slate-700 transition-all duration-500 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500 transform group-hover:scale-110">
                <i className={`${metric.icon} text-6xl text-white`}></i>
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{metric.label}</span>
                <div>
                  <span className={`text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${metric.color}`}>
                    {metric.label.includes('ROI') || metric.label.includes('Equity') ? (
                      metric.value
                    ) : (
                      <AnimatedNumber value={metric.value.replace(/[^0-9.]/g, '')} prefix="₹" suffix={metric.value.includes('Cr') ? ' Cr' : ' L'} duration={1.2} />
                    )}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Details & Gallery */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Beautiful Bento Box Media Gallery */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: '-50px' }}
              className="rounded-[2rem] border border-slate-800/60 bg-slate-900/50 backdrop-blur-lg p-5 shadow-2xl"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 px-2 gap-3">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200">Media Gallery</h3>
                <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                  {['photos', 'video'].filter(t => t === 'photos' || videoUrl).map((tab) => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveMediaTab(tab)} 
                      className={`px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all ${activeMediaTab === tab ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {activeMediaTab === 'video' && videoUrl ? (
                <div className="aspect-video w-full overflow-hidden rounded-[1.5rem] bg-[#020617] border border-slate-800 shadow-inner">
                  {(() => {
                    const embedSrc = safeEmbedUrl(videoUrl);
                    if (embedSrc) return <iframe src={embedSrc} title="Project Video Tour" className="h-full w-full border-0" allowFullScreen />;
                    return <video src={videoUrl} controls className="h-full w-full object-contain" />;
                  })()}
                </div>
              ) : (
                <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[300px] sm:h-[400px]">
                  <div className={`row-span-2 rounded-[1.5rem] overflow-hidden group cursor-pointer border border-slate-800/80 ${galleryList.length === 1 ? 'col-span-4' : 'col-span-3'}`} onClick={() => setShowGalleryModal(true)}>
                    <img src={galleryList[0] || 'https://via.placeholder.com/800'} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="Main View" />
                  </div>
                  
                  {galleryList.length > 1 && (
                    <div className="col-span-1 row-span-1 rounded-[1.25rem] overflow-hidden group cursor-pointer border border-slate-800/80" onClick={() => setShowGalleryModal(true)}>
                      <img src={galleryList[1]} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="View 2" />
                    </div>
                  )}
                  
                  {galleryList.length > 2 && (
                    <div className="col-span-1 row-span-1 rounded-[1.25rem] overflow-hidden group cursor-pointer border border-slate-800/80 relative" onClick={() => setShowGalleryModal(true)}>
                      <img src={galleryList[2]} className="w-full h-full object-cover transition duration-700 group-hover:scale-105" alt="View 3" />
                      {galleryList.length > 3 && (
                        <div className="absolute inset-0 bg-[#020617]/70 flex items-center justify-center backdrop-blur-sm group-hover:bg-[#020617]/50 transition-all">
                          <span className="text-white font-black text-sm sm:text-lg">+{galleryList.length - 3}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Premium Specifications */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true, margin: '-50px' }}
              className="rounded-[2rem] border border-slate-800/60 bg-slate-900/50 backdrop-blur-lg p-6 sm:p-8 shadow-2xl"
            >
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-6 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_#f97316]"></div>
                Property Specifications
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: 'Type', value: propertyType, accent: 'orange' },
                  { label: 'Config', value: bhk, accent: 'none' },
                  { label: 'Size', value: project.sizeSqft || project.plotAreaSqft || '1200 Sq.Ft', accent: 'none' },
                  { label: 'Facing', value: project.facing || 'North-East', accent: 'none' },
                  { label: 'Ownership', value: project.ownership || 'Freehold', accent: 'emerald' },
                  { label: 'Age', value: project.propertyAge || project.constructionYear || 'New Build', accent: 'none' },
                ].map((spec) => (
                  <div key={spec.label} className="p-4 rounded-[1rem] bg-[#020617]/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                    <span className="block text-[9px] font-bold uppercase tracking-widest text-slate-400 mb-1">{spec.label}</span>
                    <span className={`text-sm font-black uppercase ${spec.accent === 'orange' ? 'text-orange-400' : spec.accent === 'emerald' ? 'text-emerald-400' : 'text-slate-100'}`}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              {description && (
                <div className="mt-8 pt-8 border-t border-slate-800/60">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-200 mb-4">Investment Thesis & Description</h3>
                  <p className="text-slate-300/90 text-sm leading-loose font-medium">
                    {description}
                  </p>
                </div>
              )}

              {project.pdfUrl && (
                <div className="mt-8 p-6 rounded-[1.5rem] bg-gradient-to-br from-emerald-900/30 to-emerald-900/10 border border-emerald-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                      <i className="fa-solid fa-file-pdf text-xl"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Download Due Diligence Report</h4>
                      <p className="text-[11px] text-emerald-200/70 mt-1">Complete financial layout & legal checks.</p>
                    </div>
                  </div>
                  <a href={project.pdfUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#020617] font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] whitespace-nowrap">
                    Download PDF
                  </a>
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Investment Calculator (Sticky) */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: 0.5, type: 'spring' }}
                className="rounded-[2rem] border border-orange-500/30 bg-slate-900/70 backdrop-blur-xl p-1 shadow-2xl relative overflow-hidden"
              >
                {/* Glowing border effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-500"></div>

                <div className="p-6 sm:p-8 space-y-8">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-1 block">Live Dashboard</span>
                    <h2 className="text-xl font-black text-white tracking-tight">Investment Projection</h2>
                  </div>

                  {/* Funding Progress */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <span className="text-xs font-bold text-slate-300">Funded <span className="text-emerald-400">{activeFundedPercentage}%</span></span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">Goal: {formatLakhs(totalValuation)}</span>
                    </div>
                    <div className="h-2.5 w-full bg-[#020617] rounded-full overflow-hidden border border-slate-800">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${activeFundedPercentage}%` }} 
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400" 
                      />
                    </div>
                  </div>

                  {/* Calculator Input */}
                  <div className="p-5 rounded-[1.5rem] bg-[#020617]/80 border border-slate-800/80 shadow-inner space-y-5">
                    <div className="flex justify-between items-center border-b border-slate-800/80 pb-4">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Your Investment</span>
                      <span className="text-lg font-black text-white">{formatLakhs(investAmount)}</span>
                    </div>
                    
                    <div className="pt-2">
                      <input 
                        type="range" 
                        min={defaultMin} 
                        max={totalValuation > 0 ? totalValuation : 10000000} 
                        step={50000} 
                        value={investAmount} 
                        onChange={(e) => setInvestAmount(Number(e.target.value))} 
                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:accent-orange-400 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500/50" 
                      />
                      <div className="flex justify-between mt-2 px-1">
                        <span className="text-[9px] font-bold text-slate-500">Min: {formatLakhs(defaultMin)}</span>
                        <span className="text-[9px] font-bold text-slate-500">Max: {formatLakhs(totalValuation)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Returns Display */}
                  <div className="space-y-4 pt-2">
                    <div className="flex justify-between items-center px-2">
                      <span className="text-xs font-bold text-slate-400">Est. Profit ({roi}%):</span>
                      <span className="text-sm font-black text-emerald-400">+ ₹{(activeProjectedProfit / 100000).toFixed(2)} L</span>
                    </div>
                    <div className="flex justify-between items-center p-4 rounded-[1.25rem] bg-gradient-to-r from-orange-500/10 to-amber-500/5 border border-orange-500/20 shadow-[inset_0_0_20px_rgba(249,115,22,0.05)]">
                      <span className="text-sm font-bold text-orange-200">Total Return:</span>
                      <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300 drop-shadow-sm">
                        ₹{(activeProjectedReturn / 100000).toFixed(2)} L
                      </span>
                    </div>
                  </div>

                  {/* CTA */}
                  <a 
                    href={`https://wa.me/919586505111?text=${whatsappMessage}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-[1.25rem] bg-gradient-to-r from-orange-600 to-amber-500 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] active:scale-[0.98]"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <i className="fa-brands fa-whatsapp text-lg relative z-10"></i>
                    <span className="relative z-10">Proceed to Invest</span>
                  </a>
                  
                  <p className="text-[10px] text-center text-slate-500 font-medium px-4">
                    Secure 256-bit encryption. Your capital is backed by physical real estate assets.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>

        </div>
      </section>

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-[#020617]/95 backdrop-blur-xl flex flex-col">
          <div className="p-6 flex justify-end">
            <button onClick={() => setShowGalleryModal(false)} className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 sm:p-12">
            <div className="max-w-4xl mx-auto space-y-8">
              {galleryList.map((img, idx) => (
                <img key={idx} src={img} alt={`Gallery ${idx + 1}`} className="w-full rounded-[2rem] border border-slate-800 shadow-2xl" />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
