import React from 'react';

export default function SectionHeader({ eyebrow, title, description, align = 'center' }) {
  const alignment = align === 'left' ? 'text-left items-start' : 'text-center items-center';
  return <div className={`mx-auto mb-10 flex max-w-2xl flex-col ${alignment}`}>
    {eyebrow && <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-accent">{eyebrow}</p>}
    <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{title}</h2>
    {description && <p className="mt-4 text-base leading-7 text-gray-400">{description}</p>}
  </div>;
}
