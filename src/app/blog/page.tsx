import BlogClient from "./BlogClient";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllPosts, getCategories } from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Blog | Vyom Regency Pvt Ltd - Farmhouse Living & Agriculture Land Guide",
  description:
    "Expert insights on farmhouse living, agriculture land investment, organic farming, and real estate in Rajasthan. Read our blog for tips and updates.",
};

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
