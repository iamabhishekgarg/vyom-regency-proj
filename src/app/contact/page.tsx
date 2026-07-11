import ContactClient from "./ContactClient";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const seo = await getPageSeo("contact");
  return buildMetadata(seo, {
    title: "Contact Us | Vyom Regency Pvt Ltd",
    description:
      "Get in touch with Vyom Regency Pvt Ltd for premium farmhouse plots and agriculture land in Rajasthan. Call, WhatsApp, or visit us.",
  });
}

export default function ContactPage() {
  return <ContactClient />;
}
