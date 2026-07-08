"use client";

import { useState, useEffect } from "react";
import { 
  compressAndConvertImage, 
  uploadToSupabase, 
  deleteFromStorage, 
  getGalleryImages 
} from "@/lib/imageUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Trash2, Image as ImageIcon, Loader2, Copy, Check, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function MediaGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("gallery");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: "hero", label: "Hero Banners", bucket: "hero-banners" }, // New Category
    { id: "gallery", label: "Gallery", bucket: "gallery" },
    { id: "properties", label: "Properties", bucket: "properties" },
    { id: "testimonials", label: "Testimonials", bucket: "testimonials" },
    { id: "blog", label: "Blog", bucket: "blog" },
  ];

  useEffect(() => {
    fetchImages();
  }, [selectedCategory]);

  const fetchImages = async () => {
    setLoading(true);
    const bucket = categories.find(c => c.id === selectedCategory)?.bucket || "gallery";
    const imagesList = await getGalleryImages(bucket, selectedCategory);
    setImages(imagesList);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const bucket = categories.find(c => c.id === selectedCategory)?.bucket || "gallery";

    for (const file of Array.from(files)) {
      if (!file.type.includes('image')) {
        toast.error(`${file.name} is not an image`);
        continue;
      }

      try {
        toast.loading(`Optimizing ${file.name}...`, { id: file.name });
        const compressedFile = await compressAndConvertImage(file);
        
        toast.loading(`Uploading ${file.name}...`, { id: file.name });
        const { url, path, error } = await uploadToSupabase(compressedFile, bucket, selectedCategory);
        
        if (error) throw error;

        // If category is gallery, also add to the gallery table for the website
        if (selectedCategory === "gallery") {
          await supabase.from("gallery").insert([{ 
            url: url, 
            caption: file.name.replace(/\.[^/.]+$/, '').replace(/-/g, ' ') 
          }]);
        }

        toast.success(`${file.name} uploaded!`, { id: file.name });
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`, { id: file.name });
      }
    }

    setUploading(false);
    fetchImages();
    e.target.value = '';
  };

  const handleDelete = async (image: any) => {
    if (!confirm(`Delete ${image.name}?`)) return;
    const bucket = categories.find(c => c.id === selectedCategory)?.bucket || "gallery";
    
    // Delete from storage
    const success = await deleteFromStorage(bucket, image.path);
    
    if (success) {
      // If it was in gallery, also delete from the gallery table
      if (selectedCategory === "gallery") {
        await supabase.from("gallery").delete().eq("url", image.url);
      }
      toast.success("Deleted");
      fetchImages();
    }
  };

  const copyToClipboard = async (url: string, id: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedId(id);
      toast.success("URL Copied");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Copy failed — select and copy the URL manually");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Media Manager</h1>
            <p className="text-gray-500 text-sm">Auto-optimized WebP images for SEO & Speed</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                selectedCategory === cat.id
                  ? "bg-emerald-700 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 mb-8 text-center hover:border-emerald-500 transition group">
          <input
            type="file"
            id="fileUpload"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
              {uploading ? <Loader2 className="animate-spin text-emerald-700" /> : <Upload className="text-emerald-700" />}
            </div>
            <p className="text-lg font-semibold text-gray-700">
              {uploading ? "Processing Images..." : "Click to Upload Media"}
            </p>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG, WebP supported • Auto-compressed</p>
          </label>
        </div>

        {loading ? (
          <div className="text-center py-20"><Loader2 className="animate-spin mx-auto mb-2" /> Loading...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <div key={img.name} className="bg-white rounded-xl shadow-sm border overflow-hidden group">
                <div className="relative aspect-square bg-gray-100">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleDelete(img)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-[10px] text-gray-400 truncate mb-2">{img.name}</p>
                  <button
                    onClick={() => copyToClipboard(img.url, img.name)}
                    className="w-full py-1.5 bg-gray-50 hover:bg-emerald-50 text-emerald-700 text-xs font-bold rounded flex items-center justify-center gap-1 transition"
                  >
                    {copiedId === img.name ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy URL</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}