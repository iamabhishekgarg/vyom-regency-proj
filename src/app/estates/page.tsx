"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { MapPin, CheckCircle, Clock, Ban, Crown, LayoutGrid, List, ArrowUpDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  created_at: string;
}

export default function EstatesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [individualLands, setIndividualLands] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchProperties();
    fetchIndividualLands();
    
    const params = new URLSearchParams(window.location.search);
    if (params.get("type") === "individual") {
      setFilter("individual");
    }
  }, []);

  const fetchProperties = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .not("name", "ilike", "%individual%")
      .not("name", "ilike", "%premium farm land%")
      .order("created_at", { ascending: false });
    
    setProperties(data || []);
    setLoading(false);
  };

  const fetchIndividualLands = async () => {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .or("name.ilike.%individual%,name.ilike.%premium farm land%")
      .order("created_at", { ascending: false });
    
    setIndividualLands(data || []);
  };

  // Sorting Logic
  const sortData = (data: Property[]) => {
    const sorted = [...data];
    if (sortBy === "price-low") {
      return sorted.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
    }
    if (sortBy === "price-high") {
      return sorted.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
    }
    return sorted; // Default newest
  };

  const filteredProperties = sortData(properties.filter(prop => {
    if (filter === "all") return true;
    if (filter === "individual") return false;
    return prop.status === filter;
  }));

  const filteredIndividual = sortData(individualLands);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><CheckCircle size={12} /> Available</span>;
      case "limited":
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><Clock size={12} /> Limited</span>;
      case "sold":
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"><Ban size={12} /> Sold Out</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading estates...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 bg-gradient-to-r from-green-900 to-green-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our <span className="text-amber-400">Estates</span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              Discover premium farmhouse projects and individual lands in Rajasthan
            </p>
            <div className="w-24 h-1 bg-amber-400 mx-auto mt-6 rounded-full"></div>
          </div>
        </section>

        {/* Filter & Controls Bar */}
        <section className="py-6 bg-white border-b sticky top-16 z-40 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              {/* Main Filters */}
              <div className="flex flex-wrap justify-center gap-2">
                {["all", "available", "limited", "sold"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition uppercase tracking-wider ${
                      filter === f ? "bg-green-700 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {f === "all" ? "All Projects" : f}
                  </button>
                ))}
                <button
                  onClick={() => setFilter("individual")}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition uppercase tracking-wider flex items-center gap-2 ${
                    filter === "individual" ? "bg-amber-600 text-white shadow-md" : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                  }`}
                >
                  <Crown size={14} /> Individual Land
                </button>
              </div>

              {/* View & Sort Controls */}
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md transition ${viewMode === "grid" ? "bg-white text-green-700 shadow-sm" : "text-gray-400"}`}
                  >
                    <LayoutGrid size={18} />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md transition ${viewMode === "list" ? "bg-white text-green-700 shadow-sm" : "text-gray-400"}`}
                  >
                    <List size={18} />
                  </button>
                </div>
                
                <div className="relative flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-gray-400" />
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent text-sm font-semibold text-gray-700 outline-none cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Estates Grid */}
        <section className="py-16 bg-gray-50 min-h-[600px]">
          <div className="container mx-auto px-4">
            {filter === "individual" ? (
              <>
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Individual <span className="text-amber-600">Premium Farm Lands</span>
                  </h2>
                  <p className="text-gray-600">Exclusive pieces of paradise selected for you</p>
                </div>
                
                {filteredIndividual.length === 0 ? (
                  <NoResults />
                ) : (
                  <div className={viewMode === "grid" ? getGridClass(filteredIndividual.length) : "max-w-5xl mx-auto space-y-6"}>
                    {filteredIndividual.map((land) => (
                      <PropertyCard key={land.id} property={land} viewMode={viewMode} isIndividual={true} />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                {filteredProperties.length === 0 ? (
                  <NoResults />
                ) : (
                  <div className={viewMode === "grid" ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto" : "max-w-5xl mx-auto space-y-6"}>
                    {filteredProperties.map((property) => (
                      <PropertyCard key={property.id} property={property} viewMode={viewMode} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Helper to get smart grid classes
function getGridClass(count: number) {
  if (count === 1) return "max-w-2xl mx-auto";
  if (count === 2) return "grid md:grid-cols-2 gap-8 max-w-5xl mx-auto";
  return "grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto";
}

function NoResults() {
  return (
    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-200">
      <div className="text-5xl mb-4">🔍</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">No Properties Found</h3>
      <p className="text-gray-500">Try changing your filters or check back later.</p>
    </div>
  );
}

function PropertyCard({ property, viewMode, isIndividual }: { property: Property; viewMode: "grid" | "list"; isIndividual?: boolean }) {
  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all border border-gray-100 flex flex-col md:flex-row group">
        <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
          <img 
            src={property.image_url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"} 
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute top-4 left-4">{isIndividual && <span className="bg-amber-500 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg">Individual Plot</span>}</div>
        </div>
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-bold text-gray-800 group-hover:text-green-700 transition">{property.name}</h3>
              <div className="flex flex-col items-end gap-2">
                {getStatusBadge(property.status)}
                <span className="text-green-700 font-bold text-xl">{property.price}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
              <MapPin size={14} className="text-green-600" />
              <span>{property.location}</span>
              <span className="mx-2">•</span>
              <span>Size: <strong>{property.size}</strong></span>
            </div>
            <p className="text-gray-600 text-sm mb-6 line-clamp-2">{property.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {property.features?.slice(0, 4).map((f, i) => (
                <span key={i} className="bg-gray-100 text-gray-600 text-[10px] px-3 py-1 rounded-full font-medium">{f}</span>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <Link 
              href="/#lead-form" 
              className={`flex-1 text-center py-3 rounded-xl font-bold text-sm transition shadow-md ${
                isIndividual ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-green-700 hover:bg-green-800 text-white"
              }`}
            >
              {property.status === "limited" ? "🔴 Book Now →" : "Enquire Now →"}
            </Link>
            <Link href={`/estates/${property.slug}`} className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition">Details</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col h-full border border-gray-100">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image_url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"} 
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <div className="absolute top-4 right-4">{getStatusBadge(property.status)}</div>
        {isIndividual && <div className="absolute top-4 left-4"><span className="bg-amber-500 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg">Individual Plot</span></div>}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-green-700 transition">{property.name}</h3>
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-4">
          <MapPin size={12} className="text-green-600" />
          <span>{property.location}</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-green-50 p-2 rounded-lg text-center">
            <p className="text-[10px] text-gray-500">Size</p>
            <p className="font-bold text-gray-800 text-sm">{property.size}</p>
          </div>
          <div className="bg-amber-50 p-2 rounded-lg text-center">
            <p className="text-[10px] text-gray-500">Price</p>
            <p className="font-bold text-gray-800 text-sm">{property.price}</p>
          </div>
        </div>
        <p className="text-gray-600 text-xs mb-4 line-clamp-2 flex-grow">{property.description}</p>
        <div className="flex flex-wrap gap-1 mb-6">
          {property.features?.slice(0, 2).map((feature, idx) => (
            <span key={idx} className="bg-gray-100 text-gray-600 text-[10px] px-2 py-1 rounded-full">{feature}</span>
          ))}
        </div>
        {property.status !== "sold" ? (
          <Link 
            href="/#lead-form" 
            className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition shadow-md ${
              isIndividual ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-green-700 hover:bg-green-800 text-white"
            }`}
          >
            {property.status === "limited" ? "🔴 Book Now →" : "Enquire Now →"}
          </Link>
        ) : (
          <button disabled className="w-full bg-gray-300 text-gray-500 py-3 rounded-xl font-bold text-sm cursor-not-allowed">
            Sold Out
          </button>
        )}
      </div>
    </div>
  );
}

// Helper for status badges
function getStatusBadge(status: string) {
  switch (status) {
    case "available":
      return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><CheckCircle size={10} /> Available</span>;
    case "limited":
      return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><Clock size={10} /> Limited</span>;
    case "sold":
      return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"><Ban size={10} /> Sold Out</span>;
    default:
      return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[10px]">{status}</span>;
  }
}