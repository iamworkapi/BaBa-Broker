import React from "react";

const advantages = [
  {
    id: "advantage-verified",
    icon: "fa-shield-halved",
    title: "Verified, Before Listed",
    text: "Every single property undergoes a rigorous physical and legal title scan before it ever appears on your dashboard.",
  },
  {
    id: "advantage-pricing",
    icon: "fa-indian-rupee-sign",
    title: "Transparent Pricing",
    text: "Zero hidden premiums or sudden platform surcharges. We break down the true cost of acquisition line by line.",
  },
  {
    id: "advantage-advice",
    icon: "fa-chart-line",
    title: "Investment-Led Advice",
    text: "Leverage localized historical micro-market trends and predictive comparisons to make your capital work harder.",
  },
  {
    id: "advantage-support",
    icon: "fa-headset",
    title: "Dedicated Human Support",
    text: "From negotiating the first initial term sheet to navigating complex closing registration documents, we stay by your side.",
  },
];

export default function WhyChooseUsSection() {
  return (
    /* CHANGED: Swapped bg-neutral-950 for a premium dark blue bg-slate-950 */
    <section className="relative overflow-hidden bg-slate-950 px-6 py-24 sm:py-32">
      {/* Premium ambient backdrop glow layers */}
      <div className="absolute -left-44 top-1/4 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[140px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute -right-44 bottom-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[120px] mix-blend-screen pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          {/* Sticky Context Sidebar Container */}
          <div className="lg:sticky lg:top-28 lg:h-fit flex flex-col justify-center">
            <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-orange-500">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
              The Baba Broker Difference
            </span>

            <h2 className="mt-4 text-4xl font-black leading-[1.15] tracking-tight text-white sm:text-5xl">
              Why partner with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                Baba Broker
              </span>
              ?
            </h2>

            <p className="mt-6 text-base leading-7 text-slate-300 max-w-md">
              High-stakes real estate decisions deserve more than automated
              marketplace filters. We blend verified intelligence, deep local
              insight, and personal structural guidance to guarantee peace of
              mind.
            </p>

            {/* Micro-Stats Highlights Bar */}
            <div className="mt-10 flex flex-wrap gap-8 border-l-2 border-orange-500/20 pl-6 py-1">
              <div>
                <strong className="block text-3xl font-black text-white tracking-tight">
                  50-Point
                </strong>
                <span className="text-xs font-medium tracking-wide text-slate-500 uppercase mt-1 block">
                  Property Verification Process
                </span>
              </div>
              <div className="h-10 w-px bg-slate-800 self-center hidden sm:block" />
              <div>
                <strong className="block text-3xl font-black text-white tracking-tight">
                  1:1
                </strong>
                <span className="text-xs font-medium tracking-wide text-slate-500 uppercase mt-1 block">
                  Dedicated Advisor Guidance
                </span>
              </div>
            </div>
          </div>

          {/* Core Advantages Grid Cards */}
          <div className="grid gap-4 sm:grid-cols-2 self-center">
            {advantages.map((item) => (
              <article
                key={item.id}
                /* CHANGED: Swapped neutral borders/backgrounds for slate-based dark blues */
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-900 bg-slate-900/40 p-8 transition-all duration-300 will-change-transform hover:-translate-y-1 hover:border-orange-500/30 hover:bg-slate-900/70 hover:shadow-[0_20px_40px_rgba(249,115,22,0.06)]"
              >
                <div>
                  {/* Icon Block */}
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-orange-500/10 text-xl text-orange-500 transition-all duration-300 group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                    <i className={`fa-solid ${item.icon}`}></i>
                  </div>

                  {/* Title & Body Description */}
                  <h3 className="mt-6 text-lg font-bold text-white tracking-tight transition-colors group-hover:text-orange-400">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400 font-normal">
                    {item.text}
                  </p>
                </div>

                {/* Animated Interactive Bottom Border Line */}
                <div className="mt-6 flex items-center justify-between pt-2">
                  <span className="h-0.5 w-8 bg-orange-500 transition-all duration-300 group-hover:w-16"></span>
                  <i className="fa-solid fa-arrow-right text-[10px] text-orange-500/0 -translate-x-2 transition-all duration-300 group-hover:text-orange-500/100 group-hover:translate-x-0"></i>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
