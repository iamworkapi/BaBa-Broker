import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const slides = ["/assets/img/banner1.png", "/assets/img/banner2.png", "/assets/img/banner3.png"];

const CATEGORIES = [
  { id: "all", label: "All Deals", icon: "fa-layer-group" },
  { id: "plot", label: "Land & Plots", icon: "fa-map-location-dot" },
  { id: "commercial", label: "Commercial", icon: "fa-store" },
  { id: "residential", label: "Flats & Suites", icon: "fa-building" },
];

const LOCATIONS = ["Delhi NCR", "Vrindavan", "Noida", "Gurugram", "Greater Noida", "Sector 62"];

const PHRASES = ["14.2% Fixed Returns", "Fractional Land Shares", "Bank-Verified Plots", "High-Yield Commercial"];

const spring = { type: "spring", stiffness: 260, damping: 22, mass: 0.8 };

/* ─── inline mini-card for a search hit ─── */
function MiniCard({ item, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex w-full items-center gap-3 rounded-xl border border-white/[0.08] bg-slate-800/40 p-3 text-left transition hover:border-orange-500/40 hover:bg-slate-800/70"
    >
      <div className="h-10 w-12 rounded-lg bg-slate-700/60 shrink-0 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-orange-400">
            <i className="fa-solid fa-building text-xs" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-slate-200 truncate group-hover:text-orange-300 transition-colors">
          {item.title}
        </p>
        <p className="text-[10px] text-slate-400 truncate">{item.location}</p>
        <span className="text-[10px] font-black text-emerald-400 mt-0.5 block">
          {item.price}
          {item.expectedRoi ? `  •  ${item.expectedRoi}% IRR` : ""}
        </span>
      </div>
      <span
        className={`shrink-0 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${
          item.status === "upcoming"
            ? "bg-blue-500/15 text-blue-400"
            : item.status === "delivered"
            ? "bg-emerald-500/15 text-emerald-400"
            : "bg-orange-500/15 text-orange-400"
        }`}
      >
        {item.status === "running" ? "Live" : item.status}
      </span>
    </button>
  );
}



