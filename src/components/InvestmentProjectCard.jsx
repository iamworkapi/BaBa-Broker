import { useNavigate } from "react-router-dom";

function formatCommaPrice(val) {
  if (val === null || val === undefined || val === "") return "₹0";
  if (typeof val === "number") return "₹" + val.toLocaleString("en-IN");
  const digits = String(val).replace(/[^\d]/g, "");
  if (digits && Number(digits) > 0) return "₹" + Number(digits).toLocaleString("en-IN");
  return String(val).startsWith("₹") ? val : `₹${val}`;
}

const ROI_COLORS = {
  high: "text-emerald-400",
  mid: "text-amber-400",
  low: "text-orange-400",
};

function getRoiTier(roi) {
  if (roi >= 25) return "high";
  if (roi >= 18) return "mid";
  return "low";
}

export default function InvestmentProjectCard({ project, onOpenDetails }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onOpenDetails) onOpenDetails(project);
    navigate("/property-details", { state: { project } });
  };

  const {
    title = "",
    location = "",
    image = "",
    status = "running",
    propertyType = "residential",
    bhk = "2bhk",
    investmentModel = "co_investment",
    tag = "",
    totalValuation = 0,
    fundedPercentage = 0,
    investorsCount = 0,
    minInvestment = 0,
    expectedRoi = 0,
    purchasePrice = 0,
    renovationCost = 0,
    expectedSalePrice = 0,
    holdingPeriodMonths = 6,
  } = project;

  const remainingPct = Math.max(0, 100 - fundedPercentage);
  const roiTier = getRoiTier(expectedRoi);
  const roiColorClass = ROI_COLORS[roiTier];
  const isFlip = investmentModel === "renovate_flip";
  const totalOutlay = (purchasePrice || 0) + (renovationCost || 0);
  const netProfit = (expectedSalePrice || 0) - totalOutlay;

  const statusConfig = {
    running: {
      label: "Live Now",
      bg: "bg-orange-500",
      text: "text-slate-950",
      icon: "fa-circle-play",
    },
    upcoming: {
      label: "Coming Soon",
      bg: "bg-blue-600",
      text: "text-white",
      icon: "fa-rocket",
    },
    delivered: {
      label: "Delivered",
      bg: "bg-emerald-500",
      text: "text-slate-950",
      icon: "fa-circle-check",
    },
  };
  const st = statusConfig[status] || statusConfig.running;

  const defaultImage =
    image ||
    "https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg";

  return (
    <div
      onClick={handleClick}
      className="group relative flex flex-col rounded-2xl border border-slate-800/80 bg-slate-900/50 backdrop-blur-md shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/40 hover:shadow-[0_24px_64px_rgba(249,115,22,0.15)] cursor-pointer overflow-hidden"
    >
      {/* ── Image Block ── */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-950">
        <img
          src={defaultImage}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top badges */}
        <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-black uppercase tracking-wider shadow-lg ${st.bg} ${st.text}`}>
            <i className={`fa-solid ${st.icon} text-[10px]`} />
            {st.label}
          </span>
          <span className="rounded-lg border border-white/20 bg-slate-950/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-200 backdrop-blur-sm">
            {propertyType === "residential" ? bhk.toUpperCase() : propertyType}
          </span>
        </div>

        {/* ROI Badge — top right */}
        <div className="absolute right-3.5 top-3.5 flex flex-col items-end gap-1">
          <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 px-3 py-1.5 text-right backdrop-blur-md shadow-xl">
            <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
              Est. Returns
            </span>
            <span className={`text-lg font-black ${roiColorClass}`}>
              +{isFlip ? ((netProfit / totalOutlay) * 100).toFixed(1) : expectedRoi}%
            </span>
            <span className="block text-[9px] font-bold text-slate-400">Annual ROI</span>
          </div>
        </div>

        {/* Tag at bottom of image */}
        {tag && (
          <div className="absolute bottom-3 left-3.5">
            <span className="rounded-md border border-orange-500/30 bg-orange-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-orange-400 backdrop-blur-sm">
              {tag}
            </span>
          </div>
        )}
      </div>

      {/* ── Card Body ── */}
      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Model badge + title */}
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
            {isFlip ? "Renovate & Flip Deal" : "Fractional Co-Investment"}
          </span>
          <h3 className="mt-1.5 text-[15px] font-bold text-white leading-snug group-hover:text-orange-400 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
            <i className="fa-solid fa-location-dot text-orange-500 text-[10px]" />
            <span className="truncate">{location}</span>
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        {/* Financial metrics */}
        {isFlip ? (
          /* Flip deal financial strip */
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Purchase", value: formatCommaPrice(purchasePrice), color: "text-slate-200" },
              { label: "Reno Cost", value: formatCommaPrice(renovationCost), color: "text-slate-200" },
              {
                label: "Net Profit",
                value: `+${formatCommaPrice(netProfit)}`,
                color: "text-emerald-400",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-center">
                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-500">
                  {item.label}
                </span>
                <span className={`mt-0.5 block text-xs font-black ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        ) : (
          /* Co-investment: funding bar */
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-300">
                {fundedPercentage}% Funded
                <span className="text-slate-500 font-medium"> ({investorsCount} Investor{investorsCount !== 1 ? "s" : ""})</span>
              </span>
              <span className="text-orange-400">{remainingPct}% Left</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800/80 p-0.5">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min(100, Math.max(5, fundedPercentage))}%`,
                  background:
                    fundedPercentage >= 80
                      ? "linear-gradient(90deg, #10b981, #34d399)"
                      : fundedPercentage >= 50
                      ? "linear-gradient(90deg, #f97316, #f59e0b)"
                      : "linear-gradient(90deg, #f97316, #fbbf24)",
                }}
              />
            </div>
          </div>
        )}

        {/* Valuation + Min investment row */}
        <div className="flex items-end justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Project Value
            </span>
            <span className="text-sm font-black text-white">
              {formatCommaPrice(totalValuation)}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Min. Entry
            </span>
            <span className="text-sm font-black text-emerald-400">
              {formatCommaPrice(minInvestment)}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-xs font-black uppercase tracking-wider text-slate-950 shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/40 hover:brightness-110 active:scale-[0.98]"
        >
          <i className="fa-solid fa-calculator text-sm" />
          {isFlip ? "Analyze Flip Deal" : "Calculate Returns & Invest"}
          <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
