import React, { useState } from "react";

export default function ContactUs() {
  const [activeBranch, setActiveBranch] = useState("delhi");
  const [selectedServices, setSelectedServices] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [formStatus, setFormStatus] = useState({ submitting: false, success: null, error: null });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full name is required.";
    if (!formData.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errors.email = "Enter a valid email address.";
    if (!formData.phone.trim()) errors.phone = "Phone number is required.";
    else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))) errors.phone = "Enter a valid 10-digit Indian mobile number.";
    if (!formData.message.trim()) errors.message = "Message is required.";
    else if (formData.message.trim().length < 10) errors.message = "Message must be at least 10 characters.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setFormStatus({ submitting: true, success: null, error: null });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, services: selectedServices }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setFormStatus({ submitting: false, success: "Your enquiry has been submitted! We'll get back to you shortly.", error: null });
      setFormData({ name: "", email: "", phone: "", message: "" });
      setSelectedServices([]);
    } catch (err) {
      setFormStatus({ submitting: false, success: null, error: err.message });
    }
  };

  const inputCls = (field) =>
    `w-full bg-transparent px-2 py-3.5 text-sm text-white focus:outline-none placeholder-gray-600 ${
      formErrors[field] ? "!border-red-500/60" : ""
    }`;

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service],
    );
  };

  const services = [
    { id: "buying", label: "Property Buying", icon: "fa-house" },
    { id: "selling", label: "Property Selling", icon: "fa-tag" },
    { id: "rental", label: "Rental Management", icon: "fa-key" },
    { id: "investment", label: "Investment Advisory", icon: "fa-chart-pie" },
  ];

  const branches = {
    delhi: {
      mapSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.241143203265!2d77.0610849150824!3d28.622533982421768!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d051abe653731%3A0xfed8dba69ec6b4da!2sTKNOCKS%20TECHNICAL%20SERVICES%20Pvt.LTD.!5e0!3m2!1sen!2sin!4v1670233249668!5m2!1sen!2sin",
      cityName: "Delhi",
      desc: "Baba Broker's Delhi office serves the NCR region with expert property consultants helping you buy, sell, and rent with complete transparency.",
      area: "Uttam Nagar, New Delhi",
      address: (
        <>
          F-47, 1st Floor, Milap Nagar,
          <br />
          Uttam Nagar, New Delhi – 110059
        </>
      ),
      phone: "+91 1800 000 000",
      email: "delhi@bababroker.com",
    },
    mumbai: {
      mapSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823277!2d72.74109995709657!3d19.08219783958221!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c6306644edc1%3A0x5da4ed8f8d648c69!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000",
      cityName: "Mumbai",
      desc: "Our Mumbai office covers Andheri, Bandra, Thane and Navi Mumbai — helping clients navigate one of India's most dynamic property markets.",
      area: "Andheri West, Mumbai",
      address: (
        <>
          Office 12, Sai Complex, Andheri West,
          <br />
          Mumbai – 400058
        </>
      ),
      phone: "+91 1800 000 001",
      email: "mumbai@bababroker.com",
    },
    bangalore: {
      mapSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d497698.99710191956!2d77.35074421903857!3d12.95428023956427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1700000000001",
      cityName: "Bangalore",
      desc: "Serving Whitefield, Koramangala, HSR Layout and Electronic City — Bangalore's top tech corridors for residential and commercial properties.",
      area: "Koramangala, Bangalore",
      address: (
        <>
          3rd Block, Koramangala,
          <br />
          Bangalore – 560034
        </>
      ),
      phone: "+91 1800 000 002",
      email: "bangalore@bababroker.com",
    },
    pune: {
      mapSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d242201.2435729849!2d73.72788787890625!3d18.524824!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf2e67461101%3A0x828d43bf9d9ee343!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000002",
      cityName: "Pune",
      desc: "Our Pune office covers Hinjewadi, Wakad, Baner and Kharadi — the fastest-growing IT and residential corridors in the city.",
      area: "Baner, Pune",
      address: (
        <>
          Office 5, Baner Road,
          <br />
          Pune – 411045
        </>
      ),
      phone: "+91 1800 000 003",
      email: "pune@bababroker.com",
    },
    hyderabad: {
      mapSrc:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243684.54913023758!2d78.24323145!3d17.412608699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000003",
      cityName: "Hyderabad",
      desc: "Covering HITEC City, Gachibowli, Kondapur and Jubilee Hills — Hyderabad's premium residential and commercial property zones.",
      area: "HITEC City, Hyderabad",
      address: (
        <>
          Plot 22, HITEC City,
          <br />
          Hyderabad – 500081
        </>
      ),
      phone: "+91 1800 000 004",
      email: "hyderabad@bababroker.com",
    },
  };

  return (
    <div className="bg-[#0b0f19] text-gray-100 min-h-screen font-sans selection:bg-accent selection:text-black overflow-x-hidden">
      {/* ==========================================================
          HERO SECTION (Structure Unaltered As Requested)
         ========================================================== */}
      <section
        id="home"
        className="contact-hero-section relative min-h-[75vh] flex items-center justify-center overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#0e1626] to-[#0b0f19]"
      >
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[150px] pointer-events-none"></div>

        {/* Top-left: Facebook */}
        <div className="ch-chip ch-chip--tl1 absolute">
          <a href="#">
            <span
              className="ch-chip-icon w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
              style={{ background: "#1877f2" }}
            >
              <i className="fa-brands fa-facebook-f"></i>
            </span>
          </a>
        </div>

        {/* Left: Phone 1 */}
        <div className="ch-chip ch-chip--ml1 absolute">
          <a
            href="tel:+919005050533"
            className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all group shadow-xl"
          >
            <span
              className="ch-chip-icon w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ background: "#333" }}
            >
              <i className="fa-solid fa-phone text-xs"></i>
            </span>
            <span className="ch-chip-text text-sm font-medium tracking-wide group-hover:text-accent transition-colors">
              +91 90050 50533
            </span>
          </a>
        </div>

        {/* Left: WhatsApp */}
        <div className="ch-chip ch-chip--bl1 absolute">
          <a
            href="#"
            className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all group shadow-xl"
          >
            <span
              className="ch-chip-icon w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ background: "#25d366" }}
            >
              <i className="fa-brands fa-whatsapp text-sm"></i>
            </span>
            <span className="ch-chip-text text-sm font-medium tracking-wide group-hover:text-accent transition-colors">
              +91 95865 05111
            </span>
          </a>
        </div>

        {/* Top-right: Pinterest */}
        <div className="ch-chip ch-chip--tr1 absolute">
          <a href="#">
            <span
              className="ch-chip-icon w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
              style={{ background: "#e60023" }}
            >
              <i className="fa-brands fa-pinterest-p"></i>
            </span>
          </a>
        </div>

        {/* Right: Email 1 */}
        <div className="ch-chip ch-chip--mr1 absolute">
          <a
            href="mailto:sales@bababroker.com"
            className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all group shadow-xl"
          >
            <span
              className="ch-chip-icon w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ background: "#333" }}
            >
              <i className="fa-solid fa-envelope text-xs"></i>
            </span>
            <span className="ch-chip-text text-sm font-medium tracking-wide group-hover:text-accent transition-colors">
              sales@bababroker.com
            </span>
          </a>
        </div>

        {/* Right: Email 2 */}
        <div className="ch-chip ch-chip--br1 absolute">
          <a
            href="mailto:info@bababroker.com"
            className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-all group shadow-xl"
          >
            <span
              className="ch-chip-icon w-8 h-8 rounded-full flex items-center justify-center text-white"
              style={{ background: "#333" }}
            >
              <i className="fa-solid fa-envelope text-xs"></i>
            </span>
            <span className="ch-chip-text text-sm font-medium tracking-wide group-hover:text-accent transition-colors">
              info@bababroker.com
            </span>
          </a>
        </div>

        {/* Mid-left: X / Twitter */}
        <div className="ch-chip ch-chip--x absolute">
          <a href="#">
            <span
              className="ch-chip-icon w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
              style={{ background: "#000" }}
            >
              <i className="fa-brands fa-x-twitter text-xs"></i>
            </span>
          </a>
        </div>

        {/* Mid-right: LinkedIn */}
        <div className="ch-chip ch-chip--li absolute">
          <a href="#">
            <span
              className="ch-chip-icon w-9 h-9 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-110"
              style={{ background: "#0a66c2" }}
            >
              <i className="fa-brands fa-linkedin-in text-xs"></i>
            </span>
          </a>
        </div>

        {/* Center content */}
        <div className="ch-center text-center max-w-2xl px-6 z-10 relative">
          <h1 className="ch-title text-4xl sm:text-6xl font-black text-white tracking-tight leading-none mb-4 uppercase">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-400">
              us
            </span>
          </h1>
          <div className="ch-dot-icon my-4 text-accent/80 animate-pulse text-lg">
            <i className="fa-regular fa-circle-dot"></i>
          </div>
          <p className="ch-sub text-gray-400 text-base sm:text-lg leading-relaxed font-light">
            Let's talk about your next property. Submit your request via the
            contact form and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* ==========================================================
          SECTION 1: THE CONTACT FORM HUB (Dedicated Full-Width)
         ========================================================== */}
      <section className="py-24 relative bg-[#0b0f19]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="text-center mb-10">
              <span className="text-xs font-bold text-accent tracking-widest uppercase bg-accent/10 px-3 py-1 rounded-md">
                Consultation Portal
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-4 tracking-tight">
                Apply for a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-300">
                  Free Expert Session
                </span>
              </h2>
              <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
                Submit your criteria to map your goals directly with our premium
                property advisory desk.
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Form Inputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="relative group/input">
                  <label className="text-xs text-gray-400 font-medium block mb-1.5 ml-1">
                    Full Name
                  </label>
                  <div className="flex rounded-xl bg-[#111726] border border-white/10 focus-within:border-accent/50 transition-all items-center">
                    <span className="pl-4 pr-2 text-gray-500 group-focus-within/input:text-accent transition-colors">
                      <i className="fa-solid fa-user text-sm"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="John Doe"
                      className={inputCls("name")}
                      value={formData.name}
                      onChange={(e) => updateField("name", e.target.value)}
                    />
                    {formErrors.name && (
                      <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.name}</p>
                    )}
                  </div>
                </div>
                <div className="relative group/input">
                  <label className="text-xs text-gray-400 font-medium block mb-1.5 ml-1">
                    Email Address
                  </label>
                  <div className="flex rounded-xl bg-[#111726] border border-white/10 focus-within:border-accent/50 transition-all items-center">
                    <span className="pl-4 pr-2 text-gray-500 group-focus-within/input:text-accent transition-colors">
                      <i className="fa-solid fa-envelope text-sm"></i>
                    </span>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className={inputCls("email")}
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                    {formErrors.email && (
                      <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative group/input">
                <label className="text-xs text-gray-400 font-medium block mb-1.5 ml-1">
                  Phone Number
                </label>
                <div className="flex rounded-xl bg-[#111726] border border-white/10 focus-within:border-accent/50 transition-all items-center">
                  <span className="pl-4 pr-2 text-gray-500 group-focus-within/input:text-accent transition-colors">
                    <i className="fa-solid fa-phone text-sm"></i>
                  </span>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className={inputCls("phone")}
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                  {formErrors.phone && (
                    <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.phone}</p>
                  )}
                </div>
              </div>

              {/* Tailored Service Selection */}
              <div>
                <label className="text-xs text-gray-400 font-medium block mb-2.5 ml-1">
                  Select Required Services
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {services.map((svc) => {
                    const isSelected = selectedServices.includes(svc.id);
                    return (
                      <button
                        key={svc.id}
                        type="button"
                        onClick={() => toggleService(svc.id)}
                        className={`p-3.5 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? "bg-accent/10 border-accent text-accent shadow-lg shadow-accent/5 scale-[1.02]"
                            : "bg-[#111726] border-white/5 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <i
                          className={`fa-solid ${svc.icon} text-base ${isSelected ? "text-accent" : "text-gray-500"}`}
                        ></i>
                        <span className="text-center tracking-tight">
                          {svc.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative group/input">
                <label className="text-xs text-gray-400 font-medium block mb-1.5 ml-1">
                  Detailed Message
                </label>
                <div className="flex rounded-xl bg-[#111726] border border-white/10 focus-within:border-accent/50 transition-all items-start pt-2">
                  <span className="pl-4 pr-2 text-gray-500 pt-1.5 group-focus-within/input:text-accent transition-colors">
                    <i className="fa-solid fa-comment text-sm"></i>
                  </span>
                  <textarea
                    rows="4"
                    placeholder="Share specific details about target localites, space requirements, or investment timelines..."
                    className={inputCls("message")}
                    value={formData.message}
                    onChange={(e) => updateField("message", e.target.value)}
                  ></textarea>
                  {formErrors.message && (
                    <p className="text-red-400 text-xs mt-1 ml-1">{formErrors.message}</p>
                  )}
                </div>
              </div>

              {formStatus.success && (
                <div className="text-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl px-4 py-3 text-sm font-medium">
                  {formStatus.success}
                </div>
              )}
              {formStatus.error && (
                <div className="text-center bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm font-medium">
                  {formStatus.error}
                </div>
              )}
              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  disabled={formStatus.submitting}
                  className="w-full sm:w-auto px-12 py-4 rounded-xl bg-gradient-to-r from-accent to-amber-400 hover:from-accent hover:to-amber-500 text-black font-extrabold text-xs tracking-widest uppercase transition-all duration-300 shadow-xl shadow-accent/10 hover:shadow-accent/20 flex items-center justify-center gap-3 group/btn cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {formStatus.submitting ? (
                    <span className="inline-flex items-center gap-2"><span className="animate-spin h-4 w-4 border-2 border-black border-t-transparent rounded-full"></span>Sending…</span>
                  ) : (
                    <>Send Request <i className="fa-solid fa-paper-plane text-xs transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5"></i></>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ==========================================================
          SECTION 2: PREMIUM BLOG GRID GALLERY (Dedicated Full-Width)
         ========================================================== */}
      <section className="py-24 bg-gradient-to-b from-[#0b0f19] to-[#070a12] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <small className="text-accent uppercase tracking-widest font-bold text-xs bg-accent/10 px-3 py-1 rounded-md">
              Industry Intel
            </small>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-4 tracking-tight">
              LATEST EDITIONS & MARKET INSIGHTS
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">
              Stay optimized with property evaluations, regulatory developments,
              and localized asset ROI patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                date: "15 Jan 2026",
                title: "Top 5 Localities to Invest in Real Estate This Year",
                excerpt:
                  "Discover the fastest-growing neighbourhoods offering the best ROI for property investors in 2026.",
                img: "./assets/img/blog1.webp",
                tag: "Investment",
              },
              {
                date: "02 Feb 2026",
                title: "First-Time Buyer's Guide: What You Must Know",
                excerpt:
                  "Buying your first home can be overwhelming. Here's a step-by-step guide to make it stress-free.",
                img: "./assets/img/blog2.webp",
                tag: "Guides",
              },
              {
                date: "10 Mar 2026",
                title: "How to Get the Best Price When Selling Your Property",
                excerpt:
                  "Expert tips on staging, pricing, and marketing your property to attract serious buyers fast.",
                img: "./assets/img/blog3.webp",
                tag: "Sales",
              },
              {
                date: "18 Mar 2026",
                title: "Understanding RERA: Rights Every Property Buyer Has",
                excerpt:
                  "RERA protects homebuyers from fraud and delays. Know your rights before signing any agreement.",
                img: "./assets/img/blog4.webp",
                tag: "Compliance",
              },
            ].map((blog, idx) => (
              <div
                key={idx}
                className="bg-[#111726]/40 hover:bg-[#111726] border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between group/blog shadow-lg hover:-translate-y-1"
              >
                <div>
                  <div className="relative overflow-hidden aspect-[16/10] bg-[#111726]">
                    <img
                      src={blog.img}
                      alt={blog.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover/blog:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="text-[10px] bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-white font-semibold">
                        {blog.date}
                      </span>
                      <span className="text-[10px] bg-accent text-black px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        {blog.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-base text-white line-clamp-2 leading-snug group-hover/blog:text-accent transition-colors">
                      {blog.title}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-3 mt-2 font-light leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-white/5 pt-3 px-5 pb-5">
                  <a
                    href="#"
                    className="text-accent font-semibold inline-flex items-center gap-1 group/link"
                  >
                    Read Insight{" "}
                    <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover/link:translate-x-0.5"></i>
                  </a>
                  <span className="text-gray-500 font-medium">By Admin</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==========================================================
          SECTION 3: HEADQUARTERS & GEOLOCATION HUBS
         ========================================================== */}
      <section className="py-24 relative bg-[#070a12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-accent text-xs font-bold uppercase tracking-widest bg-accent/10 px-2.5 py-1 rounded">
                Corporate Footprint
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-3 tracking-tight">
                Our Operational{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-300">
                  HQ Hubs
                </span>
              </h2>
            </div>
            <p className="text-gray-400 text-sm max-w-sm font-light">
              Premium spatial consultation capabilities deployed actively across
              India’s primary growth networks.
            </p>
          </div>

          {/* Tab Engine Controller */}
          <div className="flex flex-wrap items-center justify-start gap-2 bg-white/[0.02] p-2 rounded-2xl border border-white/5 mb-8 max-w-3xl mx-auto">
            {Object.keys(branches).map((key) => (
              <button
                key={key}
                className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                  activeBranch === key
                    ? "bg-gradient-to-r from-accent to-amber-400 text-black shadow-lg shadow-accent/10"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => setActiveBranch(key)}
              >
                {branches[key].cityName}
              </button>
            ))}
          </div>

          {/* Data Content Board */}
          <div className="bg-[#111726]/40 border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              <div className="lg:col-span-7 h-[350px] sm:h-[450px] rounded-2xl overflow-hidden border border-white/5 shadow-inner">
                <iframe
                  src={branches[activeBranch].mapSrc}
                  width="100%"
                  height="100%"
                  style={{
                    border: "0",
                    filter:
                      "grayscale(0.3) contrast(1.1) invert(0.9) hue-rotate(180deg)",
                  }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${branches[activeBranch].cityName} map system`}
                  className="w-full h-full"
                />
              </div>

              <div className="lg:col-span-5 flex flex-col justify-between py-2 px-2">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-2 h-2 rounded-full bg-accent animate-ping"></span>
                    <h4 className="text-2xl font-black text-white tracking-tight">
                      Regional HQ:{" "}
                      <span className="text-accent">
                        {branches[activeBranch].cityName}
                      </span>
                    </h4>
                  </div>
                  <p className="text-gray-400 text-sm mb-6 leading-relaxed font-light">
                    {branches[activeBranch].desc}
                  </p>

                  <div className="bg-[#0b0f19]/80 border border-white/5 p-5 rounded-2xl space-y-4 shadow-xl">
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0 mt-0.5">
                        <i className="fa-solid fa-location-dot text-sm"></i>
                      </div>
                      <div>
                        <h5 className="font-bold text-white text-sm tracking-wide">
                          {branches[activeBranch].area}
                        </h5>
                        <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                          {branches[activeBranch].address}
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-white/5"></div>

                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                        <i className="fa-solid fa-phone text-sm"></i>
                      </div>
                      <div>
                        <a
                          href={`tel:${branches[activeBranch].phone.replace(/\s+/g, "")}`}
                          className="text-white font-semibold text-sm hover:text-accent transition-colors tracking-wide"
                        >
                          {branches[activeBranch].phone}
                        </a>
                        <p className="text-[10px] text-gray-500 uppercase font-medium tracking-widest mt-0.5">
                          Toll Free
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-white/5"></div>

                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                        <i className="fa-solid fa-envelope text-sm"></i>
                      </div>
                      <div>
                        <a
                          href={`mailto:${branches[activeBranch].email}`}
                          className="text-white font-semibold text-sm hover:text-accent transition-colors tracking-wide break-all"
                        >
                          {branches[activeBranch].email}
                        </a>
                        <p className="text-[10px] text-gray-500 uppercase font-medium tracking-widest mt-0.5">
                          Official Mail Desk
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <a
                    href="#home"
                    className="w-full text-center inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/10 hover:border-accent/40 bg-white/[0.02] hover:bg-accent/5 text-white hover:text-accent text-sm font-bold tracking-wide transition-all duration-300 group/btn shadow-md"
                  >
                    Initiate Portal Enquiry{" "}
                    <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover/btn:translate-x-1"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
