import React from "react";
import { ArrowRight, Car, CreditCard } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../../lib/utils";

export default function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Buy Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 to-orange-500 p-8 md:p-10 h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />

              <div className="relative">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                  <Car className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Looking to Buy?
                </h3>
                <p className="text-white/80 text-lg mb-8 max-w-md">
                  Browse our extensive collection of inspected, quality
                  vehicles. Find your perfect match today.
                </p>

                <Link to={createPageUrl("Cars")}>
                  <Button
                    size="lg"
                    className="bg-white text-rose-600 hover:bg-white/90 rounded-xl group"
                  >
                    Browse Cars
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Finance Card - REPLACED SELL CARD */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-10 h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />

              <div className="relative">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Need Financing?
                </h3>
                <p className="text-white/70 text-lg mb-8 max-w-md">
                  Get flexible payment plans with competitive rates. Drive your
                  dream car today with our easy financing options.
                </p>

                <a href="tel:0700000000">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-xl group"
                  >
                    Contact Us
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>

          {/* COMMENTED OUT - ORIGINAL SELL CARD */}
          {/* <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-10 h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3" />

              <div className="relative">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Want to Sell?
                </h3>
                <p className="text-white/70 text-lg mb-8 max-w-md">
                  Get the best price for your car with our hassle-free selling
                  process. Quick payment, smooth transfers.
                </p>

                <Link to={createPageUrl("SellCar")}>
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white rounded-xl group"
                  >
                    Sell Your Car
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}
