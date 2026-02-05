import React from "react";
import { Heart, Fuel, Settings2, Gauge, Calendar } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../../lib/utils";
export default function CarCard({ car, index = 0 }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatMileage = (mileage) => {
    return new Intl.NumberFormat("en-KE").format(mileage) + " km";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link to={`/cars/${car.id}`}>
        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-rose-200 hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
            <img
              src={
                car.image_url ||
                "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80"
              }
              alt={car.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              {car.status && (
                <Badge
                  className={`border-0 text-xs font-semibold ${
                    car.status === "Available"
                      ? "bg-green-500 text-white"
                      : car.status === "Sold"
                        ? "bg-red-500 text-white"
                        : car.status === "Reserved"
                          ? "bg-yellow-500 text-white"
                          : "bg-gray-500 text-white"
                  }`}
                >
                  {car.status}
                </Badge>
              )}
              {car.financing_available && (
                <Badge className="bg-emerald-500 text-white border-0 text-xs">
                  Financing Available
                </Badge>
              )}
              {car.condition && (
                <Badge
                  variant="secondary"
                  className="bg-white/90 backdrop-blur-sm text-slate-700 border-0 text-xs"
                >
                  {car.condition}
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-sm">
              <Heart className="w-4 h-4 text-slate-400 hover:text-rose-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-semibold text-lg text-slate-900 mb-2 truncate group-hover:text-rose-600 transition-colors">
              {car.title}
            </h3>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Gauge className="w-4 h-4" />
                <span>{car.mileage ? formatMileage(car.mileage) : "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Settings2 className="w-4 h-4" />
                <span>{car.transmission || "Auto"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Fuel className="w-4 h-4" />
                <span>{car.fuel_type || "Petrol"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{car.year || "N/A"}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {formatPrice(car.price)}
                </p>
              </div>
              <Button
                size="sm"
                className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-lg"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
