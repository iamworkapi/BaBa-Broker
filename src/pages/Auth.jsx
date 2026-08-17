import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("login"); // 'login' | 'signup'
  const [loginMethod, setLoginMethod] = useState("phone"); // 'phone' | 'email'
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [sentOtp, setSentOtp] = useState(false);

  // Form states
  const [loginPhone, setLoginPhone] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [signupData, setSignupData] = useState({
    email: "",
    phone: "",
    fullName: "",
    password: "",
  });

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step < 4) setStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!sentOtp) {
      setSentOtp(true);
    } else {
      // Simulate successful login
      navigate("/investor");
    }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Lighting Blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-blue-600/20 via-indigo-500/10 to-transparent blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-orange-500/15 via-amber-500/5 to-transparent blur-[150px]" />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/assets/img/logo.svg"
            alt="Baba Broker Logo"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <div className="hidden sm:block border-l border-slate-800/80 pl-3">
            <span className="text-xs font-black uppercase tracking-[0.2em] bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent block">
              Baba Broker
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-wider">Investor & Property Hub</span>
          </div>
        </Link>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition backdrop-blur-md cursor-pointer"
        >
          <i className="fa-solid fa-house text-orange-400 text-xs" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 flex-1 flex items-center justify-center">
        <div className="w-full grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center">
          
          {/* LEFT SIDE: Hero copy */}
          <div className="hidden lg:flex flex-col justify-center space-y-7 pr-4">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-3.5 py-1 text-xs font-extrabold text-orange-400 uppercase tracking-widest">
                <i className="fa-solid fa-building-circle-check text-xs" /> Premium Investor Desk
              </span>

              <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15]">
                Welcome to the Future of <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
                  Real Estate Investment
                </span>
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed max-w-lg font-medium">
                Sign in to manage your fractional property investments, view high-yield opportunities, and track your property portfolios in real time.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-3.5 border-y border-slate-800/80 py-5">
              {[
                { icon: "fa-chart-pie", title: "Fractional Real Estate IPOs", text: "Invest in high-value builder floors with minimum capital" },
                { icon: "fa-shield-halved", title: "Verified RERA Properties", text: "All listed flats & plots are background verified & audit ready" },
                { icon: "fa-hand-holding-dollar", title: "Transparent ROI Returns", text: "Receive regular rental yields and capital appreciation reports" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 rounded-2xl border border-slate-800/60 bg-slate-900/40 p-3.5 hover:border-slate-700 hover:bg-slate-900/80 transition-all duration-300 group"
                >
                  <div className="shrink-0 h-10 w-10 rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:border-orange-500/40 group-hover:bg-orange-500/10 transition-all shadow-inner">
                    <i className={`fa-solid ${item.icon} text-sm`} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">{item.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Staff Gateway Link */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Are you a Salesman or Staff Member?</p>
                <p className="text-[11px] text-slate-400">Access your salesman workspace or staff dashboard.</p>
              </div>
              <Link
                to="/salesman/login"
                className="shrink-0 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3.5 py-2 text-xs font-bold text-orange-400 hover:bg-orange-500 hover:text-white transition cursor-pointer"
              >
                Staff Portal <i className="fa-solid fa-arrow-right text-xs ml-1" />
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: Auth Card */}
          <div className="w-full max-w-md mx-auto">
            
            {/* Toggle Tabs */}
            <div className="mb-4 p-1.5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-2xl grid grid-cols-2 gap-1 shadow-2xl">
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                  tab === "login"
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-[1.02]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Investor Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setTab("signup");
                  setStep(1);
                }}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 cursor-pointer ${
                  tab === "signup"
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg scale-[1.02]"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Glass Container */}
            <div className="rounded-3xl border border-slate-800/90 bg-slate-900/85 p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.7)] backdrop-blur-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />

              {tab === "login" ? (
                /* LOGIN SECTION */
                <div>
                  <div className="text-center sm:text-left mb-6 border-b border-slate-800/80 pb-4">
                    <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
                    <p className="mt-1 text-xs text-slate-400">Sign in to access real estate IPOs & portfolio updates.</p>
                  </div>

                  {/* Quick Google Auth Option */}
                  <button
                    type="button"
                    className="w-full border border-slate-800 bg-slate-950/80 hover:bg-slate-800 rounded-xl py-3 text-xs font-bold text-white flex items-center justify-center gap-2.5 transition shadow-sm cursor-pointer mb-4"
                  >
                    <i className="fa-brands fa-google text-red-400 text-sm" />
                    <span>Continue with Google</span>
                  </button>

                  <div className="relative text-center my-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-800" />
                    </div>
                    <span className="relative bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                      Or Sign In With
                    </span>
                  </div>

                  {/* Method Toggle: Phone vs Email */}
                  <div className="flex gap-2 mb-4">
                    <button
                      type="button"
                      onClick={() => setLoginMethod("phone")}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        loginMethod === "phone"
                          ? "bg-slate-800 border-orange-500/40 text-orange-400"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                      }`}
                    >
                      Phone Number
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod("email")}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer border ${
                        loginMethod === "email"
                          ? "bg-slate-800 border-orange-500/40 text-orange-400"
                          : "border-slate-800 bg-slate-950 text-slate-400 hover:text-white"
                      }`}
                    >
                      Email Address
                    </button>
                  </div>

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {loginMethod === "phone" ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                          Mobile Number
                        </label>
                        <div className="flex gap-2">
                          <div className="w-20 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-bold text-white flex items-center justify-center">
                            🇮🇳 +91
                          </div>
                          <input
                            type="tel"
                            value={loginPhone}
                            onChange={(e) => setLoginPhone(e.target.value)}
                            placeholder="9876543210"
                            required
                            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="yourname@domain.com"
                          required
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 outline-none focus:border-orange-500"
                        />
                      </div>
                    )}

                    {sentOtp && (
                      <div>
                        <label className="block text-xs font-bold text-amber-400 mb-1.5 uppercase tracking-wider">
                          Enter 6-Digit Security OTP
                        </label>
                        <input
                          type="text"
                          maxLength="6"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="1 2 3 4 5 6"
                          required
                          className="w-full bg-slate-950 border border-amber-500/40 rounded-xl p-3 text-center text-sm font-mono tracking-widest text-amber-300 outline-none focus:ring-2 focus:ring-amber-500/20"
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full mt-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl transition hover:brightness-110 cursor-pointer"
                    >
                      {sentOtp ? "Verify & Proceed to Dashboard" : "Send OTP Security Code"}
                    </button>
                  </form>
                </div>
              ) : (
                /* SIGNUP SECTION */
                <div>
                  <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
                    <div>
                      <h2 className="text-xl font-black text-white">Create Investor Account</h2>
                      <p className="text-[11px] text-slate-400">Step {step} of 4</p>
                    </div>
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handlePrevStep}
                        className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                      >
                        <i className="fa-solid fa-arrow-left mr-1" /> Back
                      </button>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="flex gap-1.5 mb-5">
                    {[1, 2, 3, 4].map((s) => (
                      <div
                        key={s}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          s <= step ? "bg-gradient-to-r from-orange-500 to-amber-500 shadow-sm" : "bg-slate-800"
                        }`}
                      />
                    ))}
                  </div>

                  <form onSubmit={handleNextStep} className="space-y-4">
                    {step === 1 && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">Email Address</label>
                          <input
                            type="email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            required
                            placeholder="investor@domain.com"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-300 mb-1.5">Phone Number</label>
                          <input
                            type="tel"
                            value={signupData.phone}
                            onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                            required
                            placeholder="9876543210"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500"
                          />
                        </div>
                      </>
                    )}

                    {step === 2 && (
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={signupData.fullName}
                          onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                          required
                          placeholder="e.g. Vikram Sharma"
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500"
                        />
                      </div>
                    )}

                    {step === 3 && (
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">Create Password</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            required
                            placeholder="Min 6 characters"
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 pr-24 text-xs text-white outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-[10px] font-bold text-slate-400 hover:text-white"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>
                    )}

                    {step === 4 && (
                      <div className="text-center py-4 space-y-3">
                        <i className="fa-solid fa-circle-check text-4xl text-emerald-400" />
                        <h4 className="text-sm font-bold text-white">All Set to Complete Signup!</h4>
                        <p className="text-xs text-slate-400">Click below to finalize your investor account.</p>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full mt-2 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 py-3.5 text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl hover:brightness-110 cursor-pointer"
                    >
                      {step < 4 ? "Continue to Next Step" : "Complete Registration"}
                    </button>
                  </form>
                </div>
              )}

              {/* Staff Portal Link */}
              <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
                <Link to="/salesman/login" className="text-[11px] font-bold text-orange-400 hover:text-amber-300 transition">
                  <i className="fa-solid fa-user-tie mr-1" /> Switch to Salesman / Admin Login Portal
                </Link>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 text-center sm:flex sm:items-center sm:justify-between text-[11px] text-slate-500 border-t border-slate-900 font-medium">
        <p>© {new Date().getFullYear()} Baba Broker. All rights reserved.</p>
        <p className="text-slate-400">Secured Real Estate Investment Platform</p>
      </footer>
    </div>
  );
}
