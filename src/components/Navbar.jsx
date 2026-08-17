import React, { useEffect, useState, useRef } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [phoneCardOpen, setPhoneCardOpen] = useState(false);

  const phoneMenuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });

    const clickOutside = (e) => {
      if (phoneMenuRef.current && !phoneMenuRef.current.contains(e.target)) {
        setPhoneCardOpen(false);
      }
    };
    window.addEventListener("mousedown", clickOutside);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousedown", clickOutside);
    };
  }, []);

  const handleWhatsAppConnect = () => {
    const url = `https://wa.me/919586505111?text=${encodeURIComponent(
      "Hello Baba Broker, I would like to connect with your investment team regarding properties."
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 select-none py-4 px-6 lg:px-16 ${
        scrolled || mobileOpen
          ? "border-b border-white/[0.08] bg-slate-950 shadow-2xl"
          : "border-b border-transparent bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between relative">
        {/* Brand Architecture */}
        <Link
          to="/"
          className="block max-w-[240px] sm:max-w-[280px] transition-transform duration-200 hover:scale-[1.02]"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex items-center">
            <img
              src="assets/img/logo.svg"
              alt="Baba Broker Logo"
              className="h-14 sm:h-16 w-auto object-contain brightness-125 contrast-115"
            />
          </div>
        </Link>

        {/* Center Links Hub */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-200">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `hover:text-orange-400 transition-colors py-2.5 block tracking-wide ${
                  isActive ? "text-orange-400 font-bold" : ""
                }`
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `hover:text-orange-400 transition-colors py-2.5 block tracking-wide ${
                  isActive ? "text-orange-400 font-bold" : ""
                }`
              }
            >
              About Us
            </NavLink>
          </li>
          <li>
            <a
              href="/#our-projects"
              className="hover:text-orange-400 transition-colors py-2.5 block tracking-wide"
            >
              Investment Plans
            </a>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `hover:text-orange-400 transition-colors py-2.5 block tracking-wide ${
                  isActive ? "text-orange-400 font-bold" : ""
                }`
              }
            >
              Contact Us
            </NavLink>
          </li>
        </ul>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Become an Investor Button */}
          <Link
            to="/become-investor"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 hover:scale-[1.02] transition-all text-xs font-bold shadow-md shadow-orange-500/20"
          >
            <i className="fa-solid fa-user-tie text-[11px]"></i> Become an Investor
          </Link>

          {/* Staff & Admin Portal Button */}
          <Link
            to="/salesman/login"
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white transition-all text-xs font-bold shadow-sm"
          >
            <i className="fa-solid fa-[#shield-halved] fa-user-gear text-[11px]"></i> Staff & Admin Portal
          </Link>

          {/* Quick Contact Menu */}
          <div className="relative" ref={phoneMenuRef}>
            <button
              onClick={() => setPhoneCardOpen(!phoneCardOpen)}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center hover:bg-orange-500 hover:text-white transition-all shadow-md"
            >
              <i className="fa-solid fa-phone text-sm"></i>
            </button>

            {phoneCardOpen && (
              <div className="absolute right-0 top-12 z-50 w-72 rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Direct Contact Hotline
                </p>
                <a
                  href="tel:+911800000000"
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900 transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs">
                    <i className="fa-solid fa-phone"></i>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400 font-bold">Call Us</span>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-orange-400">
                      +91 1800 000 000
                    </span>
                  </div>
                </a>

                <button
                  onClick={handleWhatsAppConnect}
                  className="w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900 transition-colors group"
                >
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs">
                    <i className="fa-brands fa-whatsapp"></i>
                  </div>
                  <div>
                    <span className="block text-[10px] text-emerald-400 font-bold">WhatsApp Connect</span>
                    <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-400">
                      +91 95865 05111
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="h-10 w-10 rounded-xl border border-white/10 bg-slate-900 flex items-center justify-center text-slate-300 md:hidden hover:bg-slate-800"
          >
            <i className={`fa-solid ${mobileOpen ? "fa-xmark text-lg" : "fa-bars"}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-4 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden text-sm font-semibold max-h-[75vh] overflow-y-auto shadow-2xl">
          <Link
            to="/"
            className="block px-5 py-4 border-b border-slate-900 text-slate-200 active:bg-slate-900"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/about"
            className="block px-5 py-4 border-b border-slate-900 text-slate-200 active:bg-slate-900"
            onClick={() => setMobileOpen(false)}
          >
            About Us
          </Link>

          <a
            href="/#our-projects"
            className="block px-5 py-4 border-b border-slate-900 text-slate-200 active:bg-slate-900"
            onClick={() => setMobileOpen(false)}
          >
            Investment Plans
          </a>

          <Link
            to="/contact"
            className="block px-5 py-4 border-b border-slate-900 text-slate-200 active:bg-slate-900"
            onClick={() => setMobileOpen(false)}
          >
            Contact Us
          </Link>

          <Link
            to="/become-investor"
            className="block px-5 py-4 border-b border-slate-900 text-orange-400 font-bold active:bg-slate-900"
            onClick={() => setMobileOpen(false)}
          >
            <i className="fa-solid fa-user-tie text-xs mr-2"></i> Become an Investor
          </Link>

          <Link
            to="/salesman/login"
            className="block px-5 py-4 border-b border-slate-900 text-orange-400 active:bg-slate-900"
            onClick={() => setMobileOpen(false)}
          >
            <i className="fa-solid fa-user-gear text-xs mr-2"></i> Staff & Admin Portal
          </Link>

          {/* Mobile CTA */}
          <div className="p-4 bg-slate-900/50">
            <button
              onClick={() => {
                setMobileOpen(false);
                handleWhatsAppConnect();
              }}
              className="w-full py-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i> WhatsApp Connect
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
