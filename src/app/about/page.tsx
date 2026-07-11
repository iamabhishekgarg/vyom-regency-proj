import AboutClient from "./AboutClient";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const seo = await getPageSeo("about");
  return {
    ...buildMetadata(seo, {
      title: "About Us | Vyom Regency Pvt Ltd - Trusted Since 2017",
      description: "Learn about Vyom Regency Pvt Ltd, established in 2017 by Ex-NSG Commando Mr. Sobaran Singh.",
    }),
    keywords: seo?.focus_keyword || "Vyom Regency, about us, NSG commando, real estate",
  };
}

export default function AboutPage() {
  return <AboutClient />;
}
