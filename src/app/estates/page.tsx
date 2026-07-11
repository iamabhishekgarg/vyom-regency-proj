import EstatesClient from "./EstatesClient";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const seo = await getPageSeo("estates");
  return buildMetadata(seo, {
    title: "Estates & Properties | Vyom Regency Pvt Ltd",
    description: "Explore premium farmhouse plots and individual land properties from Vyom Regency across Rajasthan.",
  });
}

export default function EstatesPage() {
  return <EstatesClient />;
}
