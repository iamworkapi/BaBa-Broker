import React from 'react';

export default function Investor() {
  return (
    <>
            

    {/*  Hero Section Start  */}
    <section id="home" className="hero-section flex items-center">
        <div className="w-full flex flex-col items-center justify-center px-4 py-20 sm:py-28 text-center fade-in lg:-mt-20">

            {/*  Subtitle  */}
            <p className="text-accent text-sm sm:text-base font-semibold mb-3 tracking-wide">
                Homes that fit your lifestyle
            </p>

            {/*  Heading  */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-10 max-w-4xl">
                Discover a Home you'll love
            </h1>

            {/*  Search Box Container  */}
            <div className="w-full max-w-3xl">

                {/*  Tabs row: Buy / Rent + category pills  */}
                <div className="flex flex-wrap items-center gap-2 mb-0">
                    {/*  Buy/Rent toggle  */}
                    <div className="hero-tab-group flex">
                        <button className="hero-tab active" id="tab-buy" onClick={() => window.heroTab(this,'buy')}>
                            Buy <span className="hero-tab-dot"></span>
                        </button>
                        <button className="hero-tab" id="tab-rent" onClick={() => window.heroTab(this,'rent')}>Rent</button>
                    </div>
                    {/*  Category pills — hidden on mobile  */}
                    <div className="hidden sm:flex flex-wrap gap-2 ml-2">
                        <button className="hero-pill">Affordable</button>
                        <button className="hero-pill">Luxury</button>
                        <button className="hero-pill">Investment</button>
                    </div>
                </div>

                {/*  Mobile category pills  */}
                <div className="flex sm:hidden flex-wrap gap-2 mt-2 mb-1 justify-center">
                    <span className="text-xs text-white/70 border border-white/20 rounded-full px-3 py-1">Affordable</span>
                    <span className="text-xs text-white/70 border border-white/20 rounded-full px-3 py-1">Luxury</span>
                    <span className="text-xs text-white/70 border border-white/20 rounded-full px-3 py-1">Investment</span>
                </div>

                {/*  Search bar  */}
                <div className="hero-search-bar" style={{ position: 'relative' }}>
                    {/*  City picker trigger  */}
                    <div className="hero-city-select" id="cityPickerTrigger" onClick={() => window.toggleCityPicker(event)}>
                        <span id="cityPickerLabel"
                            className="text-gray-800 font-semibold text-sm whitespace-nowrap">Mumbai</span>
                        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20"
                            fill="#6b7280" id="cityChevron" style={{ transition: 'transform 0.2s', flexShrink: '0' }}>
                            <path
                                d="M480-362q-8 0-15-2.5t-13-8.5L268-557q-11-11-11-28t11-28q11-11 28-11t28 11l156 156 156-156q11-11 28-11t28 11q11 11 11 28t-11 28L508-373q-6 6-13 8.5t-15 2.5Z" />
                        </svg>
                    </div>
                    <div className="w-px bg-gray-300 h-8 mx-1 shrink-0"></div>
                    {/*  Search input  */}
                    <div className="flex flex-1 items-center gap-2 px-2 min-w-0">
                        <input type="text" placeholder="Search Locality, Landmark or Project"
                            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none py-1" />
                        <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"
                            style={{ flexShrink: '0', color: 'var(--color-primary)' }}>
                            <path
                                d="M10.9172 9.66621H10.2589L10.0255 9.44121C11.0255 8.27454 11.5422 6.68288 11.2589 4.99121C10.8672 2.67455 8.93385 0.824545 6.60052 0.541211C3.07552 0.107878 0.108855 3.07454 0.542188 6.59955C0.825521 8.93288 2.67552 10.8662 4.99219 11.2579C6.68385 11.5412 8.27552 11.0245 9.44219 10.0245L9.66719 10.2579V10.9162L13.2089 14.4579C13.5505 14.7995 14.1089 14.7995 14.4505 14.4579C14.7922 14.1162 14.7922 13.5579 14.4505 13.2162L10.9172 9.66621ZM5.91719 9.66621C3.84219 9.66621 2.16719 7.99121 2.16719 5.91621C2.16719 3.84121 3.84219 2.16621 5.91719 2.16621C7.99219 2.16621 9.66719 3.84121 9.66719 5.91621C9.66719 7.99121 7.99219 9.66621 5.91719 9.66621Z"
                                fill="currentColor" />
                        </svg>
                    </div>

                    {/*  City Picker Dropdown Panel  */}
                    <div id="cityPickerDropdown" className="city-picker-dropdown hidden">
                        <div className="city-picker-header">
                            <span>Select City</span>
                            <button onClick={() => window.closeCityPicker()} className="city-picker-close"><i
                                    className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="city-picker-grid">

                            <button className="city-item" onClick={() => window.selectCity('Bangalore')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path
                                        d="M32 4C20.95 4 12 12.95 12 24c0 14.25 20 36 20 36s20-21.75 20-36C52 12.95 43.05 4 32 4zm0 26a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
                                </svg>
                                <span>Bangalore</span>
                            </button>

                            <button className="city-item" onClick={() => window.selectCity('Delhi')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path
                                        d="M10 52h44v4H10zm2-4h4V28h-4zm8 0h4V22h-4zm8 0h4V18h-4zm8 0h4V22h-4zm8 0h4V28h-4zM32 8l-20 12h40z" />
                                </svg>
                                <span>Delhi</span>
                            </button>

                            <button className="city-item" onClick={() => window.selectCity('Faridabad')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path
                                        d="M8 52h48v4H8zm4-4h8V30h-8zm12 0h8V24h-8zm12 0h8V30h-8zm12 0h8V36h-8zM32 10 8 28h48z" />
                                </svg>
                                <span>Faridabad</span>
                            </button>

                            <button className="city-item" onClick={() => window.selectCity('Ghaziabad')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path d="M20 52h24v4H20zm2-4h4V34h-4zm6 0h4V28h-4zm6 0h4V34h-4zM32 12 18 30h28z" />
                                </svg>
                                <span>Ghaziabad</span>
                            </button>

                            <button className="city-item" onClick={() => window.selectCity('Greater Noida')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path
                                        d="M12 56h40v-4H12zm2-6h6V34h-6zm10 0h6V28h-6zm10 0h6V34h-6zm10 0h6V40h-6zM32 8 10 32h44z" />
                                </svg>
                                <span>Gr. Noida</span>
                            </button>

                            <button className="city-item" onClick={() => window.selectCity('Gurgaon')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path d="M16 56h32v-4H16zm4-6h4V34h-4zm8 0h4V26h-4zm8 0h4V34h-4zM32 10 14 32h36z" />
                                </svg>
                                <span>Gurgaon</span>
                            </button>

                            <button className="city-item" onClick={() => window.selectCity('Hyderabad')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path
                                        d="M32 6C19.85 6 10 15.85 10 28c0 15.46 22 30 22 30s22-14.54 22-30C54 15.85 44.15 6 32 6zm0 28a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
                                </svg>
                                <span>Hyderabad</span>
                            </button>

                            <button className="city-item" onClick={() => window.selectCity('Indore')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path
                                        d="M14 56h36v-4H14zm4-6h4V32h-4zm8 0h4V24h-4zm8 0h4V32h-4zm8 0h4V38h-4zM32 8 12 30h40z" />
                                </svg>
                                <span>Indore</span>
                            </button>

                            <button className="city-item" onClick={() => window.selectCity('Jaipur')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path
                                        d="M32 4c-2.2 0-4 1.8-4 4v4h-8v4h-4v36h32V16h-4v-4h-8V8c0-2.2-1.8-4-4-4zm-6 28h4v8h-4zm8 0h4v8h-4z" />
                                </svg>
                                <span>Jaipur</span>
                            </button>

                            <button className="city-item" onClick={() => window.selectCity('Mumbai')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path
                                        d="M32 4C20.95 4 12 12.95 12 24c0 14.25 20 36 20 36s20-21.75 20-36C52 12.95 43.05 4 32 4zm0 26a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" />
                                </svg>
                                <span>Mumbai</span>
                            </button>

                            <button className="city-item" onClick={() => window.selectCity('Navi Mumbai')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path
                                        d="M10 56h44v-4H10zm4-6h6V32h-6zm10 0h6V24h-6zm10 0h6V32h-6zm10 0h6V38h-6zM32 6 8 30h48z" />
                                </svg>
                                <span>Navi Mumbai</span>
                            </button>

                            <button className="city-item" onClick={() => window.selectCity('Noida')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path d="M18 56h28v-4H18zm4-6h4V32h-4zm8 0h4V26h-4zm8 0h4V32h-4zM32 10 16 30h32z" />
                                </svg>
                                <span>Noida</span>
                            </button>

                            <button className="city-item" onClick={() => window.selectCity('Pune')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path
                                        d="M32 6C21.5 6 13 14.5 13 25c0 13.8 19 33 19 33s19-19.2 19-33C51 14.5 42.5 6 32 6zm0 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14z" />
                                </svg>
                                <span>Pune</span>
                            </button>

                            <button className="city-item" onClick={() => window.selectCity('Thane')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="currentColor">
                                    <path
                                        d="M12 56h40v-4H12zm4-6h6V30h-6zm10 0h6V22h-6zm10 0h6V30h-6zm10 0h6V36h-6zM32 8 10 28h44z" />
                                </svg>
                                <span>Thane</span>
                            </button>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
    {/*  Hero Section End  */}

    {/*  Our Features Section Start  */}
    <section className="max-w-7xl mx-auto px-6 lg:px-16 lg:-mt-36 bg-dark-2 lg:bg-none py-8 lg:relative lg:rounded-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:gap-8 gap-4">
            <div className="card fade-in text-center cursor-pointer hover:border-accent">
                <i className="fa-solid fa-house text-3xl text-accent mb-3"></i>
                <p className="font-semibold text-sm">Discover Suitable Properties</p>
                <p className="text-gray-400 text-xs mt-1 mb-4">
                    Our interactive search helps you find a perfect home from the widest range of properties that
                    cater
                    to all your needs.
                </p>
                <a href="#" className="text-gray-400 hover:text-accent text-sm">SEARCH MORE -&gt;</a>
            </div>
            <div className="card fade-in text-center cursor-pointer hover:border-accent">
                <i className="fa-solid fa-building text-3xl text-accent mb-3"></i>
                <p className="font-semibold text-sm">Find Trusted Agents</p>
                <p className="text-gray-400 text-xs mt-1 mb-4">
                    Get expert opinions and real estate assistance from an extensive catalogue of registered agents
                    in
                    your preferred locality.
                </p>
                <a href="#" className="text-gray-400 hover:text-accent text-sm">FIND AN AGENT -&gt;</a>
            </div>
            <div className="card fade-in text-center cursor-pointer hover:border-accent">
                <i className="fa-solid fa-city text-3xl text-accent mb-3"></i>
                <p className="font-semibold text-sm">Connect with Genuine Buyers</p>
                <p className="text-gray-400 text-xs mt-1 mb-4">
                    List your property on our portal for FREE and showcase it to 50,000+ active home seekers.
                </p>
                <a href="#" className="text-gray-400 hover:text-accent text-sm">POST YOUR PROPERTY
                    -&gt;</a>
            </div>
            <div className="card fade-in text-center cursor-pointer hover:border-accent">
                <i className="fa-solid fa-land-mine-on text-3xl text-accent mb-3"></i>
                <p className="font-semibold text-sm">Get Property Alerts</p>
                <p className="text-gray-400 text-xs mt-1 mb-4">
                    Can't find what you're looking for? Tell us your requirement and get instant alerts as soon as a
                    matching property gets listed on our portal.
                </p>
                <a href="#" className="text-gray-400 hover:text-accent text-sm">SET AN ALERT -&gt;</a>
            </div>
        </div>
    </section>
    {/*  Our Features Section End  */}

    {/*  Our Features Seller Section Start  */}
    <section className="bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 py-16 text-center fade-in">
            <button className="gap-2 border border-accent/30 rounded-full px-4 py-1.5 text-xs text-accent mb-5">
                FEATURED SELLERS
            </button>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
                Explore Our <br /><span className="text-accent">Featured Sellers</span>
            </h2>
            <p className="text-gray-400 text-md max-w-lg mx-auto leading-relaxed mb-6">
                Invest in properties from trusted sellers on our platform
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {/*  Property Card 1  */}
                <div className="property-card fade-in">
                    <div className="property-img-wrap">
                        <div className="property-img-placeholder">
                            <i className="fa-solid fa-house text-5xl text-primary/40"></i>
                        </div>
                        <span className="property-badge bg-accent">Comming Sale</span>
                    </div>
                    <div className="p-5">
                        <p className="text-accent text-sm font-semibold mb-1">$4,50,000</p>
                        <h3 className="font-semibold text-base mb-1">Luxury Villa with Pool</h3>
                        <p className="text-gray-400 text-sm flex items-center gap-1 mb-3">
                            <i className="fa-solid fa-location-dot text-xs"></i> Green Valley, Sector 12
                        </p>
                        <div className="flex gap-4 text-xs text-gray-400 border-t border-white/10 pt-3">
                            <span><i className="fa-solid fa-bed text-accent mr-1"></i>4 Beds</span>
                            <span><i className="fa-solid fa-bath text-accent mr-1"></i>3 Baths</span>
                            <span><i className="fa-solid fa-vector-square text-accent mr-1"></i>2,800 sqft</span>
                        </div>
                    </div>
                </div>

                {/*  Property Card 2  */}
                <div className="property-card fade-in">
                    <div className="property-img-wrap">
                        <div className="property-img-placeholder">
                            <i className="fa-solid fa-building text-5xl text-primary/40"></i>
                        </div>
                        <span className="property-badge bg-primary">For Rent</span>
                    </div>
                    <div className="p-5">
                        <p className="text-accent text-sm font-semibold mb-1">$2,500 / mo</p>
                        <h3 className="font-semibold text-base mb-1">Modern 3BHK Apartment</h3>
                        <p className="text-gray-400 text-sm flex items-center gap-1 mb-3">
                            <i className="fa-solid fa-location-dot text-xs"></i> Downtown Heights, Block A
                        </p>
                        <div className="flex gap-4 text-xs text-gray-400 border-t border-white/10 pt-3">
                            <span><i className="fa-solid fa-bed text-accent mr-1"></i>3 Beds</span>
                            <span><i className="fa-solid fa-bath text-accent mr-1"></i>2 Baths</span>
                            <span><i className="fa-solid fa-vector-square text-accent mr-1"></i>1,600 sqft</span>
                        </div>
                    </div>
                </div>

                {/*  Property Card 3  */}
                <div className="property-card fade-in">
                    <div className="property-img-wrap">
                        <div className="property-img-placeholder">
                            <i className="fa-solid fa-store text-5xl text-primary/40"></i>
                        </div>
                        <span className="property-badge bg-accent">Commercial</span>
                    </div>
                    <div className="p-5">
                        <p className="text-accent text-sm font-semibold mb-1">$8,00,000</p>
                        <h3 className="font-semibold text-base mb-1">Prime Office Space</h3>
                        <p className="text-gray-400 text-sm flex items-center gap-1 mb-3">
                            <i className="fa-solid fa-location-dot text-xs"></i> Business Hub, Main Boulevard
                        </p>
                        <div className="flex gap-4 text-xs text-gray-400 border-t border-white/10 pt-3">
                            <span><i className="fa-solid fa-door-open text-accent mr-1"></i>10 Rooms</span>
                            <span><i className="fa-solid fa-car text-accent mr-1"></i>Parking</span>
                            <span><i className="fa-solid fa-vector-square text-accent mr-1"></i>5,000 sqft</span>
                        </div>
                    </div>
                </div>

            </div>

            <a href="./properties.html" className="promo-cta-btn mt-16" onClick={() => window.closePromo()}>
                View All Partners <i className="fa-solid fa-arrow-right"></i>
            </a>
        </div>
    </section>
    {/*  Our Features Seller Section End  */}

    {/*  How You Will Make Money Section Start  */}
    <section className="bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 py-16 text-center fade-in">
            <button className="gap-2 border border-accent/30 rounded-full px-4 py-1.5 text-xs text-accent mb-5">
                RETURNS
            </button>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
                How will you <br /><span className="text-accent">make money?</span>
            </h2>
            <p className="text-gray-400 text-md mx-auto leading-relaxed mb-8">
                Discover multiple avenues to grow your wealth with BABA BROKER's fractional investments
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {/*  Property Card 1  */}
                <div className="relative bg-gradient-to-br from-[var(--color-dark-2)] to-[var(--color-dark-3)] 
                    border border-white/10 rounded-xl overflow-hidden transition-all duration-700  
                    opacity-100 translate-y-0 hover:-translate-y-2 hover:shadow-2xl hover:border-accent">
                    <div className="p-6">
                        <div>
                            <i className="fa-solid fa-house text-5xl text-primary/40 text-start"></i>
                        </div>

                        <h3 className="font-semibold text-2xl my-6 pt-4">Rental Income</h3>

                        <p className="text-gray-400 text-base flex items-center">
                            Earn passive income as your property generates consistent rental returns.
                        </p>

                        <a href="./contact-us.html" className="promo-cta-btn mt-16" onClick={() => window.closePromo()}>
                            Learn More <i className="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>

                {/*  Property Card 2  */}
                <div className="relative bg-gradient-to-br from-[var(--color-dark-2)] to-[var(--color-dark-3)] 
                    border border-white/10 rounded-xl overflow-hidden transition-all duration-700  
                    opacity-100 translate-y-0 hover:-translate-y-2 hover:shadow-2xl hover:border-accent">
                    <div className="p-6">
                        <div>
                            <i className="fa-solid fa-house text-5xl text-primary/40 text-start"></i>
                        </div>

                        <h3 className="font-semibold text-2xl my-6 pt-4">Secondary Market</h3>

                        <p className="text-gray-400 text-base flex items-center">
                            Sell your tokens on our platform anytime, unlocking liquidity with ease.
                        </p>

                        <a href="./contact-us.html" className="promo-cta-btn mt-16" onClick={() => window.closePromo()}>
                            Learn More <i className="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>

                {/*  Property Card 3  */}
                <div className="relative bg-gradient-to-br from-[var(--color-dark-2)] to-[var(--color-dark-3)] 
                    border border-white/10 rounded-xl overflow-hidden transition-all duration-700  
                    opacity-100 translate-y-0 hover:-translate-y-2 hover:shadow-2xl hover:border-accent">
                    <div className="p-6">
                        <div>
                            <i className="fa-solid fa-house text-5xl text-primary/40 text-start"></i>
                        </div>

                        <h3 className="font-semibold text-2xl my-6 pt-4">Capital Appreciation</h3>

                        <p className="text-gray-400 text-base flex items-center">
                            Benefit from the long-term value growth of your real estate assets.
                        </p>

                        <a href="./contact-us.html" className="promo-cta-btn mt-16" onClick={() => window.closePromo()}>
                            Explore All Investment Option <i className="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                </div>

            </div>

            <a href="./contact-us.html" className="promo-cta-btn mt-16" onClick={() => window.closePromo()}>
                View All Partners <i className="fa-solid fa-arrow-right"></i>
            </a>
        </div>
    </section>
    {/*  How You Will Make Money Section End  */}

    {/*  Property Types Section Start  */}
    <section className="py-16 bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 text-center fade-in">

            {/*  Top label  */}
            <div
                className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-5">
                <i className="fa-solid fa-house text-accent text-xs"></i> Where can you invest
            </div>

            {/*  Heading  */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3" style={{ lineHeight: '60px' }}>
                Unlock opportunities in properties
                <br />
                <span className="text-accent">you never knew you could own</span>
            </h2>
            <p className="text-gray-400 mb-10 max-w-2xl mx-auto">
                Diversify your portfolio with a range of investment opportunities through
                <span className="text-accent font-semibold">Baba Broker</span>
            </p>

            {/*  Tab pills  */}
            <div className="flex flex-wrap justify-center gap-3 mb-8" id="propTypeTabs">
                <button onClick={() => window.switchPropType(this,'residential')}
                    className="prop-type-tab active-tab flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border transition-all">
                    <i className="fa-solid fa-house"></i> Residential
                </button>
                <button onClick={() => window.switchPropType(this,'plots')}
                    className="prop-type-tab flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border border-white/10 text-gray-400 bg-transparent hover:border-accent hover:text-white transition-all">
                    <i className="fa-solid fa-map"></i> Plots
                </button>
                <button onClick={() => window.switchPropType(this,'commercial')}
                    className="prop-type-tab flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border border-white/10 text-gray-400 bg-transparent hover:border-accent hover:text-white transition-all">
                    <i className="fa-solid fa-building"></i> Commercial
                </button>
                <button onClick={() => window.switchPropType(this,'rental')}
                    className="prop-type-tab flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border border-white/10 text-gray-400 bg-transparent hover:border-accent hover:text-white transition-all">
                    <i className="fa-solid fa-key"></i> Rental
                </button>
                <button onClick={() => window.switchPropType(this,'luxury')}
                    className="prop-type-tab flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold border border-white/10 text-gray-400 bg-transparent hover:border-accent hover:text-white transition-all">
                    <i className="fa-solid fa-gem"></i> Luxury
                </button>
            </div>

            {/*  Panel card  */}
            <div className="rounded-2xl bg-dark-3 border border-white/8 p-6 sm:p-8 lg:p-10 text-left">
                <div id="propTypePanel" className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 items-center">

                    {/*  Left: info  */}
                    <div id="propTypeInfo">
                        <div className="flex items-center gap-4 mb-5">
                            <span id="propTypeIcon"
                                className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent text-2xl shrink-0">
                                <i className="fa-solid fa-house"></i>
                            </span>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-0.5">Property Type</p>
                                <p id="propTypeTitle" className="text-white font-bold text-xl">Residential</p>
                            </div>
                        </div>
                        <p id="propTypeDesc" className="text-gray-400 leading-relaxed mb-6">
                            Browse verified residential properties — apartments, villas, and independent houses across
                            top cities. Find your perfect home with zero brokerage.
                        </p>
                        <div id="propTypeTags" className="flex flex-wrap gap-2">
                            <span className="text-xs border border-white/10 rounded-full px-3 py-1.5 text-gray-300">
                                Quick Setup
                            </span>
                            <span className="text-xs border border-white/10 rounded-full px-3 py-1.5 text-gray-300">
                                Verified Listings
                            </span>
                            <span className="text-xs border border-white/10 rounded-full px-3 py-1.5 text-gray-300">
                                Full Support
                            </span>
                        </div>
                    </div>

                    {/*  Right: image  */}
                    <div className="rounded-xl overflow-hidden prop-type-img-wrap">
                        <img id="propTypeImg"
                            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80"
                            alt="Residential" className="w-full h-full object-cover" />
                    </div>

                </div>
            </div>

        </div>
    </section>
    {/*  Property Types Section End  */}

    {/*  Powerfull Platform Section Start  */}
    <section className="py-16 bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 text-center fade-in">

            {/*  Top label  */}
            <div
                className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-5">
                <i className="fa-solid fa-house text-accent text-xs"></i> OUR PRODUCTS
            </div>

            {/*  Heading  */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3" style={{ lineHeight: '60px' }}>
                Powerful Platform for
                <br />
                <span className="text-accent">Real Estate Investment</span>
            </h2>
            <p className="text-gray-400 mb-10 mx-auto">
                Comprehensive solutions for fractional real estate investment, tokenization, and secondary market
                trading
            </p>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-0 mt-10">

            <div className="grid lg:grid-cols-2 gap-10">

                {/*  LEFT SIDE (Core Services)  */}
                <div>
                    {/*  Heading  */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-1 h-6 bg-accent rounded-full"></span>
                        <h3 className="text-xl font-semibold">Core Services</h3>
                    </div>

                    {/*  Grid  */}
                    <div className="grid sm:grid-cols-2 gap-5">

                        {/*  Highlight Card  */}
                        <div className="card border-accent bg-accent/10">
                            <div className="card-icon bg-accent/20 text-accent">
                                <i className="fa-solid fa-house-circle-check"></i>
                            </div>

                            <h4 className="font-semibold mb-2">Verified Property Listings</h4>
                            <p className="text-sm text-gray-400">
                                Explore 100% verified residential & commercial properties with complete legal
                                transparency and RERA compliance.
                            </p>
                        </div>

                        {/*  Card  */}
                        <div className="card">
                            <div className="card-icon">
                                <i className="fa-solid fa-handshake"></i>
                            </div>
                            <h4 className="font-semibold mb-2">Property Buying Assistance</h4>
                            <p className="text-sm text-gray-400">
                                End-to-end support from property search to final registration with expert guidance.
                            </p>
                        </div>

                        {/*  Card  */}
                        <div className="card">
                            <div className="card-icon">
                                <i className="fa-solid fa-tag"></i>
                            </div>
                            <h4 className="font-semibold mb-2">Property Selling</h4>
                            <p className="text-sm text-gray-400">
                                List your property with us and get the best market value with verified buyers.
                            </p>
                        </div>

                        {/*  Card  */}
                        <div className="card">
                            <div className="card-icon">
                                <i className="fa-solid fa-chart-pie"></i>
                            </div>
                            <h4 className="font-semibold mb-2">Investment Advisory</h4>
                            <p className="text-sm text-gray-400">
                                Data-driven real estate investment strategies for long-term growth and high ROI.
                            </p>
                        </div>

                    </div>
                </div>

                {/*  RIGHT SIDE (Platform & Tools)  */}
                <div>
                    {/*  Heading  */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                        <h3 className="text-xl font-semibold">Platform & Tools</h3>
                    </div>

                    <div className="space-y-5">

                        {/*  Large Card  */}
                        <div className="card flex gap-4 items-start">
                            <div className="card-icon">
                                <i className="fa-solid fa-building-user"></i>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Property Management</h4>
                                <p className="text-sm text-gray-400">
                                    Complete property management solutions including tenant handling, maintenance, and
                                    rent tracking.
                                </p>
                            </div>
                        </div>

                        {/*  Large Card  */}
                        <div className="card flex gap-4 items-start">
                            <div className="card-icon">
                                <i className="fa-solid fa-file-contract"></i>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">Legal & Documentation</h4>
                                <p className="text-sm text-gray-400">
                                    Hassle-free documentation support including agreements, title verification, and
                                    legal compliance.
                                </p>
                            </div>
                        </div>

                        {/*  Large Card  */}
                        <div className="card flex gap-4 items-start">
                            <div className="card-icon">
                                <i className="fa-solid fa-headset"></i>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-1">24/7 Customer Support</h4>
                                <p className="text-sm text-gray-400">
                                    Dedicated support team to assist you at every step of your real estate journey.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </section>
    {/*  Powerfull Platform Section End  */}

    {/*  Product Highlight Section Start  */}
    <section className="section">
        <div className="max-w-7xl mx-auto px-6 lg:px-0 fade-in">

            <div
                className="rounded-3xl border border-white/10 p-6 sm:p-10 flex flex-col lg:flex-row gap-10 
                bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_85%_80%,rgba(30,64,175,0.2),transparent_40%),linear-gradient(135deg,#1e40af_0%,#0f2a5c_50%,#0a0f1c_100%)]">

                {/*  LEFT SIDE  */}
                <div className="flex-1">

                    {/*  Top  */}
                    <div className="flex items-center gap-4 mb-4">
                        <div
                            className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center bg-gradient-to-br from-[var(--color-dark-2)] to-[var(--color-dark-3)]">
                            <i className="fa-solid fa-shield-halved text-accent text-lg"></i>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wide">Service</p>
                            <h2 className="text-xl font-semibold text-white">
                                Smart Property Investment Platform
                            </h2>
                        </div>
                    </div>

                    {/*  Description  */}
                    <p className="text-gray-400 mb-6 max-w-xl">
                        Invest in premium real estate with verified listings, transparent transactions, and complete
                        legal support — all in one platform.
                    </p>

                    {/*  Feature Boxes  */}
                    <div className="grid sm:grid-cols-2 gap-3 mb-6">

                        <div
                            className="flex items-center gap-2 bg-dark-3 border border-white/10 rounded-lg px-4 py-2 text-sm">
                            <i className="fa-solid fa-circle-check text-accent"></i>
                            Verified Properties
                        </div>

                        <div
                            className="flex items-center gap-2 bg-dark-3 border border-white/10 rounded-lg px-4 py-2 text-sm">
                            <i className="fa-solid fa-circle-check text-accent"></i>
                            Transparent Deals
                        </div>

                        <div
                            className="flex items-center gap-2 bg-dark-3 border border-white/10 rounded-lg px-4 py-2 text-sm">
                            <i className="fa-solid fa-circle-check text-accent"></i>
                            Legal Documentation
                        </div>

                        <div
                            className="flex items-center gap-2 bg-dark-3 border border-white/10 rounded-lg px-4 py-2 text-sm">
                            <i className="fa-solid fa-circle-check text-accent"></i>
                            Expert Guidance
                        </div>

                        <div
                            className="flex items-center gap-2 bg-dark-3 border border-white/10 rounded-lg px-4 py-2 text-sm">
                            <i className="fa-solid fa-circle-check text-accent"></i>
                            High ROI Opportunities
                        </div>

                    </div>

                    {/*  Tags  */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <span className="px-4 py-1 rounded-full bg-accent text-xs font-semibold">Trust</span>
                        <span className="px-4 py-1 rounded-full border border-white/20 text-xs">Transparency</span>
                        <span className="px-4 py-1 rounded-full border border-white/20 text-xs">Growth</span>
                    </div>

                    {/*  Badge  */}
                    <div
                        className="inline-flex items-center gap-2 bg-accent/20 text-accent text-xs px-4 py-1 rounded-full mb-4">
                        <i className="fa-solid fa-bolt"></i> Fast Processing
                    </div>

                    {/*  Bullet Points  */}
                    <ul className="space-y-2 text-sm text-gray-400 mb-6">
                        <li><i className="fa-solid fa-circle-check text-accent mr-2"></i>Instant property discovery</li>
                        <li><i className="fa-solid fa-circle-check text-accent mr-2"></i>End-to-end buying support</li>
                        <li><i className="fa-solid fa-circle-check text-accent mr-2"></i>Secure transactions & escrow</li>
                    </ul>

                    {/*  CTA  */}
                    <div className="flex gap-3">
                        <a href="#contact" className="btn btn-accent">
                            <i className="fa-solid fa-play"></i> Explore Now
                        </a>
                        <a href="#services" className="btn btn-outline">
                            Learn More <i className="fa-solid fa-arrow-right ml-1"></i>
                        </a>
                    </div>

                </div>

                {/*  RIGHT SIDE  */}
                <div className="flex-1">

                    <div
                        className="relative rounded-2xl border border-accent/20 bg-gradient-to-br from-[var(--color-dark-2)] to-[var(--color-dark-3)] h-full flex items-center justify-center overflow-hidden">

                        {/*  Glow  */}
                        <div className="absolute inset-0 bg-green-400/10 blur-3xl opacity-40"></div>

                        {/*  Content  */}
                        <div className="relative z-10 text-center">

                            <div
                                className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                                <i className="fa-solid fa-shield-halved text-accent text-2xl"></i>
                            </div>

                            <div className="w-44 h-2 bg-white/10 rounded-full mx-auto mb-2"></div>
                            <div className="w-32 h-2 bg-white/10 rounded-full mx-auto"></div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
        {/*  Feature Cards Section  */}
        <div className="max-w-7xl mx-auto px-6 lg:px-0 mt-16">

            <div className="grid md:grid-cols-3 gap-6">

                {/*  Card 1  */}
                <div className="card">
                    <div className="card-icon">
                        <i className="fa-solid fa-indian-rupee-sign"></i>
                    </div>

                    <h4 className="font-semibold mb-1">Secure Payments</h4>
                    <p className="text-sm text-gray-400">
                        Safe and transparent transactions with escrow-backed payment systems.
                    </p>
                </div>

                {/*  Card 2  */}
                <div className="card">
                    <div className="card-icon">
                        <i className="fa-solid fa-file-contract"></i>
                    </div>

                    <h4 className="font-semibold mb-1">Legal Compliance</h4>
                    <p className="text-sm text-gray-400">
                        All properties are verified with proper documentation and legal checks.
                    </p>
                </div>

                {/*  Card 3  */}
                <div className="card">
                    <div className="card-icon">
                        <i className="fa-solid fa-chart-line"></i>
                    </div>

                    <h4 className="font-semibold mb-1">Investment Tracking</h4>
                    <p className="text-sm text-gray-400">
                        Track your property investments, returns, and portfolio growth in real-time.
                    </p>
                </div>

            </div>

        </div>
    </section>
    {/*  Product Highlight Section End  */}

    {/*  Propery Tokenization Section Start  */}
    <section className="ptok-section bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">

            {/*  Heading  */}
            <div className="text-center mb-16">
                <div
                    className="inline-flex items-center gap-2 border border-accent/30 rounded-full px-4 py-1.5 text-xs text-accent mb-5">
                    <i className="fa-solid fa-rotate"></i> Process
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3">
                    Property Tokenization <span className="text-accent">Process</span>
                </h2>
                <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
                    Understanding how real estate becomes a smart investment through our verified, step-by-step process.
                </p>
            </div>

            {/*  Timeline  */}
            <div className="ptok-timeline">

                {/*  Step 1  */}
                <div className="ptok-step ptok-step--right">
                    {/*  Left: text  */}
                    <div className="ptok-text">
                        <p className="ptok-step-label">Step 01</p>
                        <h3 className="ptok-step-title">Property Evaluation</h3>
                        <p className="ptok-step-desc">Our experts conduct thorough due diligence, including legal,
                            financial, and physical property assessments to ensure investment quality.</p>
                    </div>
                    {/*  Center: number node  */}
                    <div className="ptok-node">
                        <span className="ptok-node-num">1</span>
                    </div>
                    {/*  Right: detail card  */}
                    <div className="ptok-card">
                        <ul className="ptok-checklist">
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Market Analysis</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Legal Due Diligence</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Financial Assessment</li>
                            <li><i className="fa-solid fa-circle-check text-accent"></i> Physical Inspection</li>
                        </ul>
                    </div>
                </div>

                {/*  Step 2  */}
                <div className="ptok-step ptok-step--left">
                    {/*  Left: detail card  */}
                    <div className="ptok-card">
                        <div className="ptok-code-block">
                            <span className="ptok-code-line"><span className="ptok-kw">contract</span> PropertyToken {"{"}</span>
                            <span className="ptok-code-line ptok-indent"><span className="ptok-kw">string</span> <span
                                    className="ptok-var">public</span> propertyId;</span>
                            <span className="ptok-code-line ptok-indent"><span className="ptok-kw">uint256</span> <span
                                    className="ptok-var">public</span> totalSupply;</span>
                            <span className="ptok-code-line ptok-indent ptok-comment">// Smart contract logic...</span>
                            <span className="ptok-code-line">{"}"}</span>
                        </div>
                    </div>
                    {/*  Center: number node  */}
                    <div className="ptok-node">
                        <span className="ptok-node-num">2</span>
                    </div>
                    {/*  Right: text  */}
                    <div className="ptok-text">
                        <p className="ptok-step-label">Step 02</p>
                        <h3 className="ptok-step-title">Smart Contract & SPV Creation</h3>
                        <p className="ptok-step-desc">Property is held in an SPV which is encoded into smart contracts on
                            the blockchain for maximum security and transparency.</p>
                    </div>
                </div>

                {/*  Step 3  */}
                <div className="ptok-step ptok-step--right">
                    {/*  Left: text  */}
                    <div className="ptok-text">
                        <p className="ptok-step-label">Step 03</p>
                        <h3 className="ptok-step-title">Token & Equity Distribution</h3>
                        <p className="ptok-step-desc">Property tokens and equity are made available to investors through our
                            platform, with automated compliance and KYC verification.</p>
                    </div>
                    {/*  Center: number node  */}
                    <div className="ptok-node">
                        <span className="ptok-node-num">3</span>
                    </div>
                    {/*  Right: detail card  */}
                    <div className="ptok-card">
                        <div className="ptok-stats-grid">
                            <div className="ptok-stat-row">
                                <span className="ptok-stat-label">Total Tokens</span>
                                <span className="ptok-stat-val text-accent">1,000</span>
                            </div>
                            <div className="ptok-stat-row">
                                <span className="ptok-stat-label">Token Price</span>
                                <span className="ptok-stat-val text-accent">₹5,000</span>
                            </div>
                            <div className="ptok-stat-row">
                                <span className="ptok-stat-label">Min. Investment</span>
                                <span className="ptok-stat-val text-accent">1 Token</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  Step 4  */}
                <div className="ptok-step ptok-step--left">
                    {/*  Left: detail card  */}
                    <div className="ptok-card">
                        <ul className="ptok-feature-list">
                            <li>
                                <span className="ptok-feat-icon"><i className="fa-solid fa-bolt"></i></span>
                                <span>Automated Rent Distribution</span>
                            </li>
                            <li>
                                <span className="ptok-feat-icon"><i className="fa-solid fa-clock"></i></span>
                                <span>24/7 Trading</span>
                            </li>
                            <li>
                                <span className="ptok-feat-icon"><i className="fa-solid fa-chart-line"></i></span>
                                <span>Real-time Analytics</span>
                            </li>
                        </ul>
                    </div>
                    {/*  Center: number node  */}
                    <div className="ptok-node">
                        <span className="ptok-node-num">4</span>
                    </div>
                    {/*  Right: text  */}
                    <div className="ptok-text">
                        <p className="ptok-step-label">Step 04</p>
                        <h3 className="ptok-step-title">Automated Management</h3>
                        <p className="ptok-step-desc">Smart contracts handle rental income distribution, property expenses,
                            and secondary market trading automatically — no manual intervention needed.</p>
                    </div>
                </div>

            </div>

            {/*  Bottom CTA bar  */}
            <div className="ptok-cta-bar">
                <div>
                    <p className="font-semibold text-white text-sm">Want to learn more about our property process?</p>
                    <p className="text-gray-400 text-xs mt-0.5">Explore our comprehensive documentation on property
                        listings, lifecycle, and pricing model.</p>
                </div>
                <a href="#contact" className="btn btn-accent text-sm px-6 rounded-full whitespace-nowrap">
                    View Process Docs <i className="fa-solid fa-arrow-right"></i>
                </a>
            </div>

        </div>
    </section>
    {/*  Propery Tokenization Section End  */}

    {/*  5 level of security section start  */}
    <section className="sec5-section flex bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">

            {/*  Two-col layout: sticky left + scrolling right  */}
            <div className="sec5-layout">

                {/*  Left: sticky heading  */}
                <div className="sec5-left">
                    <div
                        className="inline-flex items-center gap-2 border border-accent/30 rounded-full px-4 py-1.5 text-xs text-accent mb-12">
                        <i className="fa-solid fa-shield-halved"></i> Security
                    </div>
                    <h2 className="sec5-heading mb-12">
                        5 Levels of<br />Security
                        <span className="text-accent block">You Can Trust</span>
                    </h2>
                    <p className="sec5-sub">Your investments are protected by multiple layers of security, from verified
                        listings to regulatory compliance.</p>
                </div>

                {/*  Right: auto-scrolling cards  */}
                <div className="sec5-track-wrap">
                    <div className="sec5-track" id="sec5Track">

                        {/*  Level 1  */}
                        <div className="sec5-card">
                            <span className="sec5-level-badge mb-12">
                                <i className="fa-solid fa-shield-halved"></i> Level 1
                            </span>
                            <span className="sec5-secured-badge mb-12">
                                <i className="fa-solid fa-circle-check"></i> Secured
                            </span>
                            <div className="sec5-icon mb-12" style={{ background: 'rgba(11,78,157,0.15)' }}>
                                <i className="fa-solid fa-house-circle-check" style={{ color: '#1a6bc7' }}></i>
                            </div>
                            <h4 className="sec5-card-title mb-12">RERA Verified Listings</h4>
                            <p className="sec5-card-desc">
                                Every property is registered under RERA, ensuring legal compliance and protecting your
                                rights as a buyer or investor.
                            </p>
                            <div className="sec5-footer">
                                <span className="sec5-progress-label">
                                    <i className="fa-solid fa-rotate text-accent"></i> Level 1 of 5
                                </span>
                                <div className="sec5-progress-bar">
                                    <div className="sec5-progress-fill" style={{ width: '20%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/*  Level 2  */}
                        <div className="sec5-card">
                            <span className="sec5-level-badge">
                                <i className="fa-solid fa-shield-halved"></i> Level 2
                            </span>
                            <span className="sec5-secured-badge">
                                <i className="fa-solid fa-circle-check"></i> Secured
                            </span>
                            <div className="sec5-icon" style={{ background: 'rgba(246,129,34,0.12)' }}>
                                <i className="fa-solid fa-file-contract" style={{ color: '#F68122' }}></i>
                            </div>
                            <h4 className="sec5-card-title">Legal Title Verification</h4>
                            <p className="sec5-card-desc">Our legal team verifies title deeds, encumbrance certificates, and
                                ownership documents before any listing goes live.</p>
                            <div className="sec5-footer">
                                <span className="sec5-progress-label">
                                    <i className="fa-solid fa-rotate text-accent"></i> Level 2 of 5
                                </span>
                                <div className="sec5-progress-bar">
                                    <div className="sec5-progress-fill" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/*  Level 3  */}
                        <div className="sec5-card">
                            <span className="sec5-level-badge">
                                <i className="fa-solid fa-shield-halved"></i> Level 3
                            </span>
                            <span className="sec5-secured-badge">
                                <i className="fa-solid fa-circle-check"></i> Secured
                            </span>
                            <div className="sec5-icon" style={{ background: 'rgba(34,197,94,0.12)' }}>
                                <i className="fa-solid fa-user-shield" style={{ color: '#22c55e' }}></i>
                            </div>
                            <h4 className="sec5-card-title">Agent KYC & Certification</h4>
                            <p className="sec5-card-desc">All agents on our platform are KYC-verified, certified, and
                                background-checked to ensure you deal only with trusted professionals.</p>
                            <div className="sec5-footer">
                                <span className="sec5-progress-label">
                                    <i className="fa-solid fa-rotate text-accent"></i> Level 3 of 5
                                </span>
                                <div className="sec5-progress-bar">
                                    <div className="sec5-progress-fill" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/*  Level 4  */}
                        <div className="sec5-card">
                            <span className="sec5-level-badge">
                                <i className="fa-solid fa-shield-halved"></i> Level 4
                            </span>
                            <span className="sec5-secured-badge">
                                <i className="fa-solid fa-circle-check"></i> Secured
                            </span>
                            <div className="sec5-icon" style={{ background: 'rgba(168,85,247,0.12)' }}>
                                <i className="fa-solid fa-lock" style={{ color: '#a855f7' }}></i>
                            </div>
                            <h4 className="sec5-card-title">Secure Transaction Flow</h4>
                            <p className="sec5-card-desc">All financial transactions are processed through secure, regulated
                                channels with full audit trails and buyer protection built in.</p>
                            <div className="sec5-footer">
                                <span className="sec5-progress-label">
                                    <i className="fa-solid fa-rotate text-accent"></i> Level 4 of 5
                                </span>
                                <div className="sec5-progress-bar">
                                    <div className="sec5-progress-fill" style={{ width: '80%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/*  Level 5  */}
                        <div className="sec5-card">
                            <span className="sec5-level-badge">
                                <i className="fa-solid fa-shield-halved"></i> Level 5
                            </span>
                            <span className="sec5-secured-badge">
                                <i className="fa-solid fa-circle-check"></i> Secured
                            </span>
                            <div className="sec5-icon" style={{ background: 'rgba(20,184,166,0.12)' }}>
                                <i className="fa-solid fa-circle-check" style={{ color: '#14b8a6' }}></i>
                            </div>
                            <h4 className="sec5-card-title">Your Choice, Your Ownership</h4>
                            <p className="sec5-card-desc">We don't tell you where to invest — it's your choice. Full
                                ownership rights are guaranteed, and you stay in control of your property journey.</p>
                            <div className="sec5-footer">
                                <span className="sec5-progress-label">
                                    <i className="fa-solid fa-rotate text-accent"></i> Level 5 of 5
                                </span>
                                <div className="sec5-progress-bar">
                                    <div className="sec5-progress-fill" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/*  Duplicate set for seamless loop  */}
                        <div className="sec5-card" aria-hidden="true">
                            <span className="sec5-level-badge"><i className="fa-solid fa-shield-halved"></i> Level 1</span>
                            <span className="sec5-secured-badge"><i className="fa-solid fa-circle-check"></i> Secured</span>
                            <div className="sec5-icon" style={{ background: 'rgba(11,78,157,0.15)' }}><i
                                    className="fa-solid fa-house-circle-check" style={{ color: '#1a6bc7' }}></i></div>
                            <h4 className="sec5-card-title">RERA Verified Listings</h4>
                            <p className="sec5-card-desc">Every property is registered under RERA, ensuring legal compliance
                                and protecting your rights as a buyer or investor.</p>
                            <div className="sec5-footer"><span className="sec5-progress-label"><i
                                        className="fa-solid fa-rotate text-accent"></i> Level 1 of 5</span>
                                <div className="sec5-progress-bar">
                                    <div className="sec5-progress-fill" style={{ width: '20%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="sec5-card" aria-hidden="true">
                            <span className="sec5-level-badge"><i className="fa-solid fa-shield-halved"></i> Level 2</span>
                            <span className="sec5-secured-badge"><i className="fa-solid fa-circle-check"></i> Secured</span>
                            <div className="sec5-icon" style={{ background: 'rgba(246,129,34,0.12)' }}><i
                                    className="fa-solid fa-file-contract" style={{ color: '#F68122' }}></i></div>
                            <h4 className="sec5-card-title">Legal Title Verification</h4>
                            <p className="sec5-card-desc">Our legal team verifies title deeds, encumbrance certificates, and
                                ownership documents before any listing goes live.</p>
                            <div className="sec5-footer"><span className="sec5-progress-label"><i
                                        className="fa-solid fa-rotate text-accent"></i> Level 2 of 5</span>
                                <div className="sec5-progress-bar">
                                    <div className="sec5-progress-fill" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="sec5-card" aria-hidden="true">
                            <span className="sec5-level-badge"><i className="fa-solid fa-shield-halved"></i> Level 3</span>
                            <span className="sec5-secured-badge"><i className="fa-solid fa-circle-check"></i> Secured</span>
                            <div className="sec5-icon" style={{ background: 'rgba(34,197,94,0.12)' }}><i
                                    className="fa-solid fa-user-shield" style={{ color: '#22c55e' }}></i></div>
                            <h4 className="sec5-card-title">Agent KYC & Certification</h4>
                            <p className="sec5-card-desc">All agents on our platform are KYC-verified, certified, and
                                background-checked to ensure you deal only with trusted professionals.</p>
                            <div className="sec5-footer"><span className="sec5-progress-label"><i
                                        className="fa-solid fa-rotate text-accent"></i> Level 3 of 5</span>
                                <div className="sec5-progress-bar">
                                    <div className="sec5-progress-fill" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="sec5-card" aria-hidden="true">
                            <span className="sec5-level-badge"><i className="fa-solid fa-shield-halved"></i> Level 4</span>
                            <span className="sec5-secured-badge"><i className="fa-solid fa-circle-check"></i> Secured</span>
                            <div className="sec5-icon" style={{ background: 'rgba(168,85,247,0.12)' }}><i className="fa-solid fa-lock"
                                    style={{ color: '#a855f7' }}></i></div>
                            <h4 className="sec5-card-title">Secure Transaction Flow</h4>
                            <p className="sec5-card-desc">All financial transactions are processed through secure, regulated
                                channels with full audit trails and buyer protection built in.</p>
                            <div className="sec5-footer"><span className="sec5-progress-label"><i
                                        className="fa-solid fa-rotate text-accent"></i> Level 4 of 5</span>
                                <div className="sec5-progress-bar">
                                    <div className="sec5-progress-fill" style={{ width: '80%' }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="sec5-card" aria-hidden="true">
                            <span className="sec5-level-badge"><i className="fa-solid fa-shield-halved"></i> Level 5</span>
                            <span className="sec5-secured-badge"><i className="fa-solid fa-circle-check"></i> Secured</span>
                            <div className="sec5-icon" style={{ background: 'rgba(20,184,166,0.12)' }}><i
                                    className="fa-solid fa-circle-check" style={{ color: '#14b8a6' }}></i></div>
                            <h4 className="sec5-card-title">Your Choice, Your Ownership</h4>
                            <p className="sec5-card-desc">We don't tell you where to invest — it's your choice. Full
                                ownership rights are guaranteed, and you stay in control of your property journey.</p>
                            <div className="sec5-footer"><span className="sec5-progress-label"><i
                                        className="fa-solid fa-rotate text-accent"></i> Level 5 of 5</span>
                                <div className="sec5-progress-bar">
                                    <div className="sec5-progress-fill" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </section>
    {/*  5 level of security section end  */}

    {/*  Knowledge / Resources Section Start  */}
    <section className="section bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">

            {/*  Heading  */}
            <div className="text-center mb-14 fade-in">
                <div
                    className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-5">
                    <i className="fa-solid fa-book text-accent text-xs"></i> RESOURCES
                </div>

                <h2 className="section-title">
                    Everything You Need <br />
                    <span className="text-accent">To Know</span>
                </h2>

                <p className="section-subtitle mx-auto">
                    Learn about property buying, investment strategies, legal processes, and market insights.
                </p>
            </div>

            {/*  GRID  */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/*  LEFT BIG CARD  */}
                <div
                    className="lg:row-span-2 rounded-2xl p-6 bg-gradient-to-br from-primary to-primary-dark border border-white/10 flex flex-col justify-between relative">

                    {/*  TOP  */}
                    <div className="flex justify-between items-start mb-6">

                        {/*  Left Icon  */}
                        <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center">
                            <i className="fa-solid fa-book-open text-white"></i>
                        </div>

                        {/*  Right Icons  */}
                        <div className="flex gap-2">
                            <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
                                <i className="fa-solid fa-bolt text-xs text-white/80"></i>
                            </div>
                            <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">
                                <i className="fa-solid fa-globe text-xs text-white/80"></i>
                            </div>
                        </div>

                    </div>

                    {/*  Content  */}
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Baba Broker Guides</h3>
                        <p className="text-sm text-white/80">
                            Complete guide to buying, selling, and investing in real estate with expert insights.
                        </p>
                    </div>

                    {/*  CTA  */}
                    <a href="#" className="mt-6 text-sm font-medium text-white inline-flex items-center gap-2">
                        Explore Documentation <i className="fa-solid fa-arrow-right"></i>
                    </a>

                </div>

                {/*  RIGHT SIDE  */}
                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">

                    {/*  CARD 1  */}
                    <div className="card h-full">
                        <div className="card-icon">
                            <i className="fa-solid fa-house"></i>
                        </div>

                        <h4 className="font-semibold mb-1">Buying Process</h4>
                        <p className="text-sm text-gray-400 mb-4">
                            Step-by-step guide to buying your dream property.
                        </p>

                        <a href="#" className="text-sm font-medium text-accent inline-flex items-center gap-1">
                            Learn more <i className="fa-solid fa-arrow-right text-xs"></i>
                        </a>
                    </div>

                    {/*  CARD 2  */}
                    <div className="card h-full">
                        <div className="card-icon">
                            <i className="fa-solid fa-chart-line"></i>
                        </div>

                        <h4 className="font-semibold mb-1">Investment Guide</h4>
                        <p className="text-sm text-gray-400 mb-4">
                            Learn how to maximize ROI in real estate investments.
                        </p>

                        <a href="#" className="text-sm font-medium text-accent inline-flex items-center gap-1">
                            Learn more <i className="fa-solid fa-arrow-right text-xs"></i>
                        </a>
                    </div>

                    {/*  CARD 3  */}
                    <div className="card h-full">
                        <div className="card-icon">
                            <i className="fa-solid fa-shield-halved"></i>
                        </div>

                        <h4 className="font-semibold mb-1">Legal & Safety</h4>
                        <p className="text-sm text-gray-400 mb-4">
                            Understand legal verification and documentation.
                        </p>

                        <a href="#" className="text-sm font-medium text-accent inline-flex items-center gap-1">
                            Learn more <i className="fa-solid fa-arrow-right text-xs"></i>
                        </a>
                    </div>

                    {/*  CARD 4  */}
                    <div className="card h-full">
                        <div className="card-icon">
                            <i className="fa-solid fa-scale-balanced"></i>
                        </div>

                        <h4 className="font-semibold mb-1">Compliance</h4>
                        <p className="text-sm text-gray-400 mb-4">
                            RERA rules, taxation, and compliance explained.
                        </p>

                        <a href="#" className="text-sm font-medium text-accent inline-flex items-center gap-1">
                            Learn more <i className="fa-solid fa-arrow-right text-xs"></i>
                        </a>
                    </div>

                </div>

            </div>

            {/*  Bottom Strip  */}
            <div
                className="mt-10 rounded-xl border border-white/10 bg-dark-3 p-4 flex flex-col lg:flex-row items-center justify-between gap-4">

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <i className="fa-solid fa-bolt text-accent"></i>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Quick Access</p>
                        <p className="text-xs text-gray-400">Jump to popular sections</p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full border border-white/10 text-xs">Buying Guide</span>
                    <span className="px-3 py-1 rounded-full border border-white/10 text-xs">Pricing</span>
                    <span className="px-3 py-1 rounded-full border border-white/10 text-xs">How It Works</span>
                    <span className="px-3 py-1 rounded-full border border-white/10 text-xs">FAQs</span>
                </div>

                <a href="#" className="btn btn-accent text-sm">
                    View All Resources
                </a>

            </div>

        </div>
    </section>
    {/*  Knowledge / Resources Section Start  */}

    {/*  Testimonials Section Start  */}
    <section className="section bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">

            {/*  Heading  */}
            <div className="text-center mb-14 fade-in">

                <div
                    className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-5">
                    <i className="fa-solid fa-star text-accent text-xs"></i> TESTIMONIALS
                </div>

                <h2 className="section-title">
                    What Our Clients <br />
                    <span className="text-accent">Say About Us</span>
                </h2>

                <p className="section-subtitle mx-auto">
                    Real feedback from our customers who trusted Baba Broker for their property journey.
                </p>

            </div>

            {/*  Cards  */}
            <div className="grid md:grid-cols-3 gap-6">

                {/*  Card 1  */}
                <div className="card relative">

                    {/*  Quote Icon  */}
                    <div className="absolute top-5 right-5 text-accent text-xl opacity-30">
                        <i className="fa-solid fa-quote-right"></i>
                    </div>

                    {/*  User  */}
                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold">
                            V
                        </div>
                        <div>
                            <p className="font-semibold">Vivan Figg</p>
                            <p className="text-xs text-gray-400">Investor</p>
                        </div>
                    </div>

                    {/*  Text  */}
                    <p className="text-sm text-gray-400">
                        “Great experience with Baba Broker. Their support team guided me at every step.”
                    </p>

                </div>

                {/*  Card 2  */}
                <div className="card relative">

                    <div className="absolute top-5 right-5 text-accent text-xl opacity-30">
                        <i className="fa-solid fa-quote-right"></i>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold">
                            C
                        </div>
                        <div>
                            <p className="font-semibold">Catalina Saiaz</p>
                            <p className="text-xs text-gray-400">Investor</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400">
                        “Baba Broker helped me diversify my investments easily. Very smooth and transparent process.”
                    </p>

                </div>

                {/*  Card 3  */}
                <div className="card relative">

                    <div className="absolute top-5 right-5 text-accent text-xl opacity-30">
                        <i className="fa-solid fa-quote-right"></i>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                        <div
                            className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-semibold">
                            R
                        </div>
                        <div>
                            <p className="font-semibold">Ronit Kumar</p>
                            <p className="text-xs text-gray-400">Investor</p>
                        </div>
                    </div>

                    <p className="text-sm text-gray-400">
                        “A trustworthy platform for real estate investments. Highly recommended for smart investors.”
                    </p>

                </div>

            </div>

            {/*  CTA  */}
            <div className="text-center mt-10">
                <a href="#" className="btn btn-accent">
                    View All Testimonials
                </a>
            </div>

        </div>
    </section>
    {/*  Testimonials Section End  */}

    {/*  Why Choose Section Start  */}
    <section className="section bg-dark-2">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">

            {/*  Heading  */}
            <div className="text-center mb-14 fade-in">

                <div
                    className="inline-flex items-center gap-2 border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 mb-5">
                    <i className="fa-solid fa-star text-accent text-xs"></i> WHY CHOOSE US
                </div>

                <h2 className="section-title">
                    Discover the Benefits <br />
                    <span className="text-accent">of Baba Broker</span>
                </h2>

                <p className="section-subtitle mx-auto">
                    Seamless property buying, trusted services, and smarter investment opportunities.
                </p>

            </div>

            {/*  Cards  */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/*  Card 1  */}
                <div className="card h-full">
                    <div className="card-icon">
                        <i className="fa-solid fa-user"></i>
                    </div>

                    <h4 className="font-semibold mb-2">Accessibility for All</h4>
                    <p className="text-sm text-gray-400">
                        Start investing in real estate with flexible budgets and easy access.
                    </p>
                </div>

                {/*  Card 2  */}
                <div className="card h-full">
                    <div className="card-icon">
                        <i className="fa-solid fa-shield-halved"></i>
                    </div>

                    <h4 className="font-semibold mb-2">Secure & Transparent</h4>
                    <p className="text-sm text-gray-400">
                        Verified properties with full transparency and trusted transactions.
                    </p>
                </div>

                {/*  Highlight Card  */}
                <div className="card h-full border-accent relative">

                    <div className="card-icon text-accent">
                        <i className="fa-solid fa-layer-group"></i>
                    </div>

                    <h4 className="font-semibold mb-2">Diverse Opportunities</h4>
                    <p className="text-sm text-gray-400 mb-6">
                        Explore multiple property options and investment opportunities with strong ROI.
                    </p>

                    {/*  Arrow  */}
                    <div className="absolute bottom-5 right-5 text-accent">
                        <i className="fa-solid fa-arrow-right"></i>
                    </div>

                </div>

                {/*  Card 4  */}
                <div className="card h-full">
                    <div className="card-icon">
                        <i className="fa-solid fa-bolt"></i>
                    </div>

                    <h4 className="font-semibold mb-2">Simplified Process</h4>
                    <p className="text-sm text-gray-400">
                        Smooth and hassle-free property buying experience from start to finish.
                    </p>
                </div>

            </div>

            {/*  CTA  */}
            <div className="text-center mt-12">
                <a href="#" className="btn btn-accent px-8">
                    Get Started <i className="fa-solid fa-arrow-right ml-2"></i>
                </a>
            </div>

        </div>
    </section>
    {/*  Why Choose Section End  */}

    {/*  FAQ Section Start  */}
    <section className="faq-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">
            <div className="faq-grid">

                {/*  Left: CTA  */}
                <div className="faq-left">
                    <h2 className="faq-left-title">
                        Your Dream Home Is Just A <span className="text-accent">Call Away!</span>
                    </h2>
                    <p className="faq-left-desc">
                        As the most trusted real estate brokers in India, contact Baba Broker today
                        at <a href="tel:+911800000000">+91 1800 000 000</a> or email us at
                        <a href="mailto:info@bababroker.com">info@bababroker.com</a>. Let us help you find the perfect
                        property that matches your budget and lifestyle.
                    </p>
                    <a href="./contact-us.html"
                        className="btn btn-accent mt-6 inline-flex items-center gap-2 px-6 rounded-full">
                        Contact Us <i className="fa-solid fa-arrow-right"></i>
                    </a>
                </div>

                {/*  Right: Accordion FAQs  */}
                <div className="faq-right">
                    <h3 className="faq-heading">FAQ<span className="text-accent">s</span></h3>

                    <div className="faq-list" id="faqList">

                        <div className="faq-item">
                            <button className="faq-trigger" onClick={() => window.toggleFaq(this)}>
                                Which area is best for property investment in Delhi NCR?
                                <i className="fa-solid fa-chevron-down faq-icon"></i>
                            </button>
                            <div className="faq-panel">
                                <p>
                                    Areas like Dwarka, Noida Expressway, and Greater Noida West offer excellent ROI with
                                    upcoming infrastructure projects and affordable pricing compared to central Delhi.
                                </p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <button className="faq-trigger" onClick={() => window.toggleFaq(this)}>
                                How does Baba Broker verify property listings?
                                <i className="fa-solid fa-chevron-down faq-icon"></i>
                            </button>
                            <div className="faq-panel">
                                <p>
                                    Every listing on Baba Broker is verified by our in-house legal team. We check RERA
                                    registration, title deeds, encumbrance certificates, and ownership documents before
                                    listing.
                                </p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <button className="faq-trigger" onClick={() => window.toggleFaq(this)}>
                                What is the process to buy a property through Baba Broker?
                                <i className="fa-solid fa-chevron-down faq-icon"></i>
                            </button>
                            <div className="faq-panel">
                                <p>
                                    Simply browse our listings, shortlist properties, schedule a site visit with our
                                    agent, and we'll guide you through the entire process — from negotiation to
                                    registration — at zero brokerage.
                                </p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <button className="faq-trigger" onClick={() => window.toggleFaq(this)}>
                                Does Baba Broker charge any brokerage fees?
                                <i className="fa-solid fa-chevron-down faq-icon"></i>
                            </button>
                            <div className="faq-panel">
                                <p>No. Baba Broker operates on a zero-brokerage model for buyers and tenants. Our
                                    services are completely free for property seekers — no hidden charges whatsoever.
                                </p>
                            </div>
                        </div>

                        <div className="faq-item">
                            <button className="faq-trigger" onClick={() => window.toggleFaq(this)}>
                                Which cities does Baba Broker operate in?
                                <i className="fa-solid fa-chevron-down faq-icon"></i>
                            </button>
                            <div className="faq-panel">
                                <p>We currently operate in Delhi NCR, Mumbai, Bangalore, Pune, and Hyderabad — with
                                    plans to expand to Chennai, Kolkata, and Ahmedabad in 2026.</p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </section>
    {/*  FAQ Section End  */}

    {/*  Contact us and Blog Section Start  */}
    <section className="section contact-blog-section">
        <div className="max-w-7xl mx-auto px-6 lg:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

                {/*  LEFT: Contact Form  */}
                <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-1">Contact
                        <span className="text-accent">Us</span>
                    </h2>
                    <p className="text-accent font-medium mb-1">Apply to get a call for solution</p>
                    <p className="text-gray-400 text-sm mb-6">Submit the form to connect with our property expert —
                        completely free.</p>

                    <div className="card space-y-4">

                        <div className="flex rounded-xl overflow-hidden border border-white/10">
                            <span className="bg-primary px-4 flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-user text-white"></i>
                            </span>
                            <input type="text" placeholder="Your Name"
                                className="flex-1 bg-dark-3 px-4 py-3 text-sm focus:outline-none placeholder-gray-500 min-w-0" />
                        </div>

                        <div className="flex rounded-xl overflow-hidden border border-white/10">
                            <span className="bg-primary px-4 flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-envelope text-white"></i>
                            </span>
                            <input type="email" placeholder="Your Email"
                                className="flex-1 bg-dark-3 px-4 py-3 text-sm focus:outline-none placeholder-gray-500 min-w-0" />
                        </div>

                        <div className="flex rounded-xl overflow-hidden border border-white/10">
                            <span className="bg-primary px-4 flex items-center justify-center shrink-0">
                                <i className="fa-solid fa-phone text-white"></i>
                            </span>
                            <input type="tel" placeholder="Your Phone Number"
                                className="flex-1 bg-dark-3 px-4 py-3 text-sm focus:outline-none placeholder-gray-500 min-w-0" />
                        </div>

                        <div>
                            <h6 className="font-semibold text-base mb-3">What Can We Do For You?</h6>
                            <div className="overflow-hidden pb-1">
                                <div className="service-tag-track">
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-house text-accent"></i>
                                        Property Buying
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-tag text-accent"></i>
                                        Property Selling
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-key text-accent"></i>
                                        Rental Management
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-chart-pie text-accent"></i>
                                        Investment Advisory
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-house text-accent"></i>
                                        Property Buying
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-tag text-accent"></i>
                                        Property Selling
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-key text-accent"></i>
                                        Rental Management
                                    </button>
                                    <button type="button" className="service-tag">
                                        <i className="fa-solid fa-chart-pie text-accent"></i>
                                        Investment Advisory
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex rounded-xl overflow-hidden border border-white/10">
                            <span className="bg-primary px-4 flex items-start justify-center pt-3 shrink-0">
                                <i className="fa-solid fa-comment text-white"></i>
                            </span>
                            <textarea rows="4" placeholder="Your Message"
                                className="flex-1 bg-dark-3 px-4 py-3 text-sm focus:outline-none placeholder-gray-500 resize-none min-w-0"></textarea>
                        </div>

                        <div className="text-center sm:text-right">
                            <button type="submit" className="btn btn-accent px-8 rounded-full font-semibold">
                                Submit <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>

                {/*  RIGHT: Blog  */}
                <div>
                    <div className="mb-5 text-center lg:text-left">
                        <small className="text-accent uppercase tracking-widest font-semibold text-xs">Blog</small>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mt-1">LATEST BLOGS</h2>
                        <p className="text-gray-400 text-sm mt-2">
                            Stay updated with real estate trends, tips, and market insights.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:h-[510px] overflow-auto pt-1"
                        style={{ scrollbarWidth: 'none' }}>

                        <div className="blog-card fade-in h-max">
                            <div className="blog-card-img">
                                <div className="blog-img-placeholder">
                                    {/*  <i className="fa-solid fa-city text-4xl text-primary/30"></i>  */}
                                    <img src="./assets/img/blog1.webp" alt="blog1" className="object-fill" />
                                </div>
                                <span className="blog-badge">15 Jan 2026</span>
                            </div>
                            <div className="p-4">
                                <h6 className="font-semibold text-sm mb-2 leading-snug">
                                    Top 5 Localities to Invest in Real Estate This Year
                                </h6>
                                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                                    Discover the fastest-growing neighbourhoods offering the best ROI for
                                    property
                                    investors in 2026.
                                </p>
                                <div className="flex justify-between items-center text-xs border-t border-white/10 pt-3">
                                    <a href="#" className="text-accent hover:underline">View More</a>
                                    <span className="text-gray-500">By Admin</span>
                                </div>
                            </div>
                        </div>

                        <div className="blog-card fade-in h-max">
                            <div className="blog-card-img">
                                <div className="blog-img-placeholder">
                                    {/*  <i className="fa-solid fa-house-circle-check text-4xl text-primary/30"></i>  */}
                                    <img src="./assets/img/blog2.webp" alt="blog2" className="object-fill" />
                                </div>
                                <span className="blog-badge">02 Feb 2026</span>
                            </div>
                            <div className="p-4">
                                <h6 className="font-semibold text-sm mb-2 leading-snug">
                                    First-Time Buyer's Guide: What You Must Know
                                </h6>
                                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                                    Buying your first home can be overwhelming. Here's a step-by-step guide to
                                    make it
                                    stress-free.
                                </p>
                                <div className="flex justify-between items-center text-xs border-t border-white/10 pt-3">
                                    <a href="#" className="text-accent hover:underline">View More</a>
                                    <span className="text-gray-500">By Admin</span>
                                </div>
                            </div>
                        </div>

                        <div className="blog-card fade-in h-max">
                            <div className="blog-card-img">
                                <div className="blog-img-placeholder">
                                    {/*  <i className="fa-solid fa-chart-line text-4xl text-primary/30"></i>  */}
                                    <img src="./assets/img/blog3.webp" alt="blog3" className="object-fill" />
                                </div>
                                <span className="blog-badge">10 Mar 2026</span>
                            </div>
                            <div className="p-4">
                                <h6 className="font-semibold text-sm mb-2 leading-snug">
                                    How to Get the Best Price When Selling Your Property
                                </h6>
                                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                                    Expert tips on staging, pricing, and marketing your property to attract
                                    serious
                                    buyers fast.
                                </p>
                                <div className="flex justify-between items-center text-xs border-t border-white/10 pt-3">
                                    <a href="#" className="text-accent hover:underline">View More</a>
                                    <span className="text-gray-500">By Admin</span>
                                </div>
                            </div>
                        </div>

                        <div className="blog-card fade-in h-max">
                            <div className="blog-card-img">
                                <div className="blog-img-placeholder">
                                    {/*  <i className="fa-solid fa-file-contract text-4xl text-primary/30"></i>  */}
                                    <img src="./assets/img/blog4.webp" alt="blog4" className="object-fill" />
                                </div>
                                <span className="blog-badge">18 Mar 2026</span>
                            </div>
                            <div className="p-4">
                                <h6 className="font-semibold text-sm mb-2 leading-snug">
                                    Understanding RERA: Rights Every Property Buyer Has
                                </h6>
                                <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                                    RERA protects homebuyers from fraud and delays. Know your rights before
                                    signing any
                                    agreement.
                                </p>
                                <div className="flex justify-between items-center text-xs border-t border-white/10 pt-3">
                                    <a href="#" className="text-accent hover:underline">View More</a>
                                    <span className="text-gray-500">By Admin</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    </section>
    {/*  Contact us and Blog Section End  */}

    
                </>
  );
}
