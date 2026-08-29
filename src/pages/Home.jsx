import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CollectionSection from '../components/home/CollectionSection';
import PropertyTypesSection from '../components/home/PropertyTypesSection';
import FeaturedPropertiesSection from '../components/home/FeaturedPropertiesSection';
import PropertyTokenizationSection from '../components/home/PropertyTokenizationSection';
import SecuritySection from '../components/home/SecuritySection';
import WeHandleEverythingSection from '../components/home/WeHandleEverythingSection';
import FAQSection from '../components/home/FAQSection';

const homeSections = [
  { id: 'hero', label: 'Welcome', Component: HeroSection, reveal: false },
  { id: 'features', label: 'Benefits', Component: FeaturesSection },
  { id: 'collections', label: 'Collections', Component: CollectionSection },
  { id: 'property-types', label: 'Property types', Component: PropertyTypesSection },
  { id: 'featured-properties', label: 'Featured properties', Component: FeaturedPropertiesSection },
  { id: 'property-investment', label: 'Property investment', Component: PropertyTokenizationSection },
  { id: 'security', label: 'Security', Component: SecuritySection },
  { id: 'services', label: 'Services', Component: WeHandleEverythingSection },
  { id: 'faq', label: 'FAQs', Component: FAQSection },
];

const containerVariants = {
  hidden: {},
  visible: (i = 0) => ({
    transition: { staggerChildren: 0.1, delayChildren: i * 0.06 },
  }),
};

const sectionVariant = {
  hidden: { opacity: 0, y: 50, scale: 0.98 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 160, damping: 22, mass: 0.8, delay: i * 0.06 },
  }),
};

function MotionWrapper({ children, reveal = true, id }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  if (!reveal) {
    return <div id={id}>{children}</div>;
  }

  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'} variants={containerVariants} custom={0}>
      <motion.div variants={sectionVariant}>{children}</motion.div>
    </motion.div>
  );
}

export default function Home() {
  return (
    <>
      {homeSections.map(({ id, Component, reveal = true }) => (
        <div id={id} key={id} className="scroll-mt-20">
          <MotionWrapper reveal={reveal} id={id}>
            <Component />
          </MotionWrapper>
        </div>
      ))}
    </>
  );
}
