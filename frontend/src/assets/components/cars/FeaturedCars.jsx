import React from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../../lib/utils";
import CarCard from "./CarCard";

// Example static cars data
const mockCars = [
  {
    id: 1,
    title: "Toyota Corolla 2020",
    price: 1500000,
    image_url:
      "https://images.unsplash.com/photo-1610447508136-03d1c376c2a5?auto=format&fit=crop&w=800&q=80",
    status: "Available",
  },
  {
    id: 2,
    title: "Mercedes C200 2019",
    price: 3500000,
    image_url:
      "https://images.unsplash.com/photo-1608889177324-97d5f7f46e5c?auto=format&fit=crop&w=800&q=80",
    status: "Available",
  },
  {
    id: 3,
    title: "BMW 320i 2021",
    price: 4000000,
    image_url:
      "https://images.unsplash.com/photo-1611078480721-cd2de9c4b2d3?auto=format&fit=crop&w=800&q=80",
    status: "Available",
  },
  {
    id: 4,
    title: "Honda Civic 2018",
    price: 1300000,
    image_url:
      "https://images.unsplash.com/photo-1602524818982-82e43f244ca1?auto=format&fit=crop&w=800&q=80",
    status: "Available",
  },
];

export default function FeaturedCars({ cars = mockCars, isLoading = false }) {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-sm font-medium mb-4">
              Featured Listings
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Explore Our Top Picks
            </h2>
            <p className="text-lg text-slate-600 max-w-xl">
              Handpicked vehicles that offer exceptional value and quality.
            </p>
          </div>
          <Link to={createPageUrl("Cars")} className="mt-6 md:mt-0">
            <Button variant="outline" className="rounded-xl group text-black">
              View All Cars
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">
              No cars available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
