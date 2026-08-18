import { useNavigate } from 'react-router-dom';

function formatCommaPrice(val) {
  if (val === null || val === undefined || val === '') return '₹0';
  if (typeof val === 'number') {
    return '₹' + val.toLocaleString('en-IN');
  }
  const str = String(val).trim();
  const digits = str.replace(/[^\d]/g, '');
  if (digits && Number(digits) > 0) {
    return '₹' + Number(digits).toLocaleString('en-IN');
  }
  return str.startsWith('₹') ? str : `₹${str}`;
}

export default function InvestmentProjectCard({ project, onOpenDetails }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(project);
    }
    navigate('/property-details', { state: { project } });
  };
  const {
    title = '',
    location = '',
    price = '',
    image = '',
    status = 'running',
    propertyType = 'residential',
    bhk = '2bhk',
    investmentModel = 'co_investment',
    tag = '',
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

  const remainingPercentage = Math.max(0, 100 - fundedPercentage);
  const totalFlipOutlay = (purchasePrice || 0) + (renovationCost || 0);
  const flipProfit = (expectedSalePrice || 0) - totalFlipOutlay;
  const flipRoi = totalFlipOutlay > 0 ? ((flipProfit / totalFlipOutlay) * 100).toFixed(1) : 0;

  const defaultImage =
    image ||
    'https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg';

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-500/40 hover:bg-slate-900/90 hover:shadow-[0_20px_40px_rgba(249,115,22,0.12)] cursor-pointer"
    >
      {/* Image & Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-950">
        <img
          src={defaultImage}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

        {/* Status Badge */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span
            className={`rounded-lg px-2.5 py-1 text-[11px] font-black uppercase tracking-wider shadow-md backdrop-blur-md ${
              status === 'delivered'
                ? 'bg-emerald-500/90 text-white'
                : status === 'upcoming'
                ? 'bg-blue-600/90 text-white'
                : 'bg-orange-500/90 text-white'
            }`}
          >
            <i
              className={`fa-solid ${
                status === 'delivered'
                  ? 'fa-circle-check'
                  : status === 'upcoming'
                  ? 'fa-clock'
                  : 'fa-chart-line'
              } mr-1.5 text-[10px]`}
            ></i>
            {status}
          </span>

          <span className="rounded-lg border border-slate-700 bg-slate-900/90 px-2.5 py-1 text-[11px] font-bold capitalize text-slate-200 backdrop-blur-md">
            {propertyType === 'residential' ? bhk.toUpperCase() : propertyType}
          </span>
        </div>

        {/* Tag Badge */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          {tag && (
            <span className="rounded-md bg-slate-900/90 border border-slate-700 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-400 backdrop-blur-sm">
              {tag}
            </span>
          )}
          {project.images && project.images.length > 1 && (
            <span className="rounded-md bg-slate-950/80 border border-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300 backdrop-blur-sm flex items-center gap-1">
              <i className="fa-solid fa-camera text-orange-400"></i> {project.images.length}
            </span>
          )}
          {project.videoUrl && (
            <span className="rounded-md bg-red-600/90 border border-red-500 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm flex items-center gap-1">
              <i className="fa-solid fa-circle-play"></i> Video
            </span>
          )}
        </div>

        {/* Expected ROI Badge */}
        <div className="absolute right-4 top-4">
          <div className="rounded-xl border border-amber-500/30 bg-slate-950/80 px-3 py-1.5 text-right backdrop-blur-md shadow-lg">
            <span className="block text-[9px] font-black uppercase tracking-widest text-slate-400">
              Est. Return
            </span>
            <span className="text-sm font-black text-amber-400">
              +{investmentModel === 'renovate_flip' ? flipRoi : expectedRoi}% ROI
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
              {investmentModel === 'renovate_flip' ? 'Renovate & Flip Deal' : 'Co-Investment Pool'}
            </span>
            <div className="text-right">
              <span className="text-sm font-black text-amber-400 block">
                {formatCommaPrice(totalValuation || price)}
              </span>
              <span className="text-[10px] font-normal text-slate-400 block -mt-0.5">
                (Total Selling Price)
              </span>
            </div>
          </div>

          <h3 className="mt-2 text-base font-bold text-white tracking-tight group-hover:text-orange-400 transition-colors">
            {title}
          </h3>

          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <i className="fa-solid fa-location-dot text-orange-500 text-xs shrink-0"></i>
            <span className="truncate">{location}</span>
          </p>
        </div>

        {/* Financial Highlights */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          {investmentModel === 'renovate_flip' ? (
            /* Scenario 2: Renovate & Flip Card View */
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <span className="block text-[10px] font-semibold text-slate-400">Purchase</span>
                  <span className="font-bold text-slate-200">
                    {formatCommaPrice(purchasePrice)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-slate-400">Reno Cost</span>
                  <span className="font-bold text-slate-200">
                    {formatCommaPrice(renovationCost)}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-semibold text-amber-400">Net Profit</span>
                  <span className="font-black text-amber-400">
                    +{formatCommaPrice(flipProfit)}
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-slate-300 border-t border-amber-500/10 pt-2">
                <span>Sale Target: {formatCommaPrice(expectedSalePrice)}</span>
                <span className="text-orange-400 font-bold">{holdingPeriodMonths} Months</span>
              </div>
            </div>
          ) : (
            /* Scenario 1: Fractional Funding View */
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-slate-300">
                    {fundedPercentage}% Funded ({investorsCount} Investors)
                  </span>
                  <span className="text-orange-400">{remainingPercentage}% Available</span>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800 p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(5, fundedPercentage))}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-950/60 px-3 py-2 text-xs border border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[11px]">Min. Investment</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-white block text-xs">
                    {formatCommaPrice(minInvestment)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action CTA Button */}
          <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-950 border border-slate-800 group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 group-hover:border-transparent group-hover:text-slate-950 px-4 py-2.5 text-xs font-bold text-slate-200 transition-all duration-300 shadow-md">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-calculator text-orange-400 group-hover:text-slate-950 transition-colors"></i>
              Calculate Return & Invest
            </span>
            <i className="fa-solid fa-arrow-right text-[10px] transition-transform duration-300 group-hover:translate-x-1"></i>
          </div>
        </div>
      </div>
    </div>
  );
}
