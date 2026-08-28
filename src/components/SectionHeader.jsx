
export default function SectionHeader({ eyebrow, title, description, align = 'center' }) {
  const alignment = align === 'left' ? 'text-left items-start' : 'text-center items-center';
  return (
    <div className={`mx-auto mb-12 flex max-w-2xl flex-col ${alignment}`}>
      {eyebrow && (
        <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent self-start">
          <span className="h-[2px] w-5 bg-accent rounded-full" />
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <div className="section-divider mt-5 mb-4" />
      {description && <p className="text-sm leading-7 text-slate-400 max-w-lg">{description}</p>}
    </div>
  );
}
