import React, { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Badge } from "../ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { fetchCars as fetchCarsFromFirebase } from "../../../lib/firebaseService";

export default function CarFilters({
  filters,
  onFilterChange,
  onClearFilters,
}) {
  const [makes, setMakes] = useState([]);
  const [years, setYears] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [priceRanges, setPriceRanges] = useState([]);

  // Fetch unique filter values from Firebase
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const data = await fetchCarsFromFirebase();
        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No car data available");
          return;
        }

        // Extract and sort unique values for each filter
        const uniqueMakes = [
          ...new Set(data.map((car) => car.make).filter(Boolean)),
        ].sort();
        const uniqueYears = [
          ...new Set(data.map((car) => car.year).filter(Boolean)),
        ].sort((a, b) => b - a);
        const uniqueBodyTypes = [
          ...new Set(data.map((car) => car.body_type).filter(Boolean)),
        ].sort();
        const uniqueTransmissions = [
          ...new Set(data.map((car) => car.transmission).filter(Boolean)),
        ].sort();
        const uniqueFuelTypes = [
          ...new Set(data.map((car) => car.fuel_type).filter(Boolean)),
        ].sort();
        const uniqueConditions = [
          ...new Set(data.map((car) => car.condition).filter(Boolean)),
        ].sort();

        // Calculate price ranges based on min/max prices
        const prices = data
          .map((car) => car.price)
          .filter((p) => p)
          .sort((a, b) => a - b);
        const minPrice = prices[0] || 0;
        const maxPrice = prices[prices.length - 1] || 0;

        // Helper function to format price to M (million)
        const formatPrice = (price) => {
          const million = price / 1000000;
          return million >= 1
            ? `${million.toFixed(1)}M`
            : `${Math.round(price / 1000)}K`;
        };

        const ranges = [
          {
            label: `Under KSH ${formatPrice(minPrice + (maxPrice - minPrice) * 0.25)}`,
            value: `0-${Math.round(minPrice + (maxPrice - minPrice) * 0.25)}`,
          },
          {
            label: `KSH ${formatPrice(minPrice + (maxPrice - minPrice) * 0.25)} - ${formatPrice(minPrice + (maxPrice - minPrice) * 0.5)}`,
            value: `${Math.round(minPrice + (maxPrice - minPrice) * 0.25)}-${Math.round(minPrice + (maxPrice - minPrice) * 0.5)}`,
          },
          {
            label: `KSH ${formatPrice(minPrice + (maxPrice - minPrice) * 0.5)} - ${formatPrice(minPrice + (maxPrice - minPrice) * 0.75)}`,
            value: `${Math.round(minPrice + (maxPrice - minPrice) * 0.5)}-${Math.round(minPrice + (maxPrice - minPrice) * 0.75)}`,
          },
          {
            label: `Above KSH ${formatPrice(minPrice + (maxPrice - minPrice) * 0.75)}`,
            value: `${Math.round(minPrice + (maxPrice - minPrice) * 0.75)}+`,
          },
        ];
        setPriceRanges(ranges);

        setMakes(uniqueMakes);
        setYears(uniqueYears);
        setBodyTypes(uniqueBodyTypes);
        setTransmissions(uniqueTransmissions);
        setFuelTypes(uniqueFuelTypes);
        setConditions(uniqueConditions);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Make */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Make
        </label>
        <Select
          value={filters.make || ""}
          onValueChange={(value) => onFilterChange("make", value)}
        >
          <SelectTrigger className="rounded-xl text-slate-600">
            <SelectValue placeholder="All Makes" />
          </SelectTrigger>
          <SelectContent className="text-white cursor-pointer bg-black/90">
            <SelectItem
              value="all"
              className="transition-colors hover:bg-rose-500/20"
            >
              All Makes
            </SelectItem>
            {makes.map((make) => (
              <SelectItem
                key={make}
                value={make}
                className="transition-colors cursor-pointer hover:bg-rose-500/40"
              >
                {make}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Year */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Year
        </label>
        <Select
          value={filters.year || ""}
          onValueChange={(value) => onFilterChange("year", value)}
        >
          <SelectTrigger className="rounded-xl text-slate-600">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent className="text-white cursor-pointer bg-black/90">
            <SelectItem
              value="all"
              className="transition-colors hover:bg-rose-500/20"
            >
              All Years
            </SelectItem>
            {years.map((year) => (
              <SelectItem
                key={year}
                value={year.toString()}
                className="transition-colors cursor-pointer hover:bg-rose-500/40"
              >
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Body Type */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Body Type
        </label>
        <Select
          value={filters.body_type || ""}
          onValueChange={(value) => onFilterChange("body_type", value)}
        >
          <SelectTrigger className="rounded-xl text-slate-600">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent className="text-white cursor-pointer bg-black/90">
            <SelectItem
              value="all"
              className="transition-colors hover:bg-rose-500/20"
            >
              All Types
            </SelectItem>
            {bodyTypes.map((bodyType) => (
              <SelectItem
                key={bodyType}
                value={bodyType}
                className="transition-colors cursor-pointer hover:bg-rose-500/40"
              >
                {bodyType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Transmission */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Transmission
        </label>
        <Select
          value={filters.transmission || ""}
          onValueChange={(value) => onFilterChange("transmission", value)}
        >
          <SelectTrigger className="rounded-xl text-slate-600">
            <SelectValue placeholder="All Transmissions" />
          </SelectTrigger>
          <SelectContent className="text-white cursor-pointer bg-black/90">
            <SelectItem
              value="all"
              className="transition-colors hover:bg-rose-500/20"
            >
              All Transmissions
            </SelectItem>
            {transmissions.map((transmission) => (
              <SelectItem
                key={transmission}
                value={transmission}
                className="transition-colors cursor-pointer hover:bg-rose-500/40"
              >
                {transmission}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Fuel Type
        </label>
        <Select
          value={filters.fuel_type || ""}
          onValueChange={(value) => onFilterChange("fuel_type", value)}
        >
          <SelectTrigger className="rounded-xl text-slate-600">
            <SelectValue placeholder="All Fuel Types" />
          </SelectTrigger>
          <SelectContent className="text-white cursor-pointer bg-black/90">
            <SelectItem
              value="all"
              className="transition-colors hover:bg-rose-500/20"
            >
              All Fuel Types
            </SelectItem>
            {fuelTypes.map((fuelType) => (
              <SelectItem
                key={fuelType}
                value={fuelType}
                className="transition-colors cursor-pointer hover:bg-rose-500/40"
              >
                {fuelType}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      {/* <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Condition
        </label>
        <Select
          value={filters.condition || ""}
          onValueChange={(value) => onFilterChange("condition", value)}
        >
          <SelectTrigger className="rounded-xl text-slate-600">
            <SelectValue placeholder="All Conditions" />
          </SelectTrigger>
          <SelectContent className="text-white cursor-pointer bg-black/90">
            <SelectItem
              value="all"
              className="transition-colors hover:bg-rose-500/20"
            >
              All Conditions
            </SelectItem>
            {conditions.map((condition) => (
              <SelectItem
                key={condition}
                value={condition}
                className="transition-colors cursor-pointer hover:bg-rose-500/40"
              >
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div> */}

      {/* Price Range */}
      <div>
        <label className="block mb-2 text-sm font-medium text-slate-700">
          Price Range
        </label>
        <Select
          value={filters.priceRange || ""}
          onValueChange={(value) => onFilterChange("priceRange", value)}
        >
          <SelectTrigger className="rounded-xl text-slate-600">
            <SelectValue placeholder="Any Price" />
          </SelectTrigger>
          <SelectContent className="text-white cursor-pointer bg-black/90">
            <SelectItem
              value="all"
              className="transition-colors hover:bg-rose-500/20"
            >
              Any Price
            </SelectItem>
            {priceRanges.map((range) => (
              <SelectItem
                key={range.value}
                value={range.value}
                className="transition-colors cursor-pointer hover:bg-rose-500/40"
              >
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full text-gray-700 rounded-xl hover:bg-gray-100 hover:text-gray-500"
        onClick={onClearFilters}
      >
        <X className="w-4 h-4 mr-2 text-gray-700" />
        Clear All Filters
      </Button>
    </div>
  );

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v && v !== "all",
  ).length;

  return (
    <>
      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="sticky p-6 bg-white border rounded-2xl border-slate-100 top-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-rose-100 text-rose-600">
                {activeFiltersCount} active
              </Badge>
            )}
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="rounded-xl">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 text-white bg-rose-500">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
