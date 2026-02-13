import React, { useState, useEffect } from "react";
import {
  Search,
  Loader2,
  Grid3X3,
  LayoutList,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { Input } from "../assets/components/ui/input";
import { Button } from "../assets/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "../assets/components/ui/tabs";
import CarCard from "../assets/components/cars/CarCard";
import CarFilters from "../assets/components/cars/CarFilters";
import { motion } from "framer-motion";
import { fetchCars as fetchCarsFromFirebase } from "../lib/firebaseService";

export default function Cars() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("all");
  const [cars, setCars] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const allowedConditions = ["Foreign Used", "Locally Used"];

  // Fetch cars data from Firebase
  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCarsFromFirebase();
        setCars(Array.isArray(data) ? data : []);

        // Extract unique conditions from database and filter to allowed ones
        const uniqueConditions = [
          ...new Set(data.map((car) => car.condition).filter(Boolean)),
        ];
        const filteredConditions = uniqueConditions
          .filter((cond) => allowedConditions.includes(cond))
          .sort();
        setConditions(filteredConditions);
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
    setCurrentPage(1);
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
      if (car.condition !== activeTab) return false;
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

  // Pagination logic
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCars = filteredCars.slice(startIndex, endIndex);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-black" />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-rose-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2 animate-pulse opacity-60" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-orange-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/2 animate-pulse opacity-50" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse opacity-40" />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-30" />

      {/* Header Section */}
      <div className="relative py-12 border-b md:py-16 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm border-white/5">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-3 text-xs font-medium rounded-full bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-500/20 backdrop-blur-sm">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                  Premium Collection
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
                  Browse All Cars
                </span>
              </h1>

              <p className="max-w-2xl mx-auto text-base text-gray-400 md:text-lg">
                Find your perfect vehicle from our collection of quality
                inspected cars
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-shrink-0 lg:w-80"
          >
            <div className="sticky top-8">
              <CarFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 min-w-0"
          >
            <div className="p-4 mb-6 space-y-4 border rounded-2xl bg-black/50 backdrop-blur-xl border-gray-800/50">
              <div className="relative group">
                <div className="absolute inset-0 transition-all duration-300 opacity-0 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-xl blur-xl group-hover:blur-2xl group-hover:opacity-100" />
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute w-4 h-4 text-gray-500 transition-colors duration-300 -translate-y-1/2 left-4 top-1/2 group-hover:text-rose-400" />
                    <Input
                      placeholder="Search by make, model, or keyword..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-4 text-sm text-white transition-all duration-300 h-11 pl-11 bg-black/80 backdrop-blur-xl border-gray-700/50 rounded-xl placeholder:text-gray-500 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20"
                    />
                  </div>
                  <Button className="px-6 text-sm font-semibold transition-all duration-300 shadow-lg h-11 bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-xl shadow-rose-500/25 hover:shadow-rose-500/40">
                    <Search className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="inline-flex w-full p-1 border rounded-lg bg-black/50 backdrop-blur-xl border-gray-700/50 sm:w-auto">
                    <TabsTrigger
                      value="all"
                      className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium transition-all duration-300 rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-rose-500/25 text-gray-400 hover:text-white"
                    >
                      All
                    </TabsTrigger>
                    {conditions.map((condition) => (
                      <TabsTrigger
                        key={condition}
                        value={condition}
                        className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium transition-all duration-300 rounded-md data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-orange-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:shadow-rose-500/25 text-gray-400 hover:text-white"
                      >
                        {condition}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>

                {/* Right: Results & View Mode */}
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  {/* Results Count */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                      {filteredCars.length}
                    </span>
                    <span className="text-xs text-gray-400">
                      {filteredCars.length === 1 ? "car" : "cars"}
                    </span>

                    {/* Active Filters */}
                    {Object.keys(filters).filter((key) => filters[key]).length >
                      0 && (
                      <>
                        <span className="text-gray-600">•</span>
                        <span className="text-xs text-rose-400">
                          {
                            Object.keys(filters).filter((key) => filters[key])
                              .length
                          }{" "}
                          filter
                          {Object.keys(filters).filter((key) => filters[key])
                            .length !== 1
                            ? "s"
                            : ""}
                        </span>
                      </>
                    )}
                  </div>

                  {/* View Mode Toggle */}
                  <div className="items-center hidden gap-1 p-1 border rounded-lg bg-black/50 backdrop-blur-xl border-gray-700/50 sm:flex">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-all duration-300 ${
                        viewMode === "grid"
                          ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/25"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                      }`}
                      title="Grid View"
                    >
                      <Grid3X3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-all duration-300 ${
                        viewMode === "list"
                          ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/25"
                          : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                      }`}
                      title="List View"
                    >
                      <LayoutList className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Clear Filters */}
                  {(Object.keys(filters).filter((key) => filters[key]).length >
                    0 ||
                    searchQuery) && (
                    <Button
                      onClick={clearFilters}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-xs text-gray-400 transition-colors duration-200 hover:text-rose-400 hover:bg-rose-500/10"
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Cars Display */}
            {isLoading ? (
              <div className="flex items-center justify-center py-32">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full opacity-50 bg-gradient-to-r from-rose-500 to-orange-500 blur-xl animate-pulse" />
                  <Loader2 className="relative w-12 h-12 animate-spin text-rose-500" />
                </div>
              </div>
            ) : filteredCars.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="py-24 text-center border rounded-2xl bg-black/50 backdrop-blur-xl border-gray-800/50"
              >
                <div className="relative inline-flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-2xl bg-black/50">
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-2xl blur-xl" />
                  <Search className="relative w-10 h-10 text-gray-600" />
                </div>

                <h3 className="mb-3 text-xl font-semibold text-white">
                  No cars found
                </h3>
                <p className="mb-8 text-gray-400">
                  Try adjusting your filters or search query to find what you're
                  looking for
                </p>

                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="px-8 py-6 text-base font-medium text-gray-300 transition-all duration-300 border-gray-700 rounded-xl bg-black/50 hover:bg-gray-700/50 hover:text-white hover:border-gray-600"
                >
                  Clear All Filters
                </Button>
              </motion.div>
            ) : (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === "grid"
                      ? "sm:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  }`}
                >
                  {paginatedCars.map((car, index) => (
                    <motion.div
                      key={`${car.id}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.05,
                        ease: "easeOut",
                      }}
                    >
                      <CarCard car={car} index={index} />
                    </motion.div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    <Button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      variant="outline"
                      className="px-4 py-2 text-sm text-gray-300 border-gray-700 rounded-lg bg-black/50 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            className={`w-10 h-10 text-xs font-medium rounded-lg transition-all duration-200 ${
                              currentPage === page
                                ? "bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-md shadow-rose-500/25"
                                : "text-gray-300 border-gray-700 bg-black/50 hover:bg-gray-700/50"
                            }`}
                          >
                            {page}
                          </Button>
                        ),
                      )}
                    </div>

                    <Button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      variant="outline"
                      className="px-4 py-2 text-sm text-gray-300 border-gray-700 rounded-lg bg-black/50 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
