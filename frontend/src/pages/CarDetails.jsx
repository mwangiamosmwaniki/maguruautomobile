import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  Loader2,
  MapPin,
  Shield,
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
import { fetchCarById, createInquiry } from "../lib/firebaseService";

export default function CarDetails() {
  const { id: carId } = useParams();

  const [car, setCar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const [inquiry, setInquiry] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch car data
  useEffect(() => {
    if (!carId) {
      setIsLoading(false);
      return;
    }

    const fetchCar = async () => {
      try {
        const data = await fetchCarById(carId);
        if (!data) {
          throw new Error("Car not found");
        }
        setCar(data);
        setError(null);
      } catch (err) {
        setError(err);
        setCar(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCar();
  }, [carId]);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!inquiry.name || !inquiry.email || !inquiry.phone || !inquiry.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      // Save inquiry to Firestore - Cloud Function will send email automatically
      await createInquiry({
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone,
        message: inquiry.message,
        carId: carId || null,
        carTitle: car?.title || "Unknown Car",
        adminEmail: "mwangiamos703@gmail.com",
      });

      toast.success("Inquiry sent successfully! We will contact you soon.");
      setDialogOpen(false);
      setInquiry({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Failed to send inquiry. Please try again.");
    }
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
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-radial from-rose-500/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative text-center"
        >
          <div className="relative inline-flex items-center justify-center w-24 h-24 mx-auto mb-6 border rounded-3xl bg-black/50 border-gray-800/50">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-3xl blur-xl" />
            <Car className="relative w-12 h-12 text-gray-400" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-white">
            No Car Selected
          </h2>
          <p className="mb-8 text-gray-400">
            Please select a car to view details
          </p>
          <Link to={createPageUrl("Cars")}>
            <Button className="px-8 py-6 text-base font-semibold transition-all duration-300 shadow-lg bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-2xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105">
              Browse All Cars
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-radial from-rose-500/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />

        <div className="relative">
          <div className="absolute inset-0 rounded-full opacity-50 bg-gradient-to-r from-rose-500 to-orange-500 blur-xl animate-pulse" />
          <Loader2 className="relative w-12 h-12 mb-4 animate-spin text-rose-500" />
        </div>
        <p className="text-gray-400">Loading car details...</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-radial from-rose-500/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative text-center"
        >
          <div className="relative inline-flex items-center justify-center w-24 h-24 mx-auto mb-6 border rounded-3xl bg-black/50 border-gray-800/50">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-orange-500/20 rounded-3xl blur-xl" />
            <Car className="relative w-12 h-12 text-rose-500" />
          </div>
          <h2 className="mb-3 text-2xl font-bold text-white">Car Not Found</h2>
          <p className="max-w-md mb-8 text-gray-400">
            {error?.message ||
              "The car you're looking for doesn't exist or has been removed"}
          </p>
          <Link to={createPageUrl("Cars")}>
            <Button className="px-8 py-6 text-base font-semibold transition-all duration-300 shadow-lg bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-2xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105">
              Browse All Cars
            </Button>
          </Link>
        </motion.div>
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

  // Get all available images from the API
  const carImages =
    car.images && car.images.length > 0
      ? car.images
      : [
          car.image_url ||
            "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1000&q=80",
        ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-black" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-radial from-rose-500/20 via-orange-500/10 to-transparent rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/2 animate-pulse opacity-60" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-radial from-orange-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/2 animate-pulse opacity-50" />

      {/* Back Button */}
      <div className="relative px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Link to={createPageUrl("Cars")}>
          <Button
            variant="ghost"
            className="gap-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cars
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative px-4 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative overflow-hidden border group rounded-3xl bg-black/50 border-gray-800/50 backdrop-blur-xl">
              <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-br from-rose-500/10 to-orange-500/10 group-hover:opacity-100" />
              <img
                src={carImages[selectedImage]}
                alt={car.title}
                className="object-cover w-full transition-transform duration-500 aspect-video group-hover:scale-105"
              />

              {/* Favorite Button */}
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute p-3 transition-all duration-300 border top-4 right-4 rounded-2xl bg-black/50 backdrop-blur-xl border-gray-800/50 hover:bg-black/70"
              >
                <Heart
                  className={`w-5 h-5 transition-colors duration-300 ${
                    isFavorite
                      ? "fill-rose-500 text-rose-500"
                      : "text-white hover:text-rose-400"
                  }`}
                />
              </button>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {carImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-2xl aspect-video transition-all duration-300 ${
                    selectedImage === index
                      ? "ring-2 ring-rose-500 ring-offset-2 ring-offset-black"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${car.title} ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                  <div
                    className={`absolute inset-0 border-2 rounded-2xl transition-colors duration-300 ${
                      selectedImage === index
                        ? "border-rose-500"
                        : "border-gray-800/50"
                    }`}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Title & Price */}
            <div className="p-8 space-y-4 border rounded-3xl bg-black/50 backdrop-blur-xl border-gray-800/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {car.condition && (
                      <Badge className="px-3 py-1 text-xs font-semibold border-none bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600">
                        {car.condition}
                      </Badge>
                    )}
                  </div>
                  <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl">
                    {car.title}
                  </h1>
                  <p className="text-lg text-gray-400">
                    {car.make} {car.model}
                  </p>
                </div>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                  {formatPrice(car.price)}
                </span>
              </div>
            </div>

            {/* Specifications */}
            <div className="p-8 space-y-6 border rounded-3xl bg-black/50 backdrop-blur-xl border-gray-800/50">
              <h2 className="text-xl font-bold text-white">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {specs.map((spec, index) => {
                  const Icon = spec.icon;
                  return (
                    <div
                      key={index}
                      className="p-4 space-y-2 transition-all duration-300 border rounded-2xl bg-black/30 hover:bg-gray-800/30 border-gray-800/30"
                    >
                      <div className="flex items-center gap-2 text-gray-400">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{spec.label}</span>
                      </div>
                      <p className="text-base font-semibold text-white">
                        {spec.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            {car.description && (
              <div className="p-8 space-y-4 border rounded-3xl bg-black/50 backdrop-blur-xl border-gray-800/50">
                <h2 className="text-xl font-bold text-white">Description</h2>
                <p className="leading-relaxed text-gray-300">
                  {car.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full py-6 text-base font-semibold transition-all duration-300 shadow-lg bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-2xl shadow-rose-500/25 hover:shadow-rose-500/40">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Send Inquiry
                  </Button>
                </DialogTrigger>
                <DialogContent className="text-white border-gray-800 sm:max-w-md bg-black/95 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                      Inquire About This Car
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleInquirySubmit} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Your Name"
                        value={inquiry.name}
                        onChange={(e) =>
                          setInquiry({ ...inquiry, name: e.target.value })
                        }
                        required
                        className="text-white border-gray-700 bg-gray-900/50 placeholder:text-gray-500 rounded-xl"
                      />
                    </div>
                    <div>
                      <Input
                        type="email"
                        placeholder="Your Email"
                        value={inquiry.email}
                        onChange={(e) =>
                          setInquiry({ ...inquiry, email: e.target.value })
                        }
                        required
                        className="text-white border-gray-700 bg-gray-900/50 placeholder:text-gray-500 rounded-xl"
                      />
                    </div>
                    <div>
                      <Input
                        type="tel"
                        placeholder="Your Phone"
                        value={inquiry.phone}
                        onChange={(e) =>
                          setInquiry({ ...inquiry, phone: e.target.value })
                        }
                        required
                        className="text-white border-gray-700 bg-gray-900/50 placeholder:text-gray-500 rounded-xl"
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Your Message"
                        value={inquiry.message}
                        onChange={(e) =>
                          setInquiry({ ...inquiry, message: e.target.value })
                        }
                        rows={4}
                        className="text-white border-gray-700 resize-none bg-gray-900/50 placeholder:text-gray-500 rounded-xl"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full py-6 text-base font-semibold bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-xl"
                    >
                      Send Inquiry
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                className="w-full py-6 text-base font-medium text-gray-300 transition-all duration-300 border-gray-700 rounded-2xl bg-black/50 hover:bg-gray-800/50 hover:text-white hover:border-gray-600"
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
