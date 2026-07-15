"use client";

import { usePathname } from "next/navigation";
import { Instagram, Facebook, Linkedin, Youtube, Twitter } from "lucide-react";

const SOCIAL_LINKS = [
  { name: "Instagram", href: "https://www.instagram.com/vyomregency/", icon: Instagram, bg: "bg-gradient-to-br from-purple-600 via-pink-600 to-amber-500" },
  { name: "Facebook", href: "https://www.facebook.com/VyomRegencyPvtLtd", icon: Facebook, bg: "bg-[#1877F2]" },
  { name: "X", href: "https://x.com/VyomRegency", icon: Twitter, bg: "bg-black" },
  { name: "LinkedIn", href: "https://in.linkedin.com/company/vyomregency", icon: Linkedin, bg: "bg-[#0A66C2]" },
  { name: "YouTube", href: "https://www.youtube.com/@VyomRegency", icon: Youtube, bg: "bg-[#FF0000]" },
];

export default function SocialSidebar() {
  const pathname = usePathname();
  const hide = pathname?.startsWith("/admin") || pathname === "/login";
  if (hide) return null;

  return (
    <div className="hidden md:flex fixed right-0 top-1/2 -translate-y-1/2 z-40 flex-col shadow-lg rounded-l-xl overflow-hidden">
      {SOCIAL_LINKS.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className={`${social.bg} text-white w-11 h-11 flex items-center justify-center hover:w-14 transition-all duration-200`}
          >
            <Icon size={18} />
          </a>
        );
      })}
    </div>
  );
}
