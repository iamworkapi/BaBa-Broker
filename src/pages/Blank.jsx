import React from 'react';

export default function Blank() {
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
                                    Discover the fastest-growing neighbourhoods offering the best ROI for property
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
                                    Buying your first home can be overwhelming. Here's a step-by-step guide to make it
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
                                    Expert tips on staging, pricing, and marketing your property to attract serious
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
                                    RERA protects homebuyers from fraud and delays. Know your rights before signing any
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
