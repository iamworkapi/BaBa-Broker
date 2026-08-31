import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Phone, Mail, MapPin, Clock, ShieldCheck,
  Globe, Handshake, Briefcase, AlertTriangle, ChevronRight, Loader2, ArrowUpRight
} from "lucide-react";
import { api } from "../services/api";

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Properties", path: "/properties" },
  { name: "About Us", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const SERVICES = [
  "Residential Sales",
  "Commercial Leasing",
  "Asset Advisory",
  "Legal Compliance",
];

const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Compliance"];

const FEATURES = [
  { icon: Globe, title: "Global Reach", sub: "Cross-border deals" },
  { icon: ShieldCheck, title: "Bank-Grade Legal", sub: "Fully verified assets" },
  { icon: Handshake, title: "Zero Hidden Fees", sub: "100% transparent" },
  { icon: Briefcase, title: "Private Wealth", sub: "Dedicated advisors" },
];

const accent = "#f68122";

export default function Footer() {
  const [subEmail, setSubEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subStatus, setSubStatus] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subEmail)) {
      setSubStatus({ ok: false, msg: "Invalid email" });
      return;
    }
    setLoading(true);
    try {
      await api("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail.trim() }),
      });
      setSubStatus({ ok: true, msg: "Subscribed!" });
      setSubEmail("");
    } catch {
      setSubStatus({ ok: false, msg: "Failed" });
    } finally {
      setLoading(false);
      setTimeout(() => setSubStatus(null), 3000);
    }
  };

  return (
    <footer className="relative bg-[#020611] text-slate-300 font-sans text-sm select-none mt-16 overflow-hidden">

      {/* ── Newsletter Banner ── */}
      <div className="relative border-b border-slate-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-10%,rgba(246,129,34,0.10),transparent)]" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">Live</span>
              </div>
              <div>
                <h4 className="text-white font-bold text-base tracking-wide">
                  Join the Exclusive Investor Club
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Priority deal flow &amp; high-yield listings, straight to your inbox.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="flex items-center w-full lg:w-auto">
              <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-xl p-1 w-full lg:w-auto min-w-0 focus-within:border-orange-500/50 transition-colors">
                <input
                  type="email"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 text-sm text-white placeholder-slate-500 bg-transparent focus:outline-none min-w-0"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg px-5 py-2.5 text-sm font-bold text-slate-950 transition-all duration-200 shrink-0 flex items-center gap-2 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${accent}, #f59e0b)` }}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {subStatus && (
            <p className={`mt-3 text-xs font-semibold ${subStatus.ok ? "text-emerald-400" : "text-red-400"}`}>
              {subStatus.msg}
            </p>
          )}
        </div>
      </div>

      {/* ── Main Footer Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-10">

          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-4 space-y-5">
            <Link to="/" className="inline-block">
              <img
                src="assets/img/logo.svg"
                alt="Baba Broker"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Next-generation real estate marketplace simplifying high-ticket property acquisition, rentals, and portfolio management.
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <a href="tel:+919586505111" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all text-xs font-semibold">
                <Phone className="w-3.5 h-3.5" style={{ color: accent }} />
                +91 95865 05111
              </a>
              <a href="mailto:info@bababroker.com" className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:text-white hover:border-white/20 transition-all text-xs font-semibold">
                <Mail className="w-3.5 h-3.5" style={{ color: accent }} />
                info@bababroker.com
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 lg:col-span-2">
            <p className="text-[10px] font-extrabold tracking-[0.18em] text-white/50 uppercase mb-4">Platform</p>
            <ul className="space-y-3">
              {NAV_LINKS.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="h-[3px] w-0 group-hover:w-3 rounded-full transition-all duration-200" style={{ background: accent }} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1 lg:col-span-3">
            <p className="text-[10px] font-extrabold tracking-[0.18em] text-white/50 uppercase mb-4">Core Services</p>
            <ul className="space-y-3">
              {SERVICES.map((service) => (
                <li key={service} className="text-sm text-slate-400 flex items-center gap-2.5">
                  <span className="h-1 w-1 rounded-full shrink-0" style={{ background: accent }} />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* HQ Address */}
          <div className="col-span-2 lg:col-span-3">
            <p className="text-[10px] font-extrabold tracking-[0.18em] text-white/50 uppercase mb-4">Corporate HQ</p>
            <div className="space-y-3 text-sm text-slate-400">
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: accent }} />
                123 Property Lane, Financial District, New Delhi – 110059
              </p>
              <p className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 shrink-0" style={{ color: accent }} />
                Mon – Sat: 09:00 – 19:00 IST
              </p>
            </div>
          </div>
        </div>

        {/* Feature Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-slate-800 to-transparent" />

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {FEATURES.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="group flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/[0.07] hover:border-white/15 transition-all duration-300"
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: `${accent}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: accent }} />
              </div>
              <div className="min-w-0">
                <p className="text-white text-sm font-bold leading-tight group-hover:text-orange-300 transition-colors">
                  {title}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 rounded-2xl bg-amber-500/[0.04] border border-amber-500/10 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-500/80 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-amber-500/90 font-semibold">Disclaimer:</span> Real estate transactions involve inherent risks. Past returns are not indicative of future market yield. Conduct independent legal verification before investing.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-5 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Baba Broker Pvt Ltd. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 font-medium">
            {LEGAL_LINKS.map((link) => (
              <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