export default function HeroSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [typedText, setTypedText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [city, setCity] = useState("Delhi NCR");
  const [cityOpen, setCityOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [properties, setProperties] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const searchRef = useRef(null);
  const navigate = useNavigate();

  /* ── Backend sync ── */
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/properties").then((r) => (r.ok ? r.json() : [])).catch(() => []),
      fetch("/api/properties/featured").then((r) => (r.ok ? r.json() : [])).catch(() => []),
    ]).then(([all, feat]) => {
      if (!cancelled) {
        if (Array.isArray(all)) setProperties(all);
        if (Array.isArray(feat)) setFeatured(feat);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  /* ── Slide carousel ── */
  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setActiveSlide((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [isPaused]);

  /* ── Typing effect ── */
  useEffect(() => {
    const phrase = PHRASES[phraseIndex];
    const delay = deleting ? 35 : 70;
    const timer = setTimeout(() => {
      if (!deleting && typedText === phrase) { setDeleting(true); return; }
      if (deleting && typedText === "") { setDeleting(false); setPhraseIndex((i) => (i + 1) % PHRASES.length); return; }
      setTypedText((t) => (deleting ? t.slice(0, -1) : phrase.slice(0, t.length + 1)));
    }, !deleting && typedText === phrase ? 2200 : delay);
    return () => clearTimeout(timer);
  }, [typedText, deleting, phraseIndex]);

  /* ── Click outside ── */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setCityOpen(false); setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Search matching ── */
  const categoryPool = useMemo(
    () => activeCategory === "all" ? properties : properties.filter((p) => p.propertyType === activeCategory),
    [properties, activeCategory],
  );

  const isFlatSearch = useMemo(() => {
    const q = query.trim().toLowerCase();
    return activeCategory === "residential" || q.includes("flat") || q.includes("bhk") || q.includes("apartment") || q.includes("suite");
  }, [query, activeCategory]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const hits = categoryPool
      .filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.location || "").toLowerCase().includes(q) ||
          (p.tag || "").toLowerCase().includes(q),
      )
      .slice(0, 8);

    if (hits.length > 0) return hits;

    if (isFlatSearch) {
      const flatHits = categoryPool
        .filter((p) => p.propertyType === "residential")
        .slice(0, 6);
      return flatHits;
    }
    return [];
  }, [query, categoryPool, activeCategory, isFlatSearch]);

  /* ── Featured latest deals (fallback to running properties if no featured set) ── */
  const latestDeals = useMemo(() => {
    if (featured.length > 0) return featured.slice(0, 8);
    return properties.filter((p) => p.status === "running").slice(0, 8);
  }, [featured, properties]);

  /* ── Search action ── */
  const search = useCallback((term = query) => {
    const value = term.trim();
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    if (activeCategory !== "all") params.set("type", activeCategory);
    if (city) params.set("city", city);
    const qs = params.toString();
    navigate(qs ? `/properties?${qs}` : "/properties");
    setSuggestionsOpen(false);
  }, [query, activeCategory, city, navigate]);

  const selectMatch = useCallback((item) => {
    setQuery(item.title || item.label);
    setSuggestionsOpen(false);
    navigate("/property-details", { state: { project: item } });
  }, [navigate]);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  }, []);

  const typeLabel = (t) => {
    if (t === "residential") return "Flat";
    if (t === "commercial") return "Shop";
    return "Plot";
  };

  return (
    <section
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 pt-20 sm:pt-24 lg:pt-28 pb-10 lg:pb-16"
    >
      {/* Background Carousel */}
      {slides.map((image, index) => (
        <img
          key={image}
          src={image}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[2000ms] ease-in-out ${
            index === activeSlide ? "scale-100 opacity-45" : "scale-[1.08] opacity-0"
          }`}
        />
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-slate-950/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40" />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 -left-32 h-[500px] w-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #f97316 0%, transparent 70%)",
          x: (mousePos.x - 0.5) * -40,
          y: (mousePos.y - 0.5) * -40,
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-32 h-[400px] w-[400px] rounded-full opacity-15 blur-[100px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
          x: (mousePos.x - 0.5) * 30,
          y: (mousePos.y - 0.5) * 30,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full opacity-10 blur-[80px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
          x: (mousePos.x - 0.5) * 20,
          y: (mousePos.y - 0.5) * 20,
        }}
      />

      {/* Grid pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top accent bar */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ background: "linear-gradient(90deg, #f97316, #f59e0b, #10b981)" }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      />



      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center pt-6">

          {/* Left Column */}
          <motion.div
            className="lg:col-span-7 space-y-5"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
          >


            {/* Headline */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: spring } }}>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.1]">
                Invest in Premium
                <br />
                <span className="relative">
                  <span className="relative z-10 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                    Real Estate
                  </span>
                  <motion.span
                    aria-hidden="true"
                    className="absolute bottom-1 left-0 right-0 h-3 bg-orange-500/15 -z-0 rounded-full"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </span>
                <br />
                Starting{" "}
                <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">&#8377;2.5 Lakhs</span>
              </h1>
            </motion.div>

            {/* Typing phrase */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: spring } }}
              className="h-12 sm:h-14 flex items-center"
            >
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-300">
                {typedText}
                <motion.span
                  aria-hidden="true"
                  className="ml-1 inline-block h-[0.7em] w-[3px] rounded-full bg-orange-400 align-[-0.05em]"
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                />
              </span>
            </motion.div>

            {/* Subheadline */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: spring } }}
              className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg"
            >
              Bank-verified properties with <span className="text-emerald-400 font-semibold">RERA clearance</span>, managed by experts.
              Earn{" "}
              <span className="text-orange-400 font-semibold">14.2% fixed returns</span>{" "}
              with fractional ownership — no lock-in, zero management fees.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: spring } }}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.button
                type="button"
                onClick={() => navigate("/properties")}
                className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-orange-500/30"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={spring}
              >
                <i className="fa-solid fa-fire text-sm" />
                <span>Explore Deals</span>
                <motion.span aria-hidden="true" className="inline-block" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <i className="fa-solid fa-arrow-right text-[10px]" />
                </motion.span>
              </motion.button>

              <motion.button
                type="button"
                onClick={() => navigate("/become-investor")}
                className="flex items-center gap-2.5 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-bold text-white backdrop-blur-md hover:bg-white/10 hover:border-white/40 transition-colors"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={spring}
              >
                <i className="fa-solid fa-user-shield text-emerald-400" />
                <span>Start Investing</span>
              </motion.button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.5 } } }}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2.5">
                {[
                  { initials: "RS", bg: "bg-orange-500" },
                  { initials: "AK", bg: "bg-blue-500" },
                  { initials: "PM", bg: "bg-emerald-500" },
                  { initials: "VD", bg: "bg-purple-500" },
                ].map((avatar, i) => (
                  <motion.div
                    key={avatar.initials}
                    className={`h-8 w-8 rounded-full ${avatar.bg} text-white font-bold text-[10px] flex items-center justify-center border-2 border-slate-950 shadow-md`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ ...spring, delay: 0.6 + i * 0.08 }}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                  >
                    {avatar.initials}
                  </motion.div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <motion.i
                      key={i}
                      className="fa-solid fa-star text-[10px]"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...spring, delay: 0.8 + i * 0.06 }}
                    />
                  ))}
                  <span className="font-bold text-white ml-1 text-sm">4.9 / 5</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Trusted by 8,500+ investors across India</p>
              </div>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { ...spring, delay: 0.5 } } }}
              className="flex flex-wrap items-center gap-x-5 gap-y-2"
            >
              {[
                { icon: "fa-circle-check", text: "RERA Title Clear", color: "text-emerald-400" },
                { icon: "fa-circle-check", text: "Zero Management Fees", color: "text-emerald-400" },
                { icon: "fa-circle-check", text: "100% Bank-Verified", color: "text-emerald-400" },
              ].map((badge, i) => (
                <motion.span
                  key={badge.text}
                  className={`flex items-center gap-1.5 text-[11px] font-semibold ${badge.color}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...spring, delay: 0.6 + i * 0.08 }}
                >
                  <i className={`fa-solid ${badge.icon} text-xs`} />
                  <span className="text-slate-300">{badge.text}</span>
                </motion.span>
              ))}
            </motion.div>


          </motion.div>

          {/* Right Column — Search Card */}
          <motion.div
            className="lg:col-span-5 w-full"
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.3 }}
          >
            <div
              ref={searchRef}
              className="relative w-full rounded-3xl border border-white/[0.12] bg-slate-900/80 p-6 sm:p-7 shadow-2xl shadow-black/30 backdrop-blur-2xl space-y-5 overflow-hidden"
            >
              {/* Card inner glow */}
              <div aria-hidden="true" className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-orange-500/10 blur-[60px] pointer-events-none" />
              <div aria-hidden="true" className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-emerald-500/8 blur-[50px] pointer-events-none" />

              {/* Header */}
              <div className="relative flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Find Investment Deals</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {loading ? "Loading live deals…" : `${properties.filter(p => p.status === "running").length} live deals available now`}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Live</span>
                </div>
              </div>

              {/* Category tabs */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Asset Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <motion.button
                      key={cat.id}
                      type="button"
                      onClick={() => { setActiveCategory(cat.id); setSuggestionsOpen(true); }}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition border ${
                        activeCategory === cat.id
                          ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 border-orange-400 shadow-lg shadow-orange-500/25"
                          : "bg-slate-950/60 text-slate-300 border-white/[0.08] hover:border-orange-500/30 hover:bg-slate-800/40"
                      }`}
                      whileTap={{ scale: 0.97 }}
                      transition={spring}
                    >
                      <i className={`fa-solid ${cat.icon} text-xs ${activeCategory === cat.id ? "text-slate-950" : "text-orange-400"}`} />
                      <span className="truncate">{cat.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Location selector */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Target Location</label>
                <div className="relative">
                  <motion.button
                    type="button"
                    onClick={() => setCityOpen((o) => !o)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/[0.12] bg-slate-950/60 px-3.5 py-2.5 text-xs font-semibold text-white hover:border-orange-500/40 transition"
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-location-dot text-orange-400 text-xs" />
                      <span>{city}</span>
                    </div>
                    <motion.i
                      className="fa-solid fa-chevron-down text-[10px] text-slate-400"
                      animate={{ rotate: cityOpen ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  </motion.button>

                  <AnimatePresence>
                    {cityOpen && (
                      <motion.div
                        className="absolute left-0 top-[calc(100%+6px)] z-30 w-full rounded-xl border border-white/[0.12] bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-2xl overflow-hidden"
                        initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      >
                        {LOCATIONS.map((item, i) => (
                          <motion.button
                            key={item}
                            type="button"
                            onClick={() => { setCity(item); setCityOpen(false); }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs font-medium transition ${
                              city === item ? "bg-orange-500/20 text-orange-300 font-bold" : "text-slate-200 hover:bg-white/5"
                            }`}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ ...spring, delay: i * 0.04 }}
                          >
                            <span>{item}</span>
                            {city === item && <motion.i className="fa-solid fa-check text-xs text-orange-400" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring} />}
                          </motion.button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Search input with live results */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                  Search Properties
                  {query && matches.length > 0 && (
                    <span className="ml-2 normal-case text-emerald-400 font-bold">
                      {matches.length} result{matches.length !== 1 ? "s" : ""} found
                    </span>
                  )}
                </label>
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                  <input
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSuggestionsOpen(true); }}
                    onFocus={() => setSuggestionsOpen(true)}
                    placeholder="Flats, plots, shops, locality…"
                    className="w-full rounded-xl border border-white/[0.12] bg-slate-950/60 pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500/60 transition-colors"
                  />
                  {query && (
                    <motion.button
                      type="button"
                      onClick={() => { setQuery(""); setSuggestionsOpen(false); }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 text-white hover:bg-slate-600 transition"
                      whileTap={{ scale: 0.85 }}
                    >
                      <i className="fa-solid fa-xmark text-[10px]" />
                    </motion.button>
                  )}
                </div>
              </div>

              {/* Live results list (inline, always visible when query has results) */}
              <AnimatePresence>
                {(suggestionsOpen && matches.length > 0) && (
                  <motion.div
                    className="max-h-60 overflow-y-auto space-y-1.5 rounded-xl border border-white/[0.08] bg-slate-900/90 p-2 shadow-2xl"
                    initial={{ opacity: 0, y: -8, scaleY: 0.95 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -6, scaleY: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  >
                    <div className="px-2 py-1 text-[10px] font-bold uppercase text-orange-400 border-b border-white/[0.06] mb-1 flex items-center justify-between">
                      <span>{isFlatSearch ? "Residential Flats" : "Matching Deals"}</span>
                      <span className="text-slate-500 normal-case">{matches.length} {matches.length === 1 ? "result" : "results"}</span>
                    </div>
                    {matches.map((item, i) => (
                      <motion.div
                        key={item._id || item.id || item.label}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...spring, delay: i * 0.03 }}
                      >
                        <MiniCard
                          item={{
                            title: item.title,
                            location: item.location,
                            price: item.price,
                            expectedRoi: item.expectedRoi,
                            status: item.status,
                            image: item.image,
                            propertyType: item.propertyType,
                          }}
                          onClick={() => selectMatch(item)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                type="button"
                onClick={() => search()}
                disabled={!query.trim()}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                whileHover={{ scale: query.trim() ? 1.01 : 1 }}
                whileTap={{ scale: query.trim() ? 0.97 : 1 }}
                transition={spring}
              >
                <i className="fa-solid fa-magnifying-glass text-[11px]" />
                <span>Search All Deals</span>
                <i className="fa-solid fa-arrow-right text-[11px]" />
              </motion.button>

              {/* Quick tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Quick:</span>
                {["Luxury 3 BHK", "Vrindavan Plot", "Commercial Shop", "Noida Flat"].map((tag) => (
                  <motion.button
                    key={tag}
                    type="button"
                    onClick={() => search(tag)}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-400 hover:border-orange-500/40 hover:text-white transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={spring}
                  >
                    {tag}
                  </motion.button>
                ))}
              </div>

              {/* Loading indicator */}
              {loading && (
                <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                  <motion.i className="fa-solid fa-spinner animate-spin" />
                  <span>Syncing latest properties…</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slide dots */}
      <motion.div
        className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-slate-900/70 px-3 py-1.5 backdrop-blur-lg border border-white/[0.08]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        {slides.map((_, idx) => (
          <motion.button
            key={idx}
            type="button"
            aria-label={`Slide ${idx + 1}`}
            onClick={() => setActiveSlide(idx)}
            className="rounded-full transition-colors"
            animate={{
              width: activeSlide === idx ? 32 : 8,
              backgroundColor: activeSlide === idx ? "#f97316" : "rgba(255,255,255,0.2)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <span className="block h-2 w-2 sm:w-3" />
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
