import PropertyDetailClient from "./PropertyDetailClient";
import { getPropertyBySlug } from "@/lib/properties";

export const dynamic = "force-dynamic";

interface PropertyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: "Property Not Found" };
  }

  return {
    title: property.meta_title || `${property.name} | Vyom Regency`,
    description: property.meta_description || stripHtml(property.description || "").slice(0, 160),
  };
}

export default function PropertyDetailPage() {
  return <PropertyDetailClient />;
}
