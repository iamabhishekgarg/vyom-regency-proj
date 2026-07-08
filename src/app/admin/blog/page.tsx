"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  categorySlug: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
  featured: boolean;
}

export default function AdminBlogPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    categorySlug: "",
    author: "",
    date: "",
    readTime: "",
    image: "",
    tags: [],
    featured: false,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditing(post);
    setFormData({
      ...post,
      tags: post.tags || [],
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this blog post?")) {
      const { error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", id);

      if (error) {
        toast.error("Delete failed");
      } else {
        toast.success("Deleted successfully");
        fetchPosts();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      toast.error("Title and slug are required");
      return;
    }

    setSaving(true);
    const isNew = !editing;
    try {
      const payload = { ...formData, tags: formData.tags ?? [] };
      const { error } = isNew
        ? await supabase.from("blog_posts").insert(payload)
        : await supabase.from("blog_posts").update(payload).eq("id", editing!.id);

      if (error) {
        console.error("Error saving post:", error);
        toast.error("Save failed");
      } else {
        toast.success(isNew ? "Post created" : "Post updated");
        router.push("/admin/blog");
        fetchPosts();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { error } = await supabase.storage
      .from("blog")
      .upload(`posts/${Date.now()}-${file.name}`, file, {
        cacheControl: "3600",
        contentType: file.type,
      });

    if (error) {
      toast.error("Upload failed");
    } else {
      const { data } = supabase.storage
        .from("blog")
        .getPublicUrl(`posts/${Date.now()}-${file.name}`);

      setFormData(prev => ({ ...prev, image: data.publicUrl }));
    }
  };

  const getCategoryOptions = () => [
    { value: "farmhouse-living", label: "Farmhouse Living" },
    { value: "buying-guide", label: "Buying Guide" },
    { value: "our-projects", label: "Our Projects" },
    { value: "investment-guide", label: "Investment Guide" },
  ];

  if (!isMounted) return null;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-green-700" size={48} />
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link href="/admin" className="text-green-700 hover:text-green-800">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Admin Blog Management</h1>
        </div>
        <button
          onClick={() => setEditing(null)}
          className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
        >
          {editing ? "Back to List" : "New Post"}
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Slug *</label>
            <input              type="text"
              required
              value={formData.slug || ""}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Excerpt *</label>
            <textarea
              required
              rows={3}
              value={formData.excerpt || ""}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image URL</label>
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image || ""}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
            {formData.image && (
              <div className="mt-2 flex items-center gap-2">
                <img src={formData.image} alt="Blog image" className="w-16 h-16 rounded-lg" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Content (HTML)</label>
            <textarea
              required
              rows={8}
              value={formData.content || ""}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
            <select
              value={formData.categorySlug || ""}
              onChange={(e) => {
                const opt = getCategoryOptions().find((o) => o.value === e.target.value);
                setFormData({ ...formData, categorySlug: e.target.value, category: opt?.label || "" });
              }}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select Category</option>
              {getCategoryOptions().map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Author *</label>
            <input
              type="text"
              value={formData.author || ""}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              placeholder="e.g., farmhouse, investment, guide"
              value={formData.tags?.join(",") || ""}
              onChange={(e) => setFormData({
                ...formData,
                tags: e.target.value.split(",").filter(t => t.trim()),
              })}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Featured?</label>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.featured === true}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-600">Mark as featured</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || saving}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Post"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Posts List */}
      {posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="p-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{post.title}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(post)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
