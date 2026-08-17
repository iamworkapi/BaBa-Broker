import React from 'react';

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
    parking 
}) => {
    return (
        <div className="bg-white rounded-none shadow-md overflow-hidden flex flex-col h-full border border-gray-100 group">
            {/* Image Header */}
            <div className="relative h-60 w-full overflow-hidden bg-gray-200">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Type Badge (Buy/Rent) */}
                <div className="absolute top-4 left-4">
                    <span className="bg-white text-gray-800 text-xs font-bold px-4 py-3 rounded-full shadow-md leading-none">
                        {type}
                    </span>
                </div>

                {/* Photo Count Badge */}
                <div className="absolute bottom-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-sm flex items-center gap-1.5">
                        <i className="fa-regular fa-image"></i>
                        <span>{photoCount}</span>
                    </div>
                </div>
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col bg-white">
                <h3 className="text-[22px] font-normal text-accent mb-2">
                    {title}
                </h3>
                <div className="flex items-center text-gray-400 text-[13px] italic mb-6">
                    <i className="fa-solid fa-location-dot mr-2"></i>
                    <span>{location}</span>
                </div>
                
                <div className="mt-auto">
                    <span className="inline-block bg-[#5e6368] text-white font-semibold text-sm px-4 py-2 rounded-sm shadow-sm">
                        $ {price}
                    </span>
                </div>
            </div>

            {/* Card Footer */}
            <div className="grid grid-cols-4 border-t border-gray-100 bg-white">
                <div className="text-center py-4 border-r border-gray-100 flex flex-col justify-center items-center">
                    <span className="text-gray-700 font-bold text-[13px]">{area}</span>
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider mt-1">Area</span>
                </div>
                <div className="text-center py-4 border-r border-gray-100 flex flex-col justify-center items-center">
                    <span className="text-gray-700 font-bold text-[13px]">{baths}</span>
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider mt-1">Baths</span>
                </div>
                <div className="text-center py-4 border-r border-gray-100 flex flex-col justify-center items-center">
                    <span className="text-gray-700 font-bold text-[13px]">{beds}</span>
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider mt-1">Beds</span>
                </div>
                <div className="text-center py-4 flex flex-col justify-center items-center">
                    <span className="text-gray-700 font-bold text-[13px]">{parking}</span>
                    <span className="text-gray-400 text-[10px] uppercase tracking-wider mt-1">Parking</span>
                </div>
            </div>
        </div>
    );
};

export default PropertyCard;
