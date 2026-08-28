import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getInvestorProfile } from "../../utils/investorProfile";
import ScrollReveal from "../ScrollReveal";

const defaultSpecs = (type, bhk, area, baths, parking) => ({
  type: type === "Rent" ? "Rental Apartment" : "Premium Condominium",
  bhk: bhk || "3 BHK",
  superArea: `${area} sqft`,
  carpetArea: `${Math.round(parseInt(area.replace(/,/g, "")) * 0.9)} sqft`,
  bathrooms: baths || "3",
  furnishing: "Semi-Furnished",
  status: "Ready to Move",
  listedBy: "Agent",
  facing: "North-East",
  parking: parking || "1 Car Parking",
  maintenance: "₹3,000 /mo",
  totalFloors: "10",
});

const initialPropertiesData = {
  residential: [
      {
        id: 1,
        title: "1 BHK fully furnished floor with lift, bike parking near metro",
        location: "Dwarka Mor, Delhi",
        price: "₹ 18,00,000",
        type: "Buy",
        imagesCount: 4,
        area: "400",
        baths: "1",
        beds: "1",
        parking: "Bike Only",
        image:
          "https://apollo.olx.in/v1/files/y3pomghajbyn3-IN/image;s=600x1200;q=60;f=webp",
        images: [
          "https://apollo.olx.in/v1/files/dkcfvxy4nw3t2-IN/image;s=600x1200;q=60;f=webp",
          "https://apollo.olx.in/v1/files/o52xw31u5xuk3-IN/image;s=600x1200;q=60;f=webp",
          "https://apollo.olx.in/v1/files/skjmdul29ud73-IN/image;s=600x1200;q=60;f=webp",
          "https://apollo.olx.in/v1/files/y3pomghajbyn3-IN/image;s=600x1200;q=60;f=webp",
        ],
        specs: {
          type: "Independent Floor",
          bhk: "1 BHK",
          superArea: "400 sqft",
          carpetArea: "380 sqft",
          bathrooms: "1",
          furnishing: "Furnished",
          status: "Ready to Move",
          listedBy: "Builder",
          facing: "West",
          parking: "Bike Only",
          maintenance: "₹0",
          totalFloors: "4",
        },
      },
      {
        id: 2,
        title:
          "2 BHK semi furnished builder floor near metro with terrace rights",
        location: "Uttam Nagar East, Delhi",
        price: "₹ 28,50,000",
        type: "Buy",
        imagesCount: 2,
        area: "650",
        baths: "2",
        beds: "2",
        parking: "1 Car",
        image:
          "https://housing-images.n7net.in/012c1500/4ce90595e17d28632e87eb867d8bc0e8/v0/fs.jpeg",
        images: [
          "https://housing-images.n7net.in/012c1500/7a2c071d0941977f7a8a6b40d3b1bfee/v0/fs-large.jpeg",
          "https://housing-images.n7net.in/012c1500/4d9aba06d5c51fc5f0838ed3d1b79b00/v0/fs.jpeg",
        ],
        specs: {
          type: "Independent Floor",
          bhk: "2 BHK",
          superArea: "650 sqft",
          carpetArea: "600 sqft",
          bathrooms: "2",
          furnishing: "Semi-Furnished",
          status: "Ready to Move",
          listedBy: "Builder",
          facing: "North",
          parking: "1 Covered Car",
          maintenance: "₹500 /mo",
          totalFloors: "4",
        },
      },
      {
        id: 3,
        title: "3 BHK luxury floor with lift, car parking, branded fittings",
        location: "Sector 15 Dwarka, Delhi",
        price: "₹ 45,00,000",
        type: "Buy",
        imagesCount: 2,
        area: "950",
        baths: "3",
        beds: "3",
        parking: "1 Car",
        image:
          "https://housing-images.n7net.in/01c16c28/93c7b5f29cff32eb100ef54a381fc63d/v0/fs/3_bhk_apartment-for-sale-sector_2_dwarka-New+Delhi-living_room.jpg",
        images: [
          "https://housing-images.n7net.in/01c16c28/fbb5f708d63a9a5fca36f126369e99f6/v0/fs/3_bhk_apartment-for-sale-sector_2_dwarka-New+Delhi-bedroom_one.jpg",
          "https://housing-images.n7net.in/01c16c28/4828704392f3a81d1a54b2ed1a6b8053/v0/fs/3_bhk_apartment-for-sale-sector_2_dwarka-New+Delhi-bedroom_one.jpg",
          "https://housing-images.n7net.in/01c16c28/e16fb000a75e6baa6b373e526741d533/v0/fs/3_bhk_apartment-for-sale-sector_2_dwarka-New+Delhi-attached_balcony_with_bedroom_one.jpg",
          "https://housing-images.n7net.in/01c16c28/e3578d493ed4fce10080e93416779b80/v0/fs/3_bhk_apartment-for-sale-sector_2_dwarka-New+Delhi-attached_bathroom_with_bedroom_one.jpg",
          "https://housing-images.n7net.in/01c16c28/e6df6a1014d3c3dce576fe67a5fdd527/v0/fs/3_bhk_apartment-for-sale-sector_2_dwarka-New+Delhi-kitchen.jpg",
          "https://housing-images.n7net.in/01c16c28/93c7b5f29cff32eb100ef54a381fc63d/v0/fs/3_bhk_apartment-for-sale-sector_2_dwarka-New+Delhi-living_room.jpg",
        ],
        specs: {
          type: "Independent Floor",
          bhk: "3 BHK",
          superArea: "950 sqft",
          carpetArea: "900 sqft",
          bathrooms: "3",
          furnishing: "Semi-Furnished",
          status: "Ready to Move",
          listedBy: "Builder",
          facing: "East",
          parking: "1 Covered Car",
          maintenance: "₹1,000 /mo",
          totalFloors: "4",
        },
      },
    ],
    plots: [
      {
        id: 7,
        title: "Green Valley Estate Premium Plot",
        location: "Austin, Texas",
        price: "$850,000",
        type: "Buy",
        imagesCount: 4,
        area: "10,000",
        baths: "-",
        beds: "-",
        parking: "-",
        image:
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
        specs: defaultSpecs("Buy", "Commercial Plot", "10,000", "-", "-"),
      },
    ],
    commercial: [
      {
        id: 13,
        title: "Downtown Innovation Tech Tower",
        location: "Chicago Loop, IL",
        price: "$15,000 /mo",
        type: "Rent",
        imagesCount: 15,
        area: "8,000",
        baths: "4",
        beds: "-",
        parking: "12 Cars",
        image:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
        specs: defaultSpecs("Rent", "Tech Space", "8,000", "4", "12 Vehicles"),
      },
    ],
    rental: [
      {
        id: 19,
        title: "Sunset Studio Panoramic Loft",
        location: "Miami Beach, FL",
        price: "$3,500 /mo",
        type: "Rent",
        imagesCount: 5,
        area: "900",
        baths: "1",
        beds: "1",
        parking: "1 Car",
        image:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
        specs: defaultSpecs("Rent", "Studio", "900", "1", "1 Vehicle"),
      },
    ],
  };

const PropertyTypesSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("residential");
  const [selectedProp, setSelectedProp] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestAmount, setRequestAmount] = useState(500000);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestError, setRequestError] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(false);

  const [dbProperties, setDbProperties] = useState([]);

  useEffect(() => {
    fetch('/api/properties')
      .then((res) => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setDbProperties(data);
        }
      })
      .catch(() => {});
  }, []);

  const propertiesData = useMemo(() => {
    if (!dbProperties || dbProperties.length === 0) return initialPropertiesData;

    const formattedDbProps = dbProperties.map((p, idx) => {
      const pType = (p.propertyType || p.type || 'residential').toString().trim().toLowerCase();
      const catKey = pType === 'plot' ? 'plots' : pType === 'commercial' ? 'commercial' : 'residential';

      const priceStr = p.price || (p.totalValuation ? `₹ ${p.totalValuation.toLocaleString('en-IN')}` : 'Price on Request');
      const imgList =
        Array.isArray(p.images) && p.images.length > 0
          ? p.images
          : p.image
          ? [p.image]
          : [
              'https://housing-images.n7net.in/4f2250e8/233a502501247c905f9f712e15231459/v0/large/planner_lotus_residency-sewak_park-new+delhi-planner_n_maker.jpeg',
            ];

      return {
        id: p._id || `db-${idx}`,
        title: p.title,
        location: p.location,
        price: priceStr,
        type: p.investmentModel === 'renovate_flip' ? 'Flip Deal' : 'Co-Invest',
        imagesCount: imgList.length,
        area: p.sizeSqft || '1,200',
        baths: p.bhk === '4bhk' ? '4' : p.bhk === '3bhk' ? '3' : '2',
        beds: p.bhk === '4bhk' ? '4' : p.bhk === '3bhk' ? '3' : '2',
        parking: p.parking || '1 Car',
        image: imgList[0],
        images: imgList,
        catKey,
        specs: {
          type: pType.toUpperCase(),
          bhk: (p.bhk || '2BHK').toUpperCase(),
          superArea: p.sizeSqft || '1,200 sqft',
          carpetArea: p.sizeSqft ? `${Math.round(parseInt(p.sizeSqft) * 0.9 || 1000)} sqft` : '1,080 sqft',
          bathrooms: p.bhk === '4bhk' ? '4' : '3',
          furnishing: 'Semi-Furnished',
          status: p.status ? p.status.toUpperCase() : 'RUNNING',
          listedBy: 'Baba Broker',
          facing: 'North-East',
          parking: p.parking || 'Car + Bike',
          maintenance: 'Included',
          totalFloors: p.floor || '4',
        },
      };
    });

    const grouped = {
      residential: formattedDbProps.filter((p) => p.catKey === 'residential'),
      plots: formattedDbProps.filter((p) => p.catKey === 'plots'),
      commercial: formattedDbProps.filter((p) => p.catKey === 'commercial'),
      rental: formattedDbProps.filter((p) => p.catKey === 'rental'),
    };

    return {
      residential: grouped.residential.length > 0 ? grouped.residential : initialPropertiesData.residential,
      plots: grouped.plots.length > 0 ? grouped.plots : initialPropertiesData.plots,
      commercial: grouped.commercial.length > 0 ? grouped.commercial : initialPropertiesData.commercial,
      rental: grouped.rental.length > 0 ? grouped.rental : initialPropertiesData.rental,
    };
  }, [dbProperties]);

  const tabs = [
    { id: "residential", label: "Residential", count: propertiesData.residential?.length || 0, icon: "fa-house" },
    { id: "plots", label: "Plots", count: propertiesData.plots?.length || 0, icon: "fa-map" },
    { id: "commercial", label: "Commercial", count: propertiesData.commercial?.length || 0, icon: "fa-building" },
    { id: "rental", label: "Rental", count: propertiesData.rental?.length || 0, icon: "fa-key" },
  ];

  const currentProperties = propertiesData[activeTab] || [];

  const openSpecsModal = (prop) => {
    setSelectedProp({ ...prop, catKey: prop.catKey || activeTab });
    setCurrentImgIndex(0);
    setShowRequestForm(false);
    setRequestError("");
    setRequestSuccess(false);
    setRequestAmount(500000);
    setRequestMessage("");
  };

  const handleInitiateInquiry = () => {
    if (!selectedProp) return;
    const investor = getInvestorProfile();

    if (!investor || !investor._id) {
      navigate("/become-investor", {
        state: {
          pendingPlan: {
            id: selectedProp.id,
            title: selectedProp.title,
            location: selectedProp.location,
            propertyType: selectedProp.catKey,
            catKey: selectedProp.catKey,
          },
        },
      });
      return;
    }

    setShowRequestForm(true);
  };

  const submitInvestmentRequest = async () => {
    if (!selectedProp) return;
    const investor = getInvestorProfile();
    if (!investor || !investor._id) {
      setRequestError("Investor profile not found. Please register again.");
      return;
    }

    setRequestSubmitting(true);
    setRequestError("");
    try {
      const res = await fetch("/api/investment-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investorId: investor._id,
          propertyId: selectedProp.id,
          propertyTitle: selectedProp.title,
          propertyLocation: selectedProp.location,
          propertyType: selectedProp.catKey,
          planCategory: selectedProp.catKey,
          requestedAmount: Number(requestAmount) || 0,
          message: requestMessage.trim(),
        }),
      });
      const body = await res.text();
      const data = body ? JSON.parse(body) : {};
      if (!res.ok) throw new Error(data.error || "Failed to submit investment request.");
      setRequestSuccess(true);
    } catch (err) {
      setRequestError(err.message || "Something went wrong. Please try again.");
    } finally {
      setRequestSubmitting(false);
    }
  };

  return (
    /* Integrated exact specified styling rules here */
    <section className="relative overflow-hidden bg-slate-950 px-6 py-24 sm:py-32 antialiased selection:bg-orange-500/30">
      {/* Premium ambient backdrop glow layers */}
      <div className="absolute -top-60 top-1/4 h-[500px] w-[500px] rounded-full bg-orange-600/20 blur-[140px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute -bottom-24 bottom-1/4 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-[120px] mix-blend-screen pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto text-center z-10">
        <ScrollReveal>
        <div className="inline-flex items-center gap-2 border border-slate-800 bg-slate-900/60 backdrop-blur-md rounded-full px-4 py-1.5 text-xs font-semibold tracking-wider text-orange-400 uppercase mb-5 shadow-inner">
          <i className="fa-solid fa-house text-[10px]"></i> Curated Portfolios
        </div>

        {/* Headings */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 mb-4 tracking-tight">
          Explore Diverse{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">
            Property Typologies
          </span>
        </h2>
        <p className="text-slate-400 mb-12 max-w-2xl mx-auto text-sm sm:text-base font-normal leading-relaxed">
          Browse residential setups, commercial floors, architectural plots, and
          premium long-term rentals. Click a property to slide open its
          comprehensive specification sheet.
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-16 bg-slate-900/40 backdrop-blur-md p-1.5 rounded-2xl w-max mx-auto border border-slate-800/80 shadow-2xl">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 transform active:scale-95 ${
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 font-bold shadow-[0_4px_20px_rgba(249,115,22,0.25)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                <i
                  className={`fa-solid ${tab.icon} ${isActive ? "text-slate-950" : "text-slate-500"}`}
                ></i>
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProperties.map((prop) => {
            const isRent = prop.type === "Rent";
            return (
              <div
                key={prop.id}
                onClick={() => openSpecsModal(prop)}
                className="group relative bg-slate-900/40 border border-slate-800/80 rounded-3xl overflow-hidden flex flex-col text-left transition-all duration-500 hover:border-orange-500/40 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(249,115,22,0.08)] cursor-pointer backdrop-blur-sm"
              >
                {/* Image Area */}
                <div className="relative h-[250px] w-full overflow-hidden bg-slate-950">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40"></div>

                  <div
                    className={`absolute top-4 left-4 border font-semibold text-xs px-3 py-1 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 group-hover:translate-x-0.5 ${
                      isRent
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-orange-500/10 border-orange-500/30 text-orange-400"
                    }`}
                  >
                    {prop.type}
                  </div>

                  <div className="absolute bottom-4 right-4 bg-slate-900/80 border border-slate-800/60 backdrop-blur-md text-slate-300 font-medium text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md">
                    <i className="fa-regular fa-images text-slate-400"></i>
                    {prop.imagesCount}
                  </div>
                </div>

                {/* Content Frame */}
                <div className="p-6 flex-1 relative flex flex-col justify-between bg-slate-900/20">
                  <div className="absolute -top-5 left-6 bg-slate-900 border border-slate-800 text-slate-100 text-sm font-semibold px-4 py-1.5 rounded-xl shadow-xl transition-all duration-300 group-hover:border-orange-500/50 group-hover:text-orange-400">
                    {prop.price}
                  </div>

                  <div className="mt-4">
                    <h3 className="text-slate-200 group-hover:text-white transition-colors duration-300 text-lg font-semibold line-clamp-2 leading-snug">
                      {prop.title}
                    </h3>
                    <p className="text-slate-400 text-xs mt-2 flex items-center gap-1.5 font-normal tracking-wide">
                      <i className="fa-solid fa-location-dot text-slate-500 group-hover:text-orange-400 transition-colors"></i>
                      {prop.location}
                    </p>
                  </div>
                </div>

                {/* Technical Metric Footer Row */}
                <div className="border-t border-slate-900 grid grid-cols-4 bg-slate-900/60 backdrop-blur-sm relative divide-x divide-slate-950">
                  <div className="flex flex-col items-center justify-center py-3.5 transition-colors duration-300 group-hover:bg-slate-800/20">
                    <span className="text-slate-200 font-semibold text-xs">
                      {prop.area}
                    </span>
                    <span className="text-slate-500 text-[9px] uppercase font-medium tracking-wider mt-0.5">
                      SqFt
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-3.5 transition-colors duration-300 group-hover:bg-slate-800/20">
                    <span className="text-slate-200 font-semibold text-xs">
                      {prop.baths}
                    </span>
                    <span className="text-slate-500 text-[9px] uppercase font-medium tracking-wider mt-0.5">
                      Baths
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-3.5 transition-colors duration-300 group-hover:bg-slate-800/20">
                    <span className="text-slate-200 font-semibold text-xs">
                      {prop.beds}
                    </span>
                    <span className="text-slate-500 text-[9px] uppercase font-medium tracking-wider mt-0.5">
                      Beds
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center py-3.5 transition-colors duration-300 group-hover:bg-slate-800/20 px-1 overflow-hidden">
                    <span className="text-slate-200 font-medium text-[11px] truncate max-w-full text-center">
                      {prop.parking}
                    </span>
                    <span className="text-slate-500 text-[9px] uppercase font-medium tracking-wider mt-0.5">
                      Parking
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
          </ScrollReveal>
      </div>

      {/* Sidebar Layout Layer */}
      {selectedProp &&
        selectedProp.specs &&
        (() => {
          const imagesList = selectedProp.images || [selectedProp.image];
          const handlePrevImg = (e) => {
            e.stopPropagation();
            setCurrentImgIndex((prev) =>
              prev === 0 ? imagesList.length - 1 : prev - 1,
            );
          };
          const handleNextImg = (e) => {
            e.stopPropagation();
            setCurrentImgIndex((prev) =>
              prev === imagesList.length - 1 ? 0 : prev + 1,
            );
          };

          return (
            <>
              <div
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9998] transition-opacity duration-300"
                onClick={() => setSelectedProp(null)}
              />

              <div
                className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800/80 z-[9999] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden transition-transform duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Floating Close Button */}
                <button
                  onClick={() => setSelectedProp(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-950/70 border border-slate-800 w-9 h-9 rounded-full flex items-center justify-center transition-all z-30 shadow-xl hover:scale-105"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>

                {/* Slider Image Shell */}
                <div className="relative h-[280px] w-full bg-slate-950 shrink-0 shadow-inner">
                  <img
                    src={imagesList[currentImgIndex]}
                    alt={`${selectedProp.title}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-950/30"></div>

                  {imagesList.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImg}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 hover:text-orange-400"
                      >
                        <i className="fa-solid fa-chevron-left text-xs"></i>
                      </button>
                      <button
                        onClick={handleNextImg}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 text-white w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 hover:text-orange-400"
                      >
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-4 left-4 bg-slate-950/70 px-3 py-1 rounded-full border border-slate-800/50 backdrop-blur-md text-[10px] text-slate-300 font-semibold tracking-wider">
                    {currentImgIndex + 1} / {imagesList.length} Units
                  </div>
                </div>

                {/* Specification Grid Content Container */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 bg-gradient-to-b from-slate-900 to-slate-950">
                  <div>
                    <span
                      className={`inline-block font-semibold text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-md mb-2.5 ${
                        selectedProp.type === "Rent"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      }`}
                    >
                      {selectedProp.type === "Rent"
                        ? "Active Listing"
                        : "Verified Deal"}
                    </span>
                    <h3 className="text-slate-100 text-xl font-semibold leading-snug tracking-tight">
                      {selectedProp.title}
                    </h3>
                  </div>

                  {/* Pricing Block */}
                  <div className="grid grid-cols-2 gap-px bg-slate-800/40 rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="p-4 bg-slate-900/60 flex flex-col justify-center">
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1">
                        Valuation / Rent
                      </span>
                      <span className="text-orange-400 font-bold text-lg leading-none">
                        {selectedProp.price}
                      </span>
                    </div>
                    <div className="p-4 bg-slate-900/60 flex flex-col justify-center border-l border-slate-800/50">
                      <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider mb-1">
                        Location Hub
                      </span>
                      <span className="text-slate-200 font-medium text-xs truncate flex items-center gap-1">
                        <i className="fa-solid fa-location-dot text-amber-500 text-[10px]"></i>
                        {selectedProp.location}
                      </span>
                    </div>
                  </div>

                  {/* Parameters Matrix Grid */}
                  <div className="space-y-3">
                    <h4 className="text-slate-400 font-bold text-[11px] uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>{" "}
                      Technical Matrix
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(selectedProp.specs).map(([key, val]) => (
                        <div
                          key={key}
                          className="p-3 bg-slate-900/40 border border-slate-800/80 rounded-xl flex flex-col justify-between transition-all duration-300 hover:border-slate-700/60"
                        >
                          <span className="text-slate-500 capitalize text-[11px] font-medium tracking-wide">
                            {key.replace(/([A-Z])/g, " $1")}
                          </span>
                          <span className="text-slate-200 font-semibold text-xs mt-1 truncate">
                            {val || "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Investment Request Flow */}
                  {requestSuccess ? (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-1.5">
                      <i className="fa-solid fa-circle-check text-emerald-400 text-xl block"></i>
                      <p className="text-xs font-bold text-white">Request Sent to Admin!</p>
                      <p className="text-[11px] text-slate-400">
                        Our team will review your request for this plan and reach out to you shortly.
                      </p>
                    </div>
                  ) : showRequestForm ? (
                    <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
                      <h4 className="text-[11px] font-black uppercase tracking-wider text-orange-400">
                        Request to Invest in this Plan
                      </h4>

                      {requestError && (
                        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-[11px] text-red-200">
                          {requestError}
                        </div>
                      )}

                      <label className="block text-[11px] font-medium text-slate-300">
                        Amount You Wish to Invest (₹)
                        <input
                          type="number"
                          min="0"
                          value={requestAmount}
                          onChange={(e) => setRequestAmount(e.target.value)}
                          className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-white outline-none focus:border-orange-500"
                        />
                      </label>

                      <label className="block text-[11px] font-medium text-slate-300">
                        Message to Admin (optional)
                        <textarea
                          rows="2"
                          value={requestMessage}
                          onChange={(e) => setRequestMessage(e.target.value)}
                          placeholder="Any questions about this plan..."
                          className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-white outline-none focus:border-orange-500"
                        />
                      </label>

                      <button
                        onClick={submitInvestmentRequest}
                        disabled={requestSubmitting}
                        className="w-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {requestSubmitting ? "Sending..." : "Confirm & Send Request"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleInitiateInquiry}
                      className="w-full mt-4 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-slate-950 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-lg hover:shadow-orange-500/10 flex items-center justify-center gap-2"
                    >
                      <i className="fa-solid fa-paper-plane text-[11px]"></i>{" "}
                      Initiate Inquiry
                    </button>
                  )}
                </div>
              </div>
            </>
          );
        })()}
    </section>
  );
};

export default PropertyTypesSection;
