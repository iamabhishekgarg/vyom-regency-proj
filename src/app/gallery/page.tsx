import GalleryClient from "./GalleryClient";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const seo = await getPageSeo("gallery");
  return buildMetadata(seo, {
    title: "Gallery | Vyom Regency Pvt Ltd",
    description: "Browse photos and videos of Vyom Regency's premium farmhouse plots and agriculture land developments in Rajasthan.",
  });
}

export default function GalleryPage() {
  return <GalleryClient />;
}
