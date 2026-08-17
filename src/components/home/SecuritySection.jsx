import React from "react";

const levels = [
  {
    icon: "fa-house-circle-check",
    title: "RERA Verified Listings",
    description:
      "Every property is registered under RERA, ensuring legal compliance and protecting your rights as a buyer or investor.",
    color: "text-[#60a5fa]",
    surface: "bg-[#60a5fa]/10",
  },
  {
    icon: "fa-file-contract",
    title: "Legal Title Verification",
    description:
      "Our legal team verifies title deeds, encumbrance certificates, and ownership documents before any listing goes live.",
    color: "text-[#f68122]",
    surface: "bg-[#f68122]/10",
  },
  {
    icon: "fa-user-shield",
    title: "Agent KYC & Certification",
    description:
      "All agents on our platform are KYC-verified, certified, and background-checked to ensure you deal only with trusted professionals.",
    color: "text-[#4ade80]",
    surface: "bg-[#4ade80]/10",
  },
  {
    icon: "fa-lock",
    title: "Secure Transaction Flow",
    description:
      "All financial transactions are processed through secure, regulated channels with full audit trails and buyer protection built in.",
    color: "text-[#c084fc]",
    surface: "bg-[#c084fc]/10",
  },
  {
    icon: "fa-key",
    title: "Your Choice, Your Ownership",
    description:
      "We do not tell you where to invest—it is your choice. Full ownership rights are guaranteed, and you stay in control of your property journey.",
    color: "text-[#22d3ee]",
    surface: "bg-[#22d3ee]/10",
  },
];

function SecurityCard({ item, index }) {
  return (
    <article className="w-[300px] sm:w-[350px] shrink-0 rounded-3xl border border-white/5 bg-[#0b1f3e]/80 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:-translate-y-2 hover:border-[#f68122]/50 hover:shadow-[0_20px_45px_rgba(246,129,34,0.15)] flex flex-col justify-between relative z-10">
      <div>
        <div className="flex items-start justify-between">
          <span
            className={`grid h-12 w-12 place-items-center rounded-2xl ${item.surface} ${item.color} text-xl shadow-inner`}
          >
            <i className={`fa-solid ${item.icon}`}></i>
          </span>
          <span className="rounded-full border border-[#4ade80]/20 bg-[#4ade80]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#4ade80] flex items-center gap-1">
            <i className="fa-solid fa-circle-check"></i> Secured
          </span>
        </div>

        <p className="mt-6 text-[10px] font-black uppercase tracking-[.18em] text-[#f68122]">
          Level {index + 1} of 5
        </p>
        <h3 className="mt-1 text-xl font-bold text-white tracking-tight">
          {item.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-gray-400 min-h-[72px]">
          {item.description}
        </p>
      </div>

      <div className="mt-6">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#f68122] to-orange-400 shadow-[0_0_8px_rgba(246,129,34,0.5)]"
            style={{ width: `${(index + 1) * 20}%` }}
          ></div>
        </div>
      </div>
    </article>
  );
}

export default function SecuritySection() {
  const deck = [...levels, ...levels, ...levels];

  return (
    <section
      id="security"
      className="relative overflow-hidden bg-slate-950 px-6 py-24 sm:py-32 antialiased"
    >
      {/* Top Left premium ambient backdrop glow layers */}
      <div className="absolute -left-36 -top-36 h-[600px] w-[600px] rounded-full bg-orange-600/15 blur-[150px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute left-12 top-12 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[130px] mix-blend-screen pointer-events-none"></div>

      {/* Inline styles fallback injectors for the continuous animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-33.333% - 1.25rem)); }
        }
        .animate-marquee-infinite {
          display: flex;
          width: max-content;
          animation: marquee 35s linear infinite;
        }
        .animate-marquee-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header Block */}
        <div className="mb-12 grid gap-8 border-b border-white/5 pb-10 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f68122]/30 bg-[#f68122]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#f68122]">
              <i className="fa-solid fa-shield-halved"></i> Security Ecosystem
            </div>
            <h2 className="mt-5 max-w-2xl text-3xl font-black leading-[1.15] tracking-tight text-white sm:text-5xl">
              Five levels of safety, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f68122] to-orange-400">
                built around your trust.
              </span>
            </h2>
          </div>

          <div className="max-w-md lg:justify-self-end">
            <p className="text-base leading-7 text-gray-400">
              Your property investments are strictly shielded through every
              single milestone stage—from real-time legal vetting to safe fiscal
              ownership transitions.
            </p>
            <div className="mt-5 flex items-center gap-2 text-xs font-bold tracking-wide uppercase text-blue-200/60">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#f68122]/20 border border-[#f68122]/30 text-[#f68122]">
                <i className="fa-solid fa-pause text-[9px]"></i>
              </span>
              Hover array to pause card inspection
            </div>
          </div>
        </div>

        {/* Marquee Container */}
        <div className="relative min-w-0 w-full mt-6 overflow-hidden">
          {/* Radial Side Blurs using identical bg-slate-950 context tone */}
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 bg-gradient-to-r from-slate-950 to-transparent sm:w-24"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 bg-gradient-to-l from-slate-950 to-transparent sm:w-24"></div>

          {/* Scrolling Deck */}
          <div className="animate-marquee-infinite gap-5 py-4">
            {deck.map((item, index) => (
              <SecurityCard
                key={`${item.title}-${index}`}
                item={item}
                index={index % levels.length}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
