import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import GlobalWhatsAppButton from "@/components/GlobalWhatsAppButton";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vyom Regency Pvt Ltd - Premium Farmhouse Plots in Rajasthan",
  description: "Vyom Regency offers premium agriculture land and farmhouse plots in Kishangarh Bas, Alwar, Rajasthan. Clear titles, transparent deals since 2017.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
        <GlobalWhatsAppButton />
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
