const PropertyCard = ({
  type = 'Buy',
  image,
  photoCount = 2,
  title,
  location,
  price,
  area,
  baths,
  beds,
  parking,
}) => {
  return (
    <div className="property-card-wrapper card-advanced group cursor-pointer">
      {/* Image Header */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-800">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Top badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span className="bg-white/90 backdrop-blur-sm text-slate-900 text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-md leading-none">
            {type}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <div className="bg-black/40 backdrop-blur-sm text-white text-[11px] px-2.5 py-1.5 rounded-full flex items-center gap-1.5 border border-white/10">
            <i className="fa-regular fa-image text-[10px]"></i>
            <span>{photoCount}</span>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="property-card-overlay">
          <div className="flex gap-2 mb-3">
            <button className="flex-1 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold py-2.5 hover:bg-white/25 transition cursor-pointer">
              <i className="fa-solid fa-eye mr-1.5 text-[10px]"></i>View Details
            </button>
            <button className="rounded-xl bg-accent/90 text-white text-[11px] font-bold px-3.5 py-2.5 hover:bg-accent transition cursor-pointer">
              <i className="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>
          <p className="text-[11px] text-white/70 font-medium">
            <i className="fa-solid fa-location-dot mr-1 text-accent text-[10px]"></i>{location}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col bg-[#111827]">
        <h3 className="text-[15px] font-bold text-white mb-1.5 leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-2">
          {title}
        </h3>
        <div className="flex items-center text-slate-400 text-xs mb-4">
          <i className="fa-solid fa-location-dot mr-1.5 text-accent text-[10px]"></i>
          <span className="truncate">{location}</span>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
          <span className="inline-flex items-center bg-accent/10 text-accent font-bold text-sm px-3 py-1.5 rounded-lg">
            {typeof price === 'string' && price.startsWith('$') ? price : `₹ ${price}`}
          </span>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            {area && <span className="flex items-center gap-1"><i className="fa-solid fa-ruler-combined text-[9px]"></i>{area}</span>}
            {beds && <span className="flex items-center gap-1"><i className="fa-solid fa-bed text-[9px]"></i>{beds}</span>}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="grid grid-cols-4 border-t border-white/5 bg-[#0f172a]">
        {[
          { val: area, icon: 'fa-solid fa-expand', label: 'Area' },
          { val: baths, icon: 'fa-solid fa-bath', label: 'Baths' },
          { val: beds, icon: 'fa-solid fa-bed', label: 'Beds' },
          { val: parking, icon: 'fa-solid fa-car', label: 'Parking' },
        ].map((item, idx) => (
          <div key={idx} className="text-center py-3 border-r border-white/5 last:border-r-0 flex flex-col justify-center items-center">
            <i className={`${item.icon} text-[10px] text-slate-500 mb-1`} />
            <span className="text-white font-bold text-[11px]">{item.val}</span>
            <span className="text-slate-500 text-[9px] uppercase tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyCard;
