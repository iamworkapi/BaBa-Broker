import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from '../services/api';

export default function Footer() {
  const [subEmail, setSubEmail] = useState("");
  const [subStatus, setSubStatus] = useState(null);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subEmail)) {
      setSubStatus({ ok: false, msg: "Please enter a valid email." });
      return;
    }
    try {
      await api('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subEmail.trim() }),
      });
      setSubStatus({ ok: true, msg: "Subscribed! Welcome aboard." });
      setSubEmail("");
    } catch {
      setSubStatus({ ok: false, msg: "Subscription failed. Please try again later." });
    }
    setTimeout(() => setSubStatus(null), 5000);
  };
  return (
    <footer className="relative bg-[#071426] pt-24 text-white overflow-visible">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-[350px] w-[900px] rounded-full bg-[#f68122] opacity-[0.03] blur-[160px]"></div>

      {/* Newsletter Bar with Elevated z-index to sit comfortably over sections */}
      <div className="absolute top-0 left-0 right-0 -translate-y-1/2 px-4 z-40">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#0b1f3e] to-[#0f284d] px-6 sm:px-10 py-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-center sm:text-left">
              <h3 className="font-black text-lg sm:text-xl tracking-tight text-white flex items-center justify-center sm:justify-start gap-2">
                <i className="fa-solid fa-paper-plane text-[#f68122]"></i> Stay
                up to date with the latest listings!
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Subscribe with your email and never miss an exclusive property
                deal. 🚀
              </p>
            </div>

            <form
              onSubmit={handleSubscribe}
              className="flex items-center bg-[#071426] border border-white/10 rounded-full p-1.5 overflow-hidden w-full sm:w-auto sm:min-w-[340px] shadow-inner focus-within:border-[#f68122]/50 transition-colors"
            >
              <input
                type="email"
                value={subEmail}
                onChange={(e) => setSubEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none bg-transparent min-w-0"
              />
              <button
                type="submit"
                className="rounded-full bg-[#f68122] hover:bg-orange-600 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all duration-300 whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
            {subStatus && (
              <p className={`text-xs mt-2 ${subStatus.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                {subStatus.msg}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Top: Logo + Columns */}
        <div className="border-b border-white/10 pb-16 pt-10">
          {/* Logo */}
          <div className="mb-10">
            <img
              src="assets/img/bb-logo.jpeg"
              alt="Baba Broker"
              className="h-16 rounded-xl object-contain shadow-md border border-white/5 bg-white/5 p-1"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Col 1: About */}
            <div className="lg:border-r lg:border-white/10 lg:pr-8">
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Baba Broker is your trusted real estate partner — helping you
                buy, sell, and rent residential &amp; commercial properties with
                complete transparency.
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-[#f68122] mb-3">
                Speak With Us
              </p>
              <a
                href="tel:+919586505111"
                className="group inline-flex items-center gap-3 rounded-2xl bg-[#0b1f3e]/80 border border-white/10 px-4 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-[#0b1f3e] hover:border-[#f68122]/40"
              >
                <img
                  src="./assets/img/call-request.png"
                  alt="call-request"
                  className="w-8 object-contain"
                />
                <span>Request A Callback</span>
              </a>
            </div>

            {/* Col 2: Useful Links */}
            <div className="lg:px-6">
              <h5 className="font-bold text-sm mb-5 pl-3 border-l-4 border-[#f68122] text-white">
                Useful <span className="text-[#f68122]">Links</span>
              </h5>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <Link
                    to="/"
                    className="hover:text-[#f68122] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[#f68122] text-xs">◆</span> Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/properties"
                    className="hover:text-[#f68122] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[#f68122] text-xs">◆</span> Properties
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-[#f68122] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[#f68122] text-xs">◆</span> About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-[#f68122] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[#f68122] text-xs">◆</span> Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Our Services & Pay Online */}
            <div className="lg:border-r lg:border-white/10 lg:px-6">
              <h5 className="font-bold text-sm mb-5 pl-3 border-l-4 border-[#f68122] text-white">
                Our <span className="text-[#f68122]">Services</span>
              </h5>
              <ul className="space-y-3 text-sm text-gray-400 mb-8">
                <li>
                  <a
                    href="#services"
                    className="hover:text-[#f68122] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[#f68122] text-xs">◆</span> Property
                    Buying
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-[#f68122] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[#f68122] text-xs">◆</span> Property
                    Selling
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-[#f68122] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[#f68122] text-xs">◆</span> Rental
                    Management
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-[#f68122] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[#f68122] text-xs">◆</span> Investment
                    Advisory
                  </a>
                </li>
                <li>
                  <a
                    href="#services"
                    className="hover:text-[#f68122] transition-colors flex items-center gap-2"
                  >
                    <span className="text-[#f68122] text-xs">◆</span> Legal &
                    Documentation
                  </a>
                </li>
              </ul>

              {/* Pay Online Badges */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-3">
                  Pay <span className="text-[#f68122]">Securely Online</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href="#"
                    className="opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <img
                      src="./assets/img/visa.jpg"
                      alt="visa"
                      className="w-10 rounded border border-white/10"
                    />
                  </a>
                  <a
                    href="#"
                    className="opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <img
                      src="./assets/img/apppay.jpg"
                      alt="apppay"
                      className="w-10 rounded border border-white/10"
                    />
                  </a>
                  <a
                    href="#"
                    className="opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <img
                      src="./assets/img/rupay.jpg"
                      alt="rupay"
                      className="w-10 rounded border border-white/10"
                    />
                  </a>
                  <a
                    href="#"
                    className="opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <img
                      src="./assets/img/paytm.jpg"
                      alt="paytm"
                      className="w-10 rounded border border-white/10"
                    />
                  </a>
                  <a
                    href="#"
                    className="opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <img
                      src="./assets/img/phonepay.jpg"
                      alt="phonepay"
                      className="w-10 rounded border border-white/10"
                    />
                  </a>
                  <a
                    href="#"
                    className="opacity-75 hover:opacity-100 transition-opacity"
                  >
                    <img
                      src="./assets/img/gpay.jpg"
                      alt="gpay"
                      className="w-10 rounded border border-white/10"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Col 4: Contact */}
            <div>
              <h5 className="font-bold text-sm mb-5 pl-3 border-l-4 border-[#f68122] text-white">
                Our <span className="text-[#f68122]">Contact</span>
              </h5>
              <ul className="space-y-3.5 text-sm text-gray-400">
                <li className="flex items-start gap-3">
                  <i className="fa-solid fa-location-dot text-[#f68122] mt-1 w-4 shrink-0"></i>
                  <span>123 Property Lane, Real Estate City – 110059</span>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-phone text-[#f68122] w-4 shrink-0"></i>
                  <a
                    href="tel:+919586505111"
                    className="hover:text-[#f68122] transition-colors"
                  >
                    +91 95865 05111
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-envelope text-[#f68122] w-4 shrink-0"></i>
                  <a
                    href="mailto:info@bababroker.com"
                    className="hover:text-[#f68122] transition-colors"
                  >
                    info@bababroker.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-brands fa-skype text-[#f68122] w-4 shrink-0"></i>
                  <a
                    href="mailto:info@bababroker.com"
                    className="hover:text-[#f68122] transition-colors"
                  >
                    bababroker
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-clock text-[#f68122] w-4 shrink-0"></i>
                  <span>Mon–Sat: 9:00 AM – 7:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Important Disclaimer Card */}
        <div className="my-10 flex md:flex-row flex-col items-start gap-4 bg-[#0b1f3e]/60 border border-white/5 p-6 rounded-2xl shadow-xl backdrop-blur-md">
          <div className="p-3 bg-[#f68122]/10 rounded-xl border border-[#f68122]/20 shrink-0 text-[#f68122]">
            <i className="fas fa-triangle-exclamation text-lg"></i>
          </div>
          <div>
            <p className="mb-2 text-[#f68122] font-bold text-base tracking-wide">
              Important Legal Disclaimer
            </p>
            <p className="text-xs leading-relaxed text-gray-400">
              <span className="font-bold text-gray-300">
                Investment Risk Warning:{" "}
              </span>
              Investing in real estate involves substantial market risks,
              including the possible fluctuation or loss of principal capital.
              Past platform performance does not guarantee future financial
              results. Property values and rental yields are subject to market
              conditions, and investments are inherently illiquid. Please review
              all legal documents thoroughly prior to committing capital.
            </p>
          </div>
        </div>

        {/* Value Highlights Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-white/10 text-center sm:text-left">
          <div className="bg-[#0b1f3e]/40 border border-white/5 p-5 rounded-2xl">
            <i className="fas fa-globe mb-3 text-xl text-[#f68122]"></i>
            <h6 className="text-white text-xs font-bold uppercase tracking-wider mb-1">
              Global Reach
            </h6>
            <p className="text-gray-400 text-xs">Serving investors worldwide</p>
          </div>
          <div className="bg-[#0b1f3e]/40 border border-white/5 p-5 rounded-2xl">
            <i className="fas fa-shield-halved mb-3 text-xl text-[#f68122]"></i>
            <h6 className="text-white text-xs font-bold uppercase tracking-wider mb-1">
              Secure Platform
            </h6>
            <p className="text-gray-400 text-xs">Bank-level encryption</p>
          </div>
          <div className="bg-[#0b1f3e]/40 border border-white/5 p-5 rounded-2xl">
            <i className="fas fa-handshake mb-3 text-xl text-[#f68122]"></i>
            <h6 className="text-white text-xs font-bold uppercase tracking-wider mb-1">
              Transparent
            </h6>
            <p className="text-gray-400 text-xs">Full disclosure & reporting</p>
          </div>
          <div className="bg-[#0b1f3e]/40 border border-white/5 p-5 rounded-2xl">
            <i className="fas fa-user-tie mb-3 text-xl text-[#f68122]"></i>
            <h6 className="text-white text-xs font-bold uppercase tracking-wider mb-1">
              Expert Managed
            </h6>
            <p className="text-gray-400 text-xs">Professional oversight</p>
          </div>
        </div>

        {/* Copyright & Legal Links */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 py-6 text-xs text-gray-400 text-center sm:text-left">
          <p>
            Copyright &copy; 2025–2026 Baba Broker Pvt Ltd. | All rights
            reserved.
          </p>
          <p className="flex flex-wrap gap-5 justify-center sm:justify-end">
            <a href="#" className="hover:text-[#f68122] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#f68122] transition-colors">
              Terms of Use
            </a>
            <a href="#" className="hover:text-[#f68122] transition-colors">
              Refund & Cancellation
            </a>
          </p>
        </div>
      </div>

      {/* Bottom Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-transparent via-[#f68122] to-transparent"></div>
    </footer>
  );
}
