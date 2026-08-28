
const featuresData = [
  {
    title: "Discover High-Yield Assets",
    desc: "Filter curated commercial and residential properties tailored to deliver strong, verified returns.",
    icon: "fa-solid fa-arrow-trend-up",
    linkText: "Explore Assets",
    linkUrl: "#explore",
  },
  {
    title: "Consult Wealth Advisors",
    desc: "Connect with certified market analysts to tailor an investment strategy that matches your goals.",
    icon: "fa-solid fa-user-tie",
    linkText: "Find an Advisor",
    linkUrl: "#advisors",
  },
  {
    title: "Co-Own Premium Real Estate",
    desc: "Build a diversified portfolio with fractional shares in institutional-grade properties.",
    icon: "fa-solid fa-cubes",
    linkText: "View Fractional",
    linkUrl: "#fractional",
  },
  {
    title: "Get Investment Alerts",
    desc: "Set your target ROI parameters and get notified the exact second a matching asset drops.",
    icon: "fa-solid fa-bell",
    linkText: "Set an Alert",
    linkUrl: "#alerts",
  },
];

const FeaturesSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 lg:-mt-16 select-none">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuresData.map((feat, index) => (
          <div
            key={index}
            className="group card-advanced p-6 cursor-pointer"
          >
            <div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent border border-accent/20 transition-all duration-300 group-hover:bg-accent group-hover:text-white group-hover:scale-105 shadow-inner mb-5">
                <i
                  className={`${feat.icon} text-xl transition-transform duration-300 group-hover:rotate-3`}
                ></i>
              </div>

              <h3 className="font-bold text-base text-white mb-2 tracking-tight transition-colors duration-200 group-hover:text-accent">
                {feat.title}
              </h3>

              <p className="text-slate-400 text-xs leading-relaxed mb-6 font-normal">
                {feat.desc}
              </p>
            </div>

            <a
              href={feat.linkUrl}
              className="inline-flex items-center gap-1.5 text-accent font-semibold text-xs transition-colors duration-200 group-hover:text-accent-light mt-auto w-max"
            >
              <span>{feat.linkText}</span>
              <i className="fa-solid fa-chevron-right text-[9px] transition-transform duration-300 group-hover:translate-x-1"></i>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
