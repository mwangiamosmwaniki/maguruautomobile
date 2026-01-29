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
      "Discover Kenya's most trusted off-road vehicles. Built for African terrain with legendary reliability. Perfect for families and adventure seekers. Shop certified pre-owned Land Cruisers, Prados, and Fortuners with comprehensive warranty coverage.",
    price: "From KSH 2.5M",
    features: ["4WD Capability", "7-Seater Options", "Diesel & Petrol"],
    stats: { available: "50+", avgPrice: "KSH 5.2M" },
  },
  {
    image:
      "https://nar.media.audi.com/is/image/audinar/country/us/en/assets/pct/MY25---A5---Exterior---Front-Profile---Driving---3-TILE-ONE-592x925.jpg",
    badge: "⭐ Luxury Collection",
    title: "German Engineering Excellence",
    subtitle: "Mercedes-Benz, BMW & Audi",
    description:
      "Experience luxury and performance with premium German automobiles. Meticulously inspected Mercedes C-Class, E-Class, BMW 3 Series, 5 Series, and Audi A4 models. Perfect blend of comfort, technology, and prestige for Nairobi's discerning drivers.",
    price: "From KSH 1.8M",
    features: ["Latest Tech", "Premium Interiors", "Low Mileage"],
    stats: { available: "20+", avgPrice: "KSH 4.1M" },
  },
  {
    image:
      "https://www.mazdausa.com/siteassets/vehicles/2026/cx-30/04_btv/010_special-offers-refresh/a_desktop/cx30-desktop.png?w=480%20480w",
    badge: "🔥 Popular Choice",
    title: "Mazda CX-5 Crossover SUV",
    subtitle: "Mazda CX-5 — Stylish & Practical",
    description:
      "One of the most sought-after Mazda crossovers in Kenya. The Mazda CX-5 blends refined handling with family-friendly space, comfort, and strong safety credentials. Available in both petrol and AWD variants and ideal for city driving, trips on rough roads, and weekend outings. A reliable option with good resale value and premium features for its class.",
    price: "From KSH 2.8M+",
    features: ["Refined Ride", "Spacious Interior", "Safety Features"],
    stats: { available: "Used & Imports", avgPrice: "KSH 4M-6M+" },
  },
  {
    image:
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&q=80",
    badge: "💎 Executive Choice",
    title: "Premium Business Vehicles",
    subtitle: "BMW X Series & Executive Sedans",
    description:
      "Elevate your business image with executive-class vehicles. BMW X3, X5, 5 Series, and Mercedes E-Class perfect for corporate professionals. Advanced driver assistance, luxurious cabins, and powerful performance for Kenya's business leaders.",
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
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-rose-500/20 to-orange-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-orange-500/10 to-rose-500/10 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px]">
          {/* Left Content - Dynamic per slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="z-10"
            >
              {/* Badge */}
              <motion.span
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-2 bg-gradient-to-r from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-full text-sm font-semibold text-rose-400 mb-4 shadow-lg border border-slate-600/50"
              >
                {currentContent.badge}
              </motion.span>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-3"
              >
                {currentContent.title}
              </motion.h1>

              {/* Subtitle */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-2xl sm:text-3xl font-semibold mb-5"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500">
                  {currentContent.subtitle}
                </span>
              </motion.h2>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-base sm:text-lg text-slate-300 mb-6 leading-relaxed max-w-xl"
              >
                {currentContent.description}
              </motion.p>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-wrap gap-3 mb-6"
              >
                {currentContent.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-slate-800/60 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-slate-200">
                      {feature}
                    </span>
                  </div>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-6 mb-8 p-4 bg-slate-800/40 backdrop-blur-sm rounded-xl border border-slate-700/50"
              >
                <div>
                  <p className="text-2xl font-bold text-white">
                    {currentContent.stats.available}
                  </p>
                  <p className="text-sm text-slate-400">Cars Available</p>
                </div>
                <div className="w-px h-12 bg-slate-700" />
                <div>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
                    95%
                  </p>
                  <p className="text-sm text-slate-400">
                    Customer Satisfaction
                  </p>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link to={createPageUrl("Cars")}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-xl shadow-rose-500/30 rounded-xl px-8 py-6 text-base font-semibold transition-all hover:scale-105"
                  >
                    View All Cars
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-800/70 text-white rounded-xl px-8 py-6 text-base backdrop-blur-sm transition-all"
                >
                  <Shield className="w-5 h-5 mr-2" />
                  Quality Guarantee
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap items-center gap-6 text-sm"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">200+ Point Inspection</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">Warranty Available</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium">Secure Payments</span>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Right - Car Image Carousel */}
          <div className="relative h-[500px] lg:h-[600px]">
            {/* Car Slider */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 0.95, x: 100 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: -100 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <div className="relative h-full">
                  {/* Glow effect behind image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-orange-500/20 rounded-3xl blur-2xl transform scale-105" />

                  {/* Main Image */}
                  <img
                    src={heroSlides[currentSlide].image}
                    alt={`${heroSlides[currentSlide].subtitle} - Buy quality used cars in Kenya`}
                    className="relative w-full h-full object-cover rounded-3xl shadow-2xl border border-slate-700/50"
                  />

                  {/* Image Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-3xl" />

                  {/* Quick Stats Overlay */}
                  {/* <div className="absolute bottom-6 left-6 right-6 bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 shadow-2xl border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">
                          Average Price
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {heroSlides[currentSlide].stats.avgPrice}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-slate-400 mb-1">In Stock</p>
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
                          {heroSlides[currentSlide].stats.available}
                        </p>
                      </div>
                    </div>
                  </div> */}
                  {/* Floating badge */}
                  <div className="absolute -bottom-8 left-6 bg-slate-800 rounded-2xl shadow-xl p-3 flex items-center gap-3 z-10 border border-slate-700">
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
                      <Car className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white">200+</p>
                      <p className="text-sm text-slate-400">Cars Available</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              aria-label="Previous car category"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-slate-900/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-slate-800 hover:scale-110 transition-all z-10 border-2 border-slate-700"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next car category"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-slate-900/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:bg-slate-800 hover:scale-110 transition-all z-10 border-2 border-slate-700"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-10 bg-gradient-to-r from-rose-500 to-orange-500"
                      : "w-2.5 bg-slate-600 hover:bg-slate-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 lg:mt-20"
        >
          <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-8 border-2 border-slate-700/50">
            {/* Search Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Search className="w-6 h-6 text-rose-500" />
                Find Your Perfect Car
              </h3>
              <span className="text-sm text-slate-400 hidden sm:block">
                Search from 500+ verified listings
              </span>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-950/50 rounded-xl border border-slate-700">
              <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <Input
                placeholder="Search by make, model, or keyword... (e.g., Toyota Land Cruiser, Mercedes C200)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 text-base focus-visible:ring-0 placeholder:text-slate-500 bg-transparent text-white flex-1"
              />
            </div>

            {/* Filter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Make Select */}
              <Select value={make} onValueChange={setMake}>
                <SelectTrigger className="h-12 rounded-xl border-slate-700 bg-slate-950/50 text-white hover:border-slate-600 transition-colors">
                  <Car className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Select Make" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
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
                <SelectTrigger className="h-12 rounded-xl border-slate-700 bg-slate-950/50 text-white hover:border-slate-600 transition-colors">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
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
                <SelectTrigger className="h-12 rounded-xl border-slate-700 bg-slate-950/50 text-white hover:border-slate-600 transition-colors">
                  <Settings2 className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-white">
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="0-500000">Under KSH 500K</SelectItem>
                  <SelectItem value="500000-1000000">KSH 500K - 1M</SelectItem>
                  <SelectItem value="1000000-2000000">KSH 1M - 2M</SelectItem>
                  <SelectItem value="2000000-3000000">KSH 2M - 3M</SelectItem>
                  <SelectItem value="3000000-5000000">KSH 3M - 5M</SelectItem>
                  <SelectItem value="5000000-10000000">KSH 5M - 10M</SelectItem>
                  <SelectItem value="10000000+">Above KSH 10M</SelectItem>
                </SelectContent>
              </Select>

              {/* Search Button */}
              <Link to={createPageUrl("Cars")} className="w-full">
                <Button className="w-full h-12 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-xl text-base font-semibold shadow-lg shadow-rose-500/25 transition-all hover:scale-105">
                  <Search className="w-5 h-5 mr-2" />
                  Search Cars
                </Button>
              </Link>
            </div>

            {/* Popular Searches */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <p className="text-sm text-slate-400 mb-3">Popular Searches:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Toyota Land Cruiser",
                  "Mercedes C-Class",
                  "Honda CR-V",
                  "BMW X5",
                  "Mazda CX-5",
                  "Nissan X-Trail",
                  "Subaru Forester",
                ].map((term) => (
                  <button
                    key={term}
                    className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 text-sm rounded-lg transition-colors border border-slate-700/50"
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
