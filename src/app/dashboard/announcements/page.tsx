"use client";

import { useState } from "react";
import { 
  Megaphone, 
  Search, 
  Calendar, 
  Building2, 
  AlertCircle, 
  Plus, 
  CheckCircle2, 
  ShieldCheck,
  Tag
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createNotice } from "@/app/actions/notices";

interface NoticeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  issuedBy: string;
  createdAt: string | Date;
}

const sampleNotices: NoticeItem[] = [
  {
    id: "not_1",
    title: "Kritansh Fest 2026: Extended Hostel Curfew to 10:00 PM",
    content: "All registered KIIT hostel residents participating in Kritansh Fest are granted curfew extension till 10:00 PM from Friday to Sunday. Carry your KIIT Student RFID ID card at gate checkpoints. Biometric attendance will remain active at KP-7 turnstiles.",
    category: "CURFEW",
    priority: "IMPORTANT",
    issuedBy: "Chief Warden, King's Palace Hostels",
    createdAt: new Date().toISOString(),
  },
  {
    id: "not_2",
    title: "Routine Electrical & Geyser Maintenance (KP-7 Floors 3 & 4)",
    content: "Maintenance engineering team will inspect individual water heaters, distribution boards, and emergency lights on Thursday between 10:00 AM and 01:00 PM. Kindly keep room doors accessible and report any loose sockets directly to the floor technician.",
    category: "MAINTENANCE",
    priority: "NORMAL",
    issuedBy: "Superintendent, KP-7",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "not_3",
    title: "Special Sunday Odia Feast Menu Approved by Mess Committee",
    content: "Following the recommendations of the 3rd-year student mess representatives, this Sunday will feature authentic Hyderabadi Dum Biryani and Odia sweets. Feedback forms are open in portal.",
    category: "MESS",
    priority: "NORMAL",
    issuedBy: "Mess Committee Chairperson, KIIT",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "not_4",
    title: "Mandatory Biometric Punch Before 08:30 PM In-Time Curfew",
    content: "Strict compliance is requested for nightly attendance. Students returning after 08:30 PM must hold a digital gate pass approved by the hostel warden to prevent disciplinary flags in the KIIT ERP system.",
    category: "CURFEW",
    priority: "URGENT",
    issuedBy: "Director, Student Affairs KIIT",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "not_5",
    title: "End-Semester Quiet Hours & Study Room Access (24x7)",
    content: "In view of upcoming 6th semester mid-term & practical lab evaluations, the air-conditioned reading halls on Ground Floor of KP-7 and KP-6 will remain open 24x7 with uninterrupted Wi-Fi.",
    category: "GENERAL",
    priority: "NORMAL",
    issuedBy: "Academic Cell, KIIT Hostels",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function AnnouncementsPage() {
  const [notices, setNotices] = useState<NoticeItem[]>(sampleNotices);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("GENERAL");
  const [newPriority, setNewPriority] = useState("NORMAL");
  const [newIssuedBy, setNewIssuedBy] = useState("Chief Warden Office, KP-7");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const matchesCat = filterCategory === "ALL" || n.category === filterCategory;
    const matchesQuery = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              Hostel Notice Board
            </Badge>
            <Badge variant="outline" className="text-xs">
              Academic Prototype • KIIT KP-7
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Hostel Announcements & Circulars
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Simulated notices & circulars from the Chief Warden, Hostel Superintendent, and Mess Committee.
          </p>
        </div>

        <Button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg shadow-emerald-600/20 text-xs"
        >
          <Plus className="size-4" />
          <span>Post Circular (Admin)</span>
        </Button>
      </div>

      {/* Controls: Category Filter Chips & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {["ALL", "URGENT", "CURFEW", "MESS", "MAINTENANCE", "GENERAL"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                filterCategory === cat
                  ? "bg-emerald-600 text-white border-emerald-500 shadow-sm"
                  : "bg-card/60 text-muted-foreground border-white/10 hover:border-emerald-500/30 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="size-3.5 absolute left-3 top-3 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars..."
            className="w-full bg-card/60 border border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="p-12 text-center bg-card/40 border border-dashed border-white/10 rounded-2xl">
            <Megaphone className="size-8 mx-auto text-muted-foreground opacity-30 mb-2" />
            <p className="text-xs text-muted-foreground">No circulars matching your search criteria.</p>
          </div>
        )}

        {filtered.map((item) => (
          <Card key={item.id} className="bg-card/70 border-white/10 backdrop-blur-md hover:border-emerald-500/30 transition-all">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant="outline"
                    className={`text-[10px] font-bold ${
                      item.priority === "URGENT" ? "bg-rose-500/10 text-rose-400 border-rose-500/30" :
                      item.priority === "IMPORTANT" ? "bg-amber-500/10 text-amber-400 border-amber-500/30" :
                      "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                    }`}
                  >
                    {item.priority}
                  </Badge>
                  <span className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-black/40 border border-white/5">
                    Category: {item.category}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                  <Calendar className="size-3" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>

              <CardTitle className="text-base font-bold text-foreground mt-2">
                {item.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.content}
              </p>

              <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <ShieldCheck className="size-4 shrink-0" />
                  <span>Authorized by: <strong>{item.issuedBy}</strong></span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  KIIT Student Affairs Ref #STU-{item.id.slice(-4).toUpperCase()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal: Post New Announcement */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-card border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Megaphone className="size-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-foreground">Issue New Hostel Circular</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Circular Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Extended Gate Hours for Kritansh Fest"
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Circular Details</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="State the official notification text and instructions..."
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                  >
                    <option value="CURFEW">Curfew & Gate Timings</option>
                    <option value="MESS">Mess & Dining Menu</option>
                    <option value="MAINTENANCE">Maintenance & Electricity</option>
                    <option value="GENERAL">General Notice</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                  >
                    <option value="NORMAL">Normal Notice</option>
                    <option value="IMPORTANT">Important</option>
                    <option value="URGENT">Urgent Action Required</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Issued By (Authority)</label>
                <input
                  type="text"
                  value={newIssuedBy}
                  onChange={(e) => setNewIssuedBy(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                />
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
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 px-5"
                >
                  {isSubmitting ? "Publishing..." : "Publish Circular"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
