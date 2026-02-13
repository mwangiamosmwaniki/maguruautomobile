import React from "react";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Sarah Wanjiku",
    role: "First-time Car Buyer",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop",
    content:
      "As a first-time car buyer, I was nervous about the process. The team made everything so easy and transparent. Found my perfect Toyota within a week!",
    rating: 5,
  },
  {
    name: "James Ochieng",
    role: "Business Owner",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    content:
      "Purchased my fleet vehicle through this platform. The professionalism and speed of the transactions exceeded my expectations. Highly recommend!",
    rating: 5,
  },
  {
    name: "Mary Njeri",
    role: "Regular Customer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    content:
      "This is my third car purchase here. The inspection reports are thorough, and the financing options made it possible to upgrade to my dream SUV.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-slate-200 to-slate-400">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 rounded-full w-96 h-96 bg-rose-500/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 rounded-full w-96 h-96 bg-orange-500/10 blur-3xl" />

      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <span className="inline-block px-4 py-1.5 bg-white/60 text-rose-600 rounded-full text-sm font-medium mb-4">
            Customer Stories
          </span>
          <h2 className="mb-4 text-3xl font-bold text-black md:text-4xl">
            Loved by Thousands of Customers
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-700">
            Don't just take our word for it. Here's what our community has to
            say.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-full p-8 transition-colors duration-300 border bg-white/5 backdrop-blur-sm rounded-2xl border-black/10 hover:bg-black/10">
                <Quote className="w-10 h-10 mb-6 text-rose-700/50" />

                <p className="mb-6 leading-relaxed text-slate-800">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-amber-400 text-amber-900"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="object-cover w-12 h-12 rounded-full ring-2 ring-white/20"
                  />
                  <div>
                    <h4 className="font-semibold text-black">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-slate-700">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
