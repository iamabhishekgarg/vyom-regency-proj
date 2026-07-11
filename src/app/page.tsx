import HomeClient from "./HomeClient";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const seo = await getPageSeo("home");
  return buildMetadata(seo, {
    title: "Vyom Regency Pvt Ltd - Premium Farmhouse Plots in Rajasthan",
    description:
      "Vyom Regency offers premium agriculture land and farmhouse plots in Kishangarh Bas, Alwar, Rajasthan. Clear titles, transparent deals since 2017.",
  });
}

export default function Home() {
  return <HomeClient />;
}
