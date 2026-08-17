import React, { useEffect, useState } from 'react';

export default function SectionNavigator({ sections }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-35% 0px -45% 0px', threshold: [0.05, 0.2] });
    sections.forEach(({ id }) => { const element = document.getElementById(id); if (element) observer.observe(element); });
    return () => observer.disconnect();
  }, [sections]);

  return <aside aria-label="Home page sections" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
    <div className="rounded-full border border-white/10 bg-dark/75 px-2 py-3 shadow-2xl backdrop-blur-xl">
      {sections.map((section) => <a key={section.id} href={`#${section.id}`} aria-label={`Jump to ${section.label}`} className="group relative flex h-7 items-center justify-end">
        <span className="pointer-events-none absolute right-7 hidden whitespace-nowrap rounded-lg bg-dark-2 px-3 py-1.5 text-xs font-semibold text-white shadow-lg group-hover:block">{section.label}</span>
        <span className={`block rounded-full transition-all duration-300 ${active === section.id ? 'h-5 w-1.5 bg-accent' : 'h-1.5 w-1.5 bg-white/35 group-hover:bg-white'}`}></span>
      </a>)}
    </div>
  </aside>;
}
