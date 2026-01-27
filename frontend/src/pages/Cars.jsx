import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  Grid3X3,
  LayoutList,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "../assets/components/ui/input";
import { Button } from "../assets/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../assets/components/ui/tabs";
import CarCard from "../assets/components/cars/CarCard";
import CarFilters from "../assets/components/cars/CarFilters";
import { motion } from "framer-motion";

export default function Cars() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch cars data
  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        // Replace this with your actual API endpoint
        const response = await fetch("/api/cars?status=Available");
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
        setCars([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? "" : value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
  };

  // Filter cars based on criteria
  const filteredCars = cars.filter((car) => {
    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        car.title?.toLowerCase().includes(query) ||
        car.make?.toLowerCase().includes(query) ||
        car.model?.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Tab filter (condition)
    if (activeTab !== "all") {
      if (activeTab === "fresh" && car.condition !== "Fresh Import")
        return false;
      if (activeTab === "local" && car.condition !== "Locally Used")
        return false;
    }

    // Make
    if (filters.make && car.make !== filters.make) return false;

    // Year
    if (filters.year) {
      if (filters.year === "2017") {
        if (car.year > 2017) return false;
      } else {
        if (car.year !== parseInt(filters.year)) return false;
      }
    }

    // Body Type
    if (filters.body_type && car.body_type !== filters.body_type) return false;

    // Transmission
    if (filters.transmission && car.transmission !== filters.transmission)
      return false;

    // Fuel Type
    if (filters.fuel_type && car.fuel_type !== filters.fuel_type) return false;

    // Condition
    if (filters.condition && car.condition !== filters.condition) return false;

    // Price Range
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (max) {
        if (car.price < min || car.price > max) return false;
      } else {
        if (car.price < min) return false;
      }
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-rose-100 via-orange-50 to-amber-50 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Browse All Cars
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Find your perfect vehicle from our collection of quality inspected
              cars.
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search by make, model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl border-slate-200 bg-white text-base"
                />
              </div>
              <Button className="h-12 px-6 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-xl">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-72 flex-shrink-0">
            <CarFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Cars Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-white border border-slate-200">
                    <TabsTrigger
                      value="all"
                      className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
                    >
                      All Cars
                    </TabsTrigger>
                    <TabsTrigger
                      value="fresh"
                      className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
                    >
                      Fresh Imports
                    </TabsTrigger>
                    <TabsTrigger
                      value="local"
                      className="data-[state=active]:bg-rose-500 data-[state=active]:text-white"
                    >
                      Locally Used
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">
                  {filteredCars.length}{" "}
                  {filteredCars.length === 1 ? "car" : "cars"} found
                </span>
                <div className="hidden sm:flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-rose-100 text-rose-600" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-rose-100 text-rose-600" : "text-slate-400 hover:text-slate-600"}`}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Cars */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
              </div>
            ) : filteredCars.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No cars found
                </h3>
                <p className="text-slate-500 mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="rounded-xl"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div
                className={`grid gap-6 ${viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
              >
                {filteredCars.map((car, index) => (
                  <CarCard key={car.id} car={car} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
