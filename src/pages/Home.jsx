import React from "react";
import HeroSection from "../components/home/HeroSection";
import FeaturesSection from "../components/home/FeaturesSection";
import BrowseByBudgetSection from "../components/home/BrowseByBudgetSection";
import CollectionSection from "../components/home/CollectionSection";
import PropertyTypesSection from "../components/home/PropertyTypesSection";
import FeaturedPropertiesSection from "../components/home/FeaturedPropertiesSection";
import PropertyTokenizationSection from "../components/home/PropertyTokenizationSection";
import SecuritySection from "../components/home/SecuritySection";
import WeHandleEverythingSection from "../components/home/WeHandleEverythingSection";
import FAQSection from "../components/home/FAQSection";

const homeSections = [
  { id: "hero", label: "Welcome", Component: HeroSection },
  { id: "features", label: "Benefits", Component: FeaturesSection },
  {
    id: "investment-goals",
    label: "Investment goals",
    Component: BrowseByBudgetSection,
  },
  { id: "collections", label: "Collections", Component: CollectionSection },
  {
    id: "property-types",
    label: "Property types",
    Component: PropertyTypesSection,
  },
  {
    id: "featured-properties",
    label: "Featured properties",
    Component: FeaturedPropertiesSection,
  },
  {
    id: "property-investment",
    label: "Property investment",
    Component: PropertyTokenizationSection,
  },
  { id: "security", label: "Security", Component: SecuritySection },
  { id: "services", label: "Services", Component: WeHandleEverythingSection },
  { id: "faq", label: "FAQs", Component: FAQSection },
];



export default function Home() {
  return (
    <>
      {homeSections.map(({ id, Component }) => (
        <div id={id} key={id} className="scroll-mt-20">
          <Component />
        </div>
      ))}
    </>
  );
}
