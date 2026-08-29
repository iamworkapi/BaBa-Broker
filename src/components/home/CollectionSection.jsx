import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ScrollReveal from "../ScrollReveal";

const COLLECTION_THEMES = [
  {
    accent: "orange",
    gradient: "from-orange-500 to-amber-500",
    text: "text-orange-400",
    bg: "bg-orange-500",
    border: "border-orange-500/40",
    glow: "bg-orange-500/15",
    ring: "ring-orange-500/30",
    shadow: "shadow-orange-500/20",
    iconBg: "bg-orange-500/10",
  },
  {
    accent: "blue",
    gradient: "from-blue-500 to-cyan-400",
    text: "text-blue-400",
    bg: "bg-blue-500",
    border: "border-blue-500/40",
    glow: "bg-blue-500/15",
    ring: "ring-blue-500/30",
    shadow: "shadow-blue-500/20",
    iconBg: "bg-blue-500/10",
  },
  {
    accent: "emerald",
    gradient: "from-emerald-500 to-green-400",
    text: "text-emerald-400",
    bg: "bg-emerald-500",
    border: "border-emerald-500/40",
    glow: "bg-emerald-500/15",
    ring: "ring-emerald-500/30",
    shadow: "shadow-emerald-500/20",
    iconBg: "bg-emerald-500/10",
  },
  {
    accent: "purple",
    gradient: "from-purple-500 to-violet-400",
    text: "text-purple-400",
    bg: "bg-purple-500",
    border: "border-purple-500/40",
    glow: "bg-purple-500/15",
    ring: "ring-purple-500/30",
    shadow: "shadow-purple-500/20",
    iconBg: "bg-purple-500/10",
  },
  {
    accent: "rose",
    gradient: "from-rose-500 to-pink-400",
    text: "text-rose-400",
    bg: "bg-rose-500",
    border: "border-rose-500/40",
    glow: "bg-rose-500/15",
    ring: "ring-rose-500/30",
    shadow: "shadow-rose-500/20",
    iconBg: "bg-rose-500/10",
  },
];

const TYPE_BADGE = {
  residential: "Residential",
  commercial: "Commercial",
  plot: "Plot / Land",
};

const TYPE_ICON = {
  residential: "fa-building",
  commercial: "fa-store",
  plot: "fa-map-location-dot",
};

function mapPropertyToCard(prop, idx) {
  const theme = COLLECTION_THEMES[idx % COLLECTION_THEMES.length];
  const badge = TYPE_BADGE[prop.propertyType] || "Portfolio";
  const icon = TYPE_ICON[prop.propertyType] || "fa-gem";

  return {
    title: prop.title || "Untitled Project",
    badge,
    icon: `fa-solid ${icon}`,
    desc: (prop.description || "").slice(0, 140) + ((prop.description || "").length > 140 ? "…" : ""),
    image: prop.image || (Array.isArray(prop.images) && prop.images[0]) || "",
    price: prop.price || "",
    expectedRoi: prop.expectedRoi || 0,
    status: prop.status || "running",
    location: prop.location || "",
    rawProject: prop,
    theme,
  };
}

const fallbackPortfolios = [
  {
    title: "Pre-Leased Commercial",
    propertyType: "commercial",
    description: "Prime office spaces leased to blue-chip corporations delivering stable monthly rental income with zero vacancy risk and long-term appreciation.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80",
    price: "₹ 1.2 Cr",
    expectedRoi: 12,
    status: "running",
    location: "Sector 62, Noida",
  },
  {
    title: "Fractional Portfolios",
    propertyType: "residential",
    description: "Co-own premium real estate with a fraction of the capital. Diversify effortlessly across multiple high-yield residential assets.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop&q=80",
    price: "₹ 2.5 Lakhs",
    expectedRoi: 15,
    status: "running",
    location: "Greater Noida West",
  },
  {
    title: "Appreciation Land",
    propertyType: "plot",
    description: "Acquire plots in expanding infrastructure corridors along upcoming metro and expressway routes for maximum capital multiplier effects.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80",
    price: "₹ 45 Lakhs",
    expectedRoi: 18,
    status: "upcoming",
    location: "Yamuna Expressway",
  },
  {
    title: "Luxury Suites",
    propertyType: "residential",
    description: "Invest in high-demand luxury serviced apartments in prime metro locations capturing premium short-term rental yields.",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&auto=format&fit=crop&q=80",
    price: "₹ 85 Lakhs",
    expectedRoi: 14,
    status: "running",
    location: "Gurugram, Golf Course",
  },
  {
    title: "Distressed Assets",
    propertyType: "commercial",
    description: "Capitalize on bank auctions and below-market-value properties for immediate equity gain and rapid value-add returns.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    price: "₹ 35 Lakhs",
    expectedRoi: 22,
    status: "running",
    location: "Delhi NCR",
  },
];

/* ─── Horizontal scroll hook ─── */
function useHorizontalScroll(ref) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [ref]);

  const scroll = (dir) => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  return { canScrollLeft, canScrollRight, scroll };
}

/* ─── Status badge helper ─── */
function StatusPill({ status }) {
  const map = {
    running: { label: "Live", cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
    upcoming: { label: "Upcoming", cls: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
    delivered: { label: "Delivered", cls: "bg-slate-500/20 text-slate-400 border-slate-500/30" },
  };
  const s = map[status] || map.running;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider backdrop-blur-md ${s.cls}`}>
      {status === "running" && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
          <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
      )}
      {s.label}
    </span>
  );
}

const CollectionSection = () => {
  const navigate = useNavigate();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(null);
  const scrollRef = useRef(null);
  const { canScrollLeft, canScrollRight, scroll } = useHorizontalScroll(scrollRef);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/properties/portfolios")
      .then((res) => {
        if (!res.ok) throw new Error("API Error");
        return res.json();
      })
      .then((data) => {
        if (!cancelled && Array.isArray(data)) {
          setPortfolios(data.filter((p) => p.isPortfolio === true));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo(() => {
    const source = portfolios.length > 0 ? portfolios : fallbackPortfolios;
    return source.map(mapPropertyToCard);
  }, [portfolios]);

  /* ─── Loading skeleton ─── */
  if (loading) {
    return (
      <section className="py-24 relative bg-slate-950 overflow-hidden select-none">
        <div className="max-w-[95%] xl:max-w-7xl mx-auto relative z-10">
          <div className="animate-pulse space-y-4 mb-12 text-center">
            <div className="h-4 w-36 bg-slate-800 rounded-full mx-auto" />
            <div className="h-10 w-80 bg-slate-800 rounded-lg mx-auto" />
            <div className="h-4 w-96 bg-slate-800/60 rounded mx-auto" />
          </div>
          <div className="flex gap-6 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[320px] h-[440px] rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 relative bg-slate-950 overflow-hidden select-none">
      {/* Ambient glow */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-orange-500/[0.025] to-transparent rounded-full blur-[150px]" />
        <div className="absolute bottom-20 right-0 w-[600px] h-[600px] bg-blue-600/[0.02] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/[0.015] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-[95%] xl:max-w-7xl mx-auto relative z-10">
        <ScrollReveal>
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 px-4">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-orange-500/20 bg-orange-500/[0.06] px-4 py-1.5 mb-6 backdrop-blur-sm">
              <i className="fa-solid fa-gem text-orange-400 text-xs" />
              <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">
                Curated Categories
              </span>
              <span className="h-1 w-1 rounded-full bg-orange-500/40" />
              <span className="text-[10px] font-semibold text-slate-500">
                {cards.length} Collections
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[2.8rem] font-black text-white mb-4 tracking-tight leading-tight">
              Premium Asset{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                  Collections
                </span>
                <span
                  aria-hidden="true"
                  className="absolute bottom-0.5 left-0 right-0 h-3 bg-orange-500/10 rounded-full -z-0"
                />
              </span>
            </h2>

            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Hand-picked investment vehicles spanning commercial, luxury residential, and strategic land parcels.
              Explore vetted opportunities tailored for serious wealth creation.
            </p>
          </div>

          {/* Scroll Navigation Controls */}
          <div className="flex items-center justify-end gap-2 px-4 mb-6">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-auto">
              <i className="fa-solid fa-hand-pointer text-slate-600 mr-1.5" />
              Scroll to explore
            </span>
            <button
              type="button"
              onClick={() => scroll(-1)}
              disabled={!canScrollLeft}
              className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 cursor-pointer ${
                canScrollLeft
                  ? "border-white/15 bg-slate-900/80 text-white hover:bg-orange-500/20 hover:border-orange-500/40 hover:text-orange-400"
                  : "border-white/5 bg-slate-900/40 text-slate-700 cursor-not-allowed"
              }`}
            >
              <i className="fa-solid fa-chevron-left text-xs" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              disabled={!canScrollRight}
              className={`flex items-center justify-center w-9 h-9 rounded-xl border transition-all duration-200 cursor-pointer ${
                canScrollRight
                  ? "border-white/15 bg-slate-900/80 text-white hover:bg-orange-500/20 hover:border-orange-500/40 hover:text-orange-400"
                  : "border-white/5 bg-slate-900/40 text-slate-700 cursor-not-allowed"
              }`}
            >
              <i className="fa-solid fa-chevron-right text-xs" />
            </button>
          </div>

          {/* Horizontal Scroll Cards */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {cards.map((item, index) => {
              const t = item.theme;
              const isActive = activeIdx === index;

              return (
                <div
                  key={item.title + index}
                  className={`group relative shrink-0 w-[310px] sm:w-[340px] rounded-3xl overflow-hidden cursor-pointer snap-start transition-all duration-500 will-change-transform ${
                    isActive ? `ring-2 ${t.ring} shadow-2xl ${t.shadow}` : "shadow-xl"
                  } hover:-translate-y-2 hover:shadow-2xl`}
                  onMouseEnter={() => setActiveIdx(index)}
                  onMouseLeave={() => setActiveIdx(null)}
                  onClick={() => {
                    if (item.rawProject) {
                      navigate("/property-details", { state: { project: item.rawProject } });
                    } else {
                      navigate("/all-properties");
                    }
                  }}
                >
                  {/* Image */}
                  <div className="relative h-[200px] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" fill="%230f172a"><rect width="400" height="300"/><text x="200" y="160" text-anchor="middle" fill="%23334155" font-size="14">No Image</text></svg>';
                      }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Dark overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                    {/* Top badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-xl border border-white/10 bg-slate-950/60 ${t.text}`}>
                        <i className={`${item.icon} text-[9px]`} />
                        {item.badge}
                      </span>
                      <StatusPill status={item.status} />
                    </div>

                    {/* Price tag floating */}
                    {item.price && (
                      <div className="absolute bottom-3 left-3 z-10">
                        <span className="text-lg font-black text-white drop-shadow-lg tracking-tight">
                          {item.price}
                        </span>
                      </div>
                    )}

                    {/* ROI badge */}
                    {item.expectedRoi > 0 && (
                      <div className="absolute bottom-3 right-3 z-10">
                        <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-black backdrop-blur-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400`}>
                          <i className="fa-solid fa-arrow-trend-up text-[9px]" />
                          {item.expectedRoi}% IRR
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="relative bg-slate-900/95 backdrop-blur-xl p-5 border-t border-white/[0.04]">
                    {/* Hover glow */}
                    <div className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${t.glow} ${isActive ? "opacity-40" : "opacity-0"}`} />

                    <div className="relative z-10">
                      {/* Title */}
                      <h3 className="text-base font-black text-white mb-2 tracking-tight leading-snug group-hover:text-white transition-colors">
                        {item.title}
                      </h3>

                      {/* Location */}
                      {item.location && (
                        <p className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium mb-3">
                          <i className="fa-solid fa-location-dot text-[9px]" />
                          {item.location}
                        </p>
                      )}

                      {/* Description */}
                      <p className="text-slate-400 text-xs leading-relaxed mb-5 line-clamp-2">
                        {item.desc}
                      </p>

                      {/* CTA Row */}
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-2 text-[11px] font-bold tracking-wide transition-all duration-300 ${t.text} group-hover:gap-3`}>
                          <span>View Details</span>
                          <span className={`flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300 ${t.border} group-hover:${t.bg} group-hover:text-white group-hover:border-transparent group-hover:scale-110`}>
                            <i className="fa-solid fa-arrow-right text-[8px]" />
                          </span>
                        </span>

                        {/* Micro avatar stack (social proof) */}
                        <div className="flex items-center gap-1">
                          <div className="flex -space-x-1.5">
                            {["AK", "RS", "PM"].map((ini, i) => (
                              <div
                                key={ini}
                                className="h-5 w-5 rounded-full bg-slate-800 border border-slate-700 text-[7px] font-bold text-slate-400 flex items-center justify-center"
                              >
                                {ini}
                              </div>
                            ))}
                          </div>
                          <span className="text-[9px] text-slate-600 font-medium">+12</span>
                        </div>
                      </div>
                    </div>

                    {/* Animated bottom accent line */}
                    <div
                      className={`absolute bottom-0 left-0 h-[2px] transition-all duration-700 ease-out ${
                        isActive ? "w-full" : "w-0"
                      } bg-gradient-to-r ${t.gradient} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}

            {/* View All Card */}
            <div
              className="group relative shrink-0 w-[310px] sm:w-[340px] rounded-3xl overflow-hidden cursor-pointer snap-start border border-dashed border-white/10 bg-slate-900/30 hover:border-orange-500/30 hover:bg-slate-900/60 transition-all duration-500 flex flex-col items-center justify-center text-center p-8"
              onClick={() => navigate("/all-properties")}
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-orange-500/20 transition-all duration-300">
                <i className="fa-solid fa-grid-2 text-2xl text-orange-400" />
              </div>
              <h3 className="text-lg font-black text-white mb-2 tracking-tight">
                View All Assets
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6 max-w-[200px]">
                Browse our complete portfolio of verified investment properties.
              </p>
              <span className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 group-hover:gap-3 transition-all duration-300">
                <span>Explore All</span>
                <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>

          {/* Scroll indicator dots */}
          <div className="flex items-center justify-center gap-1.5 mt-8">
            {cards.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  if (scrollRef.current) {
                    const cardW = scrollRef.current.children[0]?.offsetWidth || 340;
                    scrollRef.current.scrollTo({ left: i * (cardW + 20), behavior: "smooth" });
                  }
                  setActiveIdx(i);
                }}
                className={`rounded-full transition-all duration-300 cursor-pointer ${
                  activeIdx === i
                    ? "w-6 h-2 bg-orange-500"
                    : "w-2 h-2 bg-slate-700 hover:bg-slate-600"
                }`}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CollectionSection;
