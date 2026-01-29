import React from "react";
import HeroSection from "../assets/components/home/HeroSection";
import FeaturesSection from "../assets/components/home/FeaturesSection";
import FeaturedCars from "../assets/components/cars/FeaturedCars";
import TestimonialsSection from "../assets/components/home/TestimonialsSection";
import CTASection from "../assets/components/home/CTASection";

export default function Home() {
  const handleSearch = (filters) => {
    console.log("Search filters:", filters);
  };

  return (
    <div className="min-h-screen">
      <HeroSection onSearch={handleSearch} />
      <FeaturedCars />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
