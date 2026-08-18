import InvestmentProjectsSection from '../components/home/InvestmentProjectsSection';

export default function Properties() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 pt-20">
      {/* Hero Header */}
      <section className="relative py-16 px-6 text-center border-b border-slate-900 bg-slate-950 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-orange-400 mb-4">
            <i className="fa-solid fa-chart-line text-xs"></i>
            Real Estate Investment Explorer
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Discover High-Yield{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-amber-500">
              Real Estate Projects
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Filter through Running, Upcoming, and Delivered opportunities. Track co-investment pools, fractional shares, and renovate-and-flip profit margins.
          </p>
        </div>
      </section>

      {/* Dynamic Projects Explorer Section */}
      <InvestmentProjectsSection />
    </div>
  );
}
