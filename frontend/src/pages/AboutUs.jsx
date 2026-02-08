import { useEffect, React, useState } from "react";
import {
  Shield,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  MapPin,
  Clock,
  Heart,
  Sparkles,
  ArrowRight,
  Car,
} from "lucide-react";
import { motion } from "framer-motion";
import CarYard1 from "../assets/images/CarYard1.png";
import CarYard2 from "../assets/images/CarYard3.png";

// Lazy Loading Image Component
const LazyImage = ({ src, alt, className, containerClassName }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById(`lazy-${alt}`);
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, [alt]);

  return (
    <div id={`lazy-${alt}`} className={containerClassName}>
      {isInView && (
        <>
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse rounded-3xl" />
          )}
          <img
            src={src}
            alt={alt}
            className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}
            onLoad={() => setIsLoaded(true)}
            loading="lazy"
          />
        </>
      )}
    </div>
  );
};

export default function AboutUs() {
  const values = [
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "Every vehicle is rigorously inspected to guarantee reliability and peace of mind.",
      gradient: "from-rose-500 to-orange-500",
    },
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Your satisfaction drives every decision we make, from browsing to delivery.",
      gradient: "from-orange-500 to-rose-500",
    },
    {
      icon: TrendingUp,
      title: "Transparency",
      description:
        "Clear pricing, honest assessments, and zero hidden charges — always.",
      gradient: "from-rose-400 to-orange-400",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We deliver premium service and unmatched attention to detail.",
      gradient: "from-orange-400 to-rose-400",
    },
  ];

  const stats = [
    { number: "500+", label: "Cars Sold", icon: Car },
    { number: "1,000+", label: "Happy Clients", icon: Users },
    { number: "5+ Years", label: "Experience", icon: Award },
    { number: "100%", label: "Verified Cars", icon: Shield },
  ];

  const features = [
    "Detailed inspection reports",
    "Flexible financing solutions",
    "Fast ownership transfer",
    "After-sales support",
    "Trade-in options",
    "Extended warranties",
  ];

  //SEO Optimization
  useEffect(() => {
    // Page title
    document.title =
      "Maguru Automobile | Trusted Car Dealers in Nairobi, Kenya";

    // Meta description
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        "content",
        "Learn about Maguru Automobile — a trusted car dealership in Nairobi offering verified, quality-checked vehicles with transparent pricing and premium customer service.",
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content =
        "Learn about Maguru Automobile — a trusted car dealership in Nairobi offering verified, quality-checked vehicles with transparent pricing and premium customer service.";
      document.head.appendChild(meta);
    }

    // Keywords (optional)
    const keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
      keywords.setAttribute(
        "content",
        "Maguru Automobile, car dealership Nairobi, buy cars Kenya, verified cars Nairobi",
      );
    } else {
      const meta = document.createElement("meta");
      meta.name = "keywords";
      meta.content =
        "Maguru Automobile, car dealership Nairobi, buy cars Kenya, verified cars Nairobi";
      document.head.appendChild(meta);
    }

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://maguruautomobile.co.ke/about";
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black" />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-rose-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2 animate-pulse opacity-60" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-orange-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/2 animate-pulse opacity-50" />
      <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-radial from-amber-500/10 to-transparent rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse opacity-40" />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWx0ZXI9InVybCgjYSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-30" />

      {/* Hero Section */}
      <section className="relative px-6 py-20 mx-auto text-center max-w-7xl md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium border rounded-full bg-gradient-to-r from-rose-500/10 to-orange-500/10 border-rose-500/20 backdrop-blur-sm">
            <Sparkles size={16} className="text-rose-400" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
              Premium Auto Marketplace
            </span>
          </span>

          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white md:text-6xl lg:text-7xl">
            About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
              Maguru Automobile
            </span>
          </h1>

          <p className="max-w-3xl mx-auto mb-10 text-base leading-relaxed text-gray-400 md:text-lg">
            We connect drivers with premium, quality-checked vehicles through a
            transparent, seamless and modern car buying experience.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#story"
              className="px-8 py-4 text-base font-semibold transition-all duration-300 shadow-lg bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-2xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105"
            >
              Our Story
            </a>
            <a
              href="#values"
              className="px-8 py-4 text-base font-semibold text-gray-300 transition-all duration-300 border border-gray-700 bg-black/50 rounded-2xl hover:bg-gray-800/50 hover:text-white hover:border-gray-600"
            >
              Our Values
            </a>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative grid grid-cols-2 gap-6 px-6 py-16 mx-auto max-w-7xl md:grid-cols-4 border-y border-gray-800/50 bg-black/30 backdrop-blur-sm">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="text-center"
          >
            <div className="relative inline-flex items-center justify-center w-12 h-12 mx-auto mb-3 border rounded-xl bg-black/50 border-gray-800/50">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-xl blur-lg" />
              <stat.icon className="relative w-6 h-6 text-rose-400" />
            </div>
            <div className="mb-1 text-3xl font-bold text-transparent md:text-4xl bg-clip-text bg-gradient-to-r from-white to-gray-300">
              {stat.number}
            </div>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </motion.div>
        ))}
      </section>

      {/* Story Section */}
      <section
        id="story"
        className="relative grid items-center gap-12 px-6 py-20 mx-auto max-w-7xl md:py-28 md:grid-cols-2"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Built on Trust. Driven by Quality.
          </h2>
          <p className="mb-6 text-base leading-relaxed text-gray-400 md:text-lg">
            Maguru Automobile was founded to simplify and modernize the car
            buying process in Kenya. We eliminate hidden costs, unclear
            histories, and unreliable sourcing.
          </p>
          <p className="text-base leading-relaxed text-gray-400 md:text-lg">
            Today, we proudly serve thousands of customers with verified
            vehicles, premium service, and total transparency.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden border rounded-3xl bg-black/50 border-gray-800/50 backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-orange-500/10 rounded-3xl blur-2xl" />
          <LazyImage
            src={CarYard1}
            alt="Maguru Automobile Car Yard"
            className="relative object-cover w-full h-full rounded-3xl"
            containerClassName="relative w-full h-80 md:h-96"
          />
        </motion.div>
      </section>

      {/* Values Section */}
      <section
        id="values"
        className="relative px-6 py-20 mx-auto max-w-7xl md:py-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Our Core Values
          </h2>
          <p className="text-base text-gray-500 md:text-lg">
            The principles behind every vehicle we deliver
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 transition-all duration-300 border rounded-3xl bg-black/50 border-gray-800/50 backdrop-blur-xl hover:-translate-y-2 hover:border-gray-700/50 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <value.icon className="text-white w-7 h-7" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-white">
                {value.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-400 md:text-base">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative grid items-center gap-12 px-6 py-20 mx-auto max-w-7xl md:py-28 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative order-2 overflow-hidden border rounded-3xl bg-black/50 border-gray-800/50 backdrop-blur-xl md:order-1"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-rose-500/10 rounded-3xl blur-2xl" />
          <LazyImage
            src={CarYard2}
            alt="Maguru Automobile Services"
            className="relative object-cover w-full h-full rounded-3xl"
            containerClassName="relative w-full h-80 md:h-96"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="order-1 md:order-2"
        >
          <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Everything You Need, In One Place
          </h2>
          <p className="mb-8 text-base text-gray-400 md:text-lg">
            We handle every step so you enjoy a smooth, worry-free purchase.
          </p>
          <ul className="space-y-4">
            {features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-gray-300"
              >
                <CheckCircle className="w-5 h-5 text-rose-400" />
                <span className="text-sm md:text-base">{feature}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      {/* Showroom Section */}
      <section className="relative px-6 py-20 mx-auto max-w-7xl md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Visit Our Showroom
          </h2>
          <p className="text-base text-gray-500 md:text-lg">
            Experience our collection in person
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: MapPin, title: "Location", text: "Nairobi, Kenya" },
            {
              icon: Clock,
              title: "Hours",
              text: "Mon–Fri: 8AM–6PM, Sat: 9AM–5PM",
            },
            {
              icon: Car,
              title: "Test Drives",
              text: "Available by appointment",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 text-center transition-all duration-300 border rounded-3xl bg-black/50 border-gray-800/50 backdrop-blur-xl hover:-translate-y-2 hover:border-gray-700/50"
            >
              <div className="relative inline-flex items-center justify-center w-12 h-12 mx-auto mb-4 border rounded-xl bg-black/50 border-gray-800/50">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-xl blur-lg" />
                <item.icon className="relative w-6 h-6 text-rose-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white md:text-xl">
                {item.title}
              </h3>
              <p className="text-sm text-gray-400 md:text-base">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative max-w-4xl px-6 py-20 mx-auto text-center md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-12 border rounded-3xl bg-black/50 border-gray-800/50 backdrop-blur-xl md:p-14"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-orange-500/5 rounded-3xl" />
          <h2 className="relative mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
            Ready to Drive Your Dream Car?
          </h2>
          <p className="relative max-w-2xl mx-auto mb-10 text-base text-gray-400 md:text-lg">
            Explore our verified vehicles or get personalized assistance today.
          </p>
          <div className="relative flex flex-wrap justify-center gap-4">
            <a
              href="/cars"
              className="inline-flex items-center gap-2 px-10 py-4 text-base font-semibold transition-all duration-300 shadow-lg bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-2xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105"
            >
              Browse Cars <ArrowRight size={18} />
            </a>
            <a
              href="tel:+254713328988"
              className="px-10 py-4 text-base font-semibold text-gray-300 transition-all duration-300 border border-gray-700 bg-black/50 rounded-2xl hover:bg-gray-800/50 hover:text-white hover:border-gray-600"
            >
              Contact Us
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
