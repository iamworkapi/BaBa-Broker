
export default function Partners() {
  return (
    <>
            

    {/*  Hero Section Start  */}
    <section className="min-h-screen flex items-center bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 pt-32 pb-20 grid lg:grid-cols-2 gap-12 items-center">

            {/*  LEFT CONTENT  */}
            <div className="fade-in">

                {/*  Heading  */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                    Smart Property <br />
                    Investment Platform for <br />
                    <span className="text-accent">Baba Broker</span>
                </h1>

                {/*  Description  */}
                <p className="text-gray-400 text-lg mb-2">
                    Convert property seekers into serious buyers.
                </p>
                <p className="text-accent text-sm mb-8">
                    Trusted, Scalable, and High-Converting Platform.
                </p>

                {/*  Buttons  */}
                <div className="flex flex-wrap gap-4 mb-10">
                    <a href="#" className="btn btn-accent px-6 py-3 rounded-full font-semibold">
                        Become a Partner
                    </a>
                    <a href="#"
                        className="border border-white/20 px-6 py-3 rounded-full font-semibold hover:border-accent hover:text-accent transition">
                        Explore Platform →
                    </a>
                </div>

                {/*  Trusted Partners  */}
                <div className="mt-12">

                    <p className="text-gray-500 text-md mb-4">Our Trusted Partners</p>

                    {/*  Scroll Wrapper  */}
                    <div className="relative overflow-hidden">

                        {/*  Track  */}
                        <div className="flex gap-12 partner-track items-center">

                            {/*  Logos  */}
                            <img src="./assets/img/hdfc.png" className="partner-logo" />
                            <img src="./assets/img/idfc.png" className="partner-logo" />
                            <img src="./assets/img/castler.png" className="partner-logo" />
                            <img src="./assets/img/manhattan.png" className="partner-logo" />

                            {/*  Duplicate  */}
                            <img src="./assets/img/hdfc.png" className="partner-logo" />
                            <img src="./assets/img/idfc.png" className="partner-logo" />
                            <img src="./assets/img/castler.png" className="partner-logo" />
                            <img src="./assets/img/manhattan.png" className="partner-logo" />

                        </div>

                    </div>

                </div>

            </div>

            {/*  RIGHT CARD (Calculator UI)  */}
            <div className="flex justify-center lg:justify-end">

                <div className="w-full max-w-md bg-dark-2 border border-white/10 rounded-2xl p-6 shadow-xl">

                    {/*  Header  */}
                    <div className="flex items-center gap-2 mb-5">
                        <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                            <i className="fa-solid fa-chart-line"></i>
                        </div>
                        <div>
                            <p className="font-semibold">ROI Calculator</p>
                            <p className="text-xs text-gray-400">Estimate your growth</p>
                        </div>
                    </div>

                    {/*  Leads  */}
                    <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-400">Monthly Leads</span>
                            <span className="text-accent font-semibold">1000</span>
                        </div>

                        <input type="range" className="w-full accent-green-500" />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>100</span>
                            <span>10,000</span>
                        </div>
                    </div>

                    {/*  Inputs  */}
                    <div className="grid grid-cols-2 gap-3 mb-4">

                        <div className="bg-dark-3 p-3 rounded-xl border border-white/10">
                            <p className="text-xs text-gray-400">Property Price</p>
                            <p className="font-semibold text-accent">₹50L</p>
                        </div>

                        <div className="bg-dark-3 p-3 rounded-xl border border-white/10">
                            <p className="text-xs text-gray-400">Conversion Rate</p>
                            <p className="font-semibold text-accent">2%</p>
                        </div>

                    </div>

                    {/*  Without  */}
                    <div className="bg-dark-3 p-4 rounded-xl border border-white/10 mb-3">
                        <p className="text-xs text-gray-400 mb-1">Without Baba Broker</p>
                        <p className="font-bold text-lg">₹10 Cr</p>
                    </div>

                    {/*  Divider  */}
                    <div className="flex justify-center my-3 text-accent">
                        <i className="fa-solid fa-arrow-down"></i>
                    </div>

                    {/*  With  */}
                    <div className="bg-accent/10 border border-accent p-4 rounded-xl mb-5">
                        <div className="flex justify-between text-xs text-accent mb-1">
                            <span>With Baba Broker</span>
                            <span>+250%</span>
                        </div>
                        <p className="font-bold text-xl text-accent">₹35 Cr</p>
                    </div>

                    {/*  CTA  */}
                    <button className="w-full btn btn-accent py-3 rounded-xl font-semibold">
                        Start Earning More →
                    </button>

                </div>

            </div>

        </div>
    </section>
    {/*  Hero Section End  */}

    {/*  Comparison Section Start  */}
    <section className="section bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">

            {/*  Heading  */}
            <div className="text-center mb-14">

                <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
                    You already have the demand. <br />
                    <span className="text-accent">Baba Broker turns it into revenue.</span>
                </h2>

                <p className="text-gray-400 text-sm">
                    Maximize conversions and unlock new revenue streams from existing leads.
                </p>

            </div>

            {/*  Cards  */}
            <div className="grid lg:grid-cols-2 gap-8">

                {/*  LEFT: Today  */}
                <div className="card p-6">

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400">
                            <i className="fa-solid fa-xmark"></i>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg">Today</h4>
                            <p className="text-xs text-gray-500">(Traditional Selling)</p>
                        </div>
                    </div>

                    <div className="space-y-3">

                        <div className="flex items-start gap-3 bg-dark-3 p-3 rounded-lg">
                            <i className="fa-solid fa-xmark text-red-400 mt-1"></i>
                            <p className="text-sm text-gray-400">Limited sales opportunities</p>
                        </div>

                        <div className="flex items-start gap-3 bg-dark-3 p-3 rounded-lg">
                            <i className="fa-solid fa-xmark text-red-400 mt-1"></i>
                            <p className="text-sm text-gray-400">Only full property selling possible</p>
                        </div>

                        <div className="flex items-start gap-3 bg-dark-3 p-3 rounded-lg">
                            <i className="fa-solid fa-xmark text-red-400 mt-1"></i>
                            <p className="text-sm text-gray-400">Budget-sensitive buyers drop off</p>
                        </div>

                        <div className="flex items-start gap-3 bg-dark-3 p-3 rounded-lg">
                            <i className="fa-solid fa-xmark text-red-400 mt-1"></i>
                            <p className="text-sm text-gray-400">High investment barrier for buyers</p>
                        </div>

                        <div className="flex items-start gap-3 bg-dark-3 p-3 rounded-lg">
                            <i className="fa-solid fa-xmark text-red-400 mt-1"></i>
                            <p className="text-sm text-gray-400">Longer deal closure cycles</p>
                        </div>

                    </div>

                </div>

                {/*  RIGHT: Tomorrow  */}
                <div className="card p-6 border border-accent bg-accent/5">

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                            <i className="fa-solid fa-check"></i>
                        </div>
                        <div>
                            <h4 className="font-semibold text-lg">Tomorrow</h4>
                            <p className="text-xs text-accent">(With Baba Broker)</p>
                        </div>
                    </div>

                    <div className="space-y-3">

                        <div className="flex items-start gap-3 bg-dark-3 p-3 rounded-lg border border-accent/20">
                            <i className="fa-solid fa-check text-accent mt-1"></i>
                            <p className="text-sm text-gray-300">Sell more properties faster</p>
                        </div>

                        <div className="flex items-start gap-3 bg-dark-3 p-3 rounded-lg border border-accent/20">
                            <i className="fa-solid fa-check text-accent mt-1"></i>
                            <p className="text-sm text-gray-300">Access fractional ownership model</p>
                        </div>

                        <div className="flex items-start gap-3 bg-dark-3 p-3 rounded-lg border border-accent/20">
                            <i className="fa-solid fa-check text-accent mt-1"></i>
                            <p className="text-sm text-gray-300">Convert more existing leads into revenue</p>
                        </div>

                        <div className="flex items-start gap-3 bg-dark-3 p-3 rounded-lg border border-accent/20">
                            <i className="fa-solid fa-check text-accent mt-1"></i>
                            <p className="text-sm text-gray-300">Buyers invest across multiple properties</p>
                        </div>

                        <div className="flex items-start gap-3 bg-dark-3 p-3 rounded-lg border border-accent/20">
                            <i className="fa-solid fa-check text-accent mt-1"></i>
                            <p className="text-sm text-gray-300">Faster sales cycles with lower entry barriers</p>
                        </div>

                    </div>

                </div>

            </div>

            {/*  Bottom Trust  */}
            <div className="text-center mt-10 text-gray-500 text-sm">
                ⭐ 4.7 Rating • Trusted by Partners Nationwide
            </div>

        </div>
    </section>
    {/*  Comparison Section End  */}

    {/*  Steps Section Start  */}
    <section className="bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 py-20">

            {/*  Badge  */}
            <div className="flex justify-center mb-6">
                <div
                    className="flex items-center gap-2 border border-white/10 text-gray-400 px-4 py-1.5 rounded-full text-xs font-semibold">
                    <i className="fa-solid fa-rocket text-accent text-xs"></i> GET STARTED
                </div>
            </div>

            {/*  Heading  */}
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-white leading-tight">
                    Start in Three Simple Steps <br />
                    <span className="text-accent">From Setup to Payment</span>
                </h2>

                <p className="text-gray-400 text-sm mt-4 max-w-2xl mx-auto">
                    Get your properties listed and start raising capital—we handle the complex parts so
                    you can focus on your business
                </p>
            </div>

            {/*  Cards  */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/*  Step 1  */}
                <div className="relative bg-dark-3 border border-white/10 rounded-2xl p-8 hover:border-accent transition">

                    {/*  Number  */}
                    <div
                        className="absolute -top-5 left-6 w-10 h-10 bg-accent text-black rounded-full flex items-center justify-center font-semibold shadow-lg">
                        1
                    </div>

                    {/*  Icon  */}
                    <div className="w-14 h-14 bg-accent/20 text-accent rounded-xl flex items-center justify-center mb-6">
                        <i className="fa-solid fa-building text-xl"></i>
                    </div>

                    <h4 className="font-semibold text-lg text-white mb-2">Add Property</h4>

                    <p className="text-gray-400 text-sm leading-relaxed">
                        Add your property to the platform with all necessary details. We handle all legal
                        documentation and set up the structure ready for fractionalization.
                    </p>
                </div>

                {/*  Step 2  */}
                <div className="relative bg-dark-3 border border-white/10 rounded-2xl p-8 hover:border-accent transition">

                    <div
                        className="absolute -top-5 left-6 w-10 h-10 bg-accent text-black rounded-full flex items-center justify-center font-semibold shadow-lg">
                        2
                    </div>

                    <div className="w-14 h-14 bg-accent/20 text-accent rounded-xl flex items-center justify-center mb-6">
                        <i className="fa-solid fa-users text-xl"></i>
                    </div>

                    <h4 className="font-semibold text-lg text-white mb-2">Add Buyers</h4>

                    <p className="text-gray-400 text-sm leading-relaxed">
                        Onboard your buyers through our platform. We handle KYC, verification, and all
                        paperwork—buyers can start investing immediately.
                    </p>
                </div>

                {/*  Step 3  */}
                <div className="relative bg-dark-3 border border-white/10 rounded-2xl p-8 hover:border-accent transition">

                    <div
                        className="absolute -top-5 left-6 w-10 h-10 bg-accent text-black rounded-full flex items-center justify-center font-semibold shadow-lg">
                        3
                    </div>

                    <div className="w-14 h-14 bg-accent/20 text-accent rounded-xl flex items-center justify-center mb-6">
                        <i className="fa-solid fa-wallet text-xl"></i>
                    </div>

                    <h4 className="font-semibold text-lg text-white mb-2">Get Payments</h4>

                    <p className="text-gray-400 text-sm leading-relaxed">
                        Receive funds securely through escrow as buyers purchase units. All payments are
                        automated, tracked, and released according to your terms.
                    </p>
                </div>

            </div>

            {/*  CTA  */}
            <div className="text-center mt-16">
                <a href="#" className="btn btn-accent px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2">
                    Add Your First Property
                    <i className="fa-solid fa-arrow-right text-sm"></i>
                </a>
            </div>

        </div>
    </section>
    {/*  Steps Section End  */}

    {/*  We handle everything section start  */}
    <section className="section bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">

            {/*  Heading  */}
            <div className="text-center mb-12">
                <div
                    className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-5">
                    <i className="fa-solid fa-circle-check text-accent text-xs"></i> Complete Real Estate Platform
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
                    We Handle Everything
                </h2>
                <p className="text-accent text-2xl sm:text-3xl font-extrabold mb-4">For Your Property</p>
                <p className="text-gray-400 max-w-xl mx-auto text-sm leading-relaxed">
                    From property search to final registration — we manage the entire process so you can focus on
                    finding your dream home.
                </p>
            </div>

            {/*  Cards Grid  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">

                {/*  Card 1  */}
                <div className="whe-card">
                    <div className="whe-card-top">
                        <div className="whe-icon" style={{ background: 'rgba(11,78,157,0.15)' }}>
                            <i className="fa-solid fa-house-circle-check" style={{ color: '#1a6bc7' }}></i>
                        </div>
                        <h3 className="whe-title">Verified Listings</h3>
                        <p className="whe-subtitle">100% RERA registered properties</p>
                        <div className="whe-chevron"><i className="fa-solid fa-chevron-down"></i></div>
                    </div>
                    <div className="whe-expand">
                        <p className="whe-desc">Every property on Baba Broker is physically verified and legally checked
                            before listing. We ensure complete transparency so you never face surprises.</p>
                        <ul className="whe-list">
                            <li><i className="fa-solid fa-circle-check text-accent"></i> RERA registration verified</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Title deed & ownership check</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Encumbrance certificate</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Site visit confirmation</li>
                        </ul>
                    </div>
                </div>

                {/*  Card 2  */}
                <div className="whe-card">
                    <div className="whe-card-top">
                        <div className="whe-icon" style={{ background: 'rgba(246,129,34,0.12)' }}>
                            <i className="fa-solid fa-file-contract" style={{ color: '#F68122' }}></i>
                        </div>
                        <h3 className="whe-title">Legal & Documentation</h3>
                        <p className="whe-subtitle">All legal work handled by us</p>
                        <div className="whe-chevron"><i className="fa-solid fa-chevron-down"></i></div>
                    </div>
                    <div className="whe-expand">
                        <p className="whe-desc">Our in-house legal team handles all paperwork — from agreement drafting to
                            property registration — so you don't have to worry about a thing.</p>
                        <ul className="whe-list">
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Sale agreement drafting</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Property registration support</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Stamp duty guidance</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Power of attorney</li>
                        </ul>
                    </div>
                </div>

                {/*  Card 3  */}
                <div className="whe-card">
                    <div className="whe-card-top">
                        <div className="whe-icon" style={{ background: 'rgba(34,197,94,0.12)' }}>
                            <i className="fa-solid fa-users" style={{ color: '#22c55e' }}></i>
                        </div>
                        <h3 className="whe-title">Buyer Onboarding</h3>
                        <p className="whe-subtitle">We onboard your buyers</p>
                        <div className="whe-chevron"><i className="fa-solid fa-chevron-down"></i></div>
                    </div>
                    <div className="whe-expand">
                        <p className="whe-desc">We handle the complete buyer journey — from initial inquiry and site visits
                            to loan assistance and final handover — with dedicated support at every step.</p>
                        <ul className="whe-list">
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Dedicated relationship manager</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Scheduled site visits</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Home loan assistance</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Post-purchase support</li>
                        </ul>
                    </div>
                </div>

                {/*  Card 4  */}
                <div className="whe-card">
                    <div className="whe-card-top">
                        <div className="whe-icon" style={{ background: 'rgba(168,85,247,0.12)' }}>
                            <i className="fa-solid fa-chart-pie" style={{ color: '#a855f7' }}></i>
                        </div>
                        <h3 className="whe-title">Investment Advisory</h3>
                        <p className="whe-subtitle">Data-driven ROI planning</p>
                        <div className="whe-chevron"><i className="fa-solid fa-chevron-down"></i></div>
                    </div>
                    <div className="whe-expand">
                        <p className="whe-desc">Our advisors analyse market trends, locality growth, and rental yields to
                            help you invest in properties that deliver the best returns.</p>
                        <ul className="whe-list">
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Market trend analysis</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Rental yield projections</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Portfolio diversification</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Exit strategy planning</li>
                        </ul>
                    </div>
                </div>

                {/*  Card 5  */}
                <div className="whe-card">
                    <div className="whe-card-top">
                        <div className="whe-icon" style={{ background: 'rgba(20,184,166,0.12)' }}>
                            <i className="fa-solid fa-key" style={{ color: '#14b8a6' }}></i>
                        </div>
                        <h3 className="whe-title">Rental Management</h3>
                        <p className="whe-subtitle">Hassle-free tenancy</p>
                        <div className="whe-chevron"><i className="fa-solid fa-chevron-down"></i></div>
                    </div>
                    <div className="whe-expand">
                        <p className="whe-desc">From finding verified tenants to collecting rent and handling maintenance —
                            we manage your rental property end-to-end so you earn without the stress.</p>
                        <ul className="whe-list">
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Tenant screening & KYC</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Rent agreement drafting</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Monthly rent collection</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Maintenance coordination</li>
                        </ul>
                    </div>
                </div>

                {/*  Card 6  */}
                <div className="whe-card">
                    <div className="whe-card-top">
                        <div className="whe-icon" style={{ background: 'rgba(239,68,68,0.12)' }}>
                            <i className="fa-solid fa-headset" style={{ color: '#ef4444' }}></i>
                        </div>
                        <h3 className="whe-title">24/7 Support</h3>
                        <p className="whe-subtitle">Always here for you</p>
                        <div className="whe-chevron"><i className="fa-solid fa-chevron-down"></i></div>
                    </div>
                    <div className="whe-expand">
                        <p className="whe-desc">Our support team is available round the clock via phone, WhatsApp, and
                            email. No query goes unanswered — we're with you at every stage of your journey.</p>
                        <ul className="whe-list">
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Phone & WhatsApp support</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Dedicated account manager</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Live chat assistance</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> After-sales follow-up</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
        {/*  Bottom CTA Banner  */}
        <div className="mt-20 max-w-7xl mx-auto px-6 lg:px-0">

            <div className="relative rounded-2xl overflow-hidden p-10 text-center border border-white/10 shadow-xl">

                {/*  Premium Dark Gradient  */}
                <div
                    className="absolute inset-0 bg-[linear-gradient(135deg,#0b1220_0%,#0f2a5c_50%,#1e40af_100%)] opacity-95">
                </div>

                {/*  Glow Effect  */}
                <div className="absolute inset-0 bg-accent/20 blur-3xl opacity-30"></div>

                {/*  Content  */}
                <div className="relative z-10 max-w-4xl mx-auto">

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                        You Focus on Properties, We Handle Everything Else
                    </h3>

                    <p className="text-white/80 text-sm sm:text-base mb-8 leading-relaxed">
                        No need to build technology, hire legal teams, or manage compliance.
                        Baba Broker provides the complete infrastructure — you just list your properties and grow your
                        business.
                    </p>

                    {/*  Button  */}
                    <a href="#"
                        className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
                        Get Started Today
                        <i className="fa-solid fa-arrow-right text-sm"></i>
                    </a>

                </div>

            </div>

        </div>
    </section>
    {/*  We handle everything section end  */}

    {/*  Property Types Section Start  */}
    <section className="bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 text-center py-20">

            {/*  Top label  */}
            <div
                className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-5">
                <i className="fa-solid fa-house text-accent text-xs"></i> What can you explore with Baba Broker
            </div>

            {/*  Heading  */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">Explore Any Real Estate <span
                    className="text-accent">Property Type</span></h2>
            <p className="text-gray-400 mb-10 mx-auto">Browse residential, commercial, plots, and rental properties
                with
                <span className="text-accent font-semibold">Baba Broker</span>
            </p>

            {/*  Tab pills  */}
            <div className="flex flex-wrap justify-center gap-3 mb-8" id="propTypeTabs">
                <button onClick={() => window.switchPropType(this,'residential')}
                    className="prop-type-tab active-tab flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border transition-all">
                    <i className="fa-solid fa-house"></i> Residential
                </button>
                <button onClick={() => window.switchPropType(this,'plots')}
                    className="prop-type-tab flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border border-white/10 text-gray-400 bg-transparent hover:border-accent hover:text-white transition-all">
                    <i className="fa-solid fa-map"></i> Plots
                </button>
                <button onClick={() => window.switchPropType(this,'commercial')}
                    className="prop-type-tab flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border border-white/10 text-gray-400 bg-transparent hover:border-accent hover:text-white transition-all">
                    <i className="fa-solid fa-building"></i> Commercial
                </button>
                <button onClick={() => window.switchPropType(this,'rental')}
                    className="prop-type-tab flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border border-white/10 text-gray-400 bg-transparent hover:border-accent hover:text-white transition-all">
                    <i className="fa-solid fa-key"></i> Rental
                </button>
                <button onClick={() => window.switchPropType(this,'luxury')}
                    className="prop-type-tab flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border border-white/10 text-gray-400 bg-transparent hover:border-accent hover:text-white transition-all">
                    <i className="fa-solid fa-gem"></i> Luxury
                </button>
            </div>

            {/*  Panel card  */}
            <div className="rounded-2xl bg-dark-3 border border-white/8 p-6 sm:p-8 lg:p-10 text-left">
                <div id="propTypePanel" className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/*  Left: info  */}
                    <div id="propTypeInfo">
                        <div className="flex items-center gap-4 mb-5">
                            <span id="propTypeIcon"
                                className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl shrink-0">
                                <i className="fa-solid fa-house"></i>
                            </span>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Property Type</p>
                                <p id="propTypeTitle" className="text-white font-bold text-xl">Residential</p>
                            </div>
                        </div>
                        <p id="propTypeDesc" className="text-gray-400 leading-relaxed mb-6">
                            Browse verified residential properties — apartments, villas, and independent houses across
                            top cities. Find your perfect home with zero brokerage.
                        </p>
                        <div id="propTypeTags" className="flex flex-wrap gap-2">
                            <span className="text-xs border border-white/10 rounded-full px-3 py-1.5 text-gray-300">
                                Quick Setup
                            </span>
                            <span className="text-xs border border-white/10 rounded-full px-3 py-1.5 text-gray-300">
                                Verified Listings
                            </span>
                            <span className="text-xs border border-white/10 rounded-full px-3 py-1.5 text-gray-300">
                                Full Support
                            </span>
                        </div>
                    </div>

                    {/*  Right: image  */}
                    <div className="rounded-xl overflow-hidden prop-type-img-wrap">
                        <img id="propTypeImg"
                            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"
                            alt="Residential" className="w-full h-full object-cover" />
                    </div>

                </div>
            </div>

        </div>
    </section>
    {/*  Property Types Section End  */}

    {/*  Knowledge / Resources Section Start  */}
    <section className="bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 py-20">

            {/*  Heading  */}
            <div className="text-center mb-14 fade-in">
                <div
                    className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-5">
                    <i className="fa-solid fa-book text-accent text-xs"></i> RESOURCES
                </div>

                <h2 className="section-title">
                    Everything You Need <br />
                    <span className="text-accent">To Know</span>
                </h2>

                <p className="section-subtitle mx-auto">
                    Learn about property buying, investment strategies, legal processes, and market insights.
                </p>
            </div>

            {/*  GRID  */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/*  LEFT BIG CARD  */}
                <div
                    className="lg:row-span-2 rounded-2xl p-6 bg-gradient-to-br from-primary to-primary-dark border border-white/10 flex flex-col justify-between relative">

                    {/*  TOP  */}
                    <div className="flex justify-between items-start mb-6">

                        {/*  Left Icon  */}
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                            <i className="fa-solid fa-book-open text-white"></i>
                        </div>

                        {/*  Right Icons  */}
                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
                                <i className="fa-solid fa-bolt text-xs text-white/80"></i>
                            </div>
                            <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
                                <i className="fa-solid fa-globe text-xs text-white/80"></i>
                            </div>
                        </div>

                    </div>

                    {/*  Content  */}
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Baba Broker Guides</h3>
                        <p className="text-sm text-white/80">
                            Complete guide to buying, selling, and investing in real estate with expert insights.
                        </p>
                    </div>

                    {/*  CTA  */}
                    <a href="#" className="mt-6 text-sm font-medium text-white inline-flex items-center gap-2">
                        Explore Documentation <i className="fa-solid fa-arrow-right"></i>
                    </a>

                </div>

                {/*  RIGHT SIDE  */}
                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">

                    {/*  CARD 1  */}
                    <div className="card h-full">
                        <div className="card-icon">
                            <i className="fa-solid fa-house"></i>
                        </div>

                        <h4 className="font-semibold mb-1">Buying Process</h4>
                        <p className="text-sm text-gray-400 mb-4">
                            Step-by-step guide to buying your dream property.
                        </p>

                        <a href="#" className="text-sm font-medium text-accent inline-flex items-center gap-1">
                            Learn more <i className="fa-solid fa-arrow-right text-xs"></i>
                        </a>
                    </div>

                    {/*  CARD 2  */}
                    <div className="card h-full">
                        <div className="card-icon">
                            <i className="fa-solid fa-chart-line"></i>
                        </div>

                        <h4 className="font-semibold mb-1">Investment Guide</h4>
                        <p className="text-sm text-gray-400 mb-4">
                            Learn how to maximize ROI in real estate investments.
                        </p>

                        <a href="#" className="text-sm font-medium text-accent inline-flex items-center gap-1">
                            Learn more <i className="fa-solid fa-arrow-right text-xs"></i>
                        </a>
                    </div>

                    {/*  CARD 3  */}
                    <div className="card h-full">
                        <div className="card-icon">
                            <i className="fa-solid fa-shield-halved"></i>
                        </div>

                        <h4 className="font-semibold mb-1">Legal & Safety</h4>
                        <p className="text-sm text-gray-400 mb-4">
                            Understand legal verification and documentation.
                        </p>

                        <a href="#" className="text-sm font-medium text-accent inline-flex items-center gap-1">
                            Learn more <i className="fa-solid fa-arrow-right text-xs"></i>
                        </a>
                    </div>

                    {/*  CARD 4  */}
                    <div className="card h-full">
                        <div className="card-icon">
                            <i className="fa-solid fa-scale-balanced"></i>
                        </div>

                        <h4 className="font-semibold mb-1">Compliance</h4>
                        <p className="text-sm text-gray-400 mb-4">
                            RERA rules, taxation, and compliance explained.
                        </p>

                        <a href="#" className="text-sm font-medium text-accent inline-flex items-center gap-1">
                            Learn more <i className="fa-solid fa-arrow-right text-xs"></i>
                        </a>
                    </div>

                </div>

            </div>

            {/*  Bottom Strip  */}
            <div
                className="mt-10 rounded-xl border border-white/10 bg-dark-3 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <i className="fa-solid fa-bolt text-accent"></i>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Quick Access</p>
                        <p className="text-xs text-gray-400">Jump to popular sections</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full border border-white/10 text-xs">Buying Guide</span>
                    <span className="px-3 py-1 rounded-full border border-white/10 text-xs">Pricing</span>
                    <span className="px-3 py-1 rounded-full border border-white/10 text-xs">How It Works</span>
                    <span className="px-3 py-1 rounded-full border border-white/10 text-xs">FAQs</span>
                </div>

                <a href="#" className="btn btn-accent text-sm">
                    View All Resources
                </a>

            </div>

        </div>
    </section>
    {/*  Knowledge / Resources Section Start  */}

    {/*  Features Section Start  */}
    <section className="bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 py-20">

            {/*  Badge  */}
            <div className="flex justify-center mb-6">
                <div
                    className="flex items-center gap-2 border border-white/10 text-gray-400 px-4 py-1.5 rounded-full text-xs font-semibold">
                    <i className="fa-solid fa-layer-group text-accent text-xs"></i> PLATFORM FEATURES
                </div>
            </div>

            {/*  Heading  */}
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-white leading-tight">
                    Everything You Need to <br />
                    <span className="text-accent">Scale Your Business</span>
                </h2>

                <p className="text-gray-400 text-sm mt-4 max-w-2xl mx-auto">
                    Complete platform features to manage properties, brokers, buyers, and grow your
                    fractional real estate business
                </p>
            </div>

            {/*  Grid  */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 fade-in">

                {/*  Highlight Card  */}
                <div className="group h-full flex flex-col rounded-2xl p-6 bg-accent/10 border border-accent/30 
                    hover:border-accent transition duration-300 hover:-translate-y-1 hover:shadow-xl relative">

                    <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-accent rounded-full"></div>

                    <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4">
                        <i className="fa-solid fa-sitemap"></i>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-2">
                            Master Broker & Sub Broker Network
                        </h4>
                        <p className="text-gray-400 text-sm">
                            Build your sales network by adding brokers. Track performance and manage commissions
                            seamlessly.
                        </p>
                    </div>

                    <div className="mt-auto flex justify-end">
                        <div
                            className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 text-accent">
                            <i className="fa-solid fa-arrow-right"></i>
                        </div>
                    </div>

                </div>

                {/*  Card 2  */}
                <div className="group h-full flex flex-col rounded-2xl p-6 bg-dark-3 border border-white/10 
      hover:border-accent transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                    <div className="w-12 h-12 rounded-xl bg-white/5 text-gray-300 flex items-center justify-center mb-4">
                        <i className="fa-solid fa-table"></i>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-2">Property Management Dashboard</h4>
                        <p className="text-gray-400 text-sm">
                            Manage listings, track fractional assets, and control everything from one dashboard.
                        </p>
                    </div>

                    <div className="mt-auto flex justify-end">
                        <div
                            className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 text-accent">
                            <i className="fa-solid fa-arrow-right"></i>
                        </div>
                    </div>

                </div>

                {/*  Card 3  */}
                <div className="group h-full flex flex-col rounded-2xl p-6 bg-dark-3 border border-white/10 
      hover:border-accent transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                    <div className="w-12 h-12 rounded-xl bg-white/5 text-gray-300 flex items-center justify-center mb-4">
                        <i className="fa-solid fa-users"></i>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-2">Buyer Management</h4>
                        <p className="text-gray-400 text-sm">
                            Manage buyers, investments, allocations, and relationships with ease.
                        </p>
                    </div>

                    <div className="mt-auto flex justify-end">
                        <div
                            className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 text-accent">
                            <i className="fa-solid fa-arrow-right"></i>
                        </div>
                    </div>

                </div>

                {/*  Card 4  */}
                <div className="group h-full flex flex-col rounded-2xl p-6 bg-dark-3 border border-white/10 
      hover:border-accent transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                    <div className="w-12 h-12 rounded-xl bg-white/5 text-gray-300 flex items-center justify-center mb-4">
                        <i className="fa-solid fa-chart-line"></i>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-2">Analytics & Reporting</h4>
                        <p className="text-gray-400 text-sm">
                            Gain insights into sales, performance, and user behavior.
                        </p>
                    </div>

                    <div className="mt-auto flex justify-end">
                        <div
                            className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 text-accent">
                            <i className="fa-solid fa-arrow-right"></i>
                        </div>
                    </div>

                </div>

                {/*  Card 5  */}
                <div className="group h-full flex flex-col rounded-2xl p-6 bg-dark-3 border border-white/10 
      hover:border-accent transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                    <div className="w-12 h-12 rounded-xl bg-white/5 text-gray-300 flex items-center justify-center mb-4">
                        <i className="fa-solid fa-money-bill-wave"></i>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-2">Commission Management</h4>
                        <p className="text-gray-400 text-sm">
                            Automate commission distribution and track payouts easily.
                        </p>
                    </div>

                    <div className="mt-auto flex justify-end">
                        <div
                            className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 text-accent">
                            <i className="fa-solid fa-arrow-right"></i>
                        </div>
                    </div>

                </div>

                {/*  Card 6  */}
                <div className="group h-full flex flex-col rounded-2xl p-6 bg-dark-3 border border-white/10 
      hover:border-accent transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                    <div className="w-12 h-12 rounded-xl bg-white/5 text-gray-300 flex items-center justify-center mb-4">
                        <i className="fa-solid fa-file-lines"></i>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-2">Document Management</h4>
                        <p className="text-gray-400 text-sm">
                            Store, organize, and share legal and property documents securely.
                        </p>
                    </div>

                    <div className="mt-auto flex justify-end">
                        <div
                            className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 text-accent">
                            <i className="fa-solid fa-arrow-right"></i>
                        </div>
                    </div>

                </div>

                {/*  Card 7  */}
                <div className="group h-full flex flex-col rounded-2xl p-6 bg-dark-3 border border-white/10 
      hover:border-accent transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                    <div className="w-12 h-12 rounded-xl bg-white/5 text-gray-300 flex items-center justify-center mb-4">
                        <i className="fa-solid fa-bullhorn"></i>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-2">Marketing & Promotion</h4>
                        <p className="text-gray-400 text-sm">
                            Promote properties using built-in tools and shareable links.
                        </p>
                    </div>

                    <div className="mt-auto flex justify-end">
                        <div
                            className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 text-accent">
                            <i className="fa-solid fa-arrow-right"></i>
                        </div>
                    </div>

                </div>

                {/*  Card 8  */}
                <div className="group h-full flex flex-col rounded-2xl p-6 bg-dark-3 border border-white/10 
      hover:border-accent transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                    <div className="w-12 h-12 rounded-xl bg-white/5 text-gray-300 flex items-center justify-center mb-4">
                        <i className="fa-solid fa-code"></i>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white mb-2">API Access & Integration</h4>
                        <p className="text-gray-400 text-sm">
                            Integrate seamlessly with your systems using our APIs.
                        </p>
                    </div>

                    <div className="mt-auto flex justify-end">
                        <div
                            className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition duration-300 text-accent">
                            <i className="fa-solid fa-arrow-right"></i>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    </section>
    {/*  Features Section End  */}

    {/*  Premium Feature Spotlight  */}
    <section className="bg-dark-2 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">

            <div className="relative rounded-3xl overflow-hidden p-[1px]">

                {/*  Outer Glow Border  */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(34,197,94,0.4),transparent,rgba(59,130,246,0.4))] 
                    blur-xl opacity-30"></div>

                {/*  Main Container  */}
                <div
                    className="relative rounded-3xl bg-dark-3 border border-white/10 p-8 lg:p-12 flex flex-col lg:flex-row gap-12">

                    {/*  LEFT CONTENT  */}
                    <div className="flex-1">

                        {/*  Label  */}
                        <p className="text-xs text-gray-500 mb-2 tracking-wider uppercase">
                            PLATFORM FEATURE
                        </p>

                        {/*  Title  */}
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
                            Master Broker & Sub Broker Network
                        </h2>

                        {/*  Description  */}
                        <p className="text-gray-400 mb-8 max-w-xl leading-relaxed">
                            Build your sales network by adding master brokers and sub brokers. Track performance,
                            automate commissions, and scale your property sales efficiently.
                        </p>

                        {/*  Features Grid  */}
                        <div className="grid sm:grid-cols-2 gap-3 mb-8">

                            {/*  Item  */}
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] 
                                border border-white/10 hover:border-accent/40 transition">
                                <i className="fa-solid fa-check text-accent"></i>
                                <span className="text-sm text-gray-300">Unlimited master brokers</span>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] 
                                border border-white/10 hover:border-accent/40 transition">
                                <i className="fa-solid fa-check text-accent"></i>
                                <span className="text-sm text-gray-300">Sub broker network control</span>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] 
                                border border-white/10 hover:border-accent/40 transition">
                                <i className="fa-solid fa-check text-accent"></i>
                                <span className="text-sm text-gray-300">Performance tracking</span>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] 
                                border border-white/10 hover:border-accent/40 transition">
                                <i className="fa-solid fa-check text-accent"></i>
                                <span className="text-sm text-gray-300">Auto commission system</span>
                            </div>

                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] 
                                border border-white/10 col-span-2 hover:border-accent/40 transition">
                                <i className="fa-solid fa-check text-accent"></i>
                                <span className="text-sm text-gray-300">Referral links & tracking codes</span>
                            </div>

                        </div>

                        {/*  Tags  */}
                        <div className="flex gap-2 flex-wrap mb-8">
                            <span className="bg-accent text-black text-xs px-3 py-1 rounded-full">Efficiency</span>
                            <span className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full">Scale</span>
                            <span className="bg-white/10 text-gray-300 text-xs px-3 py-1 rounded-full">Control</span>
                        </div>

                        {/*  Extra  */}
                        <div className="mb-8">
                            <div
                                className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs px-3 py-1 rounded-full mb-3">
                                <i className="fa-solid fa-bolt"></i> Automated Workflows
                            </div>

                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><i className="fa-solid fa-check text-accent mr-2"></i> Reduce manual work by 80%</li>
                                <li><i className="fa-solid fa-check text-accent mr-2"></i> Instant SPV creation</li>
                                <li><i className="fa-solid fa-check text-accent mr-2"></i> Automated onboarding</li>
                            </ul>
                        </div>

                        {/*  Buttons  */}
                        <div className="flex gap-4 flex-wrap">

                            <a href="#" className="relative inline-flex items-center gap-2 px-6 py-2 rounded-full text-sm font-semibold 
                                bg-accent text-black overflow-hidden group">
                                <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition">
                                </span>
                                Get Started <i className="fa-solid fa-arrow-right text-xs"></i>
                            </a>

                            <a href="#"
                                className="px-6 py-2 rounded-full border border-white/20 text-gray-300 text-sm hover:bg-white/10 transition">
                                Learn More →
                            </a>

                        </div>

                    </div>

                    {/*  RIGHT VISUAL  */}
                    <div className="flex-1">

                        <div className="relative h-full rounded-2xl overflow-hidden border border-white/10 group">

                            {/*  Base Gradient  */}
                            <div
                                className="absolute inset-0 bg-[linear-gradient(135deg,#020617_0%,#052e2b_40%,#0f172a_100%)]">
                            </div>

                            {/*  Glow Pulse  */}
                            <div
                                className="absolute inset-0 bg-accent/20 blur-3xl opacity-30 group-hover:opacity-50 transition">
                            </div>

                            {/*  Inner Card  */}
                            <div className="relative z-10 h-full flex flex-col items-center justify-center gap-5">

                                <div
                                    className="w-16 h-16 rounded-xl bg-accent/20 text-accent flex items-center justify-center text-2xl shadow-lg">
                                    <i className="fa-solid fa-sitemap"></i>
                                </div>

                                <div className="w-32 h-2 bg-white/10 rounded"></div>
                                <div className="w-24 h-2 bg-white/10 rounded"></div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/*  Bottom Mini Features  */}
            <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {/*  Card 1  */}
                <div
                    className="group rounded-2xl p-6 bg-dark-3 border border-white/10 hover:border-accent transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                    <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4">
                        <i className="fa-solid fa-money-check-dollar"></i>
                    </div>

                    <h4 className="text-white font-semibold mb-1">Escrow-Led Payments</h4>
                    <p className="text-gray-400 text-sm">
                        Secure, automated payment processing
                    </p>

                </div>

                {/*  Card 2  */}
                <div
                    className="group rounded-2xl p-6 bg-dark-3 border border-white/10 hover:border-accent transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                    <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4">
                        <i className="fa-solid fa-money-check-dollar"></i>
                    </div>

                    <h4 className="text-white font-semibold mb-1">Full Compliance</h4>
                    <p className="text-gray-400 text-sm">
                        Legal & regulatory compliance handled
                    </p>

                </div>

                {/*  Card 3  */}
                <div
                    className="group rounded-2xl p-6 bg-dark-3 border border-white/10 hover:border-accent transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                    <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4">
                        <i className="fa-solid fa-chart-line"></i>
                    </div>

                    <h4 className="text-white font-semibold mb-1">Real-Time Analytics</h4>
                    <p className="text-gray-400 text-sm">
                        Track performance & growth metrics
                    </p>

                </div>

            </div>

        </div>

    </section>
    {/*  Feature Spotlight Section End  */}

    {/*  Testimonials Section Start  */}
    <section className="bg-dark py-20">

        <div className="max-w-7xl mx-auto px-6 lg:px-0">

            {/*  Badge  */}
            <div className="flex justify-center mb-6">
                <div
                    className="flex items-center gap-2 border border-white/10 text-gray-400 px-4 py-1.5 rounded-full text-xs">
                    <i className="fa-solid fa-star text-accent"></i> TESTIMONIALS
                </div>
            </div>

            {/*  Heading  */}
            <div className="text-center mb-14">
                <h2 className="text-4xl font-extrabold text-white">
                    Public cheers for <span className="text-accent">Baba Broker</span>
                </h2>
                <p className="text-gray-400 text-sm mt-3">
                    See how our partners are growing their business
                </p>
            </div>

            {/*  Slider Wrapper  */}
            <div className="relative">

                {/*  Left Arrow  */}
                <button id="prevBtn"
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-3 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition">
                    <i className="fa-solid fa-chevron-left"></i>
                </button>

                {/*  Right Arrow  */}
                <button id="nextBtn"
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-dark-3 border border-white/10 flex items-center justify-center hover:bg-accent hover:text-black transition">
                    <i className="fa-solid fa-chevron-right"></i>
                </button>

                {/*  Slider Track  */}
                <div className="overflow-hidden">
                    <div id="sliderTrack" className="flex gap-6 transition-transform duration-500 will-change-transform">

                        {/*  CARD  */}
                        <div className="min-w-[calc(100%/3-16px)] bg-dark-3 border border-white/10 rounded-2xl p-6">

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gray-600"></div>
                                <div>
                                    <h4 className="text-white text-sm font-semibold">Vivan Figg</h4>
                                    <p className="text-gray-400 text-xs">Investor</p>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm mb-6">
                                “Nice support team”
                            </p>

                            <div className="text-accent text-2xl text-right">★</div>

                        </div>

                        {/*  CARD  */}
                        <div className="min-w-[calc(100%/3-16px)] bg-dark-3 border border-white/10 rounded-2xl p-6">

                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
                                    CS
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-semibold">Catalina Saiaz</h4>
                                    <p className="text-gray-400 text-xs">Investor</p>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm mb-6">
                                “Amazing platform to grow investment portfolio effortlessly.”
                            </p>

                            <div className="text-accent text-2xl text-right">★</div>

                        </div>

                        {/*  CARD  */}
                        <div className="min-w-[calc(100%/3-16px)] bg-dark-3 border border-white/10 rounded-2xl p-6">

                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
                                    R
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-semibold">Ronit Kumar</h4>
                                    <p className="text-gray-400 text-xs">Investor</p>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm mb-6">
                                “Trustworthy platform for smart investors.”
                            </p>

                            <div className="text-accent text-2xl text-right">★</div>

                        </div>

                        {/*  CARD  */}
                        <div className="min-w-[calc(100%/3-16px)] bg-dark-3 border border-white/10 rounded-2xl p-6">

                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
                                    R
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-semibold">Ronit Kumar</h4>
                                    <p className="text-gray-400 text-xs">Investor</p>
                                </div>
                            </div>

                            <p className="text-gray-400 text-sm mb-6">
                                “Trustworthy platform for smart investors.”
                            </p>

                            <div className="text-accent text-2xl text-right">★</div>

                        </div>

                        {/*  DUPLICATE MORE CARDS FOR SCROLL  */}

                    </div>
                </div>

            </div>

        </div>

    </section>
    {/*  Testimonials Section End  */}

    {/*  Why Choose Section Start  */}
    <section className="bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 py-20">

            {/*  Badge  */}
            <div className="flex justify-center mb-6">
                <div
                    className="flex items-center gap-2 border border-white/10 text-gray-400 px-4 py-1.5 rounded-full text-xs">
                    <i className="fa-solid fa-star text-accent"></i> WHY CHOOSE BABA BROKER
                </div>
            </div>

            {/*  Heading  */}
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-white leading-tight">
                    Start Faster <br />
                    <span className="text-accent">Save Time & Money</span>
                </h2>

                <p className="text-gray-400 text-sm mt-4">
                    Everything you need without the complexity or cost
                </p>
            </div>

            {/*  Cards  */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/*  Card 1  */}
                <div className="group h-full flex flex-col rounded-2xl p-6 bg-dark-3 border border-white/10 
                    hover:border-accent transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                    <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4">
                        <i className="fa-solid fa-code"></i>
                    </div>

                    <h4 className="text-white font-semibold mb-2">No Tech Team Needed</h4>
                    <p className="text-gray-400 text-sm">
                        Skip building software. Use our platform instead.
                    </p>

                </div>

                {/*  Card 2  */}
                <div className="group h-full flex flex-col rounded-2xl p-6 bg-dark-3 border border-white/10 
                    hover:border-accent transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                    <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4">
                        <i className="fa-solid fa-shield"></i>
                    </div>

                    <h4 className="text-white font-semibold mb-2">Legal & Compliance Done</h4>
                    <p className="text-gray-300 text-sm">
                        We handle all legal requirements automatically.
                    </p>

                </div>

                {/*  Card 3  */}
                <div className="group h-full flex flex-col rounded-2xl p-6 bg-dark-3 border border-white/10 
                    hover:border-accent transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                    <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4">
                        <i className="fa-solid fa-file-lines"></i>
                    </div>

                    <h4 className="text-white font-semibold mb-2">Full Lifecycle Support</h4>
                    <p className="text-gray-400 text-sm">
                        From listing to payout—we manage it all.
                    </p>

                </div>

                {/*  Card 4  */}
                <div className="group h-full flex flex-col rounded-2xl p-6 bg-dark-3 border border-white/10 
                    hover:border-accent transition duration-300 hover:-translate-y-2 hover:shadow-xl">

                    <div className="w-12 h-12 rounded-xl bg-accent/20 text-accent flex items-center justify-center mb-4">
                        <i className="fa-solid fa-users"></i>
                    </div>

                    <h4 className="text-white font-semibold mb-2">Access to Buyers</h4>
                    <p className="text-gray-400 text-sm">
                        Reach buyers through our platform and network.
                    </p>

                </div>

            </div>

            {/*  CTA  */}
            <div className="text-center mt-16">
                <a href="#" className="btn btn-accent px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2">
                    Become a Seller
                    <i className="fa-solid fa-arrow-right text-sm"></i>
                </a>
            </div>

        </div>
    </section>
    {/*  Why Choose Section End  */}

    {/*  FAQ Section Start  */}
    <section className="faq-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">
            <div className="faq-grid">

                {/*  Left: CTA  */}
                <div className="faq-left">
                    <h2 className="faq-left-title">
                        Your Dream Home Is Just A <span className="text-accent">Call Away!</span>
                    </h2>
                    <p className="faq-left-desc">
                        As the most trusted real estate brokers in India, contact Baba Broker today
                        at <a href="tel:+911800000000">+91 1800 000 000</a> or email us at
                        <a href="mailto:info@bababroker.com">info@bababroker.com</a>. Let us help you find the perfect
                        property that matches your budget and lifestyle.
                    </p>
                    <a href="./contact-us.html"
                        className="btn btn-accent mt-6 inline-flex items-center gap-2 px-6 rounded-full">
                        Contact Us <i className="fa-solid fa-arrow-right"></i>
                    </a>
                </div>

                {/*  Right: Accordion FAQs  */}
                <div className="faq-right">
                    <h3 className="faq-heading">FAQ<span className="text-accent">s</span></h3>

                    <div className="faq-list" id="faqList">

                        <div className="faq-item">
                            <button className="faq-trigger" onClick={() => window.toggleFaq(this)}>
                                Which area is best for property investment in Delhi NCR?
                                <i className="fa-solid fa-chevron-down faq-icon"></i>
                            </button>
                            <div className="faq-panel">
                                <p>
                                    Areas like Dwarka, Noida Expressway, and Greater Noida West offer excellent ROI with
                                    upcoming infrastructure projects and affordable pricing compared to central Delhi.
                                </p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <button className="faq-trigger" onClick={() => window.toggleFaq(this)}>
                                How does Baba Broker verify property listings?
                                <i className="fa-solid fa-chevron-down faq-icon"></i>
                            </button>
                            <div className="faq-panel">
                                <p>
                                    Every listing on Baba Broker is verified by our in-house legal team. We check RERA
                                    registration, title deeds, encumbrance certificates, and ownership documents before
                                    listing.
                                </p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <button className="faq-trigger" onClick={() => window.toggleFaq(this)}>
                                What is the process to buy a property through Baba Broker?
                                <i className="fa-solid fa-chevron-down faq-icon"></i>
                            </button>
                            <div className="faq-panel">
                                <p>
                                    Simply browse our listings, shortlist properties, schedule a site visit with our
                                    agent, and we'll guide you through the entire process — from negotiation to
                                    registration — at zero brokerage.
                                </p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <button className="faq-trigger" onClick={() => window.toggleFaq(this)}>
                                Does Baba Broker charge any brokerage fees?
                                <i className="fa-solid fa-chevron-down faq-icon"></i>
                            </button>
                            <div className="faq-panel">
                                <p>No. Baba Broker operates on a zero-brokerage model for buyers and tenants. Our
                                    services are completely free for property seekers — no hidden charges whatsoever.
                                </p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <button className="faq-trigger" onClick={() => window.toggleFaq(this)}>
                                Which cities does Baba Broker operate in?
                                <i className="fa-solid fa-chevron-down faq-icon"></i>
                            </button>
                            <div className="faq-panel">
                                <p>We currently operate in Delhi NCR, Mumbai, Bangalore, Pune, and Hyderabad — with
                                    plans to expand to Chennai, Kolkata, and Ahmedabad in 2026.</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </section>
    {/*  FAQ Section End  */}

    {/*  Contact us and Blog Section Start  */}
    <section className="section contact-blog-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                {/*  LEFT: Contact Form  */}
                <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">Contact
                        <span className="text-accent">Us</span>
                    </h2>
                    <p className="text-accent font-medium mb-1">Apply to get a call for solution</p>
                    <p className="text-gray-400 text-sm mb-6">Submit the form to connect with our property expert —
                        completely free.</p>

                    <div className="card space-y-4">

                        <div className="flex rounded-xl overflow-hidden border border-white/10">
                            <span className="bg-primary px-4 flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-user text-white"></i>
                            </span>
                            <input type="text" placeholder="Your Name"
                                className="flex-1 bg-dark-3 px-4 py-3 text-sm focus:outline-none placeholder-gray-500 min-w-0" />
                        </div>

                        <div className="flex rounded-xl overflow-hidden border border-white/10">
                            <span className="bg-primary px-4 flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-envelope text-white"></i>
                            </span>
                            <input type="email" placeholder="Your Email"
                                className="flex-1 bg-dark-3 px-4 py-3 text-sm focus:outline-none placeholder-gray-500 min-w-0" />
                        </div>

                        <div className="flex rounded-xl overflow-hidden border border-white/10">
                            <span className="bg-primary px-4 flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-phone text-white"></i>
                            </span>
                            <input type="tel" placeholder="Your Phone Number"
                                className="flex-1 bg-dark-3 px-4 py-3 text-sm focus:outline-none placeholder-gray-500 min-w-0" />
                        </div>

                        <div>
                            <h6 className="font-semibold text-base mb-3">What Can We Do For You?</h6>
                            <div className="overflow-hidden pb-1">
                                <div className="service-tag-track">
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-house text-accent"></i>
                                        Property Buying
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-tag text-accent"></i>
                                        Property Selling
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-key text-accent"></i>
                                        Rental Management
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-chart-pie text-accent"></i>
                                        Investment Advisory
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-house text-accent"></i>
                                        Property Buying
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-tag text-accent"></i>
                                        Property Selling
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-key text-accent"></i>
                                        Rental Management
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-chart-pie text-accent"></i>
                                        Investment Advisory
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex rounded-xl overflow-hidden border border-white/10">
                            <span className="bg-primary px-4 flex items-start justify-center pt-3 shrink-0">
                                <i className="fa-solid fa-comment text-white"></i>
                            </span>
                            <textarea rows="4" placeholder="Your Message"
                                className="flex-1 bg-dark-3 px-4 py-3 text-sm focus:outline-none placeholder-gray-500 resize-none min-w-0"></textarea>
                        </div>

                        <div className="text-center sm:text-right">
                            <button type="submit" className="btn btn-accent px-8 rounded-full font-semibold">
                                Submit <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/*  RIGHT: Blog  */}
                <div>
                    <div className="mb-5 text-center lg:text-left">
                        <small className="text-accent uppercase tracking-widest font-semibold text-xs">Blog</small>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mt-1">LATEST BLOGS</h2>
                        <p className="text-gray-400 text-sm mt-2">
                            Stay updated with real estate trends, tips, and market insights.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:h-[510px] overflow-auto pt-1"
                        style={{ scrollbarWidth: 'none' }}>

                        <div className="blog-card fade-in h-max">
                            <div className="blog-card-img">
                                <div className="blog-img-placeholder">
                                    {/*  <i className="fa-solid fa-city text-4xl text-primary/30"></i>  */}
                                    <img src="./assets/img/blog1.webp" alt="blog1" loading="lazy" className="object-fill" />
                                </div>
                                <span className="blog-badge">15 Jan 2026</span>
                            </div>
                            <div className="p-4">
                                <h6 className="font-semibold text-sm mb-2 leading-snug">
                                    Top 5 Localities to Invest in Real Estate This Year
                                </h6>
                                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                                    Discover the fastest-growing neighbourhoods offering the best ROI for property
                                    investors in 2026.
                                </p>
                                <div className="flex justify-between items-center text-xs border-t border-white/10 pt-3">
                                    <a href="#" className="text-accent hover:underline">View More</a>
                                    <span className="text-gray-500">By Admin</span>
                                </div>
                            </div>
                        </div>

                        <div className="blog-card fade-in h-max">
                            <div className="blog-card-img">
                                <div className="blog-img-placeholder">
                                    {/*  <i className="fa-solid fa-house-circle-check text-4xl text-primary/30"></i>  */}
                                    <img src="./assets/img/blog2.webp" alt="blog2" loading="lazy" className="object-fill" />
                                </div>
                                <span className="blog-badge">02 Feb 2026</span>
                            </div>
                            <div className="p-4">
                                <h6 className="font-semibold text-sm mb-2 leading-snug">
                                    First-Time Buyer's Guide: What You Must Know
                                </h6>
                                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                                    Buying your first home can be overwhelming. Here's a step-by-step guide to make it
                                    stress-free.
                                </p>
                                <div className="flex justify-between items-center text-xs border-t border-white/10 pt-3">
                                    <a href="#" className="text-accent hover:underline">View More</a>
                                    <span className="text-gray-500">By Admin</span>
                                </div>
                            </div>
                        </div>

                        <div className="blog-card fade-in h-max">
                            <div className="blog-card-img">
                                <div className="blog-img-placeholder">
                                    {/*  <i className="fa-solid fa-chart-line text-4xl text-primary/30"></i>  */}
                                    <img src="./assets/img/blog3.webp" alt="blog3" loading="lazy" className="object-fill" />
                                </div>
                                <span className="blog-badge">10 Mar 2026</span>
                            </div>
                            <div className="p-4">
                                <h6 className="font-semibold text-sm mb-2 leading-snug">
                                    How to Get the Best Price When Selling Your Property
                                </h6>
                                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                                    Expert tips on staging, pricing, and marketing your property to attract serious
                                    buyers fast.
                                </p>
                                <div className="flex justify-between items-center text-xs border-t border-white/10 pt-3">
                                    <a href="#" className="text-accent hover:underline">View More</a>
                                    <span className="text-gray-500">By Admin</span>
                                </div>
                            </div>
                        </div>

                        <div className="blog-card fade-in h-max">
                            <div className="blog-card-img">
                                <div className="blog-img-placeholder">
                                    {/*  <i className="fa-solid fa-file-contract text-4xl text-primary/30"></i>  */}
                                    <img src="./assets/img/blog4.webp" alt="blog4" loading="lazy" className="object-fill" />
                                </div>
                                <span className="blog-badge">18 Mar 2026</span>
                            </div>
                            <div className="p-4">
                                <h6 className="font-semibold text-sm mb-2 leading-snug">
                                    Understanding RERA: Rights Every Property Buyer Has
                                </h6>
                                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                                    RERA protects homebuyers from fraud and delays. Know your rights before signing any
                                    agreement.
                                </p>
                                <div className="flex justify-between items-center text-xs border-t border-white/10 pt-3">
                                    <a href="#" className="text-accent hover:underline">View More</a>
                                    <span className="text-gray-500">By Admin</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>

    </section>
    {/*  Contact us and Blog Section End  */}

    
                </>
  );
}
