"use client";

import LeadForm from "@/components/LeadForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";

export default function ContactPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <Header />
      <section className="relative pt-32 pb-16 bg-gradient-to-r from-green-900 to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Contact <span className="text-amber-400">Us</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Have a question or want to book a site visit? Fill out the form below and we'll get back to you shortly.
          </p>
          <div className="w-24 h-1 bg-amber-400 mx-auto mt-6 rounded-full"></div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <LeadForm />
        </div>
      </section>
      <Footer />
    </>
  );
}