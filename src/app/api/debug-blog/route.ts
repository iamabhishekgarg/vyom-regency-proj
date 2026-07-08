import { NextResponse } from "next/server";
import { supabase } from "@/integrations/supabase/client";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  const { data, error, status, statusText } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return NextResponse.json({
    urlPrefix: url.slice(0, 30),
    keyPrefix: key.slice(0, 25),
    keyLength: key.length,
    status,
    statusText,
    error,
    dataCount: data?.length ?? 0,
    data,
  });
}
