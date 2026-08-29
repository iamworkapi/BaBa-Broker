import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Send, Phone, Mail, MapPin, Clock, ShieldCheck,
  Globe, Handshake, Briefcase, AlertTriangle, ChevronRight, Loader2, ArrowUpRight
} from "lucide-react";
import { api } from "../services/api";

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
    <footer className="relative bg-[#020611] text-slate-300 font-sans text-sm border-t border-slate-800/80 overflow-hidden select-none mt-12">
      {/* Background Mesh Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(246,129,34,0.12),rgba(255,255,255,0))]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-8 space-y-8">

        {/* Top Bar: Live Stats + Newsletter Banner */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md flex flex-col lg:flex-row items-center justify-between gap-5 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2 overflow-hidden hidden sm:flex">
              <span className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-slate-800 text-xs font-bold text-slate-300 text-center leading-8">15k+</span>
              <span className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-900 bg-[#f68122]/20 text-[#f68122] text-xs font-bold text-center leading-8">★</span>
            </div>
            <div>
              <h4 className="text-white font-bold text-base tracking-wide flex items-center gap-2">
                Join Exclusive Investor Club
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Get priority deal flow & high-yield listings.</p>
            </div>
          </div>

          {/* Inline Email Form */}
          <form onSubmit={handleSubscribe} className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1.5 w-full lg:w-auto min-w-[360px] focus-within:border-[#f68122]/50 transition-colors">
            <input
              type="email"
              value={subEmail}
              onChange={(e) => setSubEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm text-white placeholder-slate-500 bg-transparent focus:outline-none min-w-0"
            />
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-[#f68122] hover:bg-[#e06d12] px-5 py-2 text-xs sm:text-sm font-bold text-white transition-all duration-200 shrink-0 flex items-center gap-2 shadow-md shadow-[#f68122]/20"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Navigation & Brand Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 pt-2">

          {/* Brand & Quick Connect */}
          <div className="col-span-2 lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <Link to="/" className="shrink-0">
                <img src="assets/img/bb-logo.jpeg" alt="Baba Broker" className="h-10 rounded-lg object-contain border border-white/10 bg-slate-900 p-1" />
              </Link>
              <div className="h-5 w-px bg-slate-800" />
              <span className="text-xs font-mono tracking-wider text-slate-400 uppercase font-semibold">Est. 2025</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed pr-4">
              Next-generation real estate marketplace simplifying high-ticket property acquisition, rentals, and portfolio management.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a href="tel:+919586505111" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-all text-xs sm:text-sm font-medium">
                <Phone className="w-4 h-4 text-[#f68122]" /> Call Support
              </a>
              <a href="mailto:info@bababroker.com" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700 transition-all text-xs sm:text-sm font-medium">
                <Mail className="w-4 h-4 text-[#f68122]" /> Email
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div className="col-span-1 lg:col-span-2 space-y-3">
            <p className="font-bold text-white text-xs tracking-wider uppercase">Platform</p>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: "Home", path: "/" },
                { name: "Properties", path: "/properties" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" }
              ].map((item, idx) => (
                <li key={idx}>
                  <Link to={item.path} className="hover:text-white transition-colors flex items-center gap-1.5 group">
                    <ChevronRight className="w-3.5 h-3.5 text-[#f68122] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1 lg:col-span-3 space-y-3">
            <p className="font-bold text-white text-xs tracking-wider uppercase">Core Services</p>
            <ul className="space-y-2 text-sm text-slate-400">
              {["Residential Sales", "Commercial Leasing", "Asset Advisory", "Legal Compliance"].map((service, idx) => (
                <li key={idx} className="hover:text-slate-200 transition-colors flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#f68122]" />
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* HQ Address */}
          <div className="col-span-2 lg:col-span-3 space-y-3">
            <p className="font-bold text-white text-xs tracking-wider uppercase">Corporate HQ</p>
            <p className="text-sm text-slate-400 flex items-start gap-2 leading-snug">
              <MapPin className="w-4 h-4 text-[#f68122] shrink-0 mt-0.5" />
              123 Property Lane, Financial District, New Delhi – 110059
            </p>
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#f68122] shrink-0" /> Mon – Sat: 09:00 – 19:00 IST
            </p>
          </div>

        </div>

        {/* Feature Cards Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-4 border-y border-slate-800/80">
          {[
            { icon: Globe, title: "Global Reach", sub: "Cross-border deals" },
            { icon: ShieldCheck, title: "Bank-Grade Legal", sub: "Fully verified assets" },
            { icon: Handshake, title: "Zero Hidden Fees", sub: "100% transparent" },
            { icon: Briefcase, title: "Private Wealth", sub: "Dedicated advisors" }
          ].map((card, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 flex items-center gap-3 hover:border-slate-700 transition-colors">
              <card.icon className="w-5 h-5 text-[#f68122] shrink-0" />
              <div className="min-w-0">
                <p className="text-white text-xs sm:text-sm font-bold truncate leading-tight">{card.title}</p>
                <p className="text-slate-400 text-xs truncate mt-0.5">{card.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Risk Disclaimer & Legal Footer */}
        <div className="space-y-4 pt-1">
          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-center gap-3 text-xs sm:text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-slate-400 leading-normal">
              <span className="text-amber-500 font-bold">Disclaimer:</span> Real estate transactions involve inherent risks. Past returns are not indicative of future market yield. Conduct independent legal verification before investing.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 text-xs sm:text-sm text-slate-400 pt-1">
            <p>© 2026 Baba Broker Pvt Ltd. All rights reserved.</p>
            <div className="flex gap-5 font-medium">
              {["Privacy Policy", "Terms of Service", "Compliance"].map((link, idx) => (
                <a key={idx} href="#" className="hover:text-white transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}