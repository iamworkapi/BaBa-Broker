import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      copied: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleCopyError = () => {
    const errorDetails = `Error: ${this.state.error?.message || 'Unknown error'}\n\nStack:\n${this.state.error?.stack || 'No stack trace'}\n\nComponent Stack:\n${this.state.errorInfo?.componentStack || 'No component stack'}\n\nURL: ${window.location.href}\nTime: ${new Date().toISOString()}`;
    navigator.clipboard?.writeText(errorDetails);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2500);
  };

  handleHardReset = () => {
    try {
      sessionStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || 'An unexpected rendering error occurred.';
      const errorStack = this.state.error?.stack || '';

      return (
        <div className="min-h-screen w-screen bg-[#070e1c] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 font-['Inter',sans-serif] relative overflow-hidden select-text">
          {/* Ambient Glow Orbs */}
          <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-orange-600/15 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[140px] pointer-events-none" />

          {/* Background Grid Accent */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Main Error Glass Card */}
          <div className="relative w-full max-w-2xl bg-slate-900/80 backdrop-blur-2xl rounded-[32px] sm:rounded-[36px] border border-slate-800/80 shadow-2xl shadow-black/80 p-6 sm:p-8 lg:p-10 flex flex-col z-10 animate-fadeIn">
            
            {/* Top Badge & System Status */}
            <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-5">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
                  Application Fault Guard
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                <span>Error Code: 500_CLIENT_PANIC</span>
              </div>
            </div>

            {/* Error Hero Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 my-6">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-transparent border border-orange-500/30 flex items-center justify-center text-3xl sm:text-4xl text-orange-400 shadow-xl shadow-orange-500/10 shrink-0">
                <i className="ri-error-warning-line" />
              </div>

              <div className="space-y-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                  Something went wrong
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
                  We encountered an unexpected issue while rendering this view. Your session data remains safe.
                </p>
              </div>
            </div>

            {/* Error Message Box */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800/90 p-4 space-y-2 mb-6">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <i className="ri-terminal-box-line text-orange-400 text-xs" />
                  Exception Message
                </span>
                <button
                  type="button"
                  onClick={this.handleCopyError}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer text-[10px] font-bold"
                  title="Copy diagnostics log"
                >
                  <i className={this.state.copied ? 'ri-check-line text-emerald-400' : 'ri-file-copy-line'} />
                  <span>{this.state.copied ? 'Copied Log' : 'Copy Log'}</span>
                </button>
              </div>
              <p className="text-xs font-mono text-orange-200/90 break-words leading-relaxed">
                {errorMessage}
              </p>
            </div>

            {/* Expandable Technical Details Drawer */}
            <div className="mb-6 space-y-2">
              <button
                type="button"
                onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 border border-slate-800/60 text-xs text-slate-300 transition cursor-pointer font-medium"
              >
                <span className="flex items-center gap-2">
                  <i className="ri-code-s-slash-line text-slate-400" />
                  <span>Technical Diagnostics & Stack Trace</span>
                </span>
                <i
                  className={`ri-arrow-down-s-line transition-transform duration-200 ${
                    this.state.showDetails ? 'rotate-180 text-orange-400' : 'text-slate-400'
                  }`}
                />
              </button>

              {this.state.showDetails && (
                <div className="p-4 rounded-2xl bg-black/70 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-2 max-h-48 overflow-y-auto animate-fadeIn select-all">
                  <div className="text-slate-300 font-bold">Stack Trace:</div>
                  <pre className="whitespace-pre-wrap text-[10px] text-slate-500 leading-tight">
                    {errorStack || 'No detailed stack trace available.'}
                  </pre>
                  {this.state.errorInfo?.componentStack && (
                    <>
                      <div className="text-slate-300 font-bold pt-2">Component Hierarchy:</div>
                      <pre className="whitespace-pre-wrap text-[10px] text-slate-500 leading-tight">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    this.setState({ hasError: false, error: null, errorInfo: null });
                  }}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs font-bold shadow-lg shadow-orange-600/25 transition cursor-pointer active:scale-98"
                >
                  <i className="ri-refresh-line text-sm" />
                  <span>Try to Recover</span>
                </button>

                <button
                  type="button"
                  onClick={this.handleHardReset}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-slate-700/80 transition cursor-pointer"
                >
                  <i className="ri-restart-line text-sm" />
                  <span>Reload View</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => (window.location.href = '/admin/dashboard')}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold border border-slate-800 transition cursor-pointer"
                >
                  <i className="ri-dashboard-line text-xs" />
                  <span>Admin Desk</span>
                </button>

                <button
                  type="button"
                  onClick={() => (window.location.href = '/')}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold border border-slate-800 transition cursor-pointer"
                >
                  <i className="ri-home-4-line text-xs" />
                  <span>Portal Home</span>
                </button>
              </div>
            </div>

            {/* Footer Support Info */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-normal">
              <span>Baba Broker Resilient Engine v2.4</span>
              <a
                href="mailto:support@bababroker.com?subject=Platform%20Exception%20Report"
                className="text-orange-400 hover:text-orange-300 transition"
              >
                Contact Support Desk →
              </a>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}