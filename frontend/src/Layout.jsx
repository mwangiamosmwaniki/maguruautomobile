import React, { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";
import { createPageUrl } from "./lib/utils";
import { motion } from "framer-motion";
import Logo from "./assets/images/maguruLogo.png";
import {
  Menu,
  X,
  Car,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";
import { Button } from "./assets/components/ui/button";
import { Toaster } from "sonner";

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "Home" },
    { name: "Buy a Car", href: "Cars" },
    { name: "About Us", href: "AboutUs" },
    // { name: "Sell Your Car", href: "SellCar" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-black text-slate-200">
      <Toaster position="top-center" richColors />

      {/* Top Bar */}
      <div className="hidden py-2 text-white border-b bg-slate-800 md:block border-slate-800">
        <div className="flex items-center justify-between px-4 mx-auto text-sm max-w-7xl sm:px-6 lg:px-8">
          <p className="flex items-center gap-2 text-slate-400">
            <Car className="w-4 h-4 text-rose-400" />
            Quality inspected vehicles with smooth transfers
          </p>
          <div className="flex items-center gap-6">
            <a
              href="tel:+254 713 328988"
              className="flex items-center gap-1.5 hover:text-rose-400 transition-colors text-slate-400"
            >
              <Phone className="w-3.5 h-3.5" />
              +254 713 328988
            </a>
            <a
              href="mailto:isaackimani6@gmail.com"
              className="flex items-center gap-1.5 hover:text-rose-400 transition-colors text-slate-400"
            >
              <Mail className="w-3.5 h-3.5" />
              isaackimani6@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-slate-800">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-2"
            >
              <div className="overflow-hidden rounded-lg w-16 h-10 sm:w-24 sm:h-14">
                <img
                  src={Logo}
                  alt="Maguru Automobile Logo"
                  className="object-contain w-full h-full"
                />
              </div>

              <span className="text-lg sm:text-xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text hidden sm:inline">
                Maguru Automobile
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="items-center hidden gap-8 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.href)}
                  className={`text-sm font-medium transition-colors ${
                    currentPageName === item.href
                      ? "text-rose-400"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button */}
            <div className="items-center hidden gap-4 md:flex">
              <Link to={createPageUrl("Cars")}>
                <Button className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-xl">
                  Browse Cars
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="p-2 md:hidden text-slate-400 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t md:hidden border-slate-800 bg-slate-900">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={createPageUrl(item.href)}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    currentPageName === item.href
                      ? "bg-rose-500/10 text-rose-400"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4">
                <Link to={createPageUrl("Cars")}>
                  <Button className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-xl">
                    Browse Cars
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="text-white bg-black border-t border-slate-800">
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link
                to={createPageUrl("Home")}
                className="flex items-center gap-2 mb-6"
              >
                <div className="flex items-center justify-center overflow-hidden rounded-lg w-16 h-10 sm:w-24 sm:h-14">
                  <img
                    src={Logo}
                    alt="Maguru Logo"
                    className="object-contain w-full h-full"
                  />
                </div>
              </Link>

              <p className="mb-6 text-sm leading-relaxed text-slate-400">
                Kenya's trusted car marketplace. Quality inspected vehicles with
                easy financing and smooth transfers.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="#"
                  className="flex items-center justify-center transition-colors rounded-lg w-9 h-9 bg-slate-900 hover:bg-rose-500"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center transition-colors rounded-lg w-9 h-9 bg-slate-900 hover:bg-rose-500"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center transition-colors rounded-lg w-9 h-9 bg-slate-900 hover:bg-rose-500"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center transition-colors rounded-lg w-9 h-9 bg-slate-900 hover:bg-rose-500"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to={createPageUrl("Home")}
                    className="text-sm transition-colors text-slate-400 hover:text-white"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("Cars")}
                    className="text-sm transition-colors text-slate-400 hover:text-white"
                  >
                    Buy a Car
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("AboutUs")}
                    className="text-sm transition-colors text-slate-400 hover:text-white"
                  >
                    About us
                  </Link>
                </li>
                {/* <li>
                  <Link
                    to={createPageUrl("SellCar")}
                    className="text-sm transition-colors text-slate-400 hover:text-white"
                  >
                    Sell Your Car
                  </Link>
                </li> */}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Services</h4>
              <ul className="space-y-3">
                <li className="text-sm transition-colors text-slate-400 hover:text-white">
                  Car Inspection
                </li>
                <li className="text-sm transition-colors text-slate-400 hover:text-white">
                  Car Insurance
                </li>
                <li className="text-sm transition-colors text-slate-400 hover:text-white">
                  Car Valuation
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="mb-4 font-semibold text-white">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <Phone className="w-4 h-4" />
                  +254 713 328988
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <Mail className="w-4 h-4" />
                  isaackimani6@gmail.com
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-400">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  Nairobi, Kenya
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-8 mt-12 border-t border-slate-800 md:flex-row">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} Maguru Automobile. All rights
              reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="#"
                className="transition-colors text-slate-400 hover:text-white"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="transition-colors text-slate-400 hover:text-white"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
        <motion.a
          href="https://wa.me/254713328988"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed z-50 flex items-center justify-center transition-colors bg-green-500 rounded-full shadow-lg bottom-6 right-6 w-14 h-14 hover:bg-green-600"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [1, 0.8, 1],
            boxShadow: [
              "0 0 10px rgba(0,255,0,0.5)",
              "0 0 20px rgba(0,255,0,0.8)",
              "0 0 10px rgba(0,255,0,0.5)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <FaWhatsapp className="w-6 h-6 text-white" />
        </motion.a>
      </footer>
    </div>
  );
}
