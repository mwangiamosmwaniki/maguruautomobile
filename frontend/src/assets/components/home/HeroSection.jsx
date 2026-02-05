import React, { useState, useEffect } from "react";
import {
  Search,
  Car,
  Calendar,
  Fuel,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Shield,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../../lib/utils";

const heroSlides = [
  {
    image:
      "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&q=80",
    badge: "🏆 Most Popular SUV",
    title: "Premium SUVs",
    subtitle: "Toyota Land Cruiser & More",
    description:
      "Discover Kenya's most trusted off-road vehicles. Built for African terrain with legendary reliability.",
    price: "From KSH 2.5M",
    features: ["4WD Capability", "7-Seater Options", "Diesel & Petrol"],
    stats: { available: "50+", avgPrice: "KSH 5.2M" },
  },
  {
    image:
      "https://nar.media.audi.com/is/image/audinar/country/us/en/assets/pct/MY25---A5---Exterior---Front-Profile---Driving---3-TILE-ONE-592x925.jpg",
    badge: "⭐ Luxury Collection",
    title: "German Engineering",
    subtitle: "Mercedes-Benz, BMW & Audi",
    description:
      "Experience luxury and performance with premium German automobiles. Meticulously inspected for discerning drivers.",
    price: "From KSH 1.8M",
    features: ["Latest Tech", "Premium Interiors", "Low Mileage"],
    stats: { available: "20+", avgPrice: "KSH 4.1M" },
  },
  {
    image:
      "https://www.mazdausa.com/siteassets/vehicles/2026/cx-30/04_btv/010_special-offers-refresh/a_desktop/cx30-desktop.png?w=480%20480w",
    badge: "🔥 Popular Choice",
    title: "Mazda CX-5 Crossover",
    subtitle: "Stylish & Practical",
    description:
      "One of the most sought-after crossovers in Kenya. Refined handling with family-friendly space and comfort.",
    price: "From KSH 2.8M+",
    features: ["Refined Ride", "Spacious Interior", "Safety Features"],
    stats: { available: "Used & Imports", avgPrice: "KSH 4M-6M+" },
  },
  {
    image:
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&q=80",
    badge: "💎 Executive Choice",
    title: "Business Vehicles",
    subtitle: "BMW X Series & Executive Sedans",
    description:
      "Elevate your business image with executive-class vehicles. Perfect for corporate professionals.",
    price: "From KSH 3.5M",
    features: ["Executive Class", "Advanced Safety", "Premium Comfort"],
    stats: { available: "30+", avgPrice: "KSH 6.5M" },
  },
];

export default function HeroSection({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [make, setMake] = useState("");
  const [year, setYear] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );
  };

  const handleSearch = () => {
    onSearch({
      query: searchQuery,
      make,
      year,
      priceRange,
    });
  };

  const currentContent = heroSlides[currentSlide];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black" />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-radial from-rose-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2 animate-pulse opacity-60" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-radial from-orange-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/2 animate-pulse opacity-50" />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-30" />

      <div className="relative px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-16">
        {/* Mobile: Image First, Content Below */}
        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          {/* Car Image - Shows First on Mobile */}
          <div className="relative order-1 h-64 sm:h-80 lg:h-[500px] lg:order-2">
            {/* Car Slider */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <div className="relative h-full">
                  {/* Glow effect */}
                  <div className="absolute inset-0 transform scale-105 bg-gradient-to-br from-rose-500/20 to-orange-500/20 rounded-2xl blur-2xl" />

                  {/* Main Image */}
                  <img
                    src={heroSlides[currentSlide].image}
                    alt={heroSlides[currentSlide].subtitle}
                    className="relative object-cover w-full h-full border shadow-2xl rounded-2xl border-gray-800/50"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />

                  {/* Floating Stats Badge - Hidden on small mobile */}
                  <div className="absolute items-center hidden gap-3 p-3 border shadow-xl sm:flex -bottom-4 left-4 bg-black/90 backdrop-blur-xl rounded-xl border-gray-800/50">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-white">500+</p>
                      <p className="text-xs text-gray-400">Cars Available</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows - Smaller on Mobile */}
            <button
              onClick={prevSlide}
              aria-label="Previous"
              className="absolute z-10 flex items-center justify-center w-10 h-10 transition-all -translate-y-1/2 border rounded-full shadow-xl left-2 top-1/2 sm:w-12 sm:h-12 bg-black/80 backdrop-blur-md hover:bg-black/90 hover:scale-110 border-gray-700/50"
            >
              <ChevronLeft className="w-5 h-5 text-white sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next"
              className="absolute z-10 flex items-center justify-center w-10 h-10 transition-all -translate-y-1/2 border rounded-full shadow-xl right-2 top-1/2 sm:w-12 sm:h-12 bg-black/80 backdrop-blur-md hover:bg-black/90 hover:scale-110 border-gray-700/50"
            >
              <ChevronRight className="w-5 h-5 text-white sm:w-6 sm:h-6" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute flex items-center gap-2 -translate-x-1/2 -bottom-6 left-1/2 sm:-bottom-8">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-gradient-to-r from-rose-500 to-orange-500"
                      : "w-2 bg-gray-600 hover:bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Content - Shows Second on Mobile */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="z-10 order-2 pt-8 lg:pt-0 lg:order-1 sm:pt-12"
            >
              {/* Badge */}
              <span className="inline-block px-3 py-1.5 mb-3 text-xs sm:text-sm font-semibold border rounded-full bg-gradient-to-r from-black/90 to-black/80 backdrop-blur-sm text-rose-400 border-gray-700/50">
                {currentContent.badge}
              </span>

              {/* Main Title */}
              <h1 className="mb-2 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-5xl">
                {currentContent.title}
              </h1>

              {/* Subtitle */}
              <h2 className="mb-4 text-xl font-semibold sm:text-2xl lg:text-3xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                  {currentContent.subtitle}
                </span>
              </h2>

              {/* Description - Shorter on mobile */}
              <p className="max-w-xl mb-4 text-sm leading-relaxed text-gray-400 sm:text-base lg:mb-6">
                {currentContent.description}
              </p>

              {/* Features - 2 columns on mobile */}
              <div className="grid grid-cols-2 gap-2 mb-4 sm:flex sm:flex-wrap sm:gap-3 lg:mb-6">
                {currentContent.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 text-xs border rounded-lg bg-black/60 backdrop-blur-sm border-gray-700/50 sm:text-sm"
                  >
                    <CheckCircle2 className="flex-shrink-0 w-3 h-3 text-green-500 sm:w-4 sm:h-4" />
                    <span className="font-medium text-gray-200">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Stats - Compact on mobile */}
              <div className="flex items-center gap-4 p-3 mb-6 border sm:gap-6 sm:p-4 bg-black/40 backdrop-blur-sm rounded-xl border-gray-700/50">
                <div>
                  <p className="text-xl font-bold text-white sm:text-2xl">
                    {currentContent.stats.available}
                  </p>
                  <p className="text-xs text-gray-400 sm:text-sm">
                    Cars Available
                  </p>
                </div>
                <div className="w-px h-10 bg-gray-700" />
                <div>
                  <p className="text-xl font-bold text-transparent sm:text-2xl bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
                    95%
                  </p>
                  <p className="text-xs text-gray-400 sm:text-sm">
                    Customer Satisfaction
                  </p>
                </div>
              </div>

              {/* CTA Buttons - Stack on mobile */}
              <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:gap-4">
                <Link to={createPageUrl("Cars")} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full px-6 py-5 text-sm font-semibold text-white transition-all shadow-xl sm:px-8 sm:text-base bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 shadow-rose-500/30 rounded-xl hover:scale-105"
                  >
                    View All Cars
                    <ChevronRight className="w-4 h-4 ml-2 sm:w-5 sm:h-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full px-6 py-5 text-sm text-white transition-all border border-gray-700 sm:w-auto sm:px-8 sm:text-base bg-black/50 hover:bg-gray-800/50 rounded-xl backdrop-blur-sm"
                >
                  <Shield className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  Quality Guarantee
                </Button>
              </div>

              {/* Trust Indicators - Compact on mobile */}
              <div className="flex flex-col gap-3 text-xs sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 sm:text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">200+ Point Inspection</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">Warranty Available</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">Secure Payments</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Search Bar - More compact and mobile-friendly */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 lg:mt-16"
        >
          <div className="p-4 border shadow-2xl sm:p-6 lg:p-8 bg-black/90 backdrop-blur-xl rounded-2xl border-gray-800/50">
            {/* Search Header */}
            <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between sm:mb-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white sm:text-xl">
                <Search className="w-5 h-5 text-rose-500 sm:w-6 sm:h-6" />
                Find Your Perfect Car
              </h3>
              <span className="text-xs text-gray-400 sm:text-sm">
                500+ verified listings
              </span>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-3 p-3 mb-4 border border-gray-700 sm:p-4 sm:mb-6 bg-black/50 rounded-xl">
              <Search className="flex-shrink-0 w-4 h-4 text-gray-400 sm:w-5 sm:h-5" />
              <Input
                placeholder="Search make, model... (e.g., Toyota)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-sm text-white bg-transparent border-0 sm:text-base focus-visible:ring-0 placeholder:text-gray-500"
              />
            </div>

            {/* Filter Grid - Stack on mobile */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Make Select */}
              <Select value={make} onValueChange={setMake}>
                <SelectTrigger className="text-white transition-colors border-gray-700 h-11 sm:h-12 rounded-xl bg-black/50 hover:border-gray-600">
                  <Car className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Make" />
                </SelectTrigger>
                <SelectContent className="text-white bg-black border-gray-700">
                  <SelectItem value="all">All Makes</SelectItem>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="honda">Honda</SelectItem>
                  <SelectItem value="nissan">Nissan</SelectItem>
                  <SelectItem value="mazda">Mazda</SelectItem>
                  <SelectItem value="suzuki">Suzuki</SelectItem>
                  <SelectItem value="volkswagen">Volkswagen</SelectItem>
                  <SelectItem value="subaru">Subaru</SelectItem>
                  <SelectItem value="audi">Audi</SelectItem>
                  <SelectItem value="landrover">Land Rover</SelectItem>
                </SelectContent>
              </Select>

              {/* Year Select */}
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="text-white transition-colors border-gray-700 h-11 sm:h-12 rounded-xl bg-black/50 hover:border-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="text-white bg-black border-gray-700">
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                  <SelectItem value="2018">2018</SelectItem>
                  <SelectItem value="2017">2017</SelectItem>
                  <SelectItem value="older">2016 & Older</SelectItem>
                </SelectContent>
              </Select>

              {/* Price Range Select */}
              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="text-white transition-colors border-gray-700 h-11 sm:h-12 rounded-xl bg-black/50 hover:border-gray-600">
                  <Settings2 className="w-4 h-4 mr-2 text-gray-400" />
                  <SelectValue placeholder="Price" />
                </SelectTrigger>
                <SelectContent className="text-white bg-black border-gray-700">
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="0-500000">Under 500K</SelectItem>
                  <SelectItem value="500000-1000000">500K - 1M</SelectItem>
                  <SelectItem value="1000000-2000000">1M - 2M</SelectItem>
                  <SelectItem value="2000000-3000000">2M - 3M</SelectItem>
                  <SelectItem value="3000000-5000000">3M - 5M</SelectItem>
                  <SelectItem value="5000000-10000000">5M - 10M</SelectItem>
                  <SelectItem value="10000000+">Above 10M</SelectItem>
                </SelectContent>
              </Select>

              {/* Search Button */}
              <Link to={createPageUrl("Cars")} className="w-full">
                <Button className="w-full text-sm font-semibold transition-all shadow-lg h-11 sm:h-12 sm:text-base bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-xl shadow-rose-500/25 hover:scale-105">
                  <Search className="w-4 h-4 mr-2 sm:w-5 sm:h-5" />
                  Search
                </Button>
              </Link>
            </div>

            {/* Popular Searches - Scrollable on mobile */}
            <div className="pt-4 mt-4 border-t border-gray-700 sm:pt-6 sm:mt-6">
              <p className="mb-3 text-xs text-gray-400 sm:text-sm">
                Popular Searches:
              </p>
              <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide sm:flex-wrap sm:overflow-visible">
                {[
                  "Land Cruiser",
                  "Mercedes C-Class",
                  "CR-V",
                  "BMW X5",
                  "CX-5",
                  "X-Trail",
                ].map((term) => (
                  <button
                    key={term}
                    className="flex-shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm transition-colors border rounded-lg bg-black/60 hover:bg-gray-800/60 text-gray-300 border-gray-700/50 whitespace-nowrap"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
