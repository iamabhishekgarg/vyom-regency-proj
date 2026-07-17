"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Save, Loader2, Sparkles, Heading, Layers, Eye, Info } from "lucide-react";
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
  { key: "pill_1", label: "Pill 1 Text (Registry Ready)" },
  { key: "pill_2", label: "Pill 2 Text (Clear Title)" },
  { key: "pill_3", label: "Pill 3 Text (Gravel Road)" },
  { key: "pill_4", label: "Pill 4 Text (water Connection)" },
  { key: "pill_5", label: "Pill 5 Text (Pollution Free zone)" },
  { key: "pill_6", label: "Pill 6 Text (Electricity)" },
  { key: "pill_7", label: "Pill 7 Text (Gated community)" },
  { key: "pill_8", label: "Pill 8 Text (24*7 Security)" },
  { key: "pill_9", label: "Pill 9 Text (Optional)" },
  { key: "pill_10", label: "Pill 10 Text (Optional)" },
];

const PILL_INFO = [
  { key: "pill_1", icon: "✅", defaultText: "Registry Ready", label: "Pill 1" },
  { key: "pill_2", icon: "🏛️", defaultText: "Clear Title", label: "Pill 2" },
  { key: "pill_3", icon: "🛣️", defaultText: "Gravel Road", label: "Pill 3" },
  { key: "pill_4", icon: "💧", defaultText: "water Connection", label: "Pill 4" },
  { key: "pill_5", icon: "🌬️", defaultText: "Pollution Free zone", label: "Pill 5" },
  { key: "pill_6", icon: "⚡️", defaultText: "Electricity", label: "Pill 6" },
  { key: "pill_7", icon: "🛡️", defaultText: "Gated community", label: "Pill 7" },
  { key: "pill_8", icon: "🔒", defaultText: "24*7 Security", label: "Pill 8" },
  { key: "pill_9", icon: null, defaultText: "", label: "Pill 9 (Optional, No Icon)" },
  { key: "pill_10", icon: null, defaultText: "", label: "Pill 10 (Optional, No Icon)" },
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
      const upsertData = SECTIONS.map((section) => ({
        page: "home",
        section: section.key,
        content: contents[section.key] || "",
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("site_content")
        .upsert(upsertData, { onConflict: "page,section" });

      if (error) throw error;

      toast.success("Home page content saved!");
    } catch (err) {
      console.error("Save failed:", err);
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition border shadow-sm bg-white">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Home Page Editor</h1>
          <p className="text-gray-500 text-sm">Customize text content and layout badges displayed on the main page</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Editor Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Hero Block */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4 bg-gray-50/50 flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <h2 className="font-bold text-gray-800">Hero Section</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Hero Title (Prefix)</label>
                  <input
                    type="text"
                    value={contents.hero_title || ""}
                    onChange={(e) => handleChange("hero_title", e.target.value)}
                    placeholder="e.g. Own Your Dream Farmhouse in the Heart of"
                    className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition text-sm bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Title Highlighted Word</label>
                  <input
                    type="text"
                    value={contents.hero_title_highlight || ""}
                    onChange={(e) => handleChange("hero_title_highlight", e.target.value)}
                    placeholder="e.g. Aravali Hills"
                    className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition text-sm bg-gray-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Hero Subtitle</label>
                <input
                  type="text"
                  value={contents.hero_subtitle || ""}
                  onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                  placeholder="e.g. 2 Hrs Drive from Delhi NCR in Khairthal, Alwar"
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition text-sm bg-gray-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Hero Description</label>
                <textarea
                  rows={2}
                  value={contents.hero_description || ""}
                  onChange={(e) => handleChange("hero_description", e.target.value)}
                  placeholder="Summarize key traits separated by pipes..."
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition text-sm bg-gray-50/50 resize-y"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Layout Titles */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4 bg-gray-50/50 flex items-center gap-2">
              <Heading size={18} className="text-green-600" />
              <h2 className="font-bold text-gray-800">Section Headings</h2>
            </div>
            <div className="p-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Benefits Section Title</label>
                <input
                  type="text"
                  value={contents.benefits_title || ""}
                  onChange={(e) => handleChange("benefits_title", e.target.value)}
                  placeholder="e.g. Why Choose Vyom Regency?"
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition text-sm bg-gray-50/50"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Trust Badges / Pills */}
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="border-b px-6 py-4 bg-gray-50/50 flex items-center gap-2">
              <Layers size={18} className="text-blue-500" />
              <h2 className="font-bold text-gray-800">Trust Badges / Pills (Max 10)</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                {PILL_INFO.map((pill) => (
                  <div key={pill.key} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        {pill.label}
                      </label>
                      {pill.icon ? (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-medium">
                          Icon: {pill.icon}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase">
                          No Icon
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      {pill.icon && (
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base select-none pointer-events-none">
                          {pill.icon}
                        </span>
                      )}
                      <input
                        type="text"
                        value={contents[pill.key] ?? ""}
                        onChange={(e) => handleChange(pill.key, e.target.value)}
                        placeholder={pill.defaultText || "Add text description..."}
                        className={`w-full py-2.5 pr-4 border rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-600 outline-none transition text-sm bg-gray-50/50 ${
                          pill.icon ? "pl-10" : "pl-4"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Sticky Sidebar with Live Preview & Save Actions */}
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-8">
          
          {/* Live Preview Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Eye size={16} className="text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live Header Preview</span>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">Real-time</span>
            </div>
            
            <div className="text-center py-4">
              <h1 className="text-lg md:text-xl font-bold font-serif leading-tight mb-2 text-white">
                {contents.hero_title || "Own Your Dream Farmhouse in the Heart of"}
                <span className="text-amber-400"> {contents.hero_title_highlight || "Aravali Hills"}</span>
              </h1>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mb-6">
                {contents.hero_subtitle || "2 Hrs Drive from Delhi NCR in Khairthal, Alwar"}
              </p>

              {/* Pills render list */}
              <div className="flex justify-center flex-wrap gap-2 max-w-md mx-auto">
                {PILL_INFO.map((pill) => {
                  const val = contents[pill.key] || pill.defaultText;
                  // If it's an optional pill (no icon) and has no configured value, don't show it
                  if (!pill.icon && !contents[pill.key]) return null;

                  return (
                    <div
                      key={pill.key}
                      className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/5 shadow-sm"
                    >
                      {pill.icon && <span className="text-xs">{pill.icon}</span>}
                      <span className="text-[10px] font-medium text-white/90">{val}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Quick Help Guide */}
          <div className="bg-amber-50/60 border border-amber-200/50 rounded-2xl p-5 text-amber-900">
            <div className="flex gap-2.5 items-start">
              <Info className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-bold text-sm mb-1 text-amber-950">Editor Guidelines</h4>
                <ul className="list-disc pl-4 space-y-1.5 text-xs text-amber-900/90 leading-relaxed">
                  <li><strong>Title highlighted word</strong> renders in warm gold styling.</li>
                  <li>First 8 pills show dynamic titles with their layout icons.</li>
                  <li>Pills 9 & 10 display conditionally only if you add text content, and won't show any icons.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Save Button Action */}
          <div className="bg-white rounded-2xl border shadow-sm p-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3.5 px-6 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {saving ? "Saving Changes..." : "Save All Changes"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
