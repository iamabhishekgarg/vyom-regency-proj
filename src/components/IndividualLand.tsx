"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { Crown, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

interface Property {
  id: string;
  name: string;
  slug: string;
  location: string;
  price: string;
  size: string;
  status: string;
  description: string;
  features: string[];
  image_url: string;
  display_type?: string;
  sort_order?: number;
  show_on_home?: boolean;
}

export default function IndividualLand() {
  const [lands, setLands] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchHomeLands();
  }, []);

  const fetchHomeLands = async () => {
    try {
      // ✅ Filter specifically for individual lands that are marked for home
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("show_on_home", true)
        .or("name.ilike.%individual%,name.ilike.%premium farm land%")
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      setLands(data || []);
    } catch (error) {
      console.error("Error fetching home lands:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || lands.length === 0) return null;

  const displayType = lands[0]?.display_type || "single";

  return (
    <section className="py-20 bg-gradient-to-br from-amber-50 via-green-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4 shadow-lg">
            <Crown className="w-4 h-4" /> Premium Offering
          </div>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-800 mb-4">
            Individual <span className="text-amber-600">Premium Farm Lands</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Exclusive pieces of paradise selected for you
          </p>
          <div className="w-24 h-1 bg-amber-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {displayType === "single" && (
          <div className="max-w-5xl mx-auto">
            <LandCard land={lands[0]} fullSize={true} />
          </div>
        )}

        {displayType === "double" && (
          <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {lands.slice(0, 2).map((land) => (
              <LandCard key={land.id} land={land} fullSize={false} />
            ))}
          </div>
        )}

        {displayType === "carousel" && (
          <div className="relative max-w-7xl mx-auto">
            <div className="overflow-hidden rounded-3xl shadow-2xl">
              <div 
                className="flex transition-transform duration-700 ease-in-out" 
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {lands.map((land) => (
                  <div key={land.id} className="w-full flex-shrink-0">
                    <LandCard land={land} fullSize={true} />
                  </div>
                ))}
              </div>
            </div>
            {lands.length > 1 && (
              <>
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev === 0 ? lands.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-xl hover:bg-white z-10 transition-all"
                >
                  <ChevronLeft size={24} className="text-green-800" />
                </button>
                <button 
                  onClick={() => setCurrentSlide((prev) => (prev === lands.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-xl hover:bg-white z-10 transition-all"
                >
                  <ChevronRight size={24} className="text-green-800" />
                </button>
              </>
            )}
          </div>
        )}

        <div className="text-center mt-12">
          <Link 
            href="/estates?type=individual" 
            className="inline-flex items-center gap-2 bg-white border-2 border-green-700 text-green-700 px-8 py-3 rounded-full font-bold hover:bg-green-700 hover:text-white transition duration-300 shadow-lg"
          >
            View All Individual Lands
            <ChevronRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function LandCard({ land, fullSize }: { land: Property; fullSize: boolean }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden group border border-gray-100">
      <div className={`relative overflow-hidden ${fullSize ? 'h-96 md:h-[500px]' : 'h-64'}`}>
        <img 
          src={land.image_url || ""} 
          alt={land.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">Individual Plot</span>
        </div>
      </div>
      <div className="p-6 md:p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{land.name}</h3>
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <MapPin size={16} className="text-amber-600" />
          <span className="text-sm">{land.location}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-500 mb-1">Plot Size</p>
            <p className="text-lg font-bold text-gray-800">{land.size}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-500 mb-1">Starting From</p>
            <p className="text-lg font-bold text-amber-700">{land.price}</p>
          </div>
        </div>
        <p className="text-gray-600 text-sm mb-6 line-clamp-3">{land.description}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/#lead-form" className="flex-1 bg-amber-600 text-white text-center py-3 rounded-xl font-bold hover:bg-amber-700 transition shadow-md">Enquire Now →</Link>
          <Link href="/estates" className="flex-1 border-2 border-green-700 text-green-700 text-center py-3 rounded-xl font-bold hover:bg-green-700 hover:text-white transition">View Details</Link>
        </div>
      </div>
    </div>
  );
}