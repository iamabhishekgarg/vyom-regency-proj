"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, today: 0 });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
    if (data) {
      setLeads(data);
      const today = new Date().toDateString();
      setStats({
        total: data.length,
        today: data.filter((l) => new Date(l.created_at).toDateString() === today).length,
      });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500 text-sm">Total Leads</p>
          <p className="text-3xl font-bold text-green-700">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6">
          <p className="text-gray-500 text-sm">New Today</p>
          <p className="text-3xl font-bold text-amber-600">{stats.today}</p>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Phone</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Source</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Project</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead: any) => (
                <tr key={lead.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm">{new Date(lead.created_at).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-sm font-medium">{lead.name}</td>
                  <td className="py-3 px-4 text-sm">{lead.phone}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      lead.source === "exit-popup" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                    }`}>
                      {lead.source === "exit-popup" ? "Exit Popup" : lead.source || "Website"}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm">{lead.project || "General"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
