import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { setAuth } from '../store/auth';
import { api } from '../services/api';
import { useToast } from '../hooks/useToast.jsx';

const ROLES = {
  admin: {
    id: 'admin',
    tabLabel: 'Admin',
    heading: 'ADMIN LOGIN',
    badge: 'Executive Command',
    icon: 'ri-shield-keyhole-line',
    themeColor: '#ea580c',
    tagline: 'Executive Portfolio & Fund Command',
    subtitle: 'Oversee fractional co-investments, capital pools, staff permissions, and executive analytics.',
    defaultEmail: 'admin@bababroker.com',
    loginPath: '/admin/login',
    dashboard: '/admin/dashboard',
    allowedKeywords: ['admin', 'owner', 'director', 'manager'],
  },
  salesman: {
    id: 'salesman',
    tabLabel: 'Sales Team',
    heading: 'SALES TEAM LOGIN',
    badge: 'Deal Desk',
    icon: 'ri-user-smile-line',
    themeColor: '#ea580c',
    tagline: 'Sales & Client Acquisition Desk',
    subtitle: 'Access assigned leads, generate 1-click WhatsApp property pitches, and track commissions.',
    defaultEmail: 'salesman@bababroker.com',
    loginPath: '/salesman/login',
    dashboard: '/salesman/dashboard',
    allowedKeywords: ['sales', 'salesman', 'agent', 'rep'],
  },
  employee: {
    id: 'employee',
    tabLabel: 'Employee',
    heading: 'EMPLOYEE LOGIN',
    badge: 'Operations & Audit',
    icon: 'ri-building-line',
    themeColor: '#ea580c',
    tagline: 'Flat Audit & Inventory Verification',
    subtitle: 'Manage flat inventory onboarding, verify unit photos, check RERA docs, and audit listings.',
    defaultEmail: 'employee@bababroker.com',
    loginPath: '/employee/login',
    dashboard: '/employee/dashboard',
    allowedKeywords: ['employee', 'staff', 'audit', 'ops', 'operations'],
  },
};

const RATE_LIMIT_MS = 3000;
const MIN_PASSWORD_LEN = 6;

function generateCsrfToken() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const arr = new Uint8Array(24);
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getPasswordStrength(pw) {
  if (!pw) return { score: 0, label: 'Empty', color: 'bg-gray-200' };
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (pw.length >= 12) score += 1;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score += 1;
  if (/\d/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 3) return { score, label: 'Fair', color: 'bg-amber-500' };
  return { score, label: 'Strong', color: 'bg-emerald-500' };
}

