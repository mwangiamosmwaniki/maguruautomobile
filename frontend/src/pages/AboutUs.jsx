import React from "react";
import {
  Car,
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
} from "lucide-react";

export default function AboutUs() {
  const values = [
    {
      icon: Shield,
      title: "Quality Assurance",
      description:
        "Every vehicle is rigorously inspected to guarantee reliability and peace of mind.",
      gradient: "from-blue-400 to-cyan-400",
    },
    {
      icon: Heart,
      title: "Customer First",
      description:
        "Your satisfaction drives every decision we make, from browsing to delivery.",
      gradient: "from-pink-400 to-rose-400",
    },
    {
      icon: TrendingUp,
      title: "Transparency",
      description:
        "Clear pricing, honest assessments, and zero hidden charges — always.",
      gradient: "from-emerald-400 to-teal-400",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We deliver premium service and unmatched attention to detail.",
      gradient: "from-amber-400 to-orange-400",
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

  return (
    <div className="bg-black text-slate-200 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[160px]" />
      </div>

      <section className="relative py-28 text-center max-w-7xl mx-auto px-6">
        <span className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full border border-white/10 bg-white/5 text-orange-500 text-sm">
          <Sparkles size={16} /> Kenya’s Premium Auto Marketplace
        </span>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-100 mb-8">
          About{" "}
          <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
            Maguru Automobile
          </span>
        </h1>

        <p className="text-slate-400 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mb-12">
          We connect drivers with premium, quality-checked vehicles through a
          transparent, seamless and modern car buying experience.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="#story"
            className="px-8 py-4 bg-gradient-to-r from-orange-700 to-orange-500 hover:from-orange-500 hover:to-orange-700 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition-all hover:scale-105"
          >
            Our Story
          </a>
          <a
            href="#values"
            className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition"
          >
            Our Values
          </a>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-8 border-y border-white/5">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <div className="text-4xl font-bold text-slate-100">
              {stat.number}
            </div>
            <p className="text-slate-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

      <section
        id="story"
        className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center"
      >
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
            Built on Trust. Driven by Quality.
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-6">
            Maguru Automobile was founded to simplify and modernize the car
            buying process in Kenya. We eliminate hidden costs, unclear
            histories, and unreliable sourcing.
          </p>
          <p className="text-slate-400 text-lg leading-relaxed">
            Today, we proudly serve thousands of customers with verified
            vehicles, premium service, and total transparency.
          </p>
        </div>

        <div className="relative bg-white/[0.04] border border-white/[0.08] rounded-3xl p-16 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.7)] flex justify-center">
          <Car className="w-40 h-40 text-blue-400" />
        </div>
      </section>

      <section id="values" className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            Our Core Values
          </h2>
          <p className="text-slate-500 text-lg">
            The principles behind every vehicle we deliver
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, i) => (
            <div
              key={i}
              className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)] hover:-translate-y-2 transition"
            >
              <div
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.gradient} opacity-70 flex items-center justify-center mb-6`}
              >
                <value.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100 mb-3">
                {value.title}
              </h3>
              <p className="text-slate-500">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-16 items-center">
        <div className="relative bg-white/[0.04] border border-white/[0.08] rounded-3xl p-16 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.7)] flex justify-center">
          <Users className="w-40 h-40 text-orange-400" />
        </div>

        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
            Everything You Need, In One Place
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            We handle every step so you enjoy a smooth, worry-free purchase.
          </p>
          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-slate-400">
                <CheckCircle className="text-emerald-400 w-5 h-5" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
            Visit Our Showroom
          </h2>
          <p className="text-slate-500 text-lg">
            Experience our collection in person
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
            <div
              key={i}
              className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(0,0,0,0.6)] text-center"
            >
              <item.icon className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                {item.title}
              </h3>
              <p className="text-slate-500">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-28 text-center">
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-3xl p-14 backdrop-blur-xl shadow-[0_0_60px_rgba(0,0,0,0.7)]">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-6">
            Ready to Drive Your Dream Car?
          </h2>
          <p className="text-slate-400 text-lg mb-10">
            Explore our verified vehicles or get personalized assistance today.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="/cars"
              className="px-10 py-4 bg-gradient-to-r from-orange-700 to-orange-500 hover:from-orange-500 hover:to-orange-700 rounded-xl font-semibold shadow-lg shadow-blue-500/30 transition hover:scale-105 flex items-center gap-2"
            >
              Browse Cars <ArrowRight size={18} />
            </a>
            <a
              href="tel:+254713328988"
              className="px-10 py-4 bg-white/5 border border-white/10 rounded-xl font-semibold hover:bg-white/10 transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
