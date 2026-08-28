import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setAuth } from '../store/auth';

export default function Auth() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login"); // 'login' | 'signup'
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (!loginEmail.trim() || !loginPassword.trim()) {
        throw new Error("Please enter both email and password.");
      }

      // Demo login
      setAuth({
        token: "demo-user-" + Date.now(),
        role: "investor",
        name: loginEmail.split("@")[0] || "Verified Investor",
        email: loginEmail,
      });

      navigate("/investor", { replace: true });
    } catch (err) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (!signupData.fullName || !signupData.email || !signupData.password) {
        throw new Error("Please fill in all required fields.");
      }

      setAuth({
        token: "demo-user-" + Date.now(),
        role: "investor",
        name: signupData.fullName,
        email: signupData.email,
      });

      navigate("/investor", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#7c2d12] via-[#9a3412] to-[#431407] p-4 sm:p-6 lg:p-8 font-['Inter',sans-serif] relative overflow-hidden select-none">
      
      {/* Background Ambient Glow Lighting */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-amber-500/20 blur-[140px]" />

      {/* Main Floating Card */}
      <div className="flex w-full max-w-4xl min-h-[520px] overflow-hidden rounded-[32px] sm:rounded-[40px] shadow-[0_25px_70px_rgba(0,0,0,0.5)] bg-white relative z-10 border border-white/10">

        {/* ─── LEFT PANEL: Geometric Ribbons with Notch Cutout ─── */}
        <div
          className="relative hidden w-[38%] flex-col items-center justify-center p-8 md:flex overflow-hidden"
          style={{
            background: `linear-gradient(145deg, #c2410c 0%, #ea580c 45%, #9a3412 100%)`,
          }}
        >
          {/* Overlapping Geometric Folded Ribbon Shapes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Ribbon 1 */}
            <div
              className="absolute -top-12 -right-12 h-96 w-96 bg-gradient-to-br from-orange-400/40 via-amber-400/30 to-transparent"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 50%)",
                filter: "drop-shadow(-8px 10px 18px rgba(0,0,0,0.25))",
              }}
            />

            {/* Ribbon 2 */}
            <div
              className="absolute top-1/4 -left-10 h-80 w-80 bg-gradient-to-tr from-amber-300/35 via-orange-400/25 to-transparent"
              style={{
                clipPath: "polygon(0 0, 85% 45%, 0 90%)",
                filter: "drop-shadow(6px 10px 16px rgba(0,0,0,0.22))",
              }}
            />

            {/* Ribbon 3 */}
            <div
              className="absolute -bottom-16 -right-10 h-72 w-72 bg-gradient-to-tl from-orange-600/60 via-amber-500/30 to-transparent"
              style={{
                clipPath: "polygon(20% 100%, 100% 0, 100% 100%)",
                filter: "drop-shadow(-6px -6px 14px rgba(0,0,0,0.2))",
              }}
            />
          </div>

          {/* Notch Tab Selection Area */}
          <div className="relative z-20 w-full flex flex-col items-end space-y-4">
            
            {/* LOGIN Pill Tab */}
            <div className="relative w-full flex justify-end">
              {activeTab === "login" ? (
                <div
                  className="relative z-20 w-[78%] py-3.5 pl-6 pr-4 bg-white rounded-l-full shadow-lg flex items-center justify-center cursor-pointer transition-all"
                  onClick={() => { setActiveTab("login"); setError(""); }}
                >
                  <span
                    className="absolute -top-3 right-0 w-3 h-3 pointer-events-none rounded-br-lg"
                    style={{ backgroundColor: "#ea580c", boxShadow: "3px 3px 0 3px #ffffff" }}
                  />
                  <span
                    className="absolute -bottom-3 right-0 w-3 h-3 pointer-events-none rounded-tr-lg"
                    style={{ backgroundColor: "#ea580c", boxShadow: "3px -3px 0 3px #ffffff" }}
                  />
                  <span className="text-xs font-black tracking-widest text-slate-800 uppercase">
                    LOGIN
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { setActiveTab("login"); setError(""); }}
                  className="w-[78%] py-3.5 pr-8 text-right text-xs font-black tracking-widest text-white/80 hover:text-white uppercase transition cursor-pointer"
                >
                  LOGIN
                </button>
              )}
            </div>

            {/* SIGN IN / SIGNUP Tab */}
            <div className="relative w-full flex justify-end">
              {activeTab === "signup" ? (
                <div
                  className="relative z-20 w-[78%] py-3.5 pl-6 pr-4 bg-white rounded-l-full shadow-lg flex items-center justify-center cursor-pointer transition-all"
                  onClick={() => { setActiveTab("signup"); setError(""); }}
                >
                  <span
                    className="absolute -top-3 right-0 w-3 h-3 pointer-events-none rounded-br-lg"
                    style={{ backgroundColor: "#ea580c", boxShadow: "3px 3px 0 3px #ffffff" }}
                  />
                  <span
                    className="absolute -bottom-3 right-0 w-3 h-3 pointer-events-none rounded-tr-lg"
                    style={{ backgroundColor: "#ea580c", boxShadow: "3px -3px 0 3px #ffffff" }}
                  />
                  <span className="text-xs font-black tracking-widest text-slate-800 uppercase">
                    SIGN IN
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { setActiveTab("signup"); setError(""); }}
                  className="w-[78%] py-3.5 pr-8 text-right text-xs font-black tracking-widest text-white/80 hover:text-white uppercase transition cursor-pointer"
                >
                  SIGN IN
                </button>
              )}
            </div>

          </div>

          {/* Logo Watermark at Bottom */}
          <div className="absolute bottom-6 left-6 flex items-center gap-2 z-20">
            <img src="/assets/img/logo.svg" alt="Baba Broker" className="h-6 w-auto brightness-0 invert opacity-90" />
            <span className="text-[11px] font-bold text-white/80 tracking-wider uppercase">Baba Broker</span>
          </div>

        </div>

        {/* ─── RIGHT PANEL: Clean Minimalist Form ─── */}
        <div className="flex w-full flex-col justify-between bg-white px-8 sm:px-12 py-10 md:w-[62%]">
          
          {/* Top Center: Circular Avatar & LOGIN Title */}
          <div className="flex flex-col items-center justify-center pt-2">
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full shadow-xl shadow-orange-500/25 border-2 border-white/80 bg-gradient-to-br from-orange-500 to-amber-500 transition-transform duration-300 hover:scale-105">
              <i className="ri-user-3-line text-3xl text-white drop-shadow-sm" />
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 uppercase">
              {activeTab === "login" ? "LOGIN" : "CREATE ACCOUNT"}
            </h2>
          </div>

          {/* Form Area */}
          <div className="w-full max-w-sm mx-auto my-auto pt-4">
            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-2.5 text-xs text-red-600 font-medium text-center animate-fadeIn">
                {error}
              </div>
            )}

            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email */}
                <div className="relative flex items-center border-b border-gray-300 focus-within:border-orange-500 transition-colors pb-2">
                  <span className="text-gray-400 mr-3 text-lg shrink-0">
                    <i className="ri-user-3-line" />
                  </span>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-gray-400 outline-none font-medium"
                  />
                </div>

                {/* Password */}
                <div className="relative flex items-center border-b border-gray-300 focus-within:border-orange-500 transition-colors pb-2">
                  <span className="text-gray-400 mr-3 text-lg shrink-0">
                    <i className="ri-lock-line" />
                  </span>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-gray-400 outline-none font-medium"
                  />
                </div>

                {/* Action Row */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="text-xs font-semibold text-orange-500/90 hover:text-orange-600 transition cursor-pointer"
                  >
                    Forgot Password?
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-9 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600"
                  >
                    {submitting ? "Signing In..." : "LOGIN"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <div className="relative flex items-center border-b border-gray-300 focus-within:border-orange-500 transition-colors pb-2">
                  <span className="text-gray-400 mr-3 text-lg shrink-0">
                    <i className="ri-user-smile-line" />
                  </span>
                  <input
                    type="text"
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                    placeholder="Full Name"
                    required
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-gray-400 outline-none font-medium"
                  />
                </div>

                {/* Email */}
                <div className="relative flex items-center border-b border-gray-300 focus-within:border-orange-500 transition-colors pb-2">
                  <span className="text-gray-400 mr-3 text-lg shrink-0">
                    <i className="ri-mail-line" />
                  </span>
                  <input
                    type="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    placeholder="Email Address"
                    required
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-gray-400 outline-none font-medium"
                  />
                </div>

                {/* Phone */}
                <div className="relative flex items-center border-b border-gray-300 focus-within:border-orange-500 transition-colors pb-2">
                  <span className="text-gray-400 mr-3 text-lg shrink-0">
                    <i className="ri-phone-line" />
                  </span>
                  <input
                    type="tel"
                    value={signupData.phone}
                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                    placeholder="Phone Number"
                    required
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-gray-400 outline-none font-medium"
                  />
                </div>

                {/* Password */}
                <div className="relative flex items-center border-b border-gray-300 focus-within:border-orange-500 transition-colors pb-2">
                  <span className="text-gray-400 mr-3 text-lg shrink-0">
                    <i className="ri-lock-line" />
                  </span>
                  <input
                    type="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    placeholder="Password"
                    required
                    className="w-full bg-transparent text-sm text-slate-800 placeholder:text-gray-400 outline-none font-medium"
                  />
                </div>

                {/* Submit button */}
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:brightness-110 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600"
                  >
                    {submitting ? "Creating Account..." : "REGISTER ACCOUNT"}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-slate-800">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <i className="ri-key-2-line text-orange-500" /> Password Recovery
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <i className="ri-close-line text-base" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Use demo access with <strong>Baba@123</strong> or contact Baba Broker operations for password assistance.
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setLoginPassword("Baba@123");
                  setShowForgotModal(false);
                }}
                className="w-full rounded-xl bg-orange-500 hover:bg-orange-600 text-white py-2.5 px-4 text-xs font-bold transition cursor-pointer"
              >
                Use Demo Password (Baba@123)
              </button>

              <a
                href="https://wa.me/919891140379?text=Hi%20Admin%2C%20I%20need%20a%20password%20reset%20for%20my%20Baba%20Broker%20account."
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm transition"
              >
                <i className="ri-whatsapp-line text-base" />
                <span>WhatsApp Admin Support</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

