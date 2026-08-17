import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import InvestmentProjectCard from '../InvestmentProjectCard';
import InvestmentCalculatorModal from '../InvestmentCalculatorModal';

const fallbackProjects = [
  {
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
    description:
      'Prime 3BHK modern luxury flat with automated smart home features. Currently 60% funded by 2 co-investors, 40% remaining available for investment. Projected 22% ROI.',
    totalValuation: 8500000,
    fundedPercentage: 60,
    investorsCount: 2,
    minInvestment: 500000,
    expectedRoi: 22,
  },
  {
    _id: 'demo-2',
    status: 'running',
    propertyType: 'residential',
    bhk: '2bhk',
    investmentModel: 'renovate_flip',
    title: '2BHK Builder Floor Renovate & Flip Deal',
    location: 'Dwarka Mor, New Delhi',
    price: '₹ 20,00,000',
    tag: 'Renovate & Flip',
    image:
      'https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg',
    description:
      'Scenario 2 Investment: Purchased at ₹20 Lakhs, renovation cost ₹2 Lakhs (Total ₹22 Lakhs). Projected sale price of ₹26 Lakhs within 6 months yielding ₹4 Lakhs net profit (~18.18% net ROI).',
    purchasePrice: 2000000,
    renovationCost: 200000,
    expectedSalePrice: 2600000,
    holdingPeriodMonths: 6,
    expectedRoi: 18.18,
  },
  {
    _id: 'demo-3',
    status: 'running',
    propertyType: 'commercial',
    bhk: 'none',
    investmentModel: 'co_investment',
    title: 'Pre-Leased Commercial IT Park Office',
    location: 'JMD Megapolis, Sohna Road Gurgaon',
    price: '₹ 1,20,00,000',
    tag: 'Guaranteed Yield',
    image:
      'https://realtyhunting.com/wp-content/uploads/2026/03/Gemini_Generated_Image_2btgk62btgk62btg.png',
    description:
      'High rental yield commercial office space leased out to MNC corporate tenant. 75% funded by 3 co-investors, 25% remaining available.',
    totalValuation: 12000000,
    fundedPercentage: 75,
    investorsCount: 3,
    minInvestment: 1000000,
    expectedRoi: 18,
  },
  {
    _id: 'demo-4',
    status: 'running',
    propertyType: 'plot',
    bhk: 'none',
    investmentModel: 'co_investment',
    title: 'Highway Touch Commercial Land Plot',
    location: 'Raman Reti, Vrindavan',
    price: '₹ 35,00,000',
    tag: 'High Capital Gain',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7RDn0xbksUO_ip8Wd-enza8qAocGUPtkoFCqyLfjL-H5rdHEV6KQkED_Y&s=10',
    description:
      'Verified strategic commercial plot in major tourism corridor. 30% funded by 1 investor, 70% available.',
    totalValuation: 3500000,
    fundedPercentage: 30,
    investorsCount: 1,
    minInvestment: 300000,
    expectedRoi: 30,
  },
  {
    _id: 'demo-5',
    status: 'upcoming',
    propertyType: 'residential',
    bhk: '4bhk',
    investmentModel: 'co_investment',
    title: '4BHK Ultra Luxury Sky Villa Launch',
    location: 'Golf Course Extension Road, Gurgaon',
    price: '₹ 2,50,00,000',
    tag: 'Early Access',
    image:
      'https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg',
    description:
      'Upcoming flagship project pre-launch opportunity. Lock-in early stage price before launch price escalation.',
    totalValuation: 25000000,
    fundedPercentage: 15,
    investorsCount: 1,
    minInvestment: 2000000,
    expectedRoi: 28,
  },
  {
    _id: 'demo-6',
    status: 'delivered',
    propertyType: 'residential',
    bhk: '3bhk',
    investmentModel: 'co_investment',
    title: 'Delivered Smart Residency Phase 1',
    location: 'Sector 62, Noida',
    price: '₹ 75,00,000',
    tag: '100% Payout Done',
    image:
      'https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg',
    description:
      'Delivered project record. 100% co-invested and exited with 25% net profit distributed to all investors within 12 months.',
    totalValuation: 7500000,
    fundedPercentage: 100,
    investorsCount: 4,
    minInvestment: 500000,
    expectedRoi: 25,
  },
];

export default function InvestmentProjectsSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearchText = (searchParams.get('search') || '').trim().toLowerCase();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [activeStatus, setActiveStatus] = useState('running'); // 'running' | 'upcoming' | 'delivered'
  const [activeType, setActiveType] = useState('residential'); // 'residential' | 'commercial' | 'plot'
  const [activeBhk, setActiveBhk] = useState('2bhk'); // '2bhk' | '3bhk' | '4bhk'

  // Selected project for calculator modal
  const [selectedProject, setSelectedProject] = useState(null);

  const autoSelectFiltersForStatus = (statusId, currentProjects = projects) => {
    setActiveStatus(statusId);

    // Find the first project matching this status
    const match = currentProjects.find(
      (p) => (p.status || 'running').toString().trim().toLowerCase() === statusId.toLowerCase()
    );

    if (match) {
      const type = (match.propertyType || match.type || 'residential').toString().trim().toLowerCase();
      setActiveType(type);

      if (type === 'residential') {
        const bhk = (match.bhk || '2bhk').toString().trim().toLowerCase();
        setActiveBhk(bhk !== 'none' && bhk ? bhk : '2bhk');
      }
    } else {
      setActiveType('residential');
      setActiveBhk('2bhk');
    }
  };

  const handleTypeChange = (typeId) => {
    setActiveType(typeId);
    if (typeId === 'residential') {
      const match = projects.find(
        (p) =>
          (p.status || 'running').toString().trim().toLowerCase() === activeStatus &&
          (p.propertyType || p.type || 'residential').toString().trim().toLowerCase() === 'residential'
      );
      if (match && match.bhk) {
        setActiveBhk(match.bhk.toString().trim().toLowerCase());
      } else {
        setActiveBhk('2bhk');
      }
    }
  };

  // Lets a deep link like /properties?type=plot&search=Vrindavan (e.g. from the
  // homepage hero's category pills / autocomplete) preset the filters below.
  const applyUrlType = (list) => {
    const urlType = searchParams.get('type');
    if (!['residential', 'commercial', 'plot'].includes(urlType)) return;

    setActiveType(urlType);
    if (urlType === 'residential') {
      const match = list.find(
        (p) =>
          (p.status || 'running').toString().trim().toLowerCase() === 'running' &&
          (p.propertyType || p.type || 'residential').toString().trim().toLowerCase() === 'residential'
      );
      setActiveBhk(match?.bhk ? match.bhk.toString().trim().toLowerCase() : '2bhk');
    }
  };

  useEffect(() => {
    fetch('/api/properties')
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) && data.length > 0 ? data : fallbackProjects;
        setProjects(list);
        autoSelectFiltersForStatus('running', list);
        applyUrlType(list);
      })
      .catch(() => {
        setProjects(fallbackProjects);
        autoSelectFiltersForStatus('running', fallbackProjects);
        applyUrlType(fallbackProjects);
      })
      .finally(() => setLoading(false));
  }, []);

  const clearSearchText = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    setSearchParams(next);
  };

  // Strict Filter logic: only show cards that match the exact status, type, and BHK
  const filteredProjects = projects.filter((item) => {
    // 1. Status Filter
    const itemStatus = (item.status || 'running').toString().trim().toLowerCase();
    if (itemStatus !== activeStatus) return false;

    // 2. Property Type Filter
    const itemType = (item.propertyType || item.type || 'residential').toString().trim().toLowerCase();
    if (itemType !== activeType) return false;

    // 3. Residential BHK Filter (applies strictly when property type is residential)
    if (activeType === 'residential') {
      const itemBhk = (item.bhk || '2bhk').toString().trim().toLowerCase();
      if (itemBhk !== activeBhk) return false;
    }

    // 4. Free-text search carried over from the homepage hero, if present
    if (urlSearchText) {
      const title = (item.title || '').toLowerCase();
      const location = (item.location || '').toLowerCase();
      if (!title.includes(urlSearchText) && !location.includes(urlSearchText)) return false;
    }

    return true;
  });

  return (
    <section id="our-projects" className="relative overflow-hidden bg-slate-950 px-4 sm:px-6 py-20 sm:py-28 border-t border-slate-900">
      {/* Background Glows */}
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-orange-600/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-10 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-[130px] pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            Verified Investment Opportunities
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-5xl">
            High-Yield Real Estate{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-amber-500">
              Co-Investments
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-400">
            Participate in fractional real estate pools and high-margin renovate-and-flip deals with verified titles, transparent returns, and low entry tickets.
          </p>
          {urlSearchText && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-4 py-1.5 text-xs text-slate-300">
              <i className="fa-solid fa-magnifying-glass text-orange-400"></i>
              Showing results for <span className="font-bold text-white">"{searchParams.get('search')}"</span>
              <button
                type="button"
                onClick={clearSearchText}
                className="ml-1 rounded-full text-slate-500 hover:text-white cursor-pointer"
                title="Clear search"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          )}
        </div>

        {/* 3-Step "How Co-Investing Works" Explainer Strip */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-start gap-3 p-2">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-orange-500/20 text-orange-400 font-black text-sm border border-orange-500/30">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Select Verified Asset</h4>
              <p className="mt-0.5 text-[11px] text-slate-400 leading-normal">
                Every listing is physically verified and legal title checked by our legal team.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-500/20 text-amber-400 font-black text-sm border border-amber-500/30">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Choose Investment Amount</h4>
              <p className="mt-0.5 text-[11px] text-slate-400 leading-normal">
                Start fractional co-investing from ₹3L - ₹5L without buying full property overheads.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-2 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 font-black text-sm border border-emerald-500/30">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Earn High Annual Returns</h4>
              <p className="mt-0.5 text-[11px] text-slate-400 leading-normal">
                Receive 18% - 28% annual ROI / net flip profit payouts directly to your account.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Main Status 3-Tab Segmented Control (Running, Upcoming, Delivered) */}
        <div className="mb-10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 rounded-3xl border border-slate-800 bg-slate-900/90 p-2 shadow-2xl backdrop-blur-xl">
            {[
              {
                id: 'running',
                label: 'Running Projects',
                sublabel: 'Ongoing Fractional Pools & Flips',
                icon: 'fa-chart-line',
                activeGradient: 'from-orange-500 to-amber-500 text-slate-950 shadow-orange-500/25',
                badgeActiveBg: 'bg-slate-950/30 text-slate-950',
                activeBorder: 'border-orange-500/50',
                count: projects.filter(p => (p.status || 'running').toLowerCase() === 'running').length,
              },
              {
                id: 'upcoming',
                label: 'Upcoming Projects',
                sublabel: 'Pre-launch & Early Access Deals',
                icon: 'fa-clock',
                activeGradient: 'from-blue-600 to-indigo-500 text-white shadow-blue-600/25',
                badgeActiveBg: 'bg-white/20 text-white',
                activeBorder: 'border-blue-500/50',
                count: projects.filter(p => (p.status || '').toLowerCase() === 'upcoming').length,
              },
              {
                id: 'delivered',
                label: 'Delivered Projects',
                sublabel: 'Fully Exited & Profit Distributed',
                icon: 'fa-circle-check',
                activeGradient: 'from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/25',
                badgeActiveBg: 'bg-slate-950/30 text-slate-950',
                activeBorder: 'border-emerald-500/50',
                count: projects.filter(p => (p.status || '').toLowerCase() === 'delivered').length,
              },
            ].map((tab) => {
              const isActive = activeStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => autoSelectFiltersForStatus(tab.id)}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl px-4 py-3.5 text-center transition-all duration-300 cursor-pointer ${
                    isActive
                      ? `bg-gradient-to-r ${tab.activeGradient} shadow-xl scale-[1.02] border ${tab.activeBorder}`
                      : 'border border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <i className={`fa-solid ${tab.icon} text-sm ${isActive ? '' : 'text-slate-500 group-hover:text-slate-300'}`}></i>
                    <span className={`text-xs sm:text-sm font-extrabold tracking-tight ${isActive ? '' : 'text-slate-200'}`}>
                      {tab.label}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${isActive ? tab.badgeActiveBg : 'bg-slate-800 text-slate-400'}`}>
                      {tab.count}
                    </span>
                  </div>

                  <span className={`mt-1 text-[10px] font-medium hidden sm:block ${isActive ? 'opacity-85 font-semibold' : 'text-slate-500'}`}>
                    {tab.sublabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Full-Width Container Card wrapping Sub-Filters & Projects Content */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Sub-Filters Header Row: Property Type on Left | Residential BHK Filter on Right */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            {/* Left: Property Type Filters (Without "All Categories") */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
                PROPERTY TYPE:
              </span>
              {[
                { id: 'residential', label: 'Residentials', icon: 'fa-building' },
                { id: 'commercial', label: 'Commercial', icon: 'fa-briefcase' },
                { id: 'plot', label: 'Plots & Land', icon: 'fa-map-location-dot' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeChange(type.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeType === type.id
                      ? 'border border-orange-500/60 bg-orange-500/20 text-orange-400 shadow-md shadow-orange-500/10'
                      : 'border border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <i className={`fa-solid ${type.icon} text-[11px]`}></i>
                  <span>{type.label}</span>
                </button>
              ))}
            </div>

            {/* Right: Residential BHK Sub-Filters (Without "All BHKs") */}
            {activeType === 'residential' && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
                  RESIDENTIAL BHK FILTER:
                </span>
                <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-950 p-1">
                  {[
                    { id: '2bhk', label: '2 BHK' },
                    { id: '3bhk', label: '3 BHK' },
                    { id: '4bhk', label: '4 BHK' },
                  ].map((bhk) => (
                    <button
                      key={bhk.id}
                      onClick={() => setActiveBhk(bhk.id)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        activeBhk === bhk.id
                          ? 'bg-amber-500 text-slate-950 font-black shadow'
                          : 'text-slate-300 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {bhk.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <i className="fa-solid fa-circle-notch fa-spin text-3xl text-orange-500 mb-3 block"></i>
              Loading Investment Projects...
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProjects.map((project) => (
                <InvestmentProjectCard
                  key={project._id || project.id}
                  project={project}
                  onOpenDetails={(p) => setSelectedProject(p)}
                />
              ))}
            </div>
          ) : (
            <div className="py-14 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-2xl text-orange-400 border border-orange-500/20 shadow-lg">
                <i className="fa-solid fa-folder-open"></i>
              </div>
              <h3 className="text-xl font-bold text-white">No Projects Found</h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                No properties matching <span className="text-orange-400 font-semibold">{activeType}</span> {activeType === 'residential' ? `(${activeBhk.toUpperCase()})` : ''} are currently listed under <span className="text-amber-400 font-semibold">{activeStatus}</span> status.
              </p>
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => autoSelectFiltersForStatus('running')}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-orange-500/20 hover:scale-105 transition-all cursor-pointer"
                >
                  <i className="fa-solid fa-fire text-sm"></i>
                  Back to Best Deals
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Calculator & Details Modal */}
      {selectedProject && (
        <InvestmentCalculatorModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
