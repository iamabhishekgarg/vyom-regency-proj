"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HeroManagement() {
  const [isMounted, setIsMounted] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const router = useRouter();

  const templateImages = [
    {
      url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80",
      name: "default-hero.jpg",
    },
    {
      url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80",
      name: "farmhouse-hero.jpg",
    },
  ];

  useEffect(() => {
    setIsMounted(true);
    fetchCurrentHero();
  }, []);

  const fetchCurrentHero = async () => {
    const { data, error } = await supabase
      .from("site_settings")
      .select("hero_image_key")
      .single();

    if (!error && data?.hero_image_key) {
      const { data: { publicUrl } } = supabase.storage
        .from("hero-banners")
        .getPublicUrl(data.hero_image_key);
      setImageUrl(publicUrl);
      setImageName(data.hero_image_key.split("/").pop() || "hero.jpg");
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const { error } = await supabase.storage
        .from("hero-banners")
        .upload(`hero/${fileName}`, file, {
          cacheControl: "3600",
          contentType: file.type,
        });

      if (error) throw error;

      const { error: updError } = await supabase
        .from("site_settings")
        .update({ hero_image_key: `hero/${fileName}` })
        .eq("id", 1);

      if (updError) throw updError;

      toast.success("Hero image updated!");
      fetchCurrentHero();
    } catch (err: any) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete current hero image?")) return;
    try {
      const { data } = await supabase.from("site_settings").select("hero_image_key").single();
      if (data?.hero_image_key) {
        await supabase.storage.from("hero-banners").remove([data.hero_image_key]);
        await supabase.from("site_settings").update({ hero_image_key: null }).match({ id: 1 });
      }
      setImageUrl("");
      setImageName("");
      toast.success("Deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push("/admin/dashboard")} className="p-2 hover:bg-gray-200 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold">Hero Banner Management</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border">
          <div className="aspect-video relative bg-gray-100 flex items-center justify-center">
            {imageUrl ? (
              <img src={imageUrl} alt="Hero" className="w-full h-full object-cover" />
            ) : (
              <p className="text-gray-400">No Hero Image Set</p>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                <Loader2 className="animate-spin mr-2" /> Uploading...
              </div>
            )}
          </div>
          <div className="p-6 flex justify-between items-center bg-gray-50">
            <div>
              <p className="text-sm font-bold text-gray-700">{imageName || "Default"}</p>
              <p className="text-xs text-gray-500">Main homepage background banner</p>
            </div>
            <div className="flex gap-3">
              <label className="bg-green-700 text-white px-4 py-2 rounded-lg font-bold cursor-pointer hover:bg-green-800 transition">
                <Upload size={18} className="inline mr-2" /> Change Image
                <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
              </label>
              {imageUrl && (
                <button onClick={handleDelete} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100">
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}