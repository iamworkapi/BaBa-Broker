const counters = [
  { value: 1200, suffix: '+', label: 'Active Investors', icon: 'fa-solid fa-users' },
  { value: 500, suffix: '+', label: 'Properties Listed', icon: 'fa-solid fa-building' },
  { value: 12.4, suffix: ' Cr', label: 'Total Investment', prefix: '₹', decimals: 1, icon: 'fa-solid fa-indian-rupee-sign' },
  { value: 14.2, suffix: '%', label: 'Avg. Annual Returns', icon: 'fa-solid fa-chart-line' },
];

export default function StatsCounter() {
  return (
    <section className="relative py-16 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f3e]/60 via-[#0f284d]/40 to-[#0b1f3e]/60" />
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {counters.map((c, i) => (
            <div
              key={i}
              className="card-advanced p-6 text-center space-y-3"
            >
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-accent/10 text-accent text-lg">
                <i className={c.icon} />
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-white counter-value">
                  {c.prefix || ''}
                  {typeof c.value === 'number' && c.value >= 100 ? Math.floor(c.value).toLocaleString('en-IN') : c.value.toFixed(c.decimals || 0)}
                  {c.suffix}
                </p>
                <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">{c.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
