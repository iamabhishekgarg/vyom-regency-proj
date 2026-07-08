"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-[9999] transition-all duration-500 ease-in-out",
        "bg-white",
        scrolled && "bg-white/95 backdrop-blur-md shadow-md"
      )}
    >
      <nav className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex flex-col group" onClick={closeMenu}>
          <span className="text-xl md:text-2xl font-bold leading-tight">
            <span className="text-green-700">Vyom</span>
            <span className="text-amber-600"> Regency</span>
          </span>
          <span className="text-[10px] md:text-xs text-gray-500 font-medium">
            Pvt Ltd | Est. 2017
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks onClick={closeMenu} />
          <a
            href="tel:+918955311031"
            className="bg-green-700 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Phone size={18} />
            Call Now
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile menu */}
        <div
          className={cn(
            "fixed inset-0 bg-white z-[-1] md:hidden transition-all duration-500 ease-in-out transform",
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          )}
          style={{ top: "0", height: "100vh" }}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-6 pt-20">
            <NavLinks mobile onClick={closeMenu} />
            <div className="w-full pt-6 border-t border-gray-100 flex flex-col gap-4">
              <a
                href="tel:+918955311031"
                className="w-full bg-green-700 text-white py-4 rounded-xl font-bold text-center shadow-lg flex items-center justify-center gap-3"
                onClick={closeMenu}
              >
                <Phone size={20} />
                Call +91 89553 11031
              </a>
              <Link
                href="/contact"
                className="w-full border-2 border-green-700 text-green-700 py-4 rounded-xl font-bold text-center"
                onClick={closeMenu}
              >
                Enquire Now
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

/* Navigation links – same component used for desktop & mobile */
function NavLinks({ mobile, onClick }: { mobile?: boolean; onClick?: () => void }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/estates", label: "Estates" },
    { href: "/gallery", label: "Gallery" },
    { href: "/about", label: "About" },
    { href: "/founder", label: "Founder" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onClick}
          className={cn(
            "transition-all duration-200 font-semibold",
            mobile
              ? "text-2xl text-gray-800 hover:text-green-700 py-2"
              : "text-gray-600 hover:text-green-700 text-sm lg:text-base"
          )}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
}