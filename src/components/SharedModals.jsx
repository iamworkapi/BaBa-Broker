import React, { useState } from 'react';

export default function SharedModals() {
  const [quoteSent, setQuoteSent] = useState(false);
  const submitQuote = (event) => {
    event.preventDefault();
    setQuoteSent(true);
    event.currentTarget.reset();
  };
  return (
    <>
      
    <div id="promoModal" className="promo-overlay" onClick={() => window.closePromoOutside(event)}>
        {/*  Slide 1  */}
        <div className="promo-box promo-slide" id="promoSlide1">
            <button className="promo-close" onClick={() => window.closePromo()}><i className="fa-solid fa-xmark"></i></button>
            {/*  Left: Image panel  */}
            <div className="promo-img-panel">
                <div className="promo-img-inner">
                    <div className="promo-img-placeholder">
                        <i className="fa-solid fa-building text-white/20" style={{ fontSize: '5rem' }}></i>
                    </div>
                    <div className="promo-img-badge">
                        <p className="promo-badge-title">Your Final <span>Opportunity</span></p>
                        <p className="promo-badge-sub">To own before it's too late</p>
                    </div>
                    <div className="promo-offer-bar">
                        <p className="promo-offer-title"><i className="fa-solid fa-tag"></i> Spot Booking Offer</p>
                        <p className="promo-offer-sub">Available on every booking — Offer valid till 31st March, 2026</p>
                    </div>
                </div>
            </div>
            {/*  Right: Details panel  */}
            <div className="promo-detail-panel">
                <div className="promo-brand">
                    <span className="promo-brand-icon"><i className="fa-solid fa-building-columns"></i></span>
                    <span className="promo-brand-name">Baba <span className="text-accent">Broker</span></span>
                </div>
                <h2 className="promo-property-name">Premium <span className="text-accent">Properties</span><br />Across India</h2>
                <p className="promo-property-loc"><i className="fa-solid fa-location-dot text-accent"></i> Delhi NCR &amp; Major
                    Cities</p>
                <p className="promo-property-desc">Homes designed to give more back to life's little luxuries. Verified
                    listings, zero hidden charges.</p>
                <div className="promo-stats">
                    <div className="promo-stat">
                        <strong>2 &amp; 3 BHK</strong>
                        <small>Starting at ₹45L+</small>
                    </div>
                    <div className="promo-stat-divider"></div>
                    <div className="promo-stat">
                        <strong>RERA Verified</strong>
                        <small>Ready Possession</small>
                    </div>
                </div>
                <a href="./contact-us.html" className="promo-cta-btn" onClick={() => window.closePromo()}>
                    Enquire Now <i className="fa-solid fa-arrow-right"></i>
                </a>
                <p className="promo-dont-show">
                    <label><input type="checkbox" id="promoDontShow" onChange={(e) => window.promoDontShowToggle?.(e.target)} /> Don't show
                        again</label>
                </p>
            </div>
        </div>
        {/*  Slide 2  */}
        <div className="promo-box promo-slide promo-slide-hidden" id="promoSlide2">
            <button className="promo-close" onClick={() => window.closePromo()}><i className="fa-solid fa-xmark"></i></button>
            {/*  Left: Image panel  */}
            <div className="promo-img-panel" style={{ background: 'linear-gradient(135deg, #1a4731 0%, #0d2b1e 100%)' }}>
                <div className="promo-img-inner">
                    <div className="promo-img-placeholder">
                        <i className="fa-solid fa-city text-white/20" style={{ fontSize: '5rem' }}></i>
                    </div>
                    <div className="promo-img-badge">
                        <p className="promo-badge-title">Exclusive <span>Investment</span></p>
                        <p className="promo-badge-sub">High-yield commercial spaces</p>
                    </div>
                    <div className="promo-offer-bar" style={{ background: '#0d2b1e' }}>
                        <p className="promo-offer-title"><i className="fa-solid fa-percent"></i> Zero Brokerage Deal</p>
                        <p className="promo-offer-sub">Direct from builder — Limited units available</p>
                    </div>
                </div>
            </div>
            {/*  Right: Details panel  */}
            <div className="promo-detail-panel">
                <div className="promo-brand">
                    <span className="promo-brand-icon"><i className="fa-solid fa-handshake"></i></span>
                    <span className="promo-brand-name">Baba <span className="text-accent">Broker</span></span>
                </div>
                <h2 className="promo-property-name">Commercial <span className="text-accent">Spaces</span><br />For Smart
                    Investors</h2>
                <p className="promo-property-loc"><i className="fa-solid fa-location-dot text-accent"></i> Noida, Gurugram &amp;
                    Pune</p>
                <p className="promo-property-desc">Office spaces and retail shops with guaranteed rental returns. Fully
                    furnished options available.</p>
                <div className="promo-stats">
                    <div className="promo-stat">
                        <strong>Shops &amp; Offices</strong>
                        <small>Starting at ₹25L+</small>
                    </div>
                    <div className="promo-stat-divider"></div>
                    <div className="promo-stat">
                        <strong>8–10% Returns</strong>
                        <small>Assured Rental Yield</small>
                    </div>
                </div>
                <a href="./contact-us.html" className="promo-cta-btn" onClick={() => window.closePromo()}>
                    Book a Site Visit <i className="fa-solid fa-arrow-right"></i>
                </a>
                <p className="promo-dont-show">
                    <label><input type="checkbox" onChange={(e) => window.promoDontShowToggle?.(e.target)} /> Don't show again</label>
                </p>
            </div>
        </div>
    </div>

    
      
    <div id="sidebarOverlay" className="sidebar-overlay" onClick={() => window.closeSidebar()}></div>
    <aside id="rightSidebar" className="right-sidebar">
        <button className="sidebar-close-btn" onClick={() => window.closeSidebar()}>
            <i className="fa-solid fa-xmark"></i>
        </button>

        {/*  Quick Links  */}
        <div className="sidebar-section">
            <h3 className="sidebar-heading">Quick <span className="text-accent">Link</span></h3>
            <ul className="sidebar-links">
                <li><a href="./about-us.html"><i className="fa-solid fa-users"></i> About Us</a></li>
                <li><a href="./contact-us.html"><i className="fa-solid fa-headset"></i> Contact Us</a></li>
                <li><a href="#"><i className="fa-solid fa-blog"></i> Blog</a></li>
                <li><a href="#"><i className="fa-solid fa-newspaper"></i> News</a></li>
                <li><a href="#"><i className="fa-solid fa-star"></i> Testimonials</a></li>
                <li><a href="#"><i className="fa-solid fa-people-group"></i> Team</a></li>
                <li><a href="#"><i className="fa-solid fa-briefcase"></i> Career</a></li>
            </ul>
        </div>

        {/*  Contact Us  */}
        <div className="sidebar-section">
            <h3 className="sidebar-heading">Contact <span className="text-accent">Us</span></h3>
            <ul className="sidebar-contact-list">
                <li>
                    <span className="sidebar-contact-icon"><i className="fa-solid fa-location-dot"></i></span>
                    F-47, 1st Floor, Milap Nagar, Uttam Nagar, New Delhi – 110059
                </li>
                <li>
                    <span className="sidebar-contact-icon"><i className="fa-solid fa-phone"></i></span>
                    <a href="tel:+911800000000">+91 1800 000 000</a>
                </li>
                <li>
                    <span className="sidebar-contact-icon"><i className="fa-solid fa-envelope"></i></span>
                    <a href="mailto:info@bababroker.com">info@bababroker.com</a>
                </li>
                <li>
                    <span className="sidebar-contact-icon"><i className="fa-solid fa-globe"></i></span>
                    <a href="./index.html">www.bababroker.com</a>
                </li>
            </ul>
        </div>

        {/*  Social Media  */}
        <div className="sidebar-section">
            <h3 className="sidebar-heading">Social <span className="text-accent">Media</span></h3>
            <div className="sidebar-socials">
                <a href="#" className="sidebar-social-btn" style={{ background: '#1877f2' }}>
                    <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a href="#" className="sidebar-social-btn" style={{ background: '#1da1f2' }}>
                    <i className="fa-brands fa-x-twitter"></i>
                </a>
                <a href="#" className="sidebar-social-btn" style={{ background: '#0a66c2' }}>
                    <i className="fa-brands fa-linkedin-in"></i>
                </a>
                <a href="#" className="sidebar-social-btn"
                    style={{ background: 'radial-gradient(circle at 30% 107%,#fdf497 0%,#fd5949 45%,#d6249f 60%,#285aeb 90%)' }}>
                    <i className="fa-brands fa-instagram"></i>
                </a>
            </div>
        </div>
    </aside>

    
      
    <div id="quoteModal" className="quote-modal-overlay" onClick={() => window.closeQuoteModalOutside(event)}>
        <div className="quote-modal-box">
            {/*  Close button  */}
            <button className="quote-modal-close" onClick={() => window.closeQuoteModal()}>X</button>
            {/*  Header  */}
            <div className="quote-modal-header">
                <h2 className="quote-modal-title">Request a <span>Quotation</span></h2>
                <p className="quote-modal-sub">Tell us what you need and our team will help you find the right property and investment option.</p>
            </div>
            {/*  Form  */}
            <form className="quote-modal-form" onSubmit={submitQuote}>
                <input type="text" placeholder="Name" className="quote-input" required />
                <input type="email" placeholder="Email" className="quote-input" required />
                <input type="tel" placeholder="Phone Number" className="quote-input" required />
                <textarea rows="4" placeholder="Property Requirements / Message"
                    className="quote-input quote-textarea"></textarea>
                <button type="submit" className="quote-submit-btn">Submit</button>
            </form>
            {quoteSent && <p className="mt-4 text-center text-sm text-green-400">Thank you. Our team will contact you shortly.</p>}
        </div>
    </div>

    
    </>
  );
}
