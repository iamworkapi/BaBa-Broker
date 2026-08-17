import React from 'react';
import SectionHeader from '../SectionHeader';
import ImageLinkCard from '../ImageLinkCard';

const propertyTypes = [
  { title: 'Flats & Apartments', description: 'Move-in ready homes for every lifestyle and budget.', image: '/assets/img/about-banner.jpg', to: '/properties#flats', icon: 'fa-building' },
  { title: 'Plots & Land', description: 'Find well-located plots for your future home or investment.', image: '/assets/img/hero-bg.png', to: '/properties#plots', icon: 'fa-map-location-dot' },
  { title: 'Commercial Spaces', description: 'Offices, shops and spaces built for business growth.', image: '/assets/img/manhattan.png', to: '/properties#commercial', icon: 'fa-store' },
];

export default function QuickBrowseSection() {
  return <section id="buy" className="scroll-mt-24 bg-dark-2 px-6 py-20"><div className="mx-auto max-w-7xl"><SectionHeader eyebrow="Find your space" title="Browse by property type" description="Start with the kind of property you need, then explore verified opportunities with clear information." /><div className="grid gap-6 md:grid-cols-3">{propertyTypes.map((item) => <ImageLinkCard key={item.title} {...item} />)}</div></div></section>;
}
