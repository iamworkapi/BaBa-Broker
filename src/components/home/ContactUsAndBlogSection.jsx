
const ContactUsAndBlogSection = () => {
  return (
    <>
      {/* Contact us and Blog Section Start */}
      <section className="relative py-20 bg-[#071426] text-white overflow-hidden">
        {/* Background Ambient Glow matching the design system */}
        <div className="pointer-events-none absolute -top-20 left-1/4 h-[300px] w-[600px] rounded-full bg-[#f68122] opacity-[0.02] blur-[140px]"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* LEFT: Contact Form Card */}
            <div className="bg-[#0b1f3e]/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-xl relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f68122]/5 rounded-bl-full pointer-events-none"></div>

              <div className="mb-6">
                <span className="text-[#f68122] font-bold text-xs uppercase tracking-widest bg-[#f68122]/10 px-3 py-1 rounded-full border border-[#f68122]/20">
                  Get In Touch
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                  Contact <span className="text-[#f68122]">Us</span>
                </h2>
                <p className="text-[#f68122] font-semibold text-sm mt-1">
                  Apply to get a call for solution
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  Submit the form to connect with our property expert —
                  completely free.
                </p>
              </div>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:border-[#f68122]/60 transition-colors bg-[#071426]">
                  <span className="bg-[#0b1f3e] px-4 flex items-center justify-center shrink-0 border-r border-white/10 text-[#f68122]">
                    <i className="fa-solid fa-user"></i>
                  </span>
                  <input
                    type="text"
                    placeholder="Your Name"
                    aria-label="Your Name"
                    className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none placeholder-gray-500 text-white min-w-0"
                  />
                </div>

                <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:border-[#f68122]/60 transition-colors bg-[#071426]">
                  <span className="bg-[#0b1f3e] px-4 flex items-center justify-center shrink-0 border-r border-white/10 text-[#f68122]">
                    <i className="fa-solid fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    placeholder="Your Email"
                    aria-label="Your Email"
                    className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none placeholder-gray-500 text-white min-w-0"
                  />
                </div>

                <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:border-[#f68122]/60 transition-colors bg-[#071426]">
                  <span className="bg-[#0b1f3e] px-4 flex items-center justify-center shrink-0 border-r border-white/10 text-[#f68122]">
                    <i className="fa-solid fa-phone"></i>
                  </span>
                  <input
                    type="tel"
                    placeholder="Your Phone Number"
                    aria-label="Your Phone Number"
                    className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none placeholder-gray-500 text-white min-w-0"
                  />
                </div>

                <div className="pt-2">
                  <h6 className="font-bold text-xs uppercase tracking-wider text-gray-300 mb-3">
                    What Can We Do For You?
                  </h6>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { icon: "fa-house", label: "Property Buying" },
                      { icon: "fa-tag", label: "Property Selling" },
                      { icon: "fa-key", label: "Rental Management" },
                      { icon: "fa-chart-pie", label: "Investment Advisory" },
                    ].map((service, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#071426] border border-white/10 hover:border-[#f68122]/50 hover:bg-[#0b1f3e] transition-all text-gray-300 hover:text-white group"
                      >
                        <i
                          className={`fa-solid ${service.icon} text-[#f68122] group-hover:scale-110 transition-transform`}
                        ></i>
                        <span>{service.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex rounded-xl overflow-hidden border border-white/10 focus-within:border-[#f68122]/60 transition-colors bg-[#071426]">
                  <span className="bg-[#0b1f3e] px-4 flex items-start justify-center pt-3.5 shrink-0 border-r border-white/10 text-[#f68122]">
                    <i className="fa-solid fa-comment"></i>
                  </span>
                  <textarea
                    rows="3"
                    placeholder="Your Message"
                    aria-label="Your Message"
                    className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none placeholder-gray-500 text-white resize-none min-w-0"
                  ></textarea>
                </div>

                <div className="pt-2 text-center sm:text-right">
                  <button
                    type="submit"
                    className="w-full sm:w-auto rounded-full bg-[#f68122] hover:bg-orange-600 px-8 py-3 text-xs font-black uppercase tracking-wider text-white shadow-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto sm:ml-auto sm:mr-0"
                  >
                    <span>Submit Request</span>
                    <i className="fa-solid fa-paper-plane text-xs"></i>
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT: Blog Section */}
            <div>
              <div className="mb-6 text-center lg:text-left">
                <span className="text-[#f68122] uppercase tracking-widest font-bold text-xs bg-[#f68122]/10 px-3 py-1 rounded-full border border-[#f68122]/20">
                  Our Journal
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                  LATEST BLOGS
                </h2>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  Stay updated with real estate trends, tips, and market
                  insights.
                </p>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:h-[510px] overflow-y-auto pr-0 sm:pr-2"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "#0b1f3e #071426",
                }}
              >
                {[
                  {
                    img: "./assets/img/blog1.webp",
                    date: "15 Jan 2026",
                    title:
                      "Top 5 Localities to Invest in Real Estate This Year",
                    desc: "Discover the fastest-growing neighbourhoods offering the best ROI for property investors in 2026.",
                  },
                  {
                    img: "./assets/img/blog2.webp",
                    date: "02 Feb 2026",
                    title: "First-Time Buyer's Guide: What You Must Know",
                    desc: "Buying your first home can be overwhelming. Here's a step-by-step guide to make it stress-free.",
                  },
                  {
                    img: "./assets/img/blog3.webp",
                    date: "10 Mar 2026",
                    title:
                      "How to Get the Best Price When Selling Your Property",
                    desc: "Expert tips on staging, pricing, and marketing your property to attract serious buyers fast.",
                  },
                  {
                    img: "./assets/img/blog4.webp",
                    date: "18 Mar 2026",
                    title:
                      "Understanding RERA: Rights Every Property Buyer Has",
                    desc: "RERA protects homebuyers from fraud and delays. Know your rights before signing any agreement.",
                  },
                ].map((blog, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0b1f3e]/60 border border-white/5 hover:border-[#f68122]/40 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-lg group backdrop-blur-sm"
                  >
                    <div className="relative overflow-hidden h-36 bg-[#071426]">
                      <img
                        src={blog.img}
                        alt={blog.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      />
                      <span className="absolute bottom-2.5 left-2.5 bg-[#071426]/90 backdrop-blur-md text-[#f68122] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md border border-white/10 shadow-md">
                        {blog.date}
                      </span>
                    </div>
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <h6 className="font-bold text-xs sm:text-sm mb-1.5 leading-snug text-white group-hover:text-[#f68122] transition-colors line-clamp-2">
                          {blog.title}
                        </h6>
                        <p className="text-gray-400 text-[11px] leading-relaxed mb-3 line-clamp-2">
                          {blog.desc}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[11px] border-t border-white/10 pt-2.5">
                        <a
                          href="#"
                          className="text-[#f68122] font-bold hover:underline flex items-center gap-1"
                        >
                          <span>Read More</span>{" "}
                          <i className="fa-solid fa-arrow-right text-[9px]"></i>
                        </a>
                        <span className="text-gray-500 italic">By Admin</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Contact us and Blog Section End */}
    </>
  );
};

export default ContactUsAndBlogSection;
