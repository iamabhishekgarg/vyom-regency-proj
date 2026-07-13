"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FALLBACK_SLIDES = [
  {
    label: "Sunrise",
    url: "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
  {
    label: "Luxury Farmhouse",
    url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
  {
    label: "Kids Playing",
    url: "https://images.unsplash.com/photo-1476234251651-f353703a034d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
  {
    label: "Bonfire",
    url: "https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
  {
    label: "Organic Farming",
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
  {
    label: "Aravali Views",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
  {
    label: "Walking Trail",
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
  },
];

const SLIDE_DURATION_MS = 5000;

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [slides, setSlides] = useState(FALLBACK_SLIDES);

  useEffect(() => {
    const fetchSlides = async () => {
      const { data } = await supabase
        .from("hero_slides")
        .select("*")
        .order("sort_order", { ascending: true });

      if (data && data.length > 0) {
        setSlides(data.map((s) => ({ label: s.label || `slide-${s.id}`, url: s.image_url })));
        setActiveSlide(0);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(interval);
  }, [slides.length]);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Image slider layer — rotates automatically, independent of the text layer below */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, i) => (
          <div
            key={slide.label}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.6)), url('${slide.url}')`,
              opacity: i === activeSlide ? 1 : 0,
            }}
            aria-hidden={i !== activeSlide}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-4 md:px-8">
        <button
          type="button"
          onClick={prevSlide}
          className="pointer-events-auto rounded-full bg-black/40 text-white p-3 shadow-lg transition hover:bg-black/60"
          aria-label="Previous slide"
        >
          <ArrowLeft size={20} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          className="pointer-events-auto rounded-full bg-black/40 text-white p-3 shadow-lg transition hover:bg-black/60"
          aria-label="Next slide"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      {/* Text + CTA layer — stays fixed on screen, unaffected by the slider */}
      <div className="container mx-auto px-4 text-center text-white max-w-5xl mx-auto z-10 relative">
        {/* Urgency Badge */}
        <div className="inline-block bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-6 animate-pulse">
          Hurry Price Revising Soon
        </div>

        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold font-serif leading-tight mb-3">
          Own Your Dream Farmhouse in the Heart of
          <span className="text-amber-400"> Aravali Hills</span>
        </h1>
        <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold leading-snug mb-4 text-white/90">
          2 Hrs Drive from Delhi NCR in Kishangarh Bas, Alwar
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Premium Farmhouse Plots | Registry Available | Gated Community | High
          Investment Growth
        </p>

        {/* CTA Buttons */}
        <div className="flex items-start gap-4 justify-center flex-wrap">
          <div className="flex flex-col items-center">
            <Link
              href="#lead-form"
              className="bg-amber-500 text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-white transition inline-flex items-center gap-2 shadow-xl"
            >
              📅 Schedule Site Visit
            </Link>
          </div>
          <div className="flex flex-col items-center">
            <Link
              href="tel:+918955311031"
              className="bg-amber-500 text-gray-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-white transition inline-flex items-center gap-2 shadow-xl"
            >
              📞 Call Now
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex justify-center flex-wrap gap-6 mt-12">
          {[
            { icon: "✅", text: "Registry Ready" },
            { icon: "🏛️", text: "Clear Title" },
            { icon: "🛣️", text: "Gravel Road" },
            { icon: "💧", text: "water Connection" },
           { icon: "🌬️", text: "Pollution Free zone" },
            { icon: "⚡️", text: "Electricity" },
            { icon: "🛡️", text: "Gated community" },
            { icon: "🔒", text: "24*7 Security" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <span>{item.icon}</span>
              <span className="text-sm">{item.text}</span>
            </div>
          ))}
        </div>

        {/* Price Indicator */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm inline-block px-6 py-3 rounded-full">
          <p className="text-sm">
            Area starts from {" "}
            <span className="text-amber-300 font-bold text-xl">1250 sq yard</span>{" "}
          </p>
        </div>
      </div>
    </section>
  );
}
