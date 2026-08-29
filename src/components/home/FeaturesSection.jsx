import { useState } from "react";

const featuresData = [
  {
    title: "Discover High-Yield Assets",
    desc: "Filter curated commercial and residential properties tailored to deliver strong, verified returns with institutional-grade due diligence.",
    icon: "fa-solid fa-arrow-trend-up",
    linkText: "Explore Assets",
    linkUrl: "#explore",
    stat: "14.2%",
    statLabel: "Avg. IRR",
    accentFrom: "from-orange-500",
    accentTo: "to-amber-500",
    accentBg: "bg-orange-500",
    accentText: "text-orange-400",
    accentBorder: "border-orange-500/30",
    accentGlow: "bg-orange-500/10",
    hoverBorder: "hover:border-orange-500/50",
    hoverShadow: "hover:shadow-orange-500/10",
  },
  {
    title: "Consult Wealth Advisors",
    desc: "Connect with certified market analysts to tailor an investment strategy that matches your goals and risk appetite.",
    icon: "fa-solid fa-user-tie",
    linkText: "Find an Advisor",
    linkUrl: "#advisors",
    stat: "50+",
    statLabel: "Experts",
    accentFrom: "from-blue-500",
    accentTo: "to-cyan-500",
    accentBg: "bg-blue-500",
    accentText: "text-blue-400",
    accentBorder: "border-blue-500/30",
    accentGlow: "bg-blue-500/10",
    hoverBorder: "hover:border-blue-500/50",
    hoverShadow: "hover:shadow-blue-500/10",
  },
  {
    title: "Co-Own Premium Real Estate",
    desc: "Build a diversified portfolio with fractional shares in institutional-grade properties starting from ₹2.5 Lakhs.",
    icon: "fa-solid fa-cubes",
    linkText: "View Fractional",
    linkUrl: "#fractional",
    stat: "₹2.5L",
    statLabel: "Min. Entry",
    accentFrom: "from-emerald-500",
    accentTo: "to-green-500",
    accentBg: "bg-emerald-500",
    accentText: "text-emerald-400",
    accentBorder: "border-emerald-500/30",
    accentGlow: "bg-emerald-500/10",
    hoverBorder: "hover:border-emerald-500/50",
    hoverShadow: "hover:shadow-emerald-500/10",
  },
  {
    title: "Get Investment Alerts",
    desc: "Set your target ROI parameters and get notified the exact second a matching high-yield asset opportunity drops.",
    icon: "fa-solid fa-bell",
    linkText: "Set an Alert",
    linkUrl: "#alerts",
    stat: "24/7",
    statLabel: "Live Alerts",
    accentFrom: "from-purple-500",
    accentTo: "to-violet-500",
    accentBg: "bg-purple-500",
    accentText: "text-purple-400",
    accentBorder: "border-purple-500/30",
    accentGlow: "bg-purple-500/10",
    hoverBorder: "hover:border-purple-500/50",
    hoverShadow: "hover:shadow-purple-500/10",
  },
];

const FeaturesSection = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="relative py-20 overflow-hidden select-none bg-slate-950">
      {/* Ambient background effects */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full bg-orange-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-600/[0.025] blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.06] px-4 py-1.5 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-orange-400 animate-ping opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-orange-400" />
            </span>
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em]">
              Why Investors Choose Us
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-white tracking-tight leading-tight">
            Your Wealth,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
              Engineered
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-2xl mx-auto leading-relaxed font-medium">
            Institutional-grade tools and verified deal flow — designed for the modern investor who demands excellence.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuresData.map((feat, index) => {
            const isHovered = hoveredIdx === index;

            return (
              <div
                key={index}
                className={`group relative flex flex-col rounded-2xl border border-white/[0.08] bg-slate-900/70 backdrop-blur-xl p-6 transition-all duration-500 cursor-pointer overflow-hidden ${feat.hoverBorder} ${feat.hoverShadow} hover:shadow-2xl hover:-translate-y-1.5`}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Hover glow overlay */}
                <div
                  className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none ${feat.accentGlow} ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />

                {/* Floating orb accent */}
                <div
                  className={`absolute -top-8 -right-8 h-24 w-24 rounded-full blur-[40px] transition-all duration-700 pointer-events-none ${feat.accentBg} ${
                    isHovered ? "opacity-20 scale-110" : "opacity-0 scale-75"
                  }`}
                />

                {/* Content */}
                <div className="relative z-10 flex-1">
                  {/* Icon + Stat Row */}
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-xl border transition-all duration-400 ${feat.accentBorder} ${feat.accentGlow} ${feat.accentText} group-hover:scale-110`}
                    >
                      <i className={`${feat.icon} text-lg transition-transform duration-300 group-hover:rotate-6`} />
                    </div>

                    {/* Mini stat badge */}
                    <div className="text-right">
                      <span className={`block text-lg font-black tracking-tight ${feat.accentText} transition-all duration-300 group-hover:scale-105`}>
                        {feat.stat}
                      </span>
                      <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                        {feat.statLabel}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-[15px] text-white mb-2.5 tracking-tight leading-snug transition-colors duration-200 group-hover:text-white">
                    {feat.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-xs leading-relaxed mb-6 font-normal">
                    {feat.desc}
                  </p>
                </div>

                {/* Bottom CTA */}
                <div className="relative z-10 mt-auto">
                  <div className={`h-px w-full mb-4 transition-all duration-500 ${isHovered ? `bg-gradient-to-r ${feat.accentFrom} ${feat.accentTo} opacity-40` : "bg-white/[0.06]"}`} />

                  <a
                    href={feat.linkUrl}
                    className={`inline-flex items-center gap-2 text-xs font-bold tracking-wide transition-all duration-300 ${feat.accentText} group-hover:gap-3`}
                  >
                    <span>{feat.linkText}</span>
                    <span
                      className={`flex items-center justify-center w-5 h-5 rounded-full border transition-all duration-300 ${feat.accentBorder} group-hover:${feat.accentBg} group-hover:text-white group-hover:border-transparent group-hover:scale-110`}
                    >
                      <i className="fa-solid fa-arrow-right text-[8px]" />
                    </span>
                  </a>
                </div>

                {/* Decorative corner line */}
                <div
                  className={`absolute bottom-0 left-0 h-[2px] transition-all duration-700 ease-out ${
                    isHovered ? "w-full" : "w-0"
                  } bg-gradient-to-r ${feat.accentFrom} ${feat.accentTo} rounded-full`}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom trust strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {[
            { icon: "fa-shield-halved", text: "RERA Verified Assets" },
            { icon: "fa-lock", text: "Bank-Grade Security" },
            { icon: "fa-chart-pie", text: "Transparent Returns" },
            { icon: "fa-headset", text: "Dedicated Support" },
          ].map((trust, i) => (
            <span key={i} className="flex items-center gap-2 text-[11px] font-semibold text-slate-500">
              <i className={`fa-solid ${trust.icon} text-slate-600 text-[10px]`} />
              <span>{trust.text}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
