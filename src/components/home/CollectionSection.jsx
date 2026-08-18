
const collectionsData = [
  {
    title: "Pre-Leased Commercial",
    badge: "Grade-A Tenancy",
    desc: "Prime office spaces leased to blue-chip corporations for zero-risk income.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    colorClass: "text-orange-400",
    glowClass: "group-hover:shadow-orange-500/10",
    borderClass: "group-hover:border-orange-500/40",
    btnBorder: "border-orange-400/60 group-hover:border-orange-400",
  },
  {
    title: "Fractional Portfolios",
    badge: "Micro-Investments",
    desc: "Co-own premium real estate with a fraction of the capital. Diversify effortlessly.",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&auto=format&fit=crop&q=80",
    colorClass: "text-blue-400",
    glowClass: "group-hover:shadow-blue-500/10",
    borderClass: "group-hover:border-blue-500/40",
    btnBorder: "border-blue-400/60 group-hover:border-blue-400",
  },
  {
    title: "Appreciation Land",
    badge: "Strategic Parcels",
    desc: "Acquire plots in expanding infrastructure corridors for maximum multiplier effects.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&auto=format&fit=crop&q=80",
    colorClass: "text-green-400",
    glowClass: "group-hover:shadow-green-500/10",
    borderClass: "group-hover:border-green-500/40",
    btnBorder: "border-green-400/60 group-hover:border-green-400",
  },
  {
    title: "Luxury Rentals",
    badge: "Airbnb Portfolios",
    desc: "Invest in high-demand tourist hotspots to capture explosive short-term yields.",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&auto=format&fit=crop&q=80",
    colorClass: "text-purple-400",
    glowClass: "group-hover:shadow-purple-500/10",
    borderClass: "group-hover:border-purple-500/40",
    btnBorder: "border-purple-400/60 group-hover:border-purple-400",
  },
  {
    title: "Distressed Assets",
    badge: "Below Market Value",
    desc: "Capitalize on bank auctions and undervalued properties for immediate equity gain.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80",
    colorClass: "text-red-400",
    glowClass: "group-hover:shadow-red-500/10",
    borderClass: "group-hover:border-red-500/40",
    btnBorder: "border-red-400/60 group-hover:border-red-400",
  },
];

const CollectionSection = () => {
  return (
    <section className="py-24 relative bg-slate-950 overflow-hidden select-none">
      {/* Ambient Graphic Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-orange-500/[0.02] to-transparent rounded-full blur-[130px] pointer-events-none"></div>

      <div className="max-w-[95%] xl:max-w-7xl mx-auto px-4 lg:px-0 relative z-10">
        {/* Centered Premium Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-4 py-1.5 rounded-full w-max mb-5 shadow-sm">
            <i className="fa-solid fa-gem text-orange-400 text-xs"></i>
            <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Curated Categories
            </p>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 tracking-tight">
            Asset{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">
              Collections
            </span>
          </h2>

          <p className="text-slate-400 text-base leading-relaxed">
            Hand-picked investment vehicles spanning commercial, luxury
            residential, and distressed assets. Explore vetted opportunities
            tailored for serious wealth creation.
          </p>
        </div>

        {/* 5-Card Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {collectionsData.map((item, index) => (
            <div
              key={index}
              className={`group relative h-[460px] rounded-2xl overflow-hidden cursor-pointer border border-white/5 bg-slate-900 shadow-xl transition-all duration-500 will-change-transform ${item.borderClass} ${item.glowClass} hover:-translate-y-1.5`}
            >
              {/* Card Background Image Layer */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 cubic-bezier(0.25, 1, 0.5, 1) group-hover:scale-105 will-change-transform"
              />

              {/* Static dark overlay for clear reading text base */}
              <div className="absolute inset-0 bg-slate-950/40 z-10"></div>

              {/* Dynamic Reactive Masking Layer */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent opacity-90 lg:opacity-75 transition-opacity duration-500 group-hover:opacity-95 z-20"></div>

              {/* Card Content Stack */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end z-30">
                {/* Header Info Group (Always Visible, Shifts smoothly on Desktop Hover) */}
                <div className="transform lg:translate-y-[76px] group-hover:translate-y-0 transition-transform duration-500 cubic-bezier(0.25, 1, 0.5, 1) will-change-transform">
                  <p
                    className={`font-bold text-[10px] uppercase tracking-widest mb-1.5 transition-colors duration-300 ${item.colorClass}`}
                  >
                    {item.badge}
                  </p>

                  <h3 className="text-lg font-black text-white mb-4 leading-snug tracking-tight">
                    {item.title}
                  </h3>
                </div>

                {/* Hidden on Desktop until Hover, Fully interactive instantly on Mobile Viewports */}
                <div className="opacity-100 lg:opacity-0 lg:transform lg:translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 cubic-bezier(0.25, 1, 0.5, 1) delay-75 will-change-transform">
                  <p className="text-slate-300 text-xs leading-relaxed mb-5 font-medium">
                    {item.desc}
                  </p>

                  <span
                    className={`inline-flex items-center gap-2 text-white font-bold text-[11px] tracking-wide border-b pb-1 transition-all duration-300 ${item.btnBorder}`}
                  >
                    Explore Opportunities
                    <i className="fa-solid fa-arrow-right text-[9px] transition-transform duration-300 group-hover:translate-x-1"></i>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionSection;
