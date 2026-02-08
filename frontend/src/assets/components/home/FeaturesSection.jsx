import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Wallet, ArrowLeftRight, Clock } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Vehicles",
    description:
      "Every car undergoes a comprehensive 200-point inspection for your peace of mind.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Wallet,
    title: "Flexible Payments",
    description:
      "Multiple payment options and transparent pricing with no hidden fees.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: ArrowLeftRight,
    title: "Smooth Transfers",
    description:
      "We handle all paperwork and registration so you can focus on enjoying your new car.",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description:
      "Our dedicated team is always here to help with any questions or concerns.",
    color: "from-rose-500 to-orange-500",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-sm font-medium mb-4">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-200 mb-4">
            The Smarter Way to Buy Cars
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            We've reimagined the car buying experience to be simple,
            transparent, and delightful.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-slate-50 rounded-2xl p-8 h-full hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 border border-transparent hover:border-slate-100 flex flex-col items-center text-center">
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
