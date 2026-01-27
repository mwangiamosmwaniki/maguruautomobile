import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Heart,
  Share2,
  Phone,
  MessageCircle,
  Fuel,
  Settings2,
  Gauge,
  Calendar,
  Car,
  Palette,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "../assets/components/ui/button";
import { Badge } from "../assets/components/ui/badge";
import { Input } from "../assets/components/ui/input";
import { Textarea } from "../assets/components/ui/textarea";
import { Separator } from "../assets/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../assets/components/ui/dialog";
import { Link } from "react-router-dom";
import { createPageUrl } from "../lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function CarDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get("id");

  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [inquiry, setInquiry] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch car data (mock for now)
  useEffect(() => {
    if (!carId) {
      setIsLoading(false);
      return;
    }

    // Replace this with real API call later
    const fetchCar = async () => {
      try {
        // Mock car data
        const mockCar = {
          id: carId,
          title: "Toyota Corolla 2020",
          price: 1200000,
          year: 2020,
          mileage: 45000,
          transmission: "Automatic",
          fuel_type: "Petrol",
          body_type: "Sedan",
          color: "White",
          engine_cc: 1600,
          features: ["Air Conditioning", "Leather Seats", "Bluetooth"],
          financing_available: true,
          condition: "Used",
          status: "Available",
          image_url:
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1000&q=80",
          description:
            "A reliable and fuel-efficient car, perfect for city driving.",
          make: "Toyota",
          model: "Corolla",
        };
        setCar(mockCar);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    // Mock sending inquiry
    toast.success("Inquiry sent successfully! We will contact you soon.");
    setDialogOpen(false);
    setInquiry({ name: "", email: "", phone: "", message: "" });
  };

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

  if (!carId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="text-center">
          <Car className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            No Car Selected
          </h2>
          <p className="text-slate-500 mb-6">
            Please select a car to view details
          </p>
          <Link to={createPageUrl("Cars")}>
            <Button className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-xl">
              Browse All Cars
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 animate-spin text-rose-500 mb-4" />
        <p className="text-slate-600">Loading car details...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Car Not Found
          </h2>
          <p className="text-slate-500 mb-6">
            {error?.message ||
              "The car you're looking for doesn't exist or has been removed"}
          </p>
          <Link to={createPageUrl("Cars")}>
            <Button className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-xl">
              Browse All Cars
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Car specifications
  const specs = [
    { icon: Calendar, label: "Year", value: car.year },
    {
      icon: Gauge,
      label: "Mileage",
      value: car.mileage ? formatMileage(car.mileage) : "N/A",
    },
    { icon: Settings2, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel Type", value: car.fuel_type },
    { icon: Car, label: "Body Type", value: car.body_type },
    { icon: Palette, label: "Color", value: car.color },
  ];

  return <div className="min-h-screen bg-slate-50"></div>;
}
