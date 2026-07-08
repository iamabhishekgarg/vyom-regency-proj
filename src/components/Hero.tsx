"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function Hero() {
  const [bgImage, setBgImage] = useState(
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80"
  );

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const { data: settingsData, error: settingsError } = await supabase
          .from("site_settings")
          .select("hero_image_key")
          .single();

        if (!settingsError && settingsData?.hero_image_key) {
          const {
            data: { publicUrl },
          } = supabase.storage
            .from("hero-banners")
            .getPublicUrl(settingsData.hero_image_key);
          setBgImage(publicUrl);
        }
      } catch (error) {
        console.log("Using default hero image");
      }
    };
    fetchHeroImage();
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center pt-16"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.6)), url('${bgImage}')`,
      }}
    >
      <div className="container mx-auto px-4 text-center text-white max-w-5xl mx-auto z-10 relative">
        {/* Urgency Badge */}
        <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
          🔥 Only 4 Plots Left at Vyom Green Paradise
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif leading-tight mb-4">
          2 Hours from <span className="text-amber-400">Delhi NCR</span> <br />
          Premium Farmhouse Plots
        </h1>

        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Own your weekend farmhouse in Kishangarh Bas, Alwar. Clear title,
          water, electricity, security — everything included.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-start gap-4 justify-center flex-wrap">
          <div className="flex flex-col items-center">
            <Link
              href="#lead-form"
              className="bg-amber-500 text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-amber-400 transition inline-flex items-center gap-2 shadow-xl"
            >
              📅 Schedule Site Visit
            </Link>
            <p className="text-white/70 text-sm mt-2">
              By Appointment Only • Limited Slots Available
            </p>
          </div>
          <a
            href="tel:+918955311031"
            className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-white hover:text-gray-900 transition inline-flex items-center gap-2"
          >
            📞 Call Now
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center flex-wrap gap-6 mt-12">
          {[
            { icon: "✅", text: "Registry Ready" },
            { icon: "🏛️", text: "Clear Title" },
            { icon: "🛣️", text: "30ft Road" },
            { icon: "💧", text: "24x7 Water" },
            { icon: "⚡️", text: "Electricity" },
            { icon: "🛡️", text: "Gated Security" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span>{item.icon}</span>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Price Indicator */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm inline-block px-6 py-3 rounded-full">
          <p className="text-sm">
            💰 Prices starting from{" "}
            <span className="text-amber-300 font-bold text-xl">₹50 Lakhs</span>{" "}
            (1350 sq yd)
          </p>
        </div>
      </div>
    </section>
  );
}