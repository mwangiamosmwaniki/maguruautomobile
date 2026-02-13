import React, { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../../lib/utils";
import { fetchCars as fetchCarsFromFirebase } from "../../../lib/firebaseService";
import CarCard from "./CarCard";

export default function FeaturedCars() {
  const [cars, setCars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        const data = await fetchCarsFromFirebase();
        // Display only the first 4 cars as featured
        setCars(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (error) {
        console.error("Error fetching featured cars:", error);
        setCars([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedCars();
  }, []);
  return (
    <section className="py-20 bg-slate-50">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col mb-12 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-rose-100 text-rose-600 rounded-full text-sm font-medium mb-4">
              Featured Listings
            </span>
            <h2 className="mb-4 text-3xl font-bold md:text-4xl text-slate-900">
              Explore Our Top Picks
            </h2>
            <p className="max-w-xl text-lg text-slate-600">
              Handpicked vehicles that offer exceptional value and quality.
            </p>
          </div>
          <Link to={createPageUrl("Cars")} className="mt-6 md:mt-0">
            <Button variant="outline" className="text-black rounded-xl group">
              View All Cars
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          </div>
        ) : cars.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-slate-500">
              No cars available yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cars.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
