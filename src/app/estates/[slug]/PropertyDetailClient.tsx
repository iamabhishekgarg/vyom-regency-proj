"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MapPin, CheckCircle, Clock, Ban, ArrowLeft, FileDown, Loader2, X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { isGalleryVideoUrl } from "@/lib/propertyUtils";
import { getPropertyBySlug, type Property } from "@/lib/properties";

export default function PropertyDetailClient() {
  const params = useParams();
  const slug = params.slug as string;

  const [property, setProperty] = useState<Property | null | undefined>(undefined);
  const [showEnquire, setShowEnquire] = useState(false);
  const [showBrochureGate, setShowBrochureGate] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (slug) getPropertyBySlug(slug).then(setProperty);
  }, [slug]);

  const handleBrochureUnlocked = async () => {
    if (!property?.brochure_url) return;
    try {
      const response = await fetch(property.brochure_url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${property.name.replace(/[^a-z0-9]+/gi, "-")}-brochure.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Brochure download failed:", err);
      window.open(property.brochure_url, "_blank");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> Available</span>;
      case "limited":
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12} /> Limited</span>;
      case "sold":
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Ban size={12} /> Sold Out</span>;
      default:
        return null;
    }
  };

  if (property === undefined) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <Loader2 className="animate-spin text-green-700" size={40} />
        </main>
        <Footer />
      </>
    );
  }

  if (property === null) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center pt-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Property Not Found</h1>
            <Link href="/estates" className="text-green-700 hover:underline">← Back to all estates</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <LeadCaptureModal
        isOpen={showEnquire}
        onClose={() => setShowEnquire(false)}
        title="Enquire Now"
        subtitle="Share your details and our team will call you shortly."
        propertyName={property.name}
        source="property_enquiry"
        submitLabel="Send Enquiry →"
      />
      <LeadCaptureModal
        isOpen={showBrochureGate}
        onClose={() => setShowBrochureGate(false)}
        title="Download Brochure"
        subtitle="Enter your details to download the brochure."
        propertyName={property.name}
        source="brochure_download"
        submitLabel="Download Brochure →"
        onSuccess={handleBrochureUnlocked}
      />

      <main>
        <section className="relative h-[50vh] min-h-[400px] flex items-end pt-16">
          <img
            src={property.image_url || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80"}
            alt={property.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="container mx-auto px-4 relative z-10 pb-10 text-white">
            <Link href="/estates" className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 mb-4 font-semibold text-sm">
              <ArrowLeft size={16} /> Back to Estates
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {getStatusBadge(property.status)}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold font-serif">{property.name}</h1>
            <div className="flex items-center gap-2 text-white/80 mt-2">
              <MapPin size={16} />
              <span>{property.location}</span>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Property</h2>
                <div
                  className="prose prose-sm md:prose-base max-w-none text-gray-600 prose-headings:text-gray-800 prose-strong:text-gray-800"
                  dangerouslySetInnerHTML={{ __html: property.description || "" }}
                />
              </div>

              {property.features?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Features & Amenities</h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {property.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle size={16} className="text-green-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {property.gallery_urls && property.gallery_urls.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 border border-gray-100">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Project Gallery</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {property.gallery_urls.map((url, i) =>
                      isGalleryVideoUrl(url) ? (
                        <div key={url} className="relative aspect-square rounded-xl overflow-hidden shadow-sm">
                          <iframe
                            src={url}
                            title={`${property.name} video ${i + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          />
                        </div>
                      ) : (
                        <div
                          key={url}
                          onClick={() => setLightboxIndex(i)}
                          className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all"
                        >
                          <img src={url} alt={`${property.name} ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                            <Maximize2 className="text-white" size={20} />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-24 space-y-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Plot Size</p>
                    <p className="font-bold text-gray-800">{property.size}</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-gray-500 mb-1">Price</p>
                    <p className="font-bold text-gray-800">{property.price}</p>
                  </div>
                </div>

                {property.status !== "sold" && (
                  <button
                    onClick={() => setShowEnquire(true)}
                    className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition shadow-md"
                  >
                    Enquire Now
                  </button>
                )}

                <button
                  onClick={() => setShowBrochureGate(true)}
                  disabled={!property.brochure_url}
                  className="w-full flex items-center justify-center gap-2 border-2 border-amber-500 text-amber-700 py-3 rounded-xl font-bold hover:bg-amber-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <FileDown size={18} />
                  {property.brochure_url ? "Download Brochure" : "Brochure Coming Soon"}
                </button>

                <a
                  href="tel:+918955311031"
                  className="w-full block text-center border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
                >
                  Call Us
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {lightboxIndex !== null && property.gallery_urls && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white hover:text-amber-400 transition z-10 bg-white/10 p-2 rounded-full backdrop-blur-sm"
          >
            <X size={32} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev! - 1 + property.gallery_urls!.length) % property.gallery_urls!.length);
            }}
            className="absolute left-4 md:left-8 text-white hover:text-amber-400 transition bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm"
          >
            <ChevronLeft size={40} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex((prev) => (prev! + 1) % property.gallery_urls!.length);
            }}
            className="absolute right-4 md:right-8 text-white hover:text-amber-400 transition bg-white/10 hover:bg-white/20 rounded-full p-3 backdrop-blur-sm"
          >
            <ChevronRight size={40} />
          </button>
          <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
            {isGalleryVideoUrl(property.gallery_urls[lightboxIndex]) ? (
              <iframe
                src={property.gallery_urls[lightboxIndex]}
                title="Property gallery video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full max-w-4xl aspect-video rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <img
                src={property.gallery_urls[lightboxIndex]}
                alt="Property gallery full view"
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            )}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full backdrop-blur-md mb-4">
              {lightboxIndex + 1} / {property.gallery_urls.length}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
