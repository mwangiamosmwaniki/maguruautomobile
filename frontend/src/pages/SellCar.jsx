import React, { useState } from "react";
import {
  Car,
  Upload,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Loader2,
} from "lucide-react";
import { Button } from "../assets/components/ui/button";
import { Input } from "../assets/components/ui/input";
import { Textarea } from "../assets/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../assets/components/ui/select";
import { Label } from "../assets/components/ui/label";
import { motion } from "framer-motion";
import { toast } from "sonner";

const steps = [
  {
    icon: Upload,
    title: "Submit Your Details",
    description: "Fill out the form with your car's information",
  },
  {
    icon: CheckCircle,
    title: "Get Your Valuation",
    description: "Our team will assess and provide a fair price",
  },
  {
    icon: Car,
    title: "Complete the Sale",
    description: "Accept the offer and receive quick payment",
  },
];

export default function SellCar() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    make: "",
    model: "",
    year: "",
    mileage: "",
    condition: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Replace this with your actual API endpoint
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: `Selling Request:
Make: ${formData.make}
Model: ${formData.model}
Year: ${formData.year}
Mileage: ${formData.mileage}
Condition: ${formData.condition}
Description: ${formData.description}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit inquiry");
      }

      toast.success(
        "Your request has been submitted! We will contact you within 24 hours.",
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        make: "",
        model: "",
        year: "",
        mileage: "",
        condition: "",
        description: "",
      });
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-16 md:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 text-rose-300 rounded-full text-sm font-medium mb-6">
              Sell Your Car
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Get the Best Price for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                Your Vehicle
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Sell your car hassle-free with quick payment and smooth transfers.
              Let us handle the paperwork while you get the best value.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 mb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-sm font-bold text-slate-600">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100"
        >
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Submit Your Car Details
          </h2>
          <p className="text-slate-600 mb-8">
            Fill out the form below and we'll get back to you within 24 hours
            with a valuation.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Your Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="John Doe"
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="0712 345 678"
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="john@example.com"
                  className="mt-1.5 rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Car Details */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Car Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Select
                    value={formData.make}
                    onValueChange={(v) => handleChange("make", v)}
                  >
                    <SelectTrigger className="mt-1.5 rounded-xl">
                      <SelectValue placeholder="Select make" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Toyota">Toyota</SelectItem>
                      <SelectItem value="Mercedes">Mercedes</SelectItem>
                      <SelectItem value="BMW">BMW</SelectItem>
                      <SelectItem value="Honda">Honda</SelectItem>
                      <SelectItem value="Nissan">Nissan</SelectItem>
                      <SelectItem value="Mazda">Mazda</SelectItem>
                      <SelectItem value="Suzuki">Suzuki</SelectItem>
                      <SelectItem value="Volkswagen">Volkswagen</SelectItem>
                      <SelectItem value="Land Rover">Land Rover</SelectItem>
                      <SelectItem value="Subaru">Subaru</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleChange("model", e.target.value)}
                    placeholder="e.g. Corolla, Civic"
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year of Manufacture</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleChange("year", e.target.value)}
                    placeholder="2020"
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="mileage">Mileage (km)</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={formData.mileage}
                    onChange={(e) => handleChange("mileage", e.target.value)}
                    placeholder="50000"
                    className="mt-1.5 rounded-xl"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(v) => handleChange("condition", v)}
                >
                  <SelectTrigger className="mt-1.5 rounded-xl">
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellent">
                      Excellent - Like new
                    </SelectItem>
                    <SelectItem value="Good">Good - Minor wear</SelectItem>
                    <SelectItem value="Fair">
                      Fair - Some repairs needed
                    </SelectItem>
                    <SelectItem value="Poor">
                      Poor - Major repairs needed
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Tell us more about your car (features, service history, any issues, etc.)"
                  className="mt-1.5 rounded-xl resize-none"
                  rows={4}
                />
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-xl h-14 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Request
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Contact Info */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Prefer to talk to us directly?</p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="tel:0700000000"
              className="flex items-center gap-2 text-slate-700 hover:text-rose-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
              <span>0700 000 000</span>
            </a>
            <a
              href="mailto:sell@autocars.co.ke"
              className="flex items-center gap-2 text-slate-700 hover:text-rose-600 transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>sell@autocars.co.ke</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
