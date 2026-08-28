import { useEffect, useState } from 'react';

export default function Preloader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHidden(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="preloader" className={hidden ? 'hidden' : ''}>
      <div className="flex items-center gap-3 mb-5">
        <div className="preloader-dot" />
        <div className="preloader-dot" />
        <div className="preloader-dot" />
      </div>
      <p className="text-xs font-bold text-slate-400 tracking-[0.3em] uppercase">Baba Broker</p>
    </div>
  );
}
