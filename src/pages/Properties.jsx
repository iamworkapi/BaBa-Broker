import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Grid3X3, List, ArrowUpDown, ShieldCheck,
  TrendingUp, Users, Landmark, Sparkles, X, ChevronDown,
  BarChart3, Clock, Target
} from "lucide-react";
import InvestmentProjectCard from "../components/InvestmentProjectCard";
import InvestmentCalculatorModal from "../components/InvestmentCalculatorModal";
import AnimatedCounter from "../components/AnimatedCounter";

const fallbackProjects = [
  {
    _id: "demo-1",
    status: "running",
    propertyType: "residential",
    bhk: "3bhk",
    investmentModel: "co_investment",
    title: "Luxury 3BHK Smart Residency Co-Investment",
    location: "Sector 150, Noida Expressway",
    price: "₹ 85,00,000",
    tag: "High Growth Pool",
    image: "https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg",
    description: "Prime 3BHK modern luxury flat with automated smart home features. Currently 60% funded by 2 co-investors, 40% remaining available.",
    totalValuation: 8500000,
    fundedPercentage: 60,
    investorsCount: 2,
    minInvestment: 500000,
    expectedRoi: 22,
  },
  {
    _id: "demo-2",
    status: "running",
    propertyType: "residential",
    bhk: "2bhk",
    investmentModel: "renovate_flip",
    title: "2BHK Builder Floor Renovate & Flip Deal",
    location: "Dwarka Mor, New Delhi",
    price: "₹ 20,00,000",
    tag: "Renovate & Flip",
    image: "https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg",
    description: "Purchased at ₹20L, renovation ₹2L. Projected sale ₹26L in 6 months — ~18.18% net ROI.",
    purchasePrice: 2000000,
    renovationCost: 200000,
    expectedSalePrice: 2600000,
    holdingPeriodMonths: 6,
    expectedRoi: 18.18,
  },
  {
    _id: "demo-3",
    status: "running",
    propertyType: "commercial",
    bhk: "none",
    investmentModel: "co_investment",
    title: "Pre-Leased Commercial IT Park Office",
    location: "JMD Megapolis, Sohna Road Gurgaon",
    price: "₹ 1,20,00,000",
    tag: "Guaranteed Yield",
    image: "https://realtyhunting.com/wp-content/uploads/2026/03/Gemini_Generated_Image_2btgk62btgk62btg.png",
    description: "High rental yield commercial office leased to MNC tenant. 75% funded, 25% remaining.",
    totalValuation: 12000000,
    fundedPercentage: 75,
    investorsCount: 3,
    minInvestment: 1000000,
    expectedRoi: 18,
  },
  {
    _id: "demo-4",
    status: "running",
    propertyType: "plot",
    bhk: "none",
    investmentModel: "co_investment",
    title: "Highway Touch Commercial Land Plot",
    location: "Raman Reti, Vrindavan",
    price: "₹ 35,00,000",
    tag: "High Capital Gain",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7RDn0xbksUO_ip8Wd-enza8qAocGUPtkoFCqyLfjL-H5rdHEV6KQkED_Y&s=10",
    description: "Verified commercial plot in tourism corridor. 30% funded, 70% available.",
    totalValuation: 3500000,
    fundedPercentage: 30,
    investorsCount: 1,
    minInvestment: 300000,
    expectedRoi: 30,
  },
  {
    _id: "demo-5",
    status: "upcoming",
    propertyType: "residential",
    bhk: "4bhk",
    investmentModel: "co_investment",
    title: "4BHK Ultra Luxury Sky Villa Launch",
    location: "Golf Course Extension Road, Gurgaon",
    price: "₹ 2,50,00,000",
    tag: "Early Access",
    image: "https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg",
    description: "Pre-launch opportunity. Lock-in early stage pricing before escalation.",
    totalValuation: 25000000,
    fundedPercentage: 15,
    investorsCount: 1,
    minInvestment: 2000000,
    expectedRoi: 28,
  },
  {
    _id: "demo-6",
    status: "delivered",
    propertyType: "residential",
    bhk: "3bhk",
    investmentModel: "co_investment",
    title: "Delivered Smart Residency Phase 1",
    location: "Sector 62, Noida",
    price: "₹ 75,00,000",
    tag: "100% Payout Done",
    image: "https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg",
    description: "Delivered project. 25% net profit distributed within 12 months.",
    totalValuation: 7500000,
    fundedPercentage: 100,
    investorsCount: 4,
    minInvestment: 500000,
    expectedRoi: 25,
  },
];

const SORT_OPTIONS = [
  { label: "Highest ROI", value: "roi-desc" },
  { label: "Lowest Entry", value: "entry-asc" },
  { label: "Newest First", value: "newest" },
  { label: "Most Funded", value: "funded-desc" },
];

const STATUS_TABS = [
  {
    id: "running",
    label: "Live Now",
    sub: "Active investment pools",
    icon: "fa-chart-line",
    gradient: "from-orange-500 to-amber-500",
    textActive: "text-slate-950",
    borderActive: "border-orange-500/60",
    shadow: "shadow-orange-500/25",
  },
  {
    id: "upcoming",
    label: "Pre-Launch",
    sub: "Early access deals",
    icon: "fa-rocket",
    gradient: "from-blue-600 to-indigo-500",
    textActive: "text-white",
    borderActive: "border-blue-500/60",
    shadow: "shadow-blue-500/25",
  },
  {
    id: "delivered",
    label: "Delivered",
    sub: "Completed exits",
    icon: "fa-circle-check",
    gradient: "from-emerald-500 to-teal-500",
    textActive: "text-slate-950",
    borderActive: "border-emerald-500/60",
    shadow: "shadow-emerald-500/25",
  },
];

const PROPERTY_TYPES = [
  { id: "residential", label: "Residential", icon: "fa-building" },
  { id: "commercial", label: "Commercial", icon: "fa-briefcase" },
  { id: "plot", label: "Plots & Land", icon: "fa-map-location-dot" },
];

const BHK_OPTIONS = ["2bhk", "3bhk", "4bhk"];

const MODEL_TABS = [
  { id: "all", label: "All Models", icon: "fa-layer-group" },
  { id: "co_investment", label: "Co-Investment", icon: "fa-users" },
  { id: "renovate_flip", label: "Renovate & Flip", icon: "fa-hammer" },
];

const ACCENT = "#f97316";

function PropertiesPage() {
  const [searchParams] = useSearchParams();
  const urlSearch = (searchParams.get("search") || "").trim().toLowerCase();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("running");
  const [activeType, setActiveType] = useState("residential");
  const [activeBhk, setActiveBhk] = useState("2bhk");
  const [activeModel, setActiveModel] = useState("all");
  const [sortBy, setSortBy] = useState("roi-desc");
  const [viewMode, setViewMode] = useState("grid");
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetch("/api/properties")
      .then((r) => (!r.ok ? Promise.reject() : r.json()))
      .then((data) => {
        const list = Array.isArray(data) && data.length > 0 ? data : fallbackProjects;
        setProjects(list);
      })
      .catch(() => setProjects(fallbackProjects))
      .finally(() => setLoading(false));
  }, []);

  const clearSearch = () => {
    setSearchInput("");
    const next = new URLSearchParams(searchParams);
    next.delete("search");
    // handled via URL update if needed
  };

  const autoSelectForStatus = (status) => {
    setActiveStatus(status);
    const match = projects.find(
      (p) => (p.status || "running").toLowerCase() === status.toLowerCase()
    );
    if (match) {
      const type = (match.propertyType || "residential").toLowerCase();
      setActiveType(type);
      if (type === "residential") {
        setActiveBhk((match.bhk || "2bhk").toLowerCase());
      }
    }
  };

  const filtered = useMemo(() => {
    let list = projects.filter((p) => {
      const ps = (p.status || "running").toLowerCase();
      const pt = (p.propertyType || "residential").toLowerCase();
      const pb = (p.bhk || "2bhk").toLowerCase();
      const pm = (p.investmentModel || "co_investment").toLowerCase();

      if (ps !== activeStatus) return false;
      if (pt !== activeType) return false;
      if (activeType === "residential" && pb !== activeBhk) return false;
      if (activeModel !== "all" && pm !== activeModel) return false;

      if (urlSearch) {
        const q = urlSearch.toLowerCase();
        const title = (p.title || "").toLowerCase();
        const loc = (p.location || "").toLowerCase();
        if (!title.includes(q) && !loc.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "roi-desc": return (b.expectedRoi || 0) - (a.expectedRoi || 0);
        case "entry-asc": return (a.minInvestment || 0) - (b.minInvestment || 0);
        case "funded-desc": return (b.fundedPercentage || 0) - (a.fundedPercentage || 0);
        case "newest": return (b._id || "").localeCompare(a._id || "");
        default: return 0;
      }
    });
    return list;
  }, [projects, activeStatus, activeType, activeBhk, activeModel, sortBy, urlSearch]);

  const counts = useMemo(() => ({
    running: projects.filter((p) => (p.status || "running").toLowerCase() === "running").length,
    upcoming: projects.filter((p) => (p.status || "").toLowerCase() === "upcoming").length,
    delivered: projects.filter((p) => (p.status || "").toLowerCase() === "delivered").length,
    total: projects.length,
    avgRoi: projects.length
      ? Math.round(projects.reduce((s, p) => s + (p.expectedRoi || 0), 0) / projects.length)
      : 0,
    totalValue: projects.reduce((s, p) => s + (p.totalValuation || 0), 0),
  }), [projects]);

  const activeTab = STATUS_TABS.find((t) => t.id === activeStatus);

  return (
    <div className="min-h-screen bg-[#070e1c] text-slate-100 antialiased font-['Inter',sans-serif]">

      {/* ─── HERO HEADER ─── */}
      <section className="relative overflow-hidden border-b border-slate-800/80">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-[#070e1c] to-[#070e1c]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(249,115,22,0.12),transparent_70%)]" />
        <div className="absolute -right-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/[0.06] blur-[140px] pointer-events-none" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-emerald-500/[0.05] blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-10 sm:pb-14">
          {/* Badge */}
          <div className="flex justify-center mb-5">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-orange-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Investment Opportunities
            </span>
          </div>

          {/* Title */}
          <h1 className="text-center text-4xl sm:text-5xl lg:text-[3.5rem] font-black text-white tracking-tight leading-[1.1]">
            Invest in <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                Premium Real Estate
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-3 bg-orange-500/15 rounded-full -z-0" />
            </span>
            <br />
            <span className="text-slate-300 text-3xl sm:text-4xl lg:text-5xl">With Confidence</span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-center text-sm sm:text-base text-slate-400 leading-relaxed">
            Browse curated co-investment pools and renovate-and-flip deals. Verified assets, transparent ROI projections, and fractional entry from ₹3L.
          </p>

          {/* Stats Bar */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { icon: Landmark, label: "Total Projects", value: counts.total, suffix: "+", color: "text-orange-400" },
              { icon: TrendingUp, label: "Avg. ROI", value: counts.avgRoi, suffix: "%", color: "text-emerald-400" },
              { icon: Users, label: "Active Investors", value: 2400, suffix: "+", color: "text-blue-400" },
              { icon: BarChart3, label: "Total Valuation", value: Math.round(counts.totalValue / 100000), suffix: "L+", prefix: "₹", color: "text-amber-400" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 20 }}
                className="group relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5 text-center backdrop-blur-md hover:border-white/15 transition-all duration-300"
              >
                <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl ${stat.color} bg-white/5`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className={`text-2xl sm:text-3xl font-black ${stat.color}`}>
                  <AnimatedCounter end={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix} />
                </p>
                <p className="mt-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS STRIP ─── */}
      <section className="border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                icon: ShieldCheck,
                title: "Verified Assets",
                desc: "Every property is physically verified with legal title check by our expert team.",
                accent: "from-orange-500 to-amber-500",
              },
              {
                step: "2",
                icon: Target,
                title: "Choose & Invest",
                desc: "Start from ₹3L via fractional co-investing. No full-property overheads.",
                accent: "from-amber-500 to-yellow-500",
              },
              {
                step: "3",
                icon: TrendingUp,
                title: "Earn Returns",
                desc: "18–28% annual ROI or flip profits paid directly to your account.",
                accent: "from-emerald-500 to-teal-400",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative flex items-center gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-4 hover:border-white/15 hover:bg-slate-900/60 transition-all duration-300"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-slate-950 font-black text-lg shadow-lg`}>
                  {item.step}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-orange-400" />
                    {item.title}
                  </h4>
                  <p className="mt-0.5 text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FILTERS + PROJECTS ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Search + Sort + View Controls Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name or location..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/70 pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 transition-all"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border border-slate-800 bg-slate-900/70 pl-3.5 pr-9 py-2.5 text-xs font-bold text-slate-300 outline-none focus:border-orange-500/50 cursor-pointer hover:border-slate-700 transition-colors"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 pointer-events-none" />
            </div>

            {/* View toggle */}
            <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/70 p-0.5">
              {[
                { mode: "grid", Icon: Grid3X3 },
                { mode: "list", Icon: List },
              ].map(({ mode, Icon }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                    viewMode === mode
                      ? "bg-orange-500/20 text-orange-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mb-6 grid grid-cols-3 gap-2 sm:gap-3">
          {STATUS_TABS.map((tab) => {
            const isActive = activeStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => autoSelectForStatus(tab.id)}
                className={`group relative flex flex-col items-center justify-center rounded-2xl px-3 py-3.5 sm:py-4 text-center transition-all duration-300 cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-br ${tab.gradient} ${tab.textActive} shadow-xl ${tab.shadow} border ${tab.borderActive}`
                    : "border border-transparent text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <i className={`fa-solid ${tab.icon} text-sm ${isActive ? "" : "text-slate-500"}`} />
                  <span className={`text-xs sm:text-sm font-extrabold tracking-tight ${isActive ? "" : "text-slate-200"}`}>
                    {tab.label}
                  </span>
                </div>
                <span className={`mt-1 text-[10px] font-medium hidden sm:block ${isActive ? "opacity-80" : "text-slate-500"}`}>
                  {tab.sub}
                </span>
                <span className={`absolute top-2 right-2 h-2 w-2 rounded-full ${isActive ? "bg-white/40 animate-pulse" : "bg-slate-700"}`} />
              </button>
            );
          })}
        </div>

        {/* Investment Model Filter */}
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-1">Model:</span>
          {MODEL_TABS.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveModel(m.id)}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeModel === m.id
                  ? "bg-white/[0.08] border border-white/20 text-white shadow-sm"
                  : "border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <i className={`fa-solid ${m.icon} text-[10px] ${activeModel === m.id ? "text-orange-400" : ""}`} />
              {m.label}
            </button>
          ))}
        </div>

        {/* Property Type + BHK Sub-filters */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3">
          {/* Type */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-1">Type:</span>
            {PROPERTY_TYPES.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  activeType === t.id
                    ? "bg-orange-500/15 border border-orange-500/40 text-orange-400 shadow-md shadow-orange-500/5"
                    : "border border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700 hover:text-white"
                }`}
              >
                <i className={`fa-solid ${t.icon} text-[11px]`} />
                {t.label}
              </button>
            ))}
          </div>

          {/* BHK — only for residential */}
          <AnimatePresence>
            {activeType === "residential" && (
              <motion.div
                initial={{ opacity: 0, scaleX: 0.9 }}
                animate={{ opacity: 1, scaleX: 1 }}
                exit={{ opacity: 0, scaleX: 0.9 }}
                className="flex flex-wrap items-center gap-2"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mr-1">BHK:</span>
                <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/80 p-1">
                  {BHK_OPTIONS.map((bhk) => (
                    <button
                      key={bhk}
                      onClick={() => setActiveBhk(bhk)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                        activeBhk === bhk
                          ? "bg-amber-500 text-slate-950 font-black shadow-md"
                          : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      {bhk.toUpperCase()}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results count */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-400">
            Showing{" "}
            <span className="text-white font-bold">{filtered.length}</span>{" "}
            of <span className="text-white font-bold">{projects.length}</span> projects
            {urlSearch && (
              <span>
                {" "}matching "<span className="text-orange-400 font-bold">{urlSearch}</span>"
              </span>
            )}
          </p>
          {activeTab && (
            <span className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${activeTab.gradient} px-3 py-1 text-[10px] font-black uppercase tracking-wider ${activeTab.textActive}`}>
              <i className={`fa-solid ${activeTab.icon} text-[10px]`} />
              {activeTab.label} ({filtered.length})
            </span>
          )}
        </div>

        {/* Projects Grid / List */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full border-4 border-orange-100 border-t-orange-500 animate-spin" />
            <p className="text-xs font-bold text-slate-400">Loading Investment Opportunities...</p>
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid gap-5 sm:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                : "flex flex-col gap-4"
            }
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04, type: "spring", stiffness: 200, damping: 25 }}
                >
                  <InvestmentProjectCard
                    project={project}
                    onOpenDetails={setSelectedProject}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 text-center"
          >
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/60 text-3xl text-orange-400 shadow-xl">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-white">No Matching Investments</h3>
            <p className="mt-2 max-w-md mx-auto text-sm text-slate-400 leading-relaxed">
              We couldn't find any projects matching your current filters. Try adjusting the status, type, or BHK filters.
            </p>
            <button
              onClick={() => {
                setActiveStatus("running");
                setActiveType("residential");
                setActiveBhk("2bhk");
                setActiveModel("all");
                setSortBy("roi-desc");
                setSearchInput("");
              }}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/40 transition-all cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              Reset All Filters
            </button>
          </motion.div>
        )}
      </section>

      {/* ─── CALCULATOR MODAL ─── */}
      <AnimatePresence>
        {selectedProject && (
          <InvestmentCalculatorModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default PropertiesPage;
