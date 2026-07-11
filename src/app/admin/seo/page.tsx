"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Save, Search } from "lucide-react";
import { SEO_ROUTES, type PageSeo } from "@/lib/seo";

type SeoFormState = Record<string, { meta_title: string; meta_description: string; focus_keyword: string }>;

export default function AdminSeoPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [form, setForm] = useState<SeoFormState>({});

  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    const { data } = await supabase.from("page_seo").select("*");
    const rows = (data as PageSeo[]) || [];
    const next: SeoFormState = {};
    for (const r of SEO_ROUTES) {
      const existing = rows.find((row) => row.route === r.route);
      next[r.route] = {
        meta_title: existing?.meta_title || "",
        meta_description: existing?.meta_description || "",
        focus_keyword: existing?.focus_keyword || "",
      };
    }
    setForm(next);
    setLoading(false);
  };

  const updateField = (route: string, key: "meta_title" | "meta_description" | "focus_keyword", value: string) => {
    setForm((prev) => ({ ...prev, [route]: { ...prev[route], [key]: value } }));
  };

  const handleSave = async (route: string) => {
    setSaving(route);
    try {
      const { error } = await supabase
        .from("page_seo")
        .upsert({ route, ...form[route], updated_at: new Date().toISOString() }, { onConflict: "route" });
      if (error) throw error;
      toast.success("SEO saved");
    } catch {
      toast.error("Failed to save SEO");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="animate-spin text-green-700" size={32} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Search className="text-green-700" size={24} />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">SEO Settings</h1>
          <p className="text-sm text-gray-500">Edit meta title, description, and focus keyword for each page</p>
        </div>
      </div>

      <div className="space-y-6">
        {SEO_ROUTES.map((r) => (
          <div key={r.route} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-bold text-gray-800">{r.label}</h2>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
              <input
                type="text"
                maxLength={70}
                value={form[r.route]?.meta_title || ""}
                onChange={(e) => updateField(r.route, "meta_title", e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
              <textarea
                rows={2}
                maxLength={160}
                value={form[r.route]?.meta_description || ""}
                onChange={(e) => updateField(r.route, "meta_description", e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Focus Keyword</label>
              <input
                type="text"
                value={form[r.route]?.focus_keyword || ""}
                onChange={(e) => updateField(r.route, "focus_keyword", e.target.value)}
                className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => handleSave(r.route)}
              disabled={saving === r.route}
              className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-800 transition disabled:opacity-50"
            >
              {saving === r.route ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Save
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
