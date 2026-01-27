import React, { useState, useEffect } from "react";
import {
  Search,
  Car,
  Calendar,
  Fuel,
  Settings2,
  ChevronLeft,
  ChevronRight,
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

const heroCars = [
  {
    image:
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800&q=80",
    title: "Toyota Land Cruiser",
    price: "KSH 9.5M",
  },
  {
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
    title: "Mercedes-Benz C200",
    price: "KSH 4.8M",
  },
  {
    image:
      "https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&q=80",
    title: "Mazda CX-5",
    price: "KSH 3.2M",
  },
  {
    image:
      "https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=800&q=80",
    title: "BMW X3",
    price: "KSH 4.5M",
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
      setCurrentSlide((prev) => (prev + 1) % heroCars.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroCars.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroCars.length) % heroCars.length);
  };

  const handleSearch = () => {
    onSearch({
      query: searchQuery,
      make,
      year,
      priceRange,
    });
  };

  return (
    <div className="relative overflow-hidden">
      {/* Dark Gradient Background */}
      <div className="absolute inset-0 bg-black" />

      {/* Decorative shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-500/20 to-orange-500/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-orange-500/10 to-rose-500/10 rounded-full blur-2xl transform -translate-x-1/3 translate-y-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 bg-slate-800/80 backdrop-blur-sm rounded-full text-sm font-medium text-rose-400 mb-6 shadow-sm border border-slate-700">
              🚗 Kenya's Trusted Car Marketplace
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Find Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-500">
                Dream Car
              </span>{" "}
              Today
            </h1>
            <p className="text-lg text-slate-400 mb-8 max-w-lg">
              Browse thousands of quality inspected vehicles. Buy with
              confidence.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Link to={createPageUrl("Cars")}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-lg shadow-rose-500/25 rounded-xl px-8"
                >
                  Browse Cars
                </Button>
              </Link>
              {/* <Link to={createPageUrl("SellCar")}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-slate-700 hover:border-slate-600 bg-slate-800/50 text-white rounded-xl px-8"
                >
                  Sell Your Car
                </Button>
              </Link> */}
            </div>

            <div className="flex items-center gap-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>200+ Point Inspection</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Secure Payments</span>
              </div>
            </div>
          </motion.div>

          {/* Right - Car Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative h-[500px]">
              {/* Car Slider */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <div className="relative h-full">
                    <img
                      src={heroCars[currentSlide].image}
                      alt={heroCars[currentSlide].title}
                      className="w-full h-full object-cover rounded-3xl shadow-2xl"
                    />
                    {/* Car Info Overlay */}
                    {/* <div className="absolute bottom-6 left-6 right-6 bg-slate-900/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-slate-700">
                      <h3 className="text-lg font-bold text-white mb-1">
                        {heroCars[currentSlide].title}
                      </h3>
                    </div> */}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-slate-700 hover:scale-110 transition-all z-10 border border-slate-700"
              >
                <ChevronLeft className="w-6 h-6 text-slate-200" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-slate-800/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-slate-700 hover:scale-110 transition-all z-10 border border-slate-700"
              >
                <ChevronRight className="w-6 h-6 text-slate-200" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                {heroCars.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentSlide
                        ? "w-8 bg-rose-500"
                        : "w-2 bg-slate-600 hover:bg-slate-500"
                    }`}
                  />
                ))}
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-14 -left-8 bg-slate-800 rounded-2xl shadow-xl p-3 flex items-center gap-3 z-10 border border-slate-700">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">500+</p>
                  <p className="text-sm text-slate-400">Cars Available</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 lg:mt-16"
        >
          <div className="bg-gray-900 rounded-2xl shadow-xl p-4 md:p-6 border border-slate-700">
            <div className="flex items-center gap-4 mb-4">
              <Search className="w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search for your dream car..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 text-lg focus-visible:ring-0 placeholder:text-slate-500 bg-transparent text-white"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Select value={make} onValueChange={setMake}>
                <SelectTrigger className="rounded-xl border-slate-700 text-white">
                  <Car className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Make" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white">
                  <SelectItem value="all">All Makes</SelectItem>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="mercedes">Mercedes</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="honda">Honda</SelectItem>
                  <SelectItem value="nissan">Nissan</SelectItem>
                  <SelectItem value="mazda">Mazda</SelectItem>
                  <SelectItem value="suzuki">Suzuki</SelectItem>
                  <SelectItem value="volkswagen">Volkswagen</SelectItem>
                </SelectContent>
              </Select>

              {/* <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="rounded-xl border-slate-700 bg-slate-900 text-white">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white">
                  <SelectItem value="all">All Years</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                  <SelectItem value="2020">2020</SelectItem>
                  <SelectItem value="2019">2019</SelectItem>
                  <SelectItem value="2018">2018</SelectItem>
                  <SelectItem value="older">2017 & older</SelectItem>
                </SelectContent>
              </Select> */}

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="rounded-xl border-slate-700 bg-slate-900 text-white">
                  <Settings2 className="w-4 h-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white">
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="0-500000">Under KSH 500K</SelectItem>
                  <SelectItem value="500000-1000000">KSH 500K - 1M</SelectItem>
                  <SelectItem value="1000000-2000000">KSH 1M - 2M</SelectItem>
                  <SelectItem value="2000000-5000000">KSH 2M - 5M</SelectItem>
                  <SelectItem value="5000000+">Above KSH 5M</SelectItem>
                </SelectContent>
              </Select>

              <Link to={createPageUrl("Cars")}>
                <Button className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-xl h-10">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
