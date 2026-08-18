
const PropertyTokenizationSection = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 px-6 py-24 sm:py-32 antialiased">
      {/* Premium top-center ambient backdrop glow layers */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-orange-600/15 blur-[160px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute left-1/2 top-12 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[550px] rounded-full bg-amber-500/10 blur-[130px] mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Heading */}
        <div className="text-center mb-20 lg:mb-32 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-slate-800 bg-slate-900/60 backdrop-blur-md rounded-full px-5 py-2 text-xs font-bold tracking-widest text-orange-400 uppercase mb-6 shadow-sm">
            <i className="fa-solid fa-microchip"></i> The Engine
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-5xl font-black text-white mb-6 tracking-tight">
            Tokenization{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-400 to-orange-500">
              Process
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Discover how we transform high-value real estate into liquid, smart
            investments through our institutional-grade tokenization pipeline.
          </p>
        </div>

        {/* Tokenization Engine Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Central Glowing Line (Desktop Only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-orange-500 via-amber-500 to-transparent -translate-x-1/2 shadow-[0_0_20px_rgba(249,115,22,0.4)] rounded-full"></div>

          {/* Step 1 */}
          <div className="relative flex flex-col md:flex-row items-center justify-between group mb-16 md:mb-24">
            {/* Center Node */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-slate-950 border-[4px] border-orange-500 items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.4)] z-10 transition-transform duration-500 group-hover:scale-125">
              <span className="text-white font-black text-lg">1</span>
            </div>

            {/* Text Content (Left) */}
            <div className="w-full md:w-[45%] md:pr-12 text-center md:text-right mb-8 md:mb-0">
              <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-2">
                Step 01
              </p>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-4 group-hover:text-orange-400 transition-colors">
                Property Evaluation
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Our experts conduct rigorous due diligence, encompassing legal
                title verification, physical inspections, and
                institutional-grade financial modeling to ensure prime
                investment quality.
              </p>
            </div>

            {/* Micro-UI (Right) */}
            <div className="w-full md:w-[45%] md:pl-12">
              <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 shadow-2xl transform transition-all duration-500 group-hover:-translate-y-2 group-hover:border-orange-500/40 group-hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.15)]">
                <ul className="space-y-4">
                  <li className="flex items-center gap-4 text-slate-200 font-semibold text-sm">
                    <i className="fa-solid fa-circle-check text-orange-400 text-xl drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"></i>{" "}
                    Market Analysis
                  </li>
                  <li className="flex items-center gap-4 text-slate-200 font-semibold text-sm">
                    <i className="fa-solid fa-circle-check text-orange-400 text-xl drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"></i>{" "}
                    Legal Title Check
                  </li>
                  <li className="flex items-center gap-4 text-slate-200 font-semibold text-sm">
                    <i className="fa-solid fa-circle-check text-orange-400 text-xl drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"></i>{" "}
                    Yield Modeling
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-between group mb-16 md:mb-24">
            {/* Center Node */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-slate-950 border-[4px] border-orange-500 items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.4)] z-10 transition-transform duration-500 group-hover:scale-125">
              <span className="text-white font-black text-lg">2</span>
            </div>

            {/* Text Content (Right) */}
            <div className="w-full md:w-[45%] md:pl-12 text-center md:text-left mb-8 md:mb-0">
              <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-2">
                Step 02
              </p>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-4 group-hover:text-orange-400 transition-colors">
                Smart Contract Creation
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The physical asset is secured in an SPV, and its ownership rules
                are encoded directly into highly secure blockchain smart
                contracts, guaranteeing tamper-proof transparency.
              </p>
            </div>

            {/* Micro-UI (Left) */}
            <div className="w-full md:w-[45%] md:pr-12">
              <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 shadow-2xl font-mono text-sm overflow-hidden relative transform transition-all duration-500 group-hover:-translate-y-2 group-hover:border-orange-500/40 group-hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.15)]">
                {/* Terminal header */}
                <div className="flex gap-2 mb-5 pb-4 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-slate-300 leading-loose">
                  <span className="text-purple-400">contract</span>{" "}
                  <span className="text-yellow-200">AssetVault</span> {"{"}
                  <br />
                  &nbsp;&nbsp;<span className="text-purple-400">
                    string
                  </span>{" "}
                  <span className="text-blue-400">public</span> propertyId;
                  <br />
                  &nbsp;&nbsp;<span className="text-purple-400">
                    uint256
                  </span>{" "}
                  <span className="text-blue-400">public</span> totalSupply;
                  <br />
                  &nbsp;&nbsp;
                  <span className="text-slate-500/70 italic">
                    // Minting logic secured...
                  </span>
                  <br />
                  {"}"}
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col md:flex-row items-center justify-between group mb-16 md:mb-24">
            {/* Center Node */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-slate-950 border-[4px] border-orange-500 items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.4)] z-10 transition-transform duration-500 group-hover:scale-125">
              <span className="text-white font-black text-lg">3</span>
            </div>

            {/* Text Content (Left) */}
            <div className="w-full md:w-[45%] md:pr-12 text-center md:text-right mb-8 md:mb-0">
              <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-2">
                Step 03
              </p>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-4 group-hover:text-orange-400 transition-colors">
                Equity Distribution
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Fractional tokens are released to verified investors via our
                platform. We handle KYC and regulatory compliance automatically,
                allowing seamless equity acquisition.
              </p>
            </div>

            {/* Micro-UI (Right) */}
            <div className="w-full md:w-[45%] md:pl-12">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-5 shadow-2xl flex flex-col justify-center items-center transform transition-all duration-500 group-hover:-translate-y-2 group-hover:border-orange-500/40 group-hover:shadow-[0_15px_30px_-10px_rgba(249,115,22,0.15)]">
                  <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
                    Total Tokens
                  </span>
                  <span className="text-3xl font-black text-white">10,000</span>
                </div>
                <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-5 shadow-2xl flex flex-col justify-center items-center transform transition-all duration-500 delay-75 group-hover:-translate-y-2 group-hover:border-orange-500/40 group-hover:shadow-[0_15px_30px_-10px_rgba(249,115,22,0.15)]">
                  <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold mb-2">
                    Token Price
                  </span>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
                    ₹5,000
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-between group">
            {/* Center Node */}
            <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-slate-950 border-[4px] border-orange-500 items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.4)] z-10 transition-transform duration-500 group-hover:scale-125">
              <span className="text-white font-black text-lg">4</span>
            </div>

            {/* Text Content (Right) */}
            <div className="w-full md:w-[45%] md:pl-12 text-center md:text-left mb-8 md:mb-0">
              <p className="text-orange-400 font-bold uppercase tracking-widest text-xs mb-2">
                Step 04
              </p>
              <h3 className="text-2xl lg:text-3xl font-black text-white mb-4 group-hover:text-orange-400 transition-colors">
                Automated Returns
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Once fully funded, the smart contracts take over. Rental income
                is distributed proportionally to token holders in real-time, and
                secondary market trading unlocks unprecedented liquidity.
              </p>
            </div>

            {/* Micro-UI (Left) */}
            <div className="w-full md:w-[45%] md:pr-12">
              <div className="flex gap-4 justify-center md:justify-end">
                <div className="w-20 h-20 rounded-[1.5rem] bg-slate-900/40 backdrop-blur-md border border-slate-800/80 flex items-center justify-center transform transition-all duration-500 group-hover:-translate-y-3 group-hover:border-orange-500/40 group-hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.2)]">
                  <i className="fa-solid fa-bolt text-3xl text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]"></i>
                </div>
                <div className="w-20 h-20 rounded-[1.5rem] bg-slate-900/40 backdrop-blur-md border border-slate-800/80 flex items-center justify-center transform transition-all duration-500 delay-75 group-hover:-translate-y-3 group-hover:border-orange-500/40 group-hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.2)]">
                  <i className="fa-solid fa-chart-line text-3xl text-white"></i>
                </div>
                <div className="w-20 h-20 rounded-[1.5rem] bg-slate-900/40 backdrop-blur-md border border-slate-800/80 flex items-center justify-center transform transition-all duration-500 delay-150 group-hover:-translate-y-3 group-hover:border-orange-500/40 group-hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.2)]">
                  <i className="fa-solid fa-money-bill-transfer text-3xl text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-24 pt-12 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-900/20 p-8 rounded-[2rem] border border-slate-800/80 backdrop-blur-sm">
          <div className="text-center md:text-left">
            <p className="font-black text-white text-xl mb-2">
              Ready to explore the tokenized asset lifecycle?
            </p>
            <p className="text-slate-400 text-sm max-w-xl">
              Dive deep into our comprehensive documentation to understand the
              legal structure, pricing models, and how we guarantee security at
              every step.
            </p>
          </div>
          <button className="bg-white text-slate-950 font-bold text-sm px-8 py-3.5 rounded-full hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 transition-all duration-300 shadow-xl flex-shrink-0 flex items-center gap-2 transform active:scale-95">
            View Technical Docs <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default PropertyTokenizationSection;
