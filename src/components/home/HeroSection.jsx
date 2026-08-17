import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const slides = [
  "/assets/img/banner1.png",
  "/assets/img/banner2.png",
  "/assets/img/banner3.png",
];

const POPULAR_FLAT_PICKS = [
  {
    id: "flat-pick-1",
    label: "Luxury 3 BHK Apartment in South Delhi",
    sub: "Okhla, New Delhi • ₹1.5 Cr",
    propertyType: "residential",
    badge: "12% IRR",
  },
  {
    id: "flat-pick-2",
    label: "Executive Studio Suite in Noida Sector 62",
    sub: "Sector 62, Noida • ₹45 Lakhs",
    propertyType: "residential",
    badge: "Pre-Leased",
  },
  {
    id: "flat-pick-3",
    label: "2 BHK Smart Residence in Greater Noida West",
    sub: "Gaur City, Greater Noida • ₹65 Lakhs",
    propertyType: "residential",
    badge: "High Growth",
  },
  {
    id: "flat-pick-4",
    label: "Penthouse Suite on Golf Course Road",
    sub: "DLF Phase 5, Gurugram • ₹2.8 Cr",
    propertyType: "residential",
    badge: "Premium Flat",
  },
  {
    id: "flat-pick-5",
    label: "2 BHK Residential Flat near Vrindavan Temple",
    sub: "Raman Reti, Vrindavan • ₹38 Lakhs",
    propertyType: "residential",
    badge: "High Appreciation",
  },
];

const fallbackSuggestions = [
  "Luxury 3 BHK Apartment in South Delhi",
  "Executive Studio Suite in Noida Sector 62",
  "2 BHK Smart Residence in Greater Noida West",
  "Residential Plots in Vrindavan (High Growth)",
  "Pre-Leased Commercial Shops with 14% Yield",
  "Fractional Tokens from ₹2.5 Lakhs",
];

const CATEGORIES = [
  { id: "all", label: "All Deals", icon: "fa-layer-group" },
  { id: "plot", label: "Land & Plots", icon: "fa-map-location-dot" },
  { id: "commercial", label: "Commercial", icon: "fa-store" },
  { id: "residential", label: "Flats & Suites", icon: "fa-building" },
];

