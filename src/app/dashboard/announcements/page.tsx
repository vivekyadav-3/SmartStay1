"use client";

import { useState, useEffect } from "react";
import { 
  Megaphone, 
  Search, 
  Calendar, 
  Building2, 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  ShieldCheck,
  UtensilsCrossed,
  Trophy,
  Wrench,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createNotice, getNotices } from "@/app/actions/notices";

interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  issuedBy: string;
  createdAt: string | Date;
}

export default function DigitalNoticeBoardPage() {
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("SPECIAL_MESS_MENU");
  const [newPriority, setNewPriority] = useState("IMPORTANT");
  const [newIssuedBy, setNewIssuedBy] = useState("Chief Warden Office, KP-7");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      const items = await getNotices();
      setNotices(items as any);
    }
    load();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await createNotice({
      title: newTitle,
      content: newContent,
      category: newCategory,
      priority: newPriority,
      issuedBy: newIssuedBy,
    });

    if (res.success && res.notice) {
      setNotices([res.notice as any, ...notices]);
      setShowModal(false);
      setNewTitle("");
      setNewContent("");
    }
    setIsSubmitting(false);
  };

  const filtered = notices.filter((n) => {
    const matchesFilter = filterCategory === "ALL" || n.category === filterCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header Banner: Clean Blue & White */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Megaphone className="size-5" />
            </div>
            <h2 className="text-xl font-extrabold text-blue-950">Hostel Digital Notice Board</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time hostel broadcasts: Special Mess Menus, Sports & Cultural Events, Maintenance circulars. No more walking down to reception!
          </p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md shadow-blue-600/20 shrink-0"
        >
          <Plus className="size-4 mr-1.5" />
          Post Official Notice
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: "ALL", label: "All Notices" },
            { id: "SPECIAL_MESS_MENU", label: "Special Menus 🍽️" },
            { id: "HOSTEL_EVENT", label: "Events & Sports 🏆" },
            { id: "MAINTENANCE", label: "Maintenance 🛠️" },
            { id: "GENERAL", label: "General & Curfew 📜" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterCategory === cat.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
            <Megaphone className="size-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs text-slate-500">No circulars found matching your selection.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <Card key={item.id} className="bg-white border-slate-200 shadow-sm hover:border-blue-300 transition-all">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge 
                      className={`text-[10px] font-bold ${
                        item.priority === "URGENT" 
                          ? "bg-red-100 text-red-800 border border-red-300" 
                          : item.priority === "IMPORTANT" 
                          ? "bg-amber-100 text-amber-800 border border-amber-300" 
                          : "bg-blue-100 text-blue-800 border border-blue-200"
                      }`}
                    >
                      {item.priority}
                    </Badge>
                    <span className="text-[11px] font-semibold text-blue-900 px-2 py-0.5 rounded bg-blue-50 border border-blue-200">
                      {item.category.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="size-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <CardTitle className="text-base font-bold text-slate-900 mt-2">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.content}
                </p>

                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-blue-800 font-semibold">
                    <ShieldCheck className="size-4 shrink-0 text-blue-600" />
                    <span>Issued by: <strong>{item.issuedBy}</strong></span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Official KIIT KP-7 Circular #{item.id.slice(-4).toUpperCase()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal: Post New Announcement */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="size-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Post Notice to Digital Board</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Notice Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="SPECIAL_MESS_MENU">Special Mess Menu (Festive Food, Sunday Special)</option>
                  <option value="HOSTEL_EVENT">Hostel Event (Cricket, Cultural Fest, Tech Meet)</option>
                  <option value="MAINTENANCE">Maintenance (Water, Wi-Fi, Electrical Outage)</option>
                  <option value="GENERAL">General Notice / Curfew Guidelines</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Notice Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Special Biryani Feast this Sunday Lunch"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Detailed Notice Content</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Type the full announcement details so all students can see..."
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="NORMAL">Normal</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="URGENT">Urgent (Red Alert)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Issued By</label>
                  <input
                    type="text"
                    value={newIssuedBy}
                    onChange={(e) => setNewIssuedBy(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowModal(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-5 rounded-lg"
                >
                  {isSubmitting ? "Publishing..." : "Broadcast Notice"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
