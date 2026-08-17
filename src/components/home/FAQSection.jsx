import React, { useState } from "react";

const faqs = [
  {
    question: "Which area is best for property investment in Delhi NCR?",
    answer:
      "Areas like Dwarka, Noida Expressway, and Greater Noida West offer excellent ROI with upcoming infrastructure projects and affordable pricing compared to central Delhi.",
  },
  {
    question: "How does Baba Broker verify property listings?",
    answer:
      "Every listing on Baba Broker is verified by our in-house legal team. We check RERA registration, title deeds, encumbrance certificates, and ownership documents before listing.",
  },
  {
    question: "What is the process to buy a property through Baba Broker?",
    answer:
      "Simply browse our listings, shortlist properties, schedule a site visit with our agent, and we'll guide you through the entire process — from negotiation to registration — at zero brokerage.",
  },
  {
    question: "Does Baba Broker charge any brokerage fees?",
    answer:
      "No. Baba Broker operates on a zero-brokerage model for buyers and tenants. Our services are completely free for property seekers — no hidden charges whatsoever.",
  },
  {
    question: "Which cities does Baba Broker operate in?",
    answer:
      "We currently operate in Delhi NCR, Mumbai, Bangalore, Pune, and Hyderabad — with plans to expand to Chennai, Kolkata, and Ahmedabad in 2026.",
  },
];

const FAQSection = () => {
  // State to track which FAQ is open. Defaulting to the first one (index 0).
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    // If clicking the already open FAQ, close it. Otherwise, open the new one.
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative bg-[#0f0f15] py-20 sm:py-32 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/4 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f68122] opacity-[0.03] blur-[120px]"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-20 items-start">
          {/* Left Column: Sticky VIP Concierge CTA */}
          <div className="lg:sticky lg:top-24 relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#161622]/80 backdrop-blur-xl p-8 sm:p-12 shadow-2xl">
            {/* Card internal glow */}
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#f68122] opacity-10 blur-[80px]"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f68122]/30 bg-[#f68122]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#f68122] mb-6 shadow-sm">
                <i className="fa-solid fa-headset"></i> Support
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white leading-[1.15] tracking-tight mb-4">
                Your Dream Home Is Just A <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f68122] to-orange-400">
                  Call Away.
                </span>
              </h2>

              <p className="text-sm leading-relaxed text-gray-400 mb-8 max-w-md">
                As the most trusted real estate brokers in India, we are here to
                help you find the perfect property that matches your exact
                budget and lifestyle.
              </p>

              <div className="space-y-4 mb-10">
                <a
                  href="tel:+911800000000"
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 transition-all hover:bg-white/10 hover:border-white/10"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/30 text-[#f68122] group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-phone-volume"></i>
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Toll Free
                    </p>
                    <p className="text-lg font-black text-white">
                      +91 1800 000 000
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:info@bababroker.com"
                  className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 transition-all hover:bg-white/10 hover:border-white/10"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/30 text-[#f68122] group-hover:scale-110 transition-transform">
                    <i className="fa-solid fa-envelope-open-text"></i>
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Email Us
                    </p>
                    <p className="text-base font-bold text-white">
                      info@bababroker.com
                    </p>
                  </div>
                </a>
              </div>

              <a
                href="/contact-us"
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#f68122] to-orange-500 px-8 py-4 text-sm font-black text-white shadow-[0_10px_30px_rgba(246,129,34,0.3)] transition-all duration-300 hover:shadow-[0_15px_40px_rgba(246,129,34,0.5)] hover:scale-[1.02]"
              >
                Contact Advisors{" "}
                <i className="fa-solid fa-arrow-right -rotate-45 transition-transform duration-300 group-hover:rotate-0"></i>
              </a>
            </div>
          </div>

          {/* Right Column: Accordion FAQs */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-8 flex items-center gap-3">
              Frequently Asked <span className="text-[#f68122]">Questions</span>
            </h3>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;

                return (
                  <div
                    key={index}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? "bg-[#161622] border-[#f68122]/40 shadow-[0_10px_30px_rgba(246,129,34,0.1)]"
                        : "bg-[#12121a] border-white/5 hover:border-white/10"
                    }`}
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex w-full items-center justify-between gap-4 p-6 text-left transition-colors"
                    >
                      <span
                        className={`font-bold text-sm sm:text-base pr-4 transition-colors ${isOpen ? "text-[#f68122]" : "text-gray-200"}`}
                      >
                        {faq.question}
                      </span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "border-[#f68122] bg-[#f68122] text-white rotate-180"
                            : "border-white/10 bg-black/20 text-gray-500"
                        }`}
                      >
                        <i className="fa-solid fa-chevron-down text-xs"></i>
                      </span>
                    </button>

                    {/* CSS Grid technique for smooth height animation */}
                    <div
                      className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-6 pb-6 pt-0 text-sm leading-relaxed text-gray-400">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