export default function LoginPage({ initialRole = 'admin', onSubmit }) {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const detectRoleFromPath = () => {
    const p = location.pathname.toLowerCase();
    if (p.includes('/employee')) return 'employee';
    if (p.includes('/salesman')) return 'salesman';
    if (p.includes('/admin')) return 'admin';
    return initialRole || 'admin';
  };

  const csrfRef = useRef(null);
  if (csrfRef.current === null) {
    csrfRef.current = generateCsrfToken();
  }

  const [activeRoleKey, setActiveRoleKey] = useState(detectRoleFromPath());
  const [email, setEmail] = useState(ROLES[detectRoleFromPath()]?.defaultEmail || 'admin@bababroker.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(0);
  const [now, setNow] = useState(Date.now());

  const activeRole = ROLES[activeRoleKey] || ROLES.admin;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const passwordValid = password.length >= MIN_PASSWORD_LEN && (/[A-Z]/.test(password) || /\d/.test(password) || /[^A-Za-z0-9]/.test(password));
  const inCooldown = now < cooldownUntil;

  useEffect(() => {
    const r = detectRoleFromPath();
    setActiveRoleKey(r);
    setEmail(ROLES[r].defaultEmail);
  }, [location.pathname]);

  useEffect(() => {
    if (!cooldownUntil) return;
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, [cooldownUntil]);

  const handleRoleChange = (roleKey) => {
    if (activeRoleKey === roleKey) return;
    setActiveRoleKey(roleKey);
    setEmail(ROLES[roleKey].defaultEmail);
    const targetPath = ROLES[roleKey].loginPath;
    if (location.pathname !== targetPath) {
      navigate(targetPath, { replace: true });
    }
  };

  const handleKeyUp = (e) => {
    if (e.getModifierState) {
      setIsCapsLockOn(e.getModifierState('CapsLock'));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (inCooldown) {
      const secondsLeft = Math.ceil((cooldownUntil - Date.now()) / 1000);
      toast({
        type: 'error',
        message: `Please wait ${secondsLeft}s before trying again.`,
        duration: 2000,
      });
      return;
    }

    setSubmitting(true);

    try {
      const emailVal = email.trim().toLowerCase();

      if (!emailVal) {
        throw new Error('Please enter your work email.');
      }

      if (!isEmailValid) {
        throw new Error('Please enter a valid email address.');
      }

      if (!password) {
        throw new Error('Please enter your password.');
      }

      if (password.length < MIN_PASSWORD_LEN) {
        throw new Error(`Password must be at least ${MIN_PASSWORD_LEN} characters.`);
      }

      if (!passwordValid) {
        throw new Error('Password must include at least one number or special character.');
      }

      if (activeRoleKey === 'admin') {
        const isSales = emailVal.includes('sales');
        const isEmp = emailVal.includes('employee') || emailVal.includes('staff') || emailVal.includes('audit');
        if (isSales) {
          throw new Error("This credential belongs to Sales Team. Please switch to the 'Sales Team' tab above.");
        }
        if (isEmp) {
          throw new Error("This credential belongs to Employee. Please switch to the 'Employee' tab above.");
        }
      } else if (activeRoleKey === 'salesman') {
        const isAdmin = emailVal.includes('admin') || emailVal.includes('owner');
        const isEmp = emailVal.includes('employee') || emailVal.includes('audit');
        if (isAdmin) {
          throw new Error("This credential is for Administrator. Please switch to the 'Admin' tab.");
        }
        if (isEmp) {
          throw new Error("This credential belongs to Employee. Please switch to the 'Employee' tab.");
        }
      } else if (activeRoleKey === 'employee') {
        const isAdmin = emailVal.includes('admin') || emailVal.includes('owner');
        const isSales = emailVal.includes('sales');
        if (isAdmin) {
          throw new Error("This credential is for Administrator. Please switch to the 'Admin' tab.");
        }
        if (isSales) {
          throw new Error("This credential belongs to Sales Team. Please switch to the 'Sales Team' tab.");
        }
      }

      if (onSubmit) {
        const res = await onSubmit({
          email: emailVal,
          password,
          role: activeRole.id,
          csrfToken: csrfRef.current,
        });
        const redirect = location.state?.from?.pathname || res?.redirectTo || activeRole.dashboard;
        navigate(redirect, { replace: true });
        return;
      }

      const res = await api('/api/auth/login', {
        method: 'POST',
        headers: { 'X-CSRF-Token': csrfRef.current },
        body: JSON.stringify({
          email: emailVal,
          password,
          role: activeRole.id,
          csrfToken: csrfRef.current,
        }),
      }, toast);

      if (res && res.token) {
        setAuth({
          token: res.token,
          role: activeRole.id,
          name: res.user?.name || `${activeRole.tabLabel} Executive`,
          email: res.user?.email || emailVal,
        });

        localStorage.setItem('rememberedRole', activeRole.id);
        toast({ type: 'success', message: `Authenticated as ${activeRole.tabLabel}! Redirecting...`, duration: 2500 });
        navigate(activeRole.dashboard, { replace: true });
        return;
      }

    } catch (err) {
      setCooldownUntil(Date.now() + RATE_LIMIT_MS);
      toast({
        type: 'error',
        message: err.message || 'Unable to sign in. Please check your credentials.',
        duration: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#7c2d12] via-[#9a3412] to-[#431407] p-4 sm:p-6 lg:p-8 font-['Inter',sans-serif] relative overflow-hidden select-text">

      <div className="pointer-events-none absolute -top-40 -left-40 h-[650px] w-[650px] rounded-full bg-gradient-to-br from-orange-500/30 via-amber-500/15 to-transparent blur-[160px] animate-pulse" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[650px] w-[650px] rounded-full bg-gradient-to-tl from-amber-600/25 via-orange-600/15 to-transparent blur-[160px] animate-pulse" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.04]" />

      <div className="flex w-full max-w-4xl min-h-[530px] overflow-hidden rounded-[36px] sm:rounded-[44px] shadow-[0_40px_120px_rgba(0,0,0,0.75),0_0_0_1px_rgba(255,255,255,0.2)] bg-white relative z-10 select-text">

        <div
          className="relative hidden w-[42%] flex-col items-center justify-between py-8 md:flex overflow-hidden"
          style={{
            background: `linear-gradient(145deg, #c2410c 0%, #ea580c 45%, #9a3412 100%)`,
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -top-14 -right-14 h-[420px] w-[420px] bg-gradient-to-br from-orange-300/40 via-amber-300/30 to-transparent"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 50%)',
                filter: 'drop-shadow(-12px 14px 24px rgba(0,0,0,0.3))',
              }}
            />

            <div
              className="absolute top-1/4 -left-12 h-88 w-88 bg-gradient-to-tr from-amber-200/45 via-orange-300/25 to-transparent"
              style={{
                clipPath: 'polygon(0 0, 85% 45%, 0 90%)',
                filter: 'drop-shadow(10px 14px 20px rgba(0,0,0,0.25))',
              }}
            />

            <div
              className="absolute -bottom-20 -right-12 h-80 w-80 bg-gradient-to-tl from-orange-700/75 via-amber-600/40 to-transparent"
              style={{
                clipPath: 'polygon(20% 100%, 100% 0, 100% 100%)',
                filter: 'drop-shadow(-10px -10px 20px rgba(0,0,0,0.25))',
              }}
            />
          </div>

          <div className="relative z-20 w-full px-7 flex items-center justify-between pb-2">
            <Link to="/" className="flex items-center gap-2 group transition-all duration-300 hover:scale-105">
              <img src="/assets/img/logo.svg" alt="Baba Broker" className="h-7 w-auto brightness-0 invert opacity-95" />
            </Link>
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-md border border-white/25 shadow-sm">
              Staff Portal
            </span>
          </div>

          <div className="relative z-20 w-full flex flex-col items-end space-y-4 my-auto pr-0">
            {Object.values(ROLES).map((role) => {
              const isActive = activeRoleKey === role.id;

              return (
                <div key={role.id} className="relative w-full flex justify-end">
                  {isActive ? (
                    <div
                      className="relative z-30 w-[88%] py-3.5 pl-6 pr-5 bg-white rounded-l-full shadow-[-8px_10px_30px_rgba(0,0,0,0.2),inset_0_1px_2px_rgba(255,255,255,0.9)] flex items-center gap-3 cursor-pointer transition-all duration-300 animate-fadeIn -mr-[1px]"
                      onClick={() => handleRoleChange(role.id)}
                    >
                      <svg
                        className="absolute -top-4 right-0 w-4 h-4 pointer-events-none fill-white"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0,16 Q16,16 16,0 L16,16 Z" />
                      </svg>

                      <svg
                        className="absolute -bottom-4 right-0 w-4 h-4 pointer-events-none fill-white"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0,0 Q16,0 16,16 L16,0 Z" />
                      </svg>

                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shrink-0 font-bold shadow-[0_3px_10px_rgba(234,88,12,0.4)] ring-2 ring-orange-100">
                        <i className={`${role.icon} text-sm drop-shadow-xs`} />
                      </div>

                      <span className="text-xs font-black tracking-wider text-slate-900 uppercase truncate drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]">
                        {role.tabLabel}
                      </span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleRoleChange(role.id)}
                      className="w-[88%] py-3 px-6 text-right text-xs font-bold tracking-wider text-white/85 hover:text-white hover:bg-white/15 hover:shadow-inner rounded-l-full uppercase transition-all duration-200 cursor-pointer flex items-center justify-end gap-2.5 group mr-0 active:scale-[0.98]"
                    >
                      <span className="truncate group-hover:-translate-x-1.5 transition-transform font-bold">{role.tabLabel}</span>
                      <i className={`${role.icon} text-sm text-white/70 group-hover:text-white group-hover:scale-115 transition-all`} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="relative z-20 w-full px-7 pt-2 flex items-center justify-between text-[10px] text-white/85 font-bold tracking-wider uppercase">
            <span className="flex items-center gap-1.5">
              <i className="ri-shield-check-fill text-amber-300 text-sm" /> 256-Bit SSL Secured
            </span>
            <span className="opacity-75">v2.4</span>
          </div>

        </div>

        <div className="flex w-full flex-col justify-center bg-white px-7 sm:px-12 py-10 md:w-[58%]">

          <div className="flex md:hidden mb-6 p-1 rounded-2xl bg-slate-100 border border-slate-200 gap-1 shadow-inner">
            {Object.values(ROLES).map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleChange(role.id)}
                className={`flex-1 py-2 px-1 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                  activeRoleKey === role.id
                    ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {role.tabLabel}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center mb-6">

            <div
              className="mb-3 flex h-20 w-20 items-center justify-center rounded-full shadow-[0_12px_30px_rgba(234,88,12,0.35)] border-2 border-white/90 transition-transform duration-300 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, #ea580c, #f59e0b)`,
              }}
            >
              <i className={`${activeRole.icon} text-3xl text-white drop-shadow-md`} />
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-wider text-slate-900 uppercase text-center">
              {activeRole.heading}
            </h2>

            <p className="mt-1 text-xs text-slate-400 text-center max-w-xs font-medium">
              {activeRole.subtitle}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto space-y-6">

            <div className="relative">
              <div
                className={`relative flex items-center border-b transition-all duration-200 pb-2 ${
                  emailFocused ? 'border-[#ea580c]' : 'border-gray-300'
                }`}
              >
                <span className={`mr-3 text-lg shrink-0 transition-colors ${emailFocused ? 'text-[#ea580c]' : 'text-gray-400'}`}>
                  <i className="ri-user-3-line" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="Work Email"
                  required
                  disabled={submitting}
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-gray-400 outline-none font-medium"
                />
                {email && (
                  <span className="shrink-0 text-xs">
                    {isEmailValid ? (
                      <i className="ri-checkbox-circle-fill text-emerald-500 text-base" title="Valid email format" />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEmail('')}
                        className="text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
                        title="Clear"
                      >
                        <i className="ri-close-circle-line text-sm" />
                      </button>
                    )}
                  </span>
                )}
              </div>
            </div>

            <div className="relative">
              <div
                className={`relative flex items-center border-b transition-all duration-200 pb-2 ${
                  passwordFocused ? 'border-[#ea580c]' : 'border-gray-300'
                }`}
              >
                <span className={`mr-3 text-lg shrink-0 transition-colors ${passwordFocused ? 'text-[#ea580c]' : 'text-gray-400'}`}>
                  <i className="ri-lock-line" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  onKeyUp={handleKeyUp}
                  placeholder="Password"
                  required
                  disabled={submitting}
                  className="w-full bg-transparent text-sm text-slate-800 placeholder:text-gray-400 outline-none font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-slate-700 p-1 cursor-pointer shrink-0 transition-colors"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <i className={showPassword ? 'ri-eye-off-line text-base' : 'ri-eye-line text-base'} />
                </button>
              </div>

              {password && (
                <div className="mt-2 flex items-center gap-2 animate-fadeIn">
                  <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                    {passwordStrength.label}
                  </span>
                </div>
              )}

              {isCapsLockOn && (
                <span className="text-[10px] text-amber-600 font-bold block mt-1 px-1 flex items-center gap-1 animate-fadeIn">
                  <i className="ri-alert-line" /> Caps Lock is ON
                </span>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition cursor-pointer hover:underline"
              >
                Forgot Password?
              </button>

              <button
                type="submit"
                disabled={submitting || inCooldown}
                className="px-9 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(234,88,12,0.4)] hover:shadow-[0_6px_25px_rgba(234,88,12,0.6)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 bg-gradient-to-r from-orange-500 via-[#ea580c] to-amber-600"
              >
                {submitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin text-xs" />
                    <span>Signing In...</span>
                  </>
                ) : inCooldown ? (
                  <span>Wait {Math.ceil((cooldownUntil - now) / 1000)}s</span>
                ) : (
                  <span>LOGIN</span>
                )}
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400 font-medium pt-1">
              <i className="ri-time-line mr-1" />
              Session expires after 4 hours of inactivity
            </p>

          </form>

        </div>

      </div>

      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl space-y-4 text-slate-800 border border-slate-100">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <i className="ri-key-2-line text-[#ea580c]" /> Password Recovery
              </h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
              >
                <i className="ri-close-line text-base" />
              </button>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Staff credentials for <strong>{activeRole.tabLabel}</strong> are centrally maintained. Contact your administrator or use the secure channel below to request a reset.
            </p>

            <div className="space-y-2 pt-1">
              <a
                href={`https://wa.me/919891140379?text=Hi%20Admin%2C%20I%20need%20a%20password%20reset%20for%20my%20${encodeURIComponent(activeRole.tabLabel)}%20Baba%20Broker%20account.`}
                target="_blank"
                rel="noreferrer"
                className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 px-4 text-xs font-bold text-center flex items-center justify-center gap-2 shadow-sm transition"
              >
                <i className="ri-whatsapp-line text-base" />
                <span>Contact Admin on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}