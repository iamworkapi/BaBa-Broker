import React, { useState, useEffect } from "react";

const AboutSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slides = [
    {
      title: "Zero Brokerage",
      desc: "Buy, sell or rent with no hidden charges or middlemen fees.",
      icon: "fa-handshake",
      img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&q=80",
    },
    {
      title: "High ROI Investments",
      desc: "Invest in pre-leased commercial assets with guaranteed returns.",
      icon: "fa-arrow-trend-up",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&q=80",
    },
    {
      title: "Fast Liquidity",
      desc: "Sell your property 3x faster with our AI matching algorithms.",
      icon: "fa-bolt",
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&q=80",
    },
  ];

  useEffect(() => {
    if (isHovered) return; // Pause slider auto-play when user hovers

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [slides.length, isHovered]);

  return (
    <section className="py-24 relative bg-slate-950 overflow-hidden">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left: Stacked Card Slider */}
          <div
            className="relative w-full h-[460px] sm:h-[520px] flex items-center justify-center lg:justify-end pr-0 lg:pr-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {slides.map((slide, index) => {
              const relativeIndex =
                (index - activeIndex + slides.length) % slides.length;

              // Advanced Card Spread Configurations
              const translateX =
                relativeIndex === 0
                  ? "0px"
                  : relativeIndex === 1
                    ? "-35px"
                    : relativeIndex === 2
                      ? "-70px"
                      : "0px";
              const translateY =
                relativeIndex === 0
                  ? "0px"
                  : relativeIndex === 1
                    ? "-10px"
                    : relativeIndex === 2
                      ? "-20px"
                      : "0px";
              const scale =
                relativeIndex === 0
                  ? 1
                  : relativeIndex === 1
                    ? 0.96
                    : relativeIndex === 2
                      ? 0.92
                      : 1;
              const rotate =
                relativeIndex === 0
                  ? "0deg"
                  : relativeIndex === 1
                    ? "-3deg"
                    : relativeIndex === 2
                      ? "-6deg"
                      : "0deg";
              const opacity = relativeIndex > 2 ? 0 : 1;
              const zIndex = 30 - relativeIndex * 10;
              const bgOpacity =
                relativeIndex === 0
                  ? "1"
                  : relativeIndex === 1
                    ? "0.85"
                    : "0.65";

              return (
                <div
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className="absolute w-[290px] sm:w-[350px] h-[390px] sm:h-[440px] rounded-2xl flex flex-col justify-end transition-all duration-700 ease-out cursor-pointer shadow-[-15px_20px_40px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden group/card"
                  style={{
                    background: `linear-gradient(180deg, rgba(15, 32, 66, ${bgOpacity}) 0%, rgba(9, 15, 29, ${bgOpacity}) 100%)`,
                    transform: `translate(${translateX}, ${translateY}) scale(${scale}) rotate(${rotate})`,
                    zIndex: zIndex,
                    opacity: opacity,
                    transformOrigin: "bottom right",
                  }}
                >
                  {/* Image Overlay */}
                  <div className="absolute inset-0 h-[55%] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090f1d]/40 to-[#090f1d] z-10"></div>
                    <img
                      src={slide.img}
                      alt={slide.title}
                      className="w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover/card:scale-110"
                    />
                  </div>

                  {/* Card Content */}
                  <div className="relative z-20 p-8 text-left">
                    <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-5 text-orange-400">
                      <i className={`fa-solid ${slide.icon} text-2xl`}></i>
                    </div>
                    <h3 className="text-white text-xl sm:text-2xl font-bold mb-2 tracking-tight">
                      {slide.title}
                    </h3>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {slide.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Typography and Content Info */}
          <div className="flex flex-col justify-center lg:pl-4 text-left">
            {/* Live Activity Status Badge */}
            <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full w-max mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <p className="text-orange-400 text-[10px] font-extrabold uppercase tracking-[0.25em]">
                Welcome To
              </p>
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tight">
              BABA{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">
                BROKER
              </span>
            </h2>

            {/* Segment Descriptions */}
            <div className="space-y-4 mb-8">
              <div className="flex gap-4 items-start p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all duration-300">
                <div className="mt-1 bg-orange-500/10 p-2 rounded-xl text-orange-400 flex-shrink-0">
                  <i className="fa-solid fa-bullseye text-sm"></i>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Founded with a vision to simplify real estate in India, Baba
                  Broker brings together{" "}
                  <strong className="text-white font-semibold">
                    verified listings
                  </strong>
                  ,{" "}
                  <strong className="text-white font-semibold">
                    expert advisors
                  </strong>
                  , and cutting-edge tech to help you buy, sell, and rent with{" "}
                  <span className="text-orange-400 font-semibold">
                    zero hassle
                  </span>
                  .
                </p>
              </div>

              <div className="flex gap-4 items-start p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all duration-300">
                <div className="mt-1 bg-blue-500/10 p-2 rounded-xl text-blue-400 flex-shrink-0">
                  <i className="fa-solid fa-chart-line text-sm"></i>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We believe every family deserves a home they love — and every
                  investor deserves{" "}
                  <strong className="text-white font-semibold">
                    returns they can count on
                  </strong>
                  . Our team of 200+ property experts is committed to making
                  that happen.
                </p>
              </div>
            </div>

            {/* Glassmorphic Statistics Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { metric: "5K+", label: "Properties Sold" },
                { metric: "200+", label: "Expert Agents" },
                { metric: "5+", label: "Major Cities" },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/[0.02] border border-white/10 rounded-xl p-4 flex flex-col justify-center items-center text-center group hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1 hover:border-orange-500/30 shadow-lg"
                >
                  <strong className="block text-2xl sm:text-3xl text-orange-400 font-black mb-0.5 transition-transform duration-300 group-hover:scale-105">
                    {stat.metric}
                  </strong>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Primary Button */}
            <div>
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-bold py-3.5 px-8 rounded-full transition-all duration-300 flex items-center gap-3 shadow-[0_8px_25px_rgba(37,99,235,0.25)] hover:shadow-[0_12px_30px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 w-max">
                Explore Platform{" "}
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
