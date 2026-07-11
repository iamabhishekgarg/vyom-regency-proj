import { Search } from "lucide-react";
import type { PropertyFormData } from "@/lib/propertyUtils";

interface SeoSectionProps {
  formData: PropertyFormData;
  updateField: <K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) => void;
}

export default function SeoSection({ formData, updateField }: SeoSectionProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Search size={16} className="text-blue-700" />
        <h3 className="font-bold text-gray-800 text-sm">SEO</h3>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">URL Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => updateField("slug", e.target.value)}
          placeholder="auto-generated from name if left blank"
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none font-mono text-sm"
        />
        <p className="text-xs text-gray-400 mt-1">
          Changing this on an existing property will change its live URL — update any shared links.
        </p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Title</label>
        <input
          type="text"
          value={formData.meta_title}
          onChange={(e) => updateField("meta_title", e.target.value)}
          placeholder={formData.name || "Falls back to property name"}
          maxLength={70}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">{formData.meta_title.length}/70 characters</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Meta Description</label>
        <textarea
          value={formData.meta_description}
          onChange={(e) => updateField("meta_description", e.target.value)}
          placeholder="Falls back to the property description"
          maxLength={160}
          rows={3}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none resize-none"
        />
        <p className="text-xs text-gray-400 mt-1">{formData.meta_description.length}/160 characters</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Focus Keyword</label>
        <input
          type="text"
          value={formData.focus_keyword}
          onChange={(e) => updateField("focus_keyword", e.target.value)}
          placeholder="e.g. farm land in Mundawar"
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
        />
      </div>
    </div>
  );
}
