import AboutSection from '../components/home/AboutSection';
import WhyChooseUsSection from '../components/home/WhyChooseUsSection';

export default function AboutUs() {
  return (
    <>
      {/* Hero Section Start */}
      <section
        className="about-hero h-[50vh] relative flex items-center justify-center text-center overflow-hidden bg-slate-950"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10"></div>
        <div className="relative z-20 text-center max-w-3xl px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-orange-400 mb-4">
            Our Story & Legacy
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500">Baba Broker</span>
          </h1>
          <p className="mt-4 text-sm text-slate-300">
            India's premiere real estate investment platform. Verified listings, transparent returns, and zero hassle.
          </p>
        </div>
      </section>
      {/* Hero Section End */}

      {/* Welcome To Section */}
      <AboutSection />

      {/* The Baba Broker Difference Section */}
      <WhyChooseUsSection />


    {/*  About Info Section Start  */}
    <section className="section bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">

            {/*  Two Column: Image + Content  */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">

                {/*  Left: Image with floating quote card  */}
                <div className="relative pb-16 fade-in">
                    <img src="./assets/img/about-banner.jpg" alt="About Baba Broker"
                        className="w-full h-72 lg:h-[380px] object-cover rounded-2xl" />
                    {/*  Floating quote card  */}
                    <div className="absolute bottom-0 left-0 w-4/5 bg-primary text-white px-5 py-4 rounded-xl shadow-lg">
                        <p className="text-xs leading-relaxed mb-3">
                            We always believe in making a great work relationship with clients and we always love
                            to support our clients with all ups and downs in their business.
                        </p>
                        <p className="text-xs">
                            <span className="font-bold">Amit Shukla</span>
                            <span className="text-white/60 ml-1 font-normal">Founder &amp; Director</span>
                        </p>
                    </div>
                </div>

                {/*  Right: Content  */}
                <div className="fade-in">
                    <span className="text-accent text-sm font-semibold uppercase tracking-widest">About Baba Broker</span>
                    <h2 className="section-title mt-2">We Deliver Your <span className="text-accent">Thoughts</span></h2>
                    <div className="accent-line"></div>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                        Baba Broker provides high quality Web &amp; Mobile App Development Services. Our excellent
                        in-house team of experienced and skilled Web &amp; Mobile App Developers delivers
                        requirement-specific and business-oriented solutions.
                    </p>

                    {/*  Blockquote — matches index.html card style  */}
                    <div className="card border-primary/30 mb-5 py-4 px-5">
                        <p className="text-gray-300 text-sm italic leading-relaxed">
                            Being a Top Web &amp; Mobile App Development Company, our team of skilled professionals
                            &amp; programmers execute excellent Web &amp; App Development Services.
                        </p>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                        We have experts in all latest and trending technologies who work hard to achieve client
                        requirements and deliver top-notch solutions on record turnaround time with very affordable
                        costs. We are having deep experience working with all Industries and clients Worldwide.
                    </p>

                    {/*  Checklist — exact index.html pattern  */}
                    <ul className="space-y-3 text-sm">
                        <li className="flex items-center gap-3">
                            <i className="fa-solid fa-circle-check text-accent"></i>
                            Top-Notch Web &amp; App Development Services
                        </li>
                        <li className="flex items-center gap-3">
                            <i className="fa-solid fa-circle-check text-accent"></i>
                            Highly Skilled Team With Excellent Communication
                        </li>
                        <li className="flex items-center gap-3">
                            <i className="fa-solid fa-circle-check text-accent"></i>
                            Delivery As Per Requirements &amp; Client Ideas
                        </li>
                    </ul>
                </div>
            </div>

            {/*  Four Cards Row — uses site .card + .card-icon pattern  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="card fade-in text-center cursor-pointer hover:border-primary group">
                    <div className="card-icon mx-auto group-hover:bg-primary/30 transition-colors duration-300">
                        <i className="fa-solid fa-lightbulb"></i>
                    </div>
                    <h4 className="font-semibold text-base mb-2">Our Approach</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        We always listen our client very carefully and make a proper plan for project as per client
                        ideas.
                    </p>
                </div>

                <div className="card fade-in text-center cursor-pointer hover:border-primary group">
                    <div className="card-icon mx-auto group-hover:bg-primary/30 transition-colors duration-300">
                        <i className="fa-solid fa-gem"></i>
                    </div>
                    <h4 className="font-semibold text-base mb-2">Our Values</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        We always value our relationship with clients, we value each project whether its small or large.
                    </p>
                </div>

                <div className="card fade-in text-center cursor-pointer hover:border-primary group">
                    <div className="card-icon mx-auto group-hover:bg-primary/30 transition-colors duration-300">
                        <i className="fa-solid fa-headset"></i>
                    </div>
                    <h4 className="font-semibold text-base mb-2">Our Support</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        We provide long term support for any project. We always available for priority support and
                        assistance.
                    </p>
                </div>

                <div className="card fade-in text-center cursor-pointer hover:border-primary group">
                    <div className="card-icon mx-auto group-hover:bg-primary/30 transition-colors duration-300">
                        <i className="fa-solid fa-gear"></i>
                    </div>
                    <h4 className="font-semibold text-base mb-2">Our Resources</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        We have skilled resources, who is well experienced in their relative technologies and required
                        skills.
                    </p>
                </div>

            </div>
        </div>
    </section>
    {/*  About Info Section End  */}

    {/*  Connect With Us Section Start  */}
    <section className="relative py-24 overflow-hidden"
        style={{ background: `url('./assets/img/about-banner.jpg')  center/cover no-repeat` }}>
        <div className="absolute inset-0 bg-black/65"></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-0">

            {/*  Section Heading  */}
            <div className="text-center mb-14 fade-in">
                <span className="text-accent text-sm font-semibold uppercase tracking-widest">Work With Us</span>
                <h2 className="section-title mt-2 text-white">Connect With Us To Know More About Our
                    <span className="text-accent">Services And Team</span>
                </h2>
                <div className="accent-line mx-auto"></div>
                <p className="text-gray-300 text-sm max-w-xl mx-auto leading-relaxed">
                    We are available to assist you for all your queries and inquiry. Our team is always ready on
                    priority basis to assist regarding all your needs.
                </p>
            </div>

            {/*  Two-column floating card  */}
            <div
                className="grid grid-cols-1 lg:grid-cols-2 max-w-4xl mx-auto shadow-2xl rounded-2xl overflow-hidden fade-in">

                {/*  Left: Blue gradient panel  */}
                <div className="bg-gradient-to-br from-primary to-primary-dark p-8 flex flex-col justify-between">
                    <div>
                        <h3 className="text-white text-2xl font-bold leading-snug mb-4">
                            Best Solution As Per<br />Your Business Needs
                        </h3>
                        <p className="text-white/75 text-sm leading-relaxed mb-6">
                            We deliver the quality solution as per your business requirements, each to diverse into
                            different requirements and different target audiences. We always deliver solutions which
                            helps you to stand out your business in a competitive market.
                        </p>
                        <ul className="space-y-2 text-sm text-white/90 mb-8">
                            <li className="flex items-center gap-2">
                                <i className="fa-solid fa-circle-check text-accent"></i>
                                Unique and Creative Ideas For Your Business
                            </li>
                            <li className="flex items-center gap-2">
                                <i className="fa-solid fa-circle-check text-accent"></i>
                                High Performing Product Delivery
                            </li>
                            <li className="flex items-center gap-2">
                                <i className="fa-solid fa-circle-check text-accent"></i>
                                Affordable Costs and Timely Delivery
                            </li>
                            <li className="flex items-center gap-2">
                                <i className="fa-solid fa-circle-check text-accent"></i>
                                Long Term Support &amp; Maintenance Services
                            </li>
                        </ul>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        <a href="#" onClick={() => window.openQuoteModal()}
                            className="btn btn-accent text-sm px-6 rounded-full">
                            Get A Quote
                        </a>
                        <a href="#contact" className="btn btn-outline text-sm px-6 rounded-full">
                            Get Started <i className="fa-solid fa-arrow-right text-xs"></i>
                        </a>
                    </div>
                </div>

                {/*  Right: White contact form  */}
                <div className="bg-white p-8">
                    <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 text-xs font-semibold mb-1">Name</label>
                                <input type="text" placeholder="Your Name"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-xs font-semibold mb-1">Email</label>
                                <input type="email" placeholder="Your Email"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-600 text-xs font-semibold mb-1">Subject</label>
                                <input type="text" placeholder="Subject"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors" />
                            </div>
                            <div>
                                <label className="block text-gray-600 text-xs font-semibold mb-1">Telephone</label>
                                <input type="tel" placeholder="Your Phone"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-600 text-xs font-semibold mb-1">Additional Details</label>
                            <textarea rows="4" placeholder="Additional details..."
                                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-primary transition-colors resize-none"></textarea>
                        </div>
                        <button type="submit"
                            className="btn btn-primary w-full justify-center rounded-full text-sm font-semibold">
                            Submit Request
                        </button>
                    </form>
                </div>

            </div>
        </div>
    </section>
    {/*  Connect With Us Section End  */}

    {/*  Team Section Start  */}
    <section className="section bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">

            {/*  Heading  */}
            <div className="mb-12 fade-in">
                <span className="text-accent text-sm font-semibold uppercase tracking-widest">Who You'll Work With</span>
                <h2 className="section-title mt-2">The People Who Make <span className="text-accent">the Decisions.</span></h2>
                <div className="accent-line"></div>
                <p className="text-gray-400 text-sm max-w-xl">
                    Senior leaders who stay involved — not just at the pitch, but throughout the engagement.
                </p>
            </div>

            {/*  Row 1: 5 members  */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-6">

                <div className="fade-in group">
                    <div
                        className="overflow-hidden rounded-2xl bg-dark-3 border border-white/5 mb-3 aspect-[3/4] group-hover:border-accent transition-all duration-300">
                        <img src="https://placehold.co/300x400/1f2937/6b7280?text=V.A" alt="Vinay Angadi"
                            loading="lazy" className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="font-semibold text-sm text-white">Vinay Angadi</p>
                    <p className="text-gray-400 text-xs mt-0.5">Founder</p>
                </div>

                <div className="fade-in group">
                    <div
                        className="overflow-hidden rounded-2xl bg-dark-3 border border-white/5 mb-3 aspect-[3/4] group-hover:border-accent transition-all duration-300">
                        <img src="https://placehold.co/300x400/1f2937/6b7280?text=T.A" alt="Thunga M Angadi"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="font-semibold text-sm text-white">Thunga M Angadi</p>
                    <p className="text-gray-400 text-xs mt-0.5">Co-Founder</p>
                </div>

                <div className="fade-in group">
                    <div
                        className="overflow-hidden rounded-2xl bg-dark-3 border border-white/5 mb-3 aspect-[3/4] group-hover:border-accent transition-all duration-300">
                        <img src="https://placehold.co/300x400/1f2937/6b7280?text=B.VS" alt="Babji VS"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="font-semibold text-sm text-white">Babji VS</p>
                    <p className="text-gray-400 text-xs mt-0.5">Advisory Board</p>
                </div>

                <div className="fade-in group">
                    <div
                        className="overflow-hidden rounded-2xl bg-dark-3 border border-white/5 mb-3 aspect-[3/4] group-hover:border-accent transition-all duration-300">
                        <img src="https://placehold.co/300x400/1f2937/6b7280?text=B.B" alt="Bhaskar Bulusu"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="font-semibold text-sm text-white">Bhaskar Bulusu</p>
                    <p className="text-gray-400 text-xs mt-0.5">Advisory Board</p>
                </div>

                <div className="fade-in group">
                    <div
                        className="overflow-hidden rounded-2xl bg-dark-3 border border-white/5 mb-3 aspect-[3/4] group-hover:border-accent transition-all duration-300">
                        <img src="https://placehold.co/300x400/1f2937/6b7280?text=A.D" alt="Amit Didwania"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="font-semibold text-sm text-white">Amit Didwania</p>
                    <p className="text-gray-400 text-xs mt-0.5">VP-Business Strategy</p>
                </div>

            </div>

            {/*  Row 2: 1 member left-aligned  */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">

                <div className="fade-in group">
                    <div
                        className="overflow-hidden rounded-2xl bg-dark-3 border border-white/5 mb-3 aspect-[3/4] group-hover:border-accent transition-all duration-300">
                        <img src="https://placehold.co/300x400/1f2937/6b7280?text=N.B" alt="Nagesh Babu"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <p className="font-semibold text-sm text-white">Nagesh Babu</p>
                    <p className="text-gray-400 text-xs mt-0.5">Director of Product Implementation</p>
                </div>

            </div>

        </div>
    </section>
    {/*  Team Section End  */}

    {/*  Team Gallery Section Start  */}
    <section className="section bg-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">
            {/*  Heading  */}
            <div className="mb-12 fade-in">
                <span className="text-accent text-sm font-semibold uppercase tracking-widest">The Team</span>
                <h2 className="section-title mt-2">The People Behind <span className="text-accent">the Work.</span></h2>
                <div className="accent-line"></div>
                <p className="text-gray-400 text-sm max-w-xl">
                    100+ engineers, designers, strategists, and problem-solvers — distributed across Bengaluru, Dubai,
                    and beyond.
                </p>
            </div>
        </div>

        {/*  Row 1: scroll right → left  */}
        <div className="relative overflow-hidden mb-4 max-w-7xl mx-auto px-6 lg:px-0">
            <div className="flex gap-4 team-scroll-ltr" style={{ width: 'max-content' }}>
                {/*  set 1  */}
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                {/*  duplicate for seamless loop  */}
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
            </div>
        </div>

        {/*  Row 2: scroll left → right  */}
        <div className="relative overflow-hidden max-w-7xl mx-auto px-6 lg:px-0">
            <div className="flex gap-4 team-scroll-rtl" style={{ width: 'max-content' }}>
                {/*  set 1  */}
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"><img
                        src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                {/*  duplicate for seamless loop  */}
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/111827/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
                <div className="w-44 h-52 rounded-2xl bg-dark-3 border border-white/5 overflow-hidden shrink-0"
                    aria-hidden="true"><img src="https://placehold.co/176x208/1f2937/6b7280?text=Member" alt=""
                        className="w-full h-full object-cover object-top" /></div>
            </div>
        </div>

    </section>
    {/*  Team Gallery Section End  */}

    {/*  Stats Banner Section Start  */}
    <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="fade-in">
                <p className="text-3xl sm:text-4xl font-extrabold text-white" data-target="10" data-suffix="+">0</p>
                <p className="text-white/70 mt-1 text-sm">Business Partner</p>
            </div>
            <div className="fade-in">
                <p className="text-3xl sm:text-4xl font-extrabold text-white" data-target="12" data-suffix="+">0</p>
                <p className="text-white/70 mt-1 text-sm">Award Wins</p>
            </div>
            <div className="fade-in">
                <p className="text-3xl sm:text-4xl font-extrabold text-white" data-target="600" data-suffix="+">0</p>
                <p className="text-white/70 mt-1 text-sm">Happy Clients</p>
            </div>
            <div className="fade-in">
                <p className="text-3xl sm:text-4xl font-extrabold text-white" data-target="3000" data-suffix="+">0</p>
                <p className="text-white/70 mt-1 text-sm">Project Completed</p>
            </div>
        </div>
    </section>
    {/*  Stats Banner Section End  */}

    {/*  Our Offices Section Start  */}
    <section className="section bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">

            {/*  Heading  */}
            <div className="text-center mb-12 fade-in">
                <span className="text-accent text-sm font-semibold uppercase tracking-widest">Where We Are</span>
                <h2 className="section-title mt-2">Our <span className="text-accent">Offices</span></h2>
                <div className="accent-line mx-auto"></div>
            </div>

            {/*  Office Cards  */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                {/*  USA  */}
                <div className="card fade-in group hover:border-accent cursor-pointer">
                    {/*  City illustration placeholder  */}
                    <div
                        className="w-full h-36 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 overflow-hidden group-hover:bg-primary/20 transition-colors duration-300">
                        <i
                            className="fa-solid fa-city text-5xl text-primary/40 group-hover:text-primary/60 transition-colors duration-300"></i>
                    </div>
                    <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">USA</p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        2710 Pace West Dr, Tucson<br />AZ 85730
                    </p>
                    <div className="flex items-center gap-4 text-gray-500 border-t border-white/10 pt-4">
                        <a href="#" className="hover:text-accent transition-colors" title="Location">
                            <i className="fa-solid fa-location-dot"></i>
                        </a>
                        <a href="tel:+11234567890" className="hover:text-accent transition-colors" title="Phone">
                            <i className="fa-solid fa-phone"></i>
                        </a>
                        <a href="mailto:usa@bababroker.com" className="hover:text-accent transition-colors" title="Email">
                            <i className="fa-solid fa-envelope"></i>
                        </a>
                    </div>
                </div>

                {/*  Australia  */}
                <div className="card fade-in group hover:border-accent cursor-pointer">
                    <div
                        className="w-full h-36 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 overflow-hidden group-hover:bg-primary/20 transition-colors duration-300">
                        <i
                            className="fa-solid fa-building text-5xl text-primary/40 group-hover:text-primary/60 transition-colors duration-300"></i>
                    </div>
                    <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">Australia</p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        21 Benalia Cres Marayong<br />2148
                    </p>
                    <div className="flex items-center gap-4 text-gray-500 border-t border-white/10 pt-4">
                        <a href="#" className="hover:text-accent transition-colors" title="Location">
                            <i className="fa-solid fa-location-dot"></i>
                        </a>
                        <a href="tel:+611234567890" className="hover:text-accent transition-colors" title="Phone">
                            <i className="fa-solid fa-phone"></i>
                        </a>
                        <a href="mailto:au@bababroker.com" className="hover:text-accent transition-colors" title="Email">
                            <i className="fa-solid fa-envelope"></i>
                        </a>
                    </div>
                </div>

                {/*  UK  */}
                <div className="card fade-in group hover:border-accent cursor-pointer">
                    <div
                        className="w-full h-36 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 overflow-hidden group-hover:bg-primary/20 transition-colors duration-300">
                        <i
                            className="fa-solid fa-landmark text-5xl text-primary/40 group-hover:text-primary/60 transition-colors duration-300"></i>
                    </div>
                    <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">UK</p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        18 Tuesday Market Place,<br />King's Lynn, Norfolk, PE30 1JW
                    </p>
                    <div className="flex items-center gap-4 text-gray-500 border-t border-white/10 pt-4">
                        <a href="#" className="hover:text-accent transition-colors" title="Location">
                            <i className="fa-solid fa-location-dot"></i>
                        </a>
                        <a href="tel:+441234567890" className="hover:text-accent transition-colors" title="Phone">
                            <i className="fa-solid fa-phone"></i>
                        </a>
                        <a href="mailto:uk@bababroker.com" className="hover:text-accent transition-colors" title="Email">
                            <i className="fa-solid fa-envelope"></i>
                        </a>
                    </div>
                </div>

                {/*  India  */}
                <div className="card fade-in group hover:border-accent cursor-pointer">
                    <div
                        className="w-full h-36 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5 overflow-hidden group-hover:bg-primary/20 transition-colors duration-300">
                        <i
                            className="fa-solid fa-archway text-5xl text-primary/40 group-hover:text-primary/60 transition-colors duration-300"></i>
                    </div>
                    <p className="text-accent text-xs font-bold uppercase tracking-widest mb-1">India</p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        Bawani Nagar, Jaipur,<br />Rajasthan
                    </p>
                    <div className="flex items-center gap-4 text-gray-500 border-t border-white/10 pt-4">
                        <a href="#" className="hover:text-accent transition-colors" title="Location">
                            <i className="fa-solid fa-location-dot"></i>
                        </a>
                        <a href="tel:+911234567890" className="hover:text-accent transition-colors" title="Phone">
                            <i className="fa-solid fa-phone"></i>
                        </a>
                        <a href="mailto:india@bababroker.com" className="hover:text-accent transition-colors" title="Email">
                            <i className="fa-solid fa-envelope"></i>
                        </a>
                    </div>
                </div>

            </div>
        </div>
    </section>
    {/*  Our Offices Section End  */}

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
