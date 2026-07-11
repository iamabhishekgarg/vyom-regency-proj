import { supabase } from "@/integrations/supabase/client";

export interface PageSeo {
  route: string;
  meta_title: string | null;
  meta_description: string | null;
  focus_keyword: string | null;
}

export const SEO_ROUTES = [
  { route: "home", label: "Home Page" },
  { route: "about", label: "About Us" },
  { route: "founder", label: "Founder" },
  { route: "contact", label: "Contact" },
  { route: "gallery", label: "Gallery" },
  { route: "estates", label: "Estates Listing" },
  { route: "blog", label: "Blog Listing" },
] as const;

export async function getPageSeo(route: string): Promise<PageSeo | null> {
  const { data } = await supabase.from("page_seo").select("*").eq("route", route).maybeSingle();
  return data;
}

export function buildMetadata(
  seo: PageSeo | null,
  fallback: { title: string; description: string }
) {
  return {
    title: seo?.meta_title || fallback.title,
    description: seo?.meta_description || fallback.description,
  };
}
