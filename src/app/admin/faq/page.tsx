"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, GripVertical, Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface FAQItem {
  id?: number;
  question: string;
  answer: string;
  sort_order: number;
}

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error) {
      setFaqs(data || []);
    } else {
      console.error("Error fetching FAQs:", error);
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setFaqs([...faqs, { question: "", answer: "", sort_order: faqs.length }]);
  };

  const handleRemove = (index: number) => {
    const updated = faqs.filter((_, i) => i !== index);
    setFaqs(updated.map((f, i) => ({ ...f, sort_order: i })));
  };

  const handleChange = (index: number, field: "question" | "answer", value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...faqs];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setFaqs(updated.map((f, i) => ({ ...f, sort_order: i })));
  };

  const handleMoveDown = (index: number) => {
    if (index === faqs.length - 1) return;
    const updated = [...faqs];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setFaqs(updated.map((f, i) => ({ ...f, sort_order: i })));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await supabase.from("faqs").delete().neq("id", 0);

      const { error } = await supabase.from("faqs").insert(
        faqs.map((f, i) => ({
          question: f.question,
          answer: f.answer,
          sort_order: i,
        }))
      );

      if (error) {
        toast.error("Save failed: " + error.message);
      } else {
        toast.success("FAQs saved successfully");
        fetchFaqs();
      }
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

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
          <Link href="/admin" className="text-green-700 hover:text-green-800 inline-block mb-2">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">FAQ Management</h1>
          <p className="text-sm text-gray-500">Add, edit, remove, and reorder FAQs</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleAdd} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition flex items-center gap-2">
            <Plus size={18} /> Add FAQ
          </button>
          <button onClick={handleSaveAll} disabled={saving} className="bg-amber-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-amber-400 transition flex items-center gap-2 disabled:opacity-50">
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save All
          </button>
        </div>
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500 mb-4">No FAQs yet. Click "Add FAQ" to get started.</p>
          <button onClick={handleAdd} className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition">
            + Add Your First FAQ
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 mt-2">
                  <button onClick={() => handleMoveUp(index)} className="text-gray-400 hover:text-gray-600" disabled={index === 0}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                  </button>
                  <span className="text-xs text-gray-400 text-center">{index + 1}</span>
                  <button onClick={() => handleMoveDown(index)} className="text-gray-400 hover:text-gray-600" disabled={index === faqs.length - 1}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                </div>
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => handleChange(index, "question", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 font-semibold"
                  />
                  <textarea
                    placeholder="Answer"
                    rows={3}
                    value={faq.answer}
                    onChange={(e) => handleChange(index, "answer", e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button onClick={() => handleRemove(index)} className="text-red-500 hover:text-red-700 mt-2">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {faqs.length > 0 && (
        <div className="mt-6 text-center">
          <button onClick={handleAdd} className="text-green-700 font-semibold hover:text-green-800 border-2 border-dashed border-green-300 rounded-xl px-6 py-3 w-full hover:bg-green-50 transition">
            + Add Another FAQ
          </button>
        </div>
      )}
    </div>
  );
}
