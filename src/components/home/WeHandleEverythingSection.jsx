import React from "react";
import { Link } from "react-router-dom";

import ScrollReveal from "../ScrollReveal";

const services = [
  {
    icon: "fa-house-circle-check",
    title: "Verified Listings",
    subtitle: "RERA, ownership and site checks",
    description:
      "Every property on Baba Broker is physically verified and legally checked before listing, so you can decide with fewer surprises.",
    points: [
      "RERA registration verified",
      "Title deed & ownership check",
      "Encumbrance certificate",
      "Site visit confirmation",
    ],
  },
  {
    icon: "fa-file-contract",
    title: "Legal & Documentation",
    subtitle: "Clear paperwork and registration support",
    description:
      "Our legal team handles important paperwork from agreement drafting to property registration seamlessly.",
    points: [
      "Sale agreement drafting",
      "Property registration support",
      "Stamp duty guidance",
      "Power of attorney",
    ],
  },
  {
    icon: "fa-users",
    title: "Buyer Onboarding",
    subtitle: "Visits, loans and handover guidance",
    description:
      "We handle the buyer journey from the first enquiry and site visit through loan assistance and final handover.",
    points: [
      "Dedicated relationship manager",
      "Scheduled site visits",
      "Home loan assistance",
      "Post-purchase support",
    ],
  },
  {
    icon: "fa-chart-pie",
    title: "Investment Advisory",
    subtitle: "Local insight and ROI planning",
    description:
      "Our advisors analyse market trends, locality growth and rental yields to help identify suitable opportunities.",
    points: [
      "Market trend analysis",
      "Rental yield projections",
      "Portfolio diversification",
      "Exit strategy planning",
    ],
  },
  {
    icon: "fa-key",
    title: "Rental Management",
    subtitle: "Tenants, rent and maintenance support",
    description:
      "We manage the operational side of your rental property so ownership stays simpler and profitable.",
    points: [
      "Tenant screening & KYC",
      "Rent agreement drafting",
      "Monthly rent collection",
      "Maintenance coordination",
    ],
  },
  {
    icon: "fa-headset",
    title: "Always-On Support",
    subtitle: "Phone, WhatsApp and follow-up help",
    description:
      "Our support team is available by phone, WhatsApp and email throughout your entire property journey.",
    points: [
      "Phone & WhatsApp support",
      "Dedicated account manager",
      "Live chat assistance",
      "After-sales follow-up",
    ],
  },
];

const processSteps = [
  { number: "01", title: "Discover" },
  { number: "02", title: "Verify" },
  { number: "03", title: "Secure" },
  { number: "04", title: "Manage" },
];

export default function WeHandleEverythingSection() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#0a0a0e] px-6 py-20 sm:py-28 antialiased"
    >
      {/* Premium Top-Left Ambient Backdrop Glow */}
      <div className="absolute -left-36 -top-36 h-[550px] w-[550px] rounded-full bg-[#f68122]/15 blur-[140px] mix-blend-screen pointer-events-none"></div>

      {/* Premium Top-Center Ambient Backdrop Glow */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-orange-500/10 blur-[150px] mix-blend-screen pointer-events-none"></div>

      {/* Premium Bottom-Right Deep Blue Ambient Glow */}
      <div className="absolute -right-44 -bottom-44 h-[650px] w-[650px] rounded-full bg-blue-600/10 blur-[160px] mix-blend-screen pointer-events-none"></div>

      <div className="relative mx-auto max-w-7xl z-10">
        <ScrollReveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-16 border-b border-white/5 pb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f68122]/30 bg-[#f68122]/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#f68122] shadow-[0_0_15px_rgba(246,129,34,0.1)]">
              <i className="fa-solid fa-circle-check"></i> Complete Real Estate
              Platform
            </div>
            <h2 className="mt-6 text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-5xl">
              Everything your property <br className="hidden sm:block" />
              journey{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f68122] to-orange-400">
                actually needs.
              </span>
            </h2>
          </div>
          <div className="max-w-md">
            <p className="text-base leading-relaxed text-gray-400 mb-6">
              Search, evaluate, document, and manage your property with a
              single, dependable team of experts standing beside you at every
              step.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#0a0a0e] transition-all duration-300 hover:bg-[#f68122] hover:text-white hover:shadow-[0_0_20px_rgba(246,129,34,0.4)]"
            >
              Speak with an advisor
              <i className="fa-solid fa-arrow-right -rotate-45 transition-transform duration-300 group-hover:rotate-0"></i>
            </Link>
          </div>
        </div>

        {/* Process Bar (Sleek Inline Flow) */}
        <div className="mb-12 flex flex-wrap items-center justify-center gap-3 sm:gap-6 rounded-2xl border border-white/5 bg-[#161622]/50 backdrop-blur-md p-4 sm:p-6 shadow-2xl w-max mx-auto">
          {processSteps.map((step, index) => (
            <React.Fragment key={step.title}>
              <div className="flex items-center gap-3 group">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f68122]/10 text-[10px] font-black text-[#f68122] ring-1 ring-[#f68122]/30 group-hover:bg-[#f68122] group-hover:text-white transition-all duration-300">
                  {step.number}
                </span>
                <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors duration-300">
                  {step.title}
                </span>
              </div>
              {/* Connector line (hide on last item) */}
              {index !== processSteps.length - 1 && (
                <div className="hidden sm:block h-px w-8 sm:w-12 bg-white/10"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* High-End Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/5 bg-[#12121a] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-[#f68122]/40 hover:shadow-[0_20px_40px_-15px_rgba(246,129,34,0.15)]"
            >
              {/* Massive Watermark Number */}
              <span className="pointer-events-none absolute -right-2 -top-4 text-[8rem] font-black leading-none text-white/[0.02] transition-colors duration-500 group-hover:text-[#f68122]/[0.05]">
                0{index + 1}
              </span>

              {/* Icon & Title */}
              <div className="relative z-10 mb-6 flex items-center gap-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1a1a24] to-[#0f0f15] border border-white/10 text-xl text-[#f68122] shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:border-[#f68122]/30 group-hover:shadow-[0_0_20px_rgba(246,129,34,0.2)]">
                  <i className={`fa-solid ${service.icon}`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {service.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#f68122]">
                    {service.subtitle}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="relative z-10 text-sm leading-relaxed text-gray-400 mb-8 min-h-[60px]">
                {service.description}
              </p>

              {/* Divider */}
              <div className="mb-6 h-px w-full bg-gradient-to-r from-white/10 to-transparent"></div>

              {/* Premium Checklist */}
              <ul className="relative z-10 flex flex-col gap-3.5 flex-1 justify-end">
                {service.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-sm font-medium text-gray-300"
                  >
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#f68122]/10 text-[8px] text-[#f68122]">
                      <i className="fa-solid fa-check"></i>
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
