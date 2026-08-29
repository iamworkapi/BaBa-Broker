import { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const MotionLink = motion(Link);
const MotionNavLink = motion(NavLink);

const NAV_LINKS = [
  { to: "/", label: "Home", id: "hero" },
  { to: "/about", label: "About Us", id: null },
  { to: "/properties", label: "Investment Plans", id: null },
  { to: "/contact", label: "Contact Us", id: null },
];

const spring = { type: "spring", stiffness: 260, damping: 22, mass: 0.8 };

const linkVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring, delay: i * 0.06 },
  }),
};

const mobileItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: { ...spring, delay: i * 0.05 },
  }),
  exit: { opacity: 0, x: 20, transition: { duration: 0.18 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const hamburgerVariants = {
  closed: { rotate: 0 },
  open: { rotate: 180, transition: { type: "spring", stiffness: 260, damping: 20 } },
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  const phoneRef = useRef(null);
  const location = useLocation();

  const handleWhatsAppConnect = useCallback(() => {
    const url = `https://wa.me/919586505111?text=${encodeURIComponent(
      "Hello Baba Broker, I would like to connect with your investment team regarding properties.",
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 30);
      // Detect active section from scroll position
      const sectionIds = NAV_LINKS.filter((l) => l.id).map((l) => l.id);
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close phone dropdown on outside click
  useEffect(() => {
    const onClick = (e) => {
      if (phoneRef.current && !phoneRef.current.contains(e.target)) setPhoneOpen(false);
    };
    window.addEventListener("mousedown", onClick);
    return () => window.removeEventListener("mousedown", onClick);
  }, []);

  // Lock body scroll when mobile drawer open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeAll = () => { setMobileOpen(false); setPhoneOpen(false); };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 select-none transition-all duration-300 ${
        scrolled || mobileOpen
          ? "border-b border-white/[0.08] bg-slate-950/80 shadow-2xl shadow-black/30"
          : "bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent"
      }`}
      style={{ backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(8px)", WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(8px)" }}
    >
      {/* Gradient accent line at top when scrolled */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: "linear-gradient(90deg, #f97316 0%, #f59e0b 40%, #10b981 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl flex items-center justify-between px-5 py-2 lg:px-16">
        {/* ─── Animated Logo ─── */}
        <motion.div transition={spring}>
          <Link to="/" onClick={closeAll} className="block">
            <motion.img
              src="assets/img/logo.svg"
              alt="Baba Broker"
              className="h-10 sm:h-12 lg:h-14 w-auto object-contain"
              style={{ maxWidth: '170px' }}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              draggable={false}
            />
          </Link>
        </motion.div>

        {/* ─── Desktop Nav Links ─── */}
        <motion.ul
          className="hidden md:flex items-center gap-1"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } } }}
        >
          {NAV_LINKS.map((link, i) => (
            <motion.li key={link.label} custom={i} variants={linkVariants}>
              {link.to ? (
                <NavLink
                  to={link.to}
                  onClick={closeAll}
                  className={({ isActive }) => {
                    const isSectionActive = link.id && activeSection === link.id && location.pathname === "/";
                    const isActiveRoute = link.id ? isSectionActive : isActive;
                    return `relative px-4 py-2 rounded-xl text-[13px] font-semibold tracking-wide transition-colors duration-200 ${
                      isActiveRoute
                        ? "text-orange-400"
                        : "text-slate-300 hover:text-orange-300"
                    }`;
                  }}
                >
                  {({ isActive }) => {
                    const isSectionActive = link.id && activeSection === link.id && location.pathname === "/";
                    const active = link.id ? isSectionActive : isActive;
                    return (
                      <>
                        {active && (
                          <motion.span
                            layoutId="navPill"
                            className="absolute inset-0 rounded-xl bg-orange-500/15 border border-orange-500/20"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{link.label}</span>
                      </>
                    );
                  }}
                </NavLink>
              ) : (
                <a
                  href={link.href}
                  className="relative px-4 py-2 rounded-xl text-[13px] font-semibold tracking-wide text-slate-300 hover:text-orange-300 transition-colors duration-200"
                  onClick={closeAll}
                >
                  {link.label}
                </a>
              )}
            </motion.li>
          ))}
        </motion.ul>

        {/* ─── Right Controls ─── */}
        <div className="flex items-center gap-2.5">
          {/* Become an Investor */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.25 }}
          >
            <MotionLink
              to="/become-investor"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={spring}
            >
              <i className="fa-solid fa-user-tie text-[11px]" />
              Become an Investor
            </MotionLink>
          </motion.div>

          {/* Staff & Admin Portal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...spring, delay: 0.32 }}
          >
            <MotionLink
              to="/salesman/login"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all shadow-sm"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={spring}
            >
              <i className="fa-solid fa-user-gear text-[11px]" />
              Staff &amp; Admin Portal
            </MotionLink>
          </motion.div>

          {/* Phone Contact Dropdown */}
          <motion.div className="relative" ref={phoneRef} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: 0.38 }}>
            <motion.button
              onClick={() => setPhoneOpen(!phoneOpen)}
              className="h-10 w-10 sm:h-11 sm:w-11 rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-400 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors shadow-md"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={spring}
            >
              <motion.i
                className="fa-solid fa-phone text-sm"
                animate={phoneOpen ? { rotate: [0, -15, 15, -8, 8, 0] } : { rotate: 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>

            <AnimatePresence>
              {phoneOpen && (
                <motion.div
                  className="absolute right-0 top-14 z-50 w-72 rounded-2xl border border-slate-700/60 bg-slate-900/95 p-5 shadow-2xl space-y-3 overflow-hidden"
                  initial={{ opacity: 0, y: -12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ ...spring, damping: 25 }}
                  style={{ backdropFilter: "blur(20px)" }}
                >
                  {/* Accent bar */}
                  <motion.div
                    className="absolute inset-x-0 top-0 h-[2px]"
                    style={{ background: "linear-gradient(90deg, #f97316, #10b981)" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.35, delay: 0.05 }}
                  />

                  <motion.p
                    className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] pt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    Direct Contact Hotline
                  </motion.p>

                  <motion.a
                    href="tel:+911800000000"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/60 transition-colors group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.12 }}
                  >
                    <motion.div
                      className="h-9 w-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs"
                      whileHover={{ scale: 1.1, rotate: -8 }}
                      transition={spring}
                    >
                      <i className="fa-solid fa-phone" />
                    </motion.div>
                    <div>
                      <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Call Us
                      </span>
                      <span className="text-sm font-bold text-slate-200 group-hover:text-orange-400 transition-colors">
                        +91 1800 000 000
                      </span>
                    </div>
                  </motion.a>

                  <motion.button
                    onClick={handleWhatsAppConnect}
                    className="w-full text-left flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/60 transition-colors group"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...spring, delay: 0.18 }}
                  >
                    <motion.div
                      className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs"
                      whileHover={{ scale: 1.1, rotate: 8 }}
                      transition={spring}
                    >
                      <i className="fa-brands fa-whatsapp" />
                    </motion.div>
                    <div>
                      <span className="block text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                        WhatsApp Connect
                      </span>
                      <span className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors">
                        +91 95865 05111
                      </span>
                    </div>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ─── Hamburger Button ─── */}
          <motion.button
            onClick={() => setMobileOpen((v) => !v)}
            className="h-10 w-10 rounded-xl border border-white/10 bg-slate-900/80 flex items-center justify-center text-slate-300 md:hidden"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            transition={spring}
            variants={hamburgerVariants}
            animate={mobileOpen ? "open" : "closed"}
          >
            <motion.div className="flex flex-col gap-1.5 items-center justify-center w-5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="block h-[1.5px] w-5 rounded-full bg-current origin-center"
                  animate={
                    mobileOpen
                      ? i === 0
                        ? { rotate: 45, y: 5.5 }
                        : i === 1
                        ? { opacity: 0, scaleX: 0 }
                        : { rotate: -45, y: -5.5 }
                      : { rotate: 0, y: 0, opacity: 1, scaleX: 1 }
                  }
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              ))}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* ─── Mobile Drawer ─── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={closeAll}
            />

            {/* Drawer panel */}
            <motion.div
              className="md:hidden z-50 mx-4 mt-2 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden text-sm font-semibold shadow-2xl max-h-[75vh] overflow-y-auto"
              initial={{ opacity: 0, y: -20, scaleY: 0.95 }}
              animate={{ opacity: 1, y: 0, scaleY: 1 }}
              exit={{ opacity: 0, y: -12, scaleY: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {/* Accent bar */}
              <motion.div
                className="h-[2px]"
                style={{ background: "linear-gradient(90deg, #f97316 0%, #f59e0b 50%, #10b981 100%)" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
              />

              <div className="p-3 space-y-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    custom={i}
                    variants={mobileItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {link.to ? (
                      <NavLink
                        to={link.to}
                        onClick={closeAll}
                        className={({ isActive }) => {
                          const isSectionActive = link.id && activeSection === link.id && location.pathname === "/";
                          return `block px-5 py-3.5 rounded-xl transition-colors ${
                            (link.id ? isSectionActive : isActive)
                              ? "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                              : "text-slate-300 border border-transparent hover:bg-slate-900"
                          }`;
                        }}
                      >
                        {link.label}
                      </NavLink>
                    ) : (
                      <a
                        href={link.href}
                        className="block px-5 py-3.5 rounded-xl text-slate-300 border border-transparent hover:bg-slate-900 transition-colors"
                        onClick={closeAll}
                      >
                        {link.label}
                      </a>
                    )}
                  </motion.div>
                ))}

                {/* Mobile CTA */}
                <motion.div
                  custom={NAV_LINKS.length}
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="pt-2 space-y-2"
                >
                  <Link
                    to="/become-investor"
                    onClick={closeAll}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold text-xs"
                  >
                    <i className="fa-solid fa-user-tie text-[11px]" />
                    Become an Investor
                  </Link>
                  <button
                    onClick={() => { closeAll(); handleWhatsAppConnect(); }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold text-xs"
                  >
                    <i className="fa-brands fa-whatsapp text-sm" />
                    WhatsApp Connect
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}