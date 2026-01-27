import React, { useState } from "react";
import { Button } from "../ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Simulate subscription API call
    toast.success(`Subscribed successfully with ${email}!`);
    setEmail("");
  };

  return (
    <section className="bg-slate-900 text-white py-12">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-slate-400 mb-6">
          Get the latest cars, deals, and updates straight to your inbox.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <div className="relative w-full sm:w-auto flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-72 py-3 pl-10 pr-4 rounded-lg bg-slate-800 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
            />
          </div>
          <Button
            onClick={handleSubscribe}
            className="bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 rounded-lg px-6 py-3"
          >
            Subscribe
          </Button>
        </div>
      </div>
    </section>
  );
}
