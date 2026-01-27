import React from "react";
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

export default function CarFilters({
  filters,
  onFilterChange,
  onClearFilters,
}) {
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Make */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Make
        </label>
        <Select
          value={filters.make || ""}
          onValueChange={(value) => onFilterChange("make", value)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="All Makes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Makes</SelectItem>
            <SelectItem value="Toyota">Toyota</SelectItem>
            <SelectItem value="Mercedes">Mercedes</SelectItem>
            <SelectItem value="BMW">BMW</SelectItem>
            <SelectItem value="Honda">Honda</SelectItem>
            <SelectItem value="Nissan">Nissan</SelectItem>
            <SelectItem value="Mazda">Mazda</SelectItem>
            <SelectItem value="Suzuki">Suzuki</SelectItem>
            <SelectItem value="Volkswagen">Volkswagen</SelectItem>
            <SelectItem value="Land Rover">Land Rover</SelectItem>
            <SelectItem value="Subaru">Subaru</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Year */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Year
        </label>
        <Select
          value={filters.year || ""}
          onValueChange={(value) => onFilterChange("year", value)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
            <SelectItem value="2019">2019</SelectItem>
            <SelectItem value="2018">2018</SelectItem>
            <SelectItem value="2017">2017 & older</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Body Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Body Type
        </label>
        <Select
          value={filters.body_type || ""}
          onValueChange={(value) => onFilterChange("body_type", value)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Sedan">Sedan</SelectItem>
            <SelectItem value="SUV">SUV</SelectItem>
            <SelectItem value="Hatchback">Hatchback</SelectItem>
            <SelectItem value="Wagon">Wagon</SelectItem>
            <SelectItem value="Pickup">Pickup</SelectItem>
            <SelectItem value="Van">Van</SelectItem>
            <SelectItem value="Coupe">Coupe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Transmission */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Transmission
        </label>
        <Select
          value={filters.transmission || ""}
          onValueChange={(value) => onFilterChange("transmission", value)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="All Transmissions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transmissions</SelectItem>
            <SelectItem value="Automatic">Automatic</SelectItem>
            <SelectItem value="Manual">Manual</SelectItem>
            <SelectItem value="CVT">CVT</SelectItem>
            <SelectItem value="Tiptronic">Tiptronic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Fuel Type
        </label>
        <Select
          value={filters.fuel_type || ""}
          onValueChange={(value) => onFilterChange("fuel_type", value)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="All Fuel Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Fuel Types</SelectItem>
            <SelectItem value="Petrol">Petrol</SelectItem>
            <SelectItem value="Diesel">Diesel</SelectItem>
            <SelectItem value="Hybrid">Hybrid</SelectItem>
            <SelectItem value="Electric">Electric</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Condition
        </label>
        <Select
          value={filters.condition || ""}
          onValueChange={(value) => onFilterChange("condition", value)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="All Conditions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Conditions</SelectItem>
            <SelectItem value="Fresh Import">Fresh Import</SelectItem>
            <SelectItem value="Locally Used">Locally Used</SelectItem>
            <SelectItem value="Brand New">Brand New</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Price Range
        </label>
        <Select
          value={filters.priceRange || ""}
          onValueChange={(value) => onFilterChange("priceRange", value)}
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Any Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Price</SelectItem>
            <SelectItem value="0-500000">Under KSH 500K</SelectItem>
            <SelectItem value="500000-1000000">KSH 500K - 1M</SelectItem>
            <SelectItem value="1000000-2000000">KSH 1M - 2M</SelectItem>
            <SelectItem value="2000000-5000000">KSH 2M - 5M</SelectItem>
            <SelectItem value="5000000+">Above KSH 5M</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full rounded-xl"
        onClick={onClearFilters}
      >
        <X className="w-4 h-4 mr-2" />
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
        <div className="bg-white rounded-2xl p-6 border border-slate-100 sticky top-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg text-slate-900">Filters</h3>
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
                <Badge className="ml-2 bg-rose-500 text-white">
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
