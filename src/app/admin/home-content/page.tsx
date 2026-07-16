"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface ContentItem {
  id?: number;
  page: string;
  section: string;
  content: string;
}

const SECTIONS = [
  { key: "hero_title", label: "Hero Title (before highlight)" },
  { key: "hero_title_highlight", label: "Hero Title (highlighted word)" },
  { key: "hero_subtitle", label: "Hero Subtitle" },
  { key: "hero_description", label: "Hero Description" },
  { key: "benefits_title", label: "Benefits Section Title" },
];

export default function HomeContentPage() {
  const [contents, setContents] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .eq("page", "home");

    if (!error && data) {
      const map: Record<string, string> = {};
      data.forEach((item: ContentItem) => {
        map[item.section] = item.content;
      });
      setContents(map);
    }
    setLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    setContents((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const section of SECTIONS) {
        const content = contents[section.key];
        if (!content) continue;

        const { data: existing } = await supabase
          .from("site_content")
          .select("id")
          .eq("page", "home")
          .eq("section", section.key)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("site_content")
            .update({ content, updated_at: new Date().toISOString() })
            .eq("id", existing.id);
        } else {
          await supabase
            .from("site_content")
            .insert({ page: "home", section: section.key, content });
        }
      }
      toast.success("Home page content saved!");
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-green-700" size={48} />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 hover:bg-gray-200 rounded-full transition">
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Home Page Content</h1>
          <p className="text-gray-500 text-sm">Edit text content displayed on the home page</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.key}>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{section.label}</label>
            <textarea
              rows={3}
              value={contents[section.key] || ""}
              onChange={(e) => handleChange(section.key, e.target.value)}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-green-700 text-white py-3 rounded-xl font-bold hover:bg-green-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {saving ? "Saving..." : "Save Content"}
        </button>
      </div>
    </div>
  );
}
