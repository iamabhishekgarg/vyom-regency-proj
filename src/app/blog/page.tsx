import BlogClient from "./BlogClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts, getCategories } from "@/lib/blog";
import { getPageSeo, buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getPageSeo("blog");
  return buildMetadata(seo, {
    title: "Blog | Vyom Regency Pvt Ltd - Farmhouse Living & Agriculture Land Guide",
    description:
      "Expert insights on farmhouse living, agriculture land investment, organic farming, and real estate in Rajasthan. Read our blog for tips and updates.",
  });
}

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);

  return (
    <>
      <Header />
      <BlogClient posts={posts} categories={categories} />
      <Footer />
    </>
  );
}