const RECENT_INVESTMENTS_TICKER = [
  "🔥 Over ₹12.4 Cr invested by 1,200+ HNI investors this quarter",
  "⚡ 4 Fractional Shares remaining in Noida Commercial Hub (13.5% Rent Yield)",
  "📈 Vrindavan Cultural Corridor Land Values appreciated +18.4% YoY",
];

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
  const [tickerIndex, setTickerIndex] = useState(0);

  const searchContainerRef = useRef(null);
  const navigate = useNavigate();

  // Equal-length phrases (19-22 characters) to ensure rock-solid stability without vertical jerking
  const phrases = useMemo(
    () => [
      "14.2% Fixed Returns",
      "Fractional Land Shares",
      "Bank-Verified Plots",
      "High-Yield Commercial",
    ],
    []
  );

  // Fetch properties from backend
  useEffect(() => {
    fetch("/api/properties")
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setProperties(data);
      })
      .catch(() => { });
  }, []);

  // Background banner slides slideshow with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(
      () => setActiveSlide((current) => (current + 1) % slides.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [isPaused]);

  // Live Investor Ticker auto-switch
  useEffect(() => {
    const tickerTimer = window.setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % RECENT_INVESTMENTS_TICKER.length);
    }, 4500);
    return () => window.clearInterval(tickerTimer);
  }, []);

  // Typing animation effect with smooth stability
  useEffect(() => {
    const phrase = phrases[phraseIndex];
    const delay = deleting ? 35 : 70;
    const timer = window.setTimeout(
      () => {
        if (!deleting && typedText === phrase) {
          setDeleting(true);
          return;
        }
        if (deleting && typedText === "") {
          setDeleting(false);
          setPhraseIndex((index) => (index + 1) % phrases.length);
          return;
        }
        setTypedText((text) =>
          deleting ? text.slice(0, -1) : phrase.slice(0, text.length + 1),
        );
      },
      !deleting && typedText === phrase ? 2000 : delay,
    );
    return () => window.clearTimeout(timer);
  }, [typedText, deleting, phraseIndex, phrases]);

  // Close dropdowns on outside click UX
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setCityOpen(false);
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Live-matched properties for active category
  const categoryPool = useMemo(
    () =>
      activeCategory === "all"
        ? properties
        : properties.filter((p) => p.propertyType === activeCategory),
    [properties, activeCategory],
  );

  // Check if current search or selected tab targets Flats
  const isFlatSearch = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (
      activeCategory === "residential" ||
      q.includes("flat") ||
      q.includes("bhk") ||
      q.includes("apartment") ||
      q.includes("suite") ||
      q.includes("residence")
    );
  }, [query, activeCategory]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      if (activeCategory === "residential") {
        const liveFlats = properties.filter((p) => p.propertyType === "residential");
        if (liveFlats.length > 0) {
          return liveFlats.slice(0, 6).map((p) => ({
            id: p._id,
            label: p.title,
            sub: p.location || "Prime Location",
            propertyType: "residential",
            raw: p,
          }));
        }
        return POPULAR_FLAT_PICKS;
      }

      return categoryPool.slice(0, 5).map((p) => ({
        id: p._id,
        label: p.title,
        sub: p.location,
        propertyType: p.propertyType,
        raw: p,
      }));
    }

    const live = categoryPool
      .filter(
        (p) =>
          (p.title || "").toLowerCase().includes(q) ||
          (p.location || "").toLowerCase().includes(q) ||
          (p.propertyType || "").toLowerCase().includes(q)
      )
      .slice(0, 6)
      .map((p) => ({
        id: p._id,
        label: p.title,
        sub: p.location,
        propertyType: p.propertyType,
        raw: p,
      }));

    if (live.length > 0) return live;

    if (isFlatSearch) {
      const filteredFlats = POPULAR_FLAT_PICKS.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.sub.toLowerCase().includes(q) ||
          q.includes("flat") ||
          q.includes("bhk")
      );
      if (filteredFlats.length > 0) return filteredFlats;
      return POPULAR_FLAT_PICKS;
    }

    return fallbackSuggestions
      .filter((s) => s.toLowerCase().includes(q))
      .map((s) => ({
        id: s,
        label: s,
        sub: "",
        propertyType: null,
        raw: null,
      }));
  }, [query, categoryPool, activeCategory, properties, isFlatSearch]);

  const categoryLabel = (type) => {
    if (type === "residential") return "Flat";
    if (type === "plot") return "Plot";
    if (type === "commercial") return "Shop";
    return "Investment";
  };

  const search = (term = query) => {
    const value = term.trim();
    const params = new URLSearchParams();
    if (value) params.set("search", value);
    if (activeCategory !== "all") params.set("type", activeCategory);
    if (city) params.set("city", city);
    const qs = params.toString();
    navigate(qs ? `/properties?${qs}` : "/properties");
  };

  const selectMatch = (match) => {
    setQuery(match.label);
    setSuggestionsOpen(false);
    if (match.raw) {
      navigate("/property-details", { state: { project: match.raw } });
    } else {
      search(match.label);
    }
  };

  return (
    <section
      id="home"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-slate-950 pt-28 sm:pt-36 lg:pt-40 pb-16 lg:pb-24"
    >
      {/* Background Carousel Images */}
      {slides.map((image, index) => (
        <img
          key={image}
          src={image}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1800ms] ease-in-out ${
            index === activeSlide ? "scale-100 opacity-60" : "scale-[1.05] opacity-0"
          }`}
        />
      ))}

      {/* Modern High-Contrast Gradient Backdrop Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/70"></div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2 rounded-full bg-slate-900/80 px-3.5 py-1.5 backdrop-blur-md border border-white/10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            onClick={() => setActiveSlide(idx)}
            className={`h-2 rounded-full transition-all ${
              activeSlide === idx ? "w-8 bg-orange-500" : "w-2 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Hero Content Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

          {/* Left Column: Executive Headline & Value Proposition (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-6 text-left">

            {/* Headline + Typing Phrase Block with Perfect Line Height & Zero Overlap */}
            <div className="min-h-[170px] sm:min-h-[190px] lg:min-h-[210px] flex flex-col justify-start space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-[2.85rem] font-extrabold text-white tracking-tight leading-[1.4] m-0">
                Invest Smarter in High-Yield Real Estate Offering
              </h1>
              <div className="text-2xl sm:text-3xl lg:text-[2.7rem] font-black text-orange-400 leading-9 tracking-tight">
                {typedText}
                <span className="ml-1 inline-block h-[.75em] w-[3px] animate-pulse bg-orange-400 align-[-.05em]" />
              </div>
            </div>

            {/* Subheadline Description Paragraph */}
            <p className="text-slate-300 text-sm sm:text-base font-normal leading-[1.75] max-w-xl">
              Access verified RERA & Bank-approved residential flats, commercial shops, and high-growth land starting from just ₹2.5 Lakhs.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                type="button"
                onClick={() => navigate("/properties")}
                className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-7 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-orange-500/25 transition hover:scale-[1.02] hover:brightness-110 active:scale-95 cursor-pointer"
              >
                <i className="fa-solid fa-fire text-slate-950"></i>
                <span>Explore Investment Deals</span>
                <i className="fa-solid fa-arrow-right text-[10px]"></i>
              </button>

              <button
                type="button"
                onClick={() => navigate("/become-investor")}
                className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/10 hover:border-white/40 cursor-pointer"
              >
                <i className="fa-solid fa-user-shield text-emerald-400"></i>
                <span>Become an Investor</span>
              </button>
            </div>

            {/* Social Proof Rating */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2">
                <div className="h-7 w-7 rounded-full bg-orange-500 text-slate-950 font-bold text-[10px] flex items-center justify-center border-2 border-slate-950">RS</div>
                <div className="h-7 w-7 rounded-full bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-slate-950">AK</div>
                <div className="h-7 w-7 rounded-full bg-emerald-500 text-white font-bold text-[10px] flex items-center justify-center border-2 border-slate-950">PM</div>
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1 text-amber-400 text-[11px]">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <span className="font-bold text-white ml-1">4.9 / 5</span>
                </div>
                <p className="text-[11px] text-slate-400">Trusted by 1,400+ Active Investors</p>
              </div>
            </div>

            {/* Trust Assurance Strip */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs font-medium text-slate-300 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <i className="fa-solid fa-circle-check"></i> <span className="text-slate-300">RERA Title Clear</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <i className="fa-solid fa-circle-check"></i> <span className="text-slate-300">Zero Management Fees</span>
              </span>
            </div>

          </div>

          {/* Right Column: Floating Glass Search Card (lg:col-span-5) */}
          <div className="lg:col-span-5 w-full">
            <div
              ref={searchContainerRef}
              className="w-full rounded-3xl border border-white/15 bg-slate-900/90 p-6 sm:p-7 shadow-2xl backdrop-blur-xl text-left space-y-5"
            >
              {/* Form Title & Desk Active Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-bold text-white">Search Property Deals</h3>
                  <p className="text-xs text-slate-400">Filter by category, city, or locality</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Live Desk</span>
                </div>
              </div>

              {/* Category Segmented Tabs */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Asset Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setActiveCategory(cat.id);
                        setSuggestionsOpen(true);
                      }}
                      className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition border ${activeCategory === cat.id
                        ? "bg-orange-500 text-slate-950 border-orange-400 shadow-md"
                        : "bg-slate-950/80 text-slate-300 border-white/10 hover:bg-slate-800"
                        }`}
                    >
                      <i className={`fa-solid ${cat.icon} text-xs ${activeCategory === cat.id ? 'text-slate-950' : 'text-orange-400'}`}></i>
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Select */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Target Location
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setCityOpen((open) => !open)}
                    className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-slate-950 px-3.5 py-2.5 text-xs font-semibold text-white outline-none hover:border-orange-500/50 transition"
                  >
                    <div className="flex items-center gap-2">
                      <i className="fa-solid fa-location-dot text-orange-400 text-xs"></i>
                      <span>{city}</span>
                    </div>
                    <i className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition ${cityOpen ? "rotate-180" : ""}`}></i>
                  </button>

                  {cityOpen && (
                    <div className="absolute left-0 top-[calc(100%+6px)] z-30 w-full rounded-xl border border-white/15 bg-slate-900 p-1.5 shadow-2xl backdrop-blur-2xl">
                      {["Delhi NCR", "Vrindavan", "Noida", "Gurugram"].map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => {
                            setCity(item);
                            setCityOpen(false);
                          }}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition ${city === item ? "bg-orange-500/20 text-orange-300 font-bold" : "text-slate-200 hover:bg-white/5"
                            }`}
                        >
                          <span>{item}</span>
                          {city === item && <i className="fa-solid fa-check text-xs text-orange-400"></i>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Keyword Search Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  search();
                }}
                className="space-y-3.5"
              >
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Keyword Search
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    <input
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setSuggestionsOpen(true);
                      }}
                      onFocus={() => setSuggestionsOpen(true)}
                      placeholder="Search flats, plots, shops, locality..."
                      className="w-full rounded-xl border border-white/15 bg-slate-950 pl-9 pr-8 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 transition"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuery("");
                          setSuggestionsOpen(false);
                        }}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center rounded-full bg-slate-700 text-[10px] text-white hover:bg-slate-600"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    )}
                  </div>
                </div>

                {/* Dropdown Suggestions */}
                {suggestionsOpen && matches.length > 0 && (
                  <div className="relative z-20 max-h-52 overflow-y-auto rounded-xl border border-white/15 bg-slate-950 p-1.5 shadow-2xl">
                    <div className="px-2.5 py-1 text-[10px] font-bold uppercase text-orange-400 border-b border-white/10 mb-1">
                      {isFlatSearch ? "Popular Flat Picks" : "Suggested Deals"}
                    </div>
                    {matches.map((item) => (
                      <button
                        key={item.id || item.label}
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectMatch(item)}
                        className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs text-slate-200 hover:bg-white/10 text-left transition"
                      >
                        <span className="truncate font-medium">{item.label}</span>
                        <span className="text-[10px] bg-orange-500/20 text-orange-300 font-bold px-2 py-0.5 rounded-full shrink-0 ml-2">
                          {item.badge || categoryLabel(item.propertyType)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Submit Search Button */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl transition hover:brightness-110 active:scale-95 cursor-pointer"
                >
                  <span>Search Matched Deals</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>
              </form>

              {/* Quick Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Tags:</span>
                {["Luxury 3 BHK", "Vrindavan Plot", "Commercial Shop"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => search(tag)}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] text-slate-300 hover:border-orange-500/50 hover:text-white transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Trust & Performance Stats Strip */}
        <div className="mx-auto mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <i className="fa-solid fa-vault text-base"></i>
            </div>
            <div className="text-left">
              <p className="text-base font-extrabold text-white">₹120+ Cr</p>
              <p className="text-[10px] font-medium text-slate-400">Asset Portfolio</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <i className="fa-solid fa-chart-line text-base"></i>
            </div>
            <div className="text-left">
              <p className="text-base font-extrabold text-white">14.2%</p>
              <p className="text-[10px] font-medium text-slate-400">Target Annual IRR</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <i className="fa-solid fa-shield-check text-base"></i>
            </div>
            <div className="text-left">
              <p className="text-base font-extrabold text-white">100%</p>
              <p className="text-[10px] font-medium text-slate-400">RERA Compliant</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <i className="fa-solid fa-users text-base"></i>
            </div>
            <div className="text-left">
              <p className="text-base font-extrabold text-white">8,500+</p>
              <p className="text-[10px] font-medium text-slate-400">Active Investors</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
