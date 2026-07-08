"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface SiteSettings {
  id?: number;
  site_title: string;
  site_description: string;
  contact_phone: string;
  contact_email: string;
  address: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    site_title: "",
    site_description: "",
    contact_phone: "",
    contact_email: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .single();

      if (error && error.code !== "PGRST116") { // PGRST116 = no rows found
        throw error;
      }

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Upsert settings (update if exists, insert if not)
      const { error } = await supabase
        .from("settings")
        .upsert([settings], { onConflict: "id" });

      if (error) throw error;

      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-green-700" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Site Settings</h1>
          <p className="text-gray-500 text-sm">Manage your website configuration</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Site Title</label>
          <input
            type="text"
            name="site_title"
            value={settings.site_title}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
            placeholder="Vyom Regency Pvt Ltd"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Site Description</label>
          <textarea
            name="site_description"
            value={settings.site_description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
            placeholder="Premium agriculture land for farmhouse living..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Phone</label>
            <input
              type="tel"
              name="contact_phone"
              value={settings.contact_phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              placeholder="+91 89553 11031"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Email</label>
            <input
              type="email"
              name="contact_email"
              value={settings.contact_email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
              placeholder="info@vyomregency.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
          <textarea
            name="address"
            value={settings.address}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
            placeholder="Kishangarh Bas, Khairthal-Tijara, Rajasthan"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}