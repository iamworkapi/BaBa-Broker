// --- Navbar scroll effect ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// --- Mobile menu toggle ---
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn?.addEventListener('click', () => {
    if (window.innerWidth >= 1024) {
        // lg: open right sidebar
        openSidebar();
    } else {
        mobileMenu?.classList.toggle('hidden');
    }
});

// --- Smooth close mobile menu on link click ---
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => mobileMenu?.classList.add('hidden'));
});

// --- Counter animation ---
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current).toLocaleString() + (el.dataset.suffix || '');
    }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// --- Fade-in on scroll ---
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-8');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => {
    el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
    fadeObserver.observe(el);
});

// --- Hero Buy / Rent tab toggle ---
function heroTab(el, type) {
    document.querySelectorAll('.hero-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const pills = document.querySelectorAll('.hero-pill');
    const buyPills = ['Affordable', 'Luxury', 'Investment'];
    const rentPills = ['Full House', 'Flatmates', 'Co-Living / PG'];
    const labels = type === 'rent' ? rentPills : buyPills;
    pills.forEach((p, i) => { if (labels[i]) p.textContent = labels[i]; });
}

// --- City Picker ---
function toggleCityPicker(e) {
    e.stopPropagation();
    const dropdown = document.getElementById('cityPickerDropdown');
    const chevron = document.getElementById('cityChevron');
    const isOpen = !dropdown.classList.contains('hidden');
    if (isOpen) {
        dropdown.classList.add('hidden');
        chevron.style.transform = 'rotate(0deg)';
    } else {
        dropdown.classList.remove('hidden');
        chevron.style.transform = 'rotate(180deg)';
    }
}

function closeCityPicker() {
    const dropdown = document.getElementById('cityPickerDropdown');
    const chevron = document.getElementById('cityChevron');
    dropdown.classList.add('hidden');
    chevron.style.transform = 'rotate(0deg)';
}

function selectCity(name) {
    document.getElementById('cityPickerLabel').textContent = name;
    // highlight selected
    document.querySelectorAll('.city-item').forEach(btn => {
        btn.classList.toggle('selected', btn.textContent.trim() === name);
    });
    closeCityPicker();
}

// Close city picker on outside click
document.addEventListener('click', (e) => {
    const dropdown = document.getElementById('cityPickerDropdown');
    const trigger = document.getElementById('cityPickerTrigger');
    if (dropdown && !dropdown.classList.contains('hidden')) {
        if (!dropdown.contains(e.target) && !trigger.contains(e.target)) {
            closeCityPicker();
        }
    }
});

// ===== Mega Menu =====
(function () {
    const parents = document.querySelectorAll('.mega-parent');

    function closeAll() {
        parents.forEach(p => {
            p.classList.remove('open');
            const id = p.dataset.mega;
            if (id) document.getElementById(id)?.classList.remove('open');
        });
    }

    parents.forEach(parent => {
        const trigger = parent.querySelector('.mega-trigger');
        const megaId = parent.dataset.mega;
        const panel = megaId ? document.getElementById(megaId) : null;

        if (!trigger || !panel) return;

        // Open on mouseenter, close on mouseleave (with small delay)
        let leaveTimer;

        const open = () => {
            clearTimeout(leaveTimer);
            closeAll();
            parent.classList.add('open');
            panel.classList.add('open');
        };

        const close = () => {
            leaveTimer = setTimeout(() => {
                parent.classList.remove('open');
                panel.classList.remove('open');
            }, 120);
        };

        parent.addEventListener('mouseenter', open);
        parent.addEventListener('mouseleave', close);
        panel.addEventListener('mouseenter', () => clearTimeout(leaveTimer));
        panel.addEventListener('mouseleave', close);
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (!e.target.closest('.mega-parent') && !e.target.closest('.mega-menu')) {
            closeAll();
        }
    });
})();

// ===== Branch Switcher =====
function switchBranch(btn, city) {
    document.querySelectorAll('.branch-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.branch-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('branch-' + city)?.classList.add('active');
}

// ===== Mobile Accordion =====
function toggleMobAcc(btn) {
    const panel = btn.nextElementSibling;
    const isOpen = panel.classList.contains('open');
    // Close all others
    document.querySelectorAll('.mob-acc-panel.open').forEach(p => p.classList.remove('open'));
    document.querySelectorAll('.mob-acc-trigger.open').forEach(b => b.classList.remove('open'));
    if (!isOpen) {
        panel.classList.add('open');
        btn.classList.add('open');
    }
}


// ===== Right Sidebar =====
function openSidebar() {
    document.getElementById('rightSidebar')?.classList.add('open');
    document.getElementById('sidebarOverlay')?.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeSidebar() {
    document.getElementById('rightSidebar')?.classList.remove('open');
    document.getElementById('sidebarOverlay')?.classList.remove('open');
    document.body.style.overflow = '';
}

// Close sidebar on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSidebar();
});

// ===== Get a Quote Modal =====
function openQuoteModal() {
    const modal = document.getElementById('quoteModal');
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

function closeQuoteModalOutside(e) {
    if (e.target.id === 'quoteModal') closeQuoteModal();
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeQuoteModal();
});


// The homepage promotion popup is intentionally disabled.

let promoSliderInterval = null;

function startPromoSlider() {
    let current = 0;
    const slides = document.querySelectorAll('.promo-slide');
    if (slides.length < 2) return;
    promoSliderInterval = setInterval(() => {
        slides[current].classList.add('promo-slide-hidden');
        current = (current + 1) % slides.length;
        slides[current].classList.remove('promo-slide-hidden');
    }, 2000);
}

function closePromo() {
    const modal = document.getElementById('promoModal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (promoSliderInterval) { clearInterval(promoSliderInterval); promoSliderInterval = null; }
}

function closePromoOutside(e) {
    if (e.target.id === 'promoModal') closePromo();
}

function promoDontShowToggle(checkbox) {
    localStorage.setItem('promoDismissed', checkbox.checked ? 'true' : 'false');
}


// ===== Stacked Card Carousel =====
(function () {
    const carousel = document.getElementById('stackCarousel');
    if (!carousel) return;

    const cards = Array.from(carousel.querySelectorAll('.stack-card'));
    const total = cards.length;
    let order = cards.map((_, i) => i); // order[0] = front card index

    function applyPositions() {
        order.forEach((cardIdx, pos) => {
            const card = cards[cardIdx];
            card.dataset.pos = pos < 4 ? pos : 3;
        });
    }

    function cycle() {
        const frontCardIdx = order[0];
        const frontCard = cards[frontCardIdx];

        // fly out front card
        frontCard.classList.add('exiting');

        setTimeout(() => {
            frontCard.classList.remove('exiting');
            // move front to back of order
            order.push(order.shift());
            applyPositions();
        }, 520);
    }

    applyPositions();
    setInterval(cycle, 2800);
})();


// ===== FAQ Accordion =====
function toggleFaq(btn) {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    // close all
    document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
    // open clicked if it was closed
    if (!isOpen) item.classList.add('open');
}


// ===== Property Type Showcase Tabs =====
const propTypeData = {
    residential: {
        icon: 'fa-house', title: 'Residential',
        desc: 'Browse verified residential properties — apartments, villas, and independent houses across top cities. Find your perfect home with zero brokerage.',
        tags: ['Quick Setup', 'Verified Listings', 'Full Support'],
        img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80'
    },
    plots: {
        icon: 'fa-map', title: 'Plots',
        desc: 'Invest in residential and agricultural plots across prime locations. RERA verified land with clear titles and legal documentation support.',
        tags: ['Clear Titles', 'RERA Verified', 'Legal Support'],
        img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80'
    },
    commercial: {
        icon: 'fa-building', title: 'Commercial',
        desc: 'Find offices, retail shops, showrooms, and warehouses in high-footfall commercial zones. Ideal for businesses and investors.',
        tags: ['High ROI', 'Prime Locations', 'Flexible Leasing'],
        img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80'
    },
    rental: {
        icon: 'fa-key', title: 'Rental',
        desc: 'Discover furnished and unfurnished rental homes, PG accommodations, and co-living spaces. Move in fast with verified landlords.',
        tags: ['Zero Deposit', 'Verified Owners', 'Instant Move-in'],
        img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80'
    },
    luxury: {
        icon: 'fa-gem', title: 'Luxury',
        desc: 'Explore ultra-premium villas, penthouses, and luxury apartments with world-class amenities in the most sought-after addresses.',
        tags: ['Premium Amenities', 'Exclusive Listings', 'Concierge Service'],
        img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80'
    }
};

function switchPropType(btn, type) {
    document.querySelectorAll('.prop-type-tab').forEach(b => {
        b.classList.remove('active-tab');
        b.classList.add('border-white/10', 'text-gray-400', 'bg-transparent');
    });
    btn.classList.add('active-tab');
    btn.classList.remove('border-white/10', 'text-gray-400', 'bg-transparent');

    const d = propTypeData[type];
    document.getElementById('propTypeIcon').innerHTML = `<i class="fa-solid ${d.icon}"></i>`;
    document.getElementById('propTypeTitle').textContent = d.title;
    document.getElementById('propTypeDesc').textContent = d.desc;
    document.getElementById('propTypeTags').innerHTML = d.tags.map(t =>
        `<span class="text-xs border border-white/10 rounded-full px-3 py-1 text-gray-300">${t}</span>`
    ).join('');
    document.getElementById('propTypeImg').src = d.img;
    document.getElementById('propTypeImg').alt = d.title;
}


const track = document.getElementById("sliderTrack");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

if (track && nextBtn && prevBtn) {
    let index = 0;
    const cardWidth = (track.children[0]?.offsetWidth || 0) + 24; // 24 = gap

    nextBtn.addEventListener("click", () => {
        if (index < track.children.length - 3) {
            index++;
            track.style.transform = `translateX(-${index * cardWidth}px)`;
        }
    });

    prevBtn.addEventListener("click", () => {
        if (index > 0) {
            index--;
            track.style.transform = `translateX(-${index * cardWidth}px)`;
        }
    });
}
