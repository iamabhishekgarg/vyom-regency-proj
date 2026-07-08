"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Edit, Trash2, Upload, X, CheckCircle, Clock, Ban, Home } from "lucide-react";
import imageCompression from "browser-image-compression";

interface Property {
  id: string;
  name: string;
  slug: string;
  location: string;
  price: string;
  size: string;
  status: string;
  description: string;
  features: string[];
  image_url: string;
  created_at: string;
  display_type?: string;
  sort_order?: number;
  show_on_home?: boolean;
}

function generateSEOFilename(originalName: string, propertyName: string): string {
  const timestamp = Date.now();
  const cleanPropertyName = propertyName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30);
  return `property-${cleanPropertyName}-${timestamp}.webp`;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    size: "",
    status: "available",
    description: "",
    features: "",
    image_url: "",
    display_type: "single",
    sort_order: 0,
    show_on_home: false,
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("properties")
      .select("*")
      .order("sort_order", { ascending: true });
    setProperties(data || []);
    setLoading(false);
  };

  const handleOpenModal = (property?: Property) => {
    if (property) {
      setEditingProperty(property);
      setFormData({
        name: property.name,
        location: property.location,
        price: property.price,
        size: property.size,
        status: property.status,
        description: property.description || "",
        features: property.features?.join(", ") || "",
        image_url: property.image_url || "",
        display_type: property.display_type || "single",
        sort_order: property.sort_order || 0,
        show_on_home: property.show_on_home || false,
      });
    } else {
      setEditingProperty(null);
      setFormData({
        name: "",
        location: "",
        price: "",
        size: "",
        status: "available",
        description: "",
        features: "",
        image_url: "",
        display_type: "single",
        sort_order: 0,
        show_on_home: false,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProperty(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : (name === "sort_order" ? parseInt(value) || 0 : value);
    setFormData({ ...formData, [name]: val });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp',
      };
      const compressedFile = await imageCompression(file, options);
      const seoFileName = generateSEOFilename(file.name, formData.name || "property");
      const filePath = `properties/${seoFileName}`;

      const { error: uploadError } = await supabase.storage
        .from("properties")
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          contentType: 'image/webp'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("properties")
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const baseSlug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    
    const uniqueSlug = `${baseSlug}-${Date.now()}`;
    
    const propertyData = {
      name: formData.name,
      slug: uniqueSlug,
      location: formData.location,
      price: formData.price,
      size: formData.size,
      status: formData.status,
      description: formData.description,
      features: formData.features ? formData.features.split(",").map((f) => f.trim()).filter(f => f) : [],
      image_url: formData.image_url,
      display_type: formData.display_type,
      sort_order: formData.sort_order,
      show_on_home: formData.show_on_home,
    };
    
    try {
      if (editingProperty) {
        const { error } = await supabase
          .from("properties")
          .update(propertyData)
          .eq("id", editingProperty.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("properties")
          .insert([propertyData]);
        if (error) throw error;
      }
      fetchProperties();
      handleCloseModal();
    } catch (error: any) {
      console.error("Submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      const { error } = await supabase.from("properties").delete().eq("id", id);
      if (!error) fetchProperties();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-medium"><CheckCircle size={10} className="inline mr-1" /> Available</span>;
      case "limited":
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-[10px] font-medium"><Clock size={10} className="inline mr-1" /> Limited</span>;
      case "sold":
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-[10px] font-medium"><Ban size={10} className="inline mr-1" /> Sold Out</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-[10px]">{status}</span>;
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Properties</h1>
          <p className="text-gray-500 text-sm">Manage listings and home page display</p>
        </div>
        <button onClick={() => handleOpenModal()} className="bg-green-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-800 transition flex items-center gap-2">
          <Plus size={16} /> Add Property
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
              <div className="relative h-40 bg-gray-200">
                <img src={property.image_url || ""} alt={property.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">{getStatusBadge(property.status)}</div>
                {property.show_on_home && (
                  <div className="absolute top-2 left-2 bg-amber-500 text-white p-1.5 rounded-full shadow-lg" title="Showing on Home Page">
                    <Home size={14} />
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-800 truncate">{property.name}</h3>
                  <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase font-bold">
                    {property.display_type}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{property.location}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-green-700 font-bold text-sm">{property.price}</span>
                  <span className="text-gray-400 text-[10px]">Order: {property.sort_order}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(property)} className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-gray-200 transition">Edit</button>
                  <button onClick={() => handleDelete(property.id)} className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingProperty ? "Edit Property" : "Add Property"}</h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                  <input type="text" name="price" value={formData.price} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plot Size *</label>
                  <input type="text" name="size" value={formData.size} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg">
                    <option value="available">Available</option>
                    <option value="limited">Limited</option>
                    <option value="sold">Sold Out</option>
                  </select>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 space-y-4">
                <h3 className="font-bold text-amber-800 text-sm flex items-center gap-2">
                  <Home size={16} /> Home Page Display Settings
                </h3>
                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    name="show_on_home" 
                    id="show_on_home"
                    checked={formData.show_on_home} 
                    onChange={handleInputChange}
                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                  />
                  <label htmlFor="show_on_home" className="text-sm font-semibold text-gray-700">Show this land on Home Page</label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Display Type</label>
                    <select name="display_type" value={formData.display_type} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg text-sm">
                      <option value="single">Single (Full Width)</option>
                      <option value="double">Double (2 Columns)</option>
                      <option value="carousel">Carousel (Slider)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order (0 = First)</label>
                    <input type="number" name="sort_order" value={formData.sort_order} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={2} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma separated)</label>
                <input type="text" name="features" value={formData.features} onChange={handleInputChange} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="flex gap-3 items-center">
                  {formData.image_url && <img src={formData.image_url} className="w-16 h-16 object-cover rounded-lg" />}
                  <label className="flex-1 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4 text-center cursor-pointer hover:border-green-500 transition">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <Upload className="mx-auto mb-1 text-gray-400" size={20} />
                    <p className="text-[10px] text-gray-500">{uploading ? "Uploading..." : "Click to upload"}</p>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={submitting || uploading} className="flex-1 bg-green-700 text-white py-2.5 rounded-lg font-bold hover:bg-green-800 transition disabled:opacity-50">
                  {submitting ? "Saving..." : "Save Property"}
                </button>
                <button type="button" onClick={handleCloseModal} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}