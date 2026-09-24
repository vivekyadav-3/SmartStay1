"use client";

import { useState } from "react";
import { 
  Plus, 
  MessageSquareWarning, 
  Zap, 
  Droplet, 
  Wifi, 
  Hammer, 
  Sparkles, 
  Bug, 
  CheckCircle2, 
  Clock, 
  Phone, 
  ShieldCheck,
  MapPin,
  KeyRound,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { submitComplaint, updateComplaintStatus } from "@/app/actions/complaints";

interface ComplaintItem {
  id: string;
  ticketId: string;
  title: string;
  desc: string;
  category: string;
  priority: string;
  status: string;
  location?: string | null;
  assignedTo?: string | null;
  assignedContact?: string | null;
  resolutionOtp?: string | null;
  createdAt: string | Date;
  user?: {
    name?: string | null;
    rollNo?: string | null;
    roomNo?: string | null;
    hostelName?: string | null;
  };
}

const categoryIcons: Record<string, any> = {
  ELECTRICAL: Zap,
  PLUMBING: Droplet,
  WIFI: Wifi,
  CARPENTRY: Hammer,
  HOUSEKEEPING: Sparkles,
  PEST: Bug,
};

export default function ComplaintsClient({ 
  complaints: initialComplaints, 
  role 
}: { 
  complaints: any[]; 
  role: string 
}) {
  const [complaints, setComplaints] = useState<ComplaintItem[]>(initialComplaints);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<ComplaintItem | null>(
    initialComplaints[0] || null
  );

  // Form states
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("ELECTRICAL");
  const [priority, setPriority] = useState("MEDIUM");
  const [location, setLocation] = useState("Room 412, Bed B");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolveOtpInput, setResolveOtpInput] = useState("");
  const [resolveError, setResolveError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await submitComplaint({
      title,
      desc,
      category,
      priority,
      location,
    });

    if (res.success && res.complaint) {
      const newItems = [res.complaint as any, ...complaints];
      setComplaints(newItems);
      setSelectedTicket(res.complaint as any);
      setShowModal(false);
      setTitle("");
      setDesc("");
    }
    setIsSubmitting(false);
  };

  const handleResolveWithOtp = async (ticketId: string) => {
    setResolveError("");
    const res = await updateComplaintStatus(ticketId, "RESOLVED", resolveOtpInput);
    if (res.error) {
      setResolveError(res.error);
    } else {
      setComplaints(complaints.map(c => c.id === ticketId ? { ...c, status: "RESOLVED" } : c));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: "RESOLVED" });
      }
      setResolveOtpInput("");
    }
  };

  const filtered = complaints.filter(c => filterCategory === "ALL" || c.category === filterCategory);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              KP-7 Maintenance Desk
            </Badge>
            <Badge variant="outline" className="text-xs">
              Turnaround SLA: 24 Hours
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Complaints & Maintenance
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track technician assignment, live status timeline, and closure OTP verification.
          </p>
        </div>

        <Button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg shadow-emerald-600/20 text-xs"
        >
          <Plus className="size-4" />
          <span>Raise New Complaint</span>
        </Button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {["ALL", "ELECTRICAL", "PLUMBING", "WIFI", "CARPENTRY", "HOUSEKEEPING"].map((cat) => (
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

      {/* Main Split: Ticket List (Left) + Detailed Ticket View (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Complaints List */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
            Your Maintenance Requests ({filtered.length})
          </span>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {filtered.length === 0 && (
              <div className="p-8 text-center bg-card/40 border border-dashed border-white/10 rounded-2xl">
                <MessageSquareWarning className="size-8 mx-auto text-muted-foreground opacity-30 mb-2" />
                <p className="text-xs text-muted-foreground">No complaints filed under this category.</p>
              </div>
            )}

            {filtered.map((item) => {
              const IconComp = categoryIcons[item.category] || Zap;
              const isSelected = selectedTicket?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedTicket(item)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-emerald-950/30 border-emerald-500/50 shadow-md"
                      : "bg-card/60 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      {item.ticketId}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        item.status === "RESOLVED"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : item.status === "IN_PROGRESS"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {item.status}
                    </Badge>
                  </div>

                  <h4 className="text-xs font-bold text-foreground line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">
                    {item.desc}
                  </p>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <IconComp className="size-3 text-emerald-400" />
                      <span>{item.category}</span>
                    </span>
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detailed Ticket View */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <Card className="bg-card/80 border-white/10 backdrop-blur-xl shadow-xl">
              <CardHeader className="border-b border-white/5 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {selectedTicket.ticketId}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          selectedTicket.priority === "HIGH" || selectedTicket.priority === "EMERGENCY"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                        }`}
                      >
                        Priority: {selectedTicket.priority}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold mt-2">
                      {selectedTicket.title}
                    </CardTitle>
                  </div>

                  <Badge
                    className={`text-xs font-semibold px-3 py-1 ${
                      selectedTicket.status === "RESOLVED"
                        ? "bg-emerald-600 text-white"
                        : "bg-amber-500 text-slate-950"
                    }`}
                  >
                    {selectedTicket.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-5 space-y-6">
                {/* 4-Step Interactive Status Timeline */}
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-3">
                    Resolution Status Timeline
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-300">
                      <CheckCircle2 className="size-4 mx-auto text-emerald-400 mb-1" />
                      <span className="font-semibold block text-[10px]">1. Reported</span>
                    </div>
                    <div className={`p-2 rounded-lg border ${
                      selectedTicket.status !== "PENDING"
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                        : "bg-black/30 border-white/5 text-muted-foreground"
                    }`}>
                      <CheckCircle2 className="size-4 mx-auto mb-1" />
                      <span className="font-semibold block text-[10px]">2. Assigned</span>
                    </div>
                    <div className={`p-2 rounded-lg border ${
                      selectedTicket.status === "IN_PROGRESS" || selectedTicket.status === "RESOLVED"
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
                        : "bg-black/30 border-white/5 text-muted-foreground"
                    }`}>
                      <Clock className="size-4 mx-auto mb-1" />
                      <span className="font-semibold block text-[10px]">3. In Progress</span>
                    </div>
                    <div className={`p-2 rounded-lg border ${
                      selectedTicket.status === "RESOLVED"
                        ? "bg-emerald-600 text-white border-emerald-500"
                        : "bg-black/30 border-white/5 text-muted-foreground"
                    }`}>
                      <ShieldCheck className="size-4 mx-auto mb-1" />
                      <span className="font-semibold block text-[10px]">4. Resolved</span>
                    </div>
                  </div>
                </div>

                {/* Complaint Description & Location */}
                <div className="space-y-3 bg-black/30 p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                      Issue Description
                    </span>
                    <p className="text-xs text-foreground leading-relaxed">
                      {selectedTicket.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t border-white/5">
                    <MapPin className="size-3.5 text-emerald-400" />
                    <span>Location: <strong className="text-foreground">{selectedTicket.location || "Room 412, KP-7"}</strong></span>
                  </div>
                </div>

                {/* Assigned Maintenance Technician Card */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/30 to-black/40 border border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                      Assigned Field Staff
                    </span>
                    <h5 className="text-sm font-bold text-foreground">
                      {selectedTicket.assignedTo || "KP-7 Maintenance Desk"}
                    </h5>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Phone className="size-3 text-emerald-400" />
                      <span>{selectedTicket.assignedContact || "+91 98612 34567"}</span>
                    </p>
                  </div>

                  {/* Closure Verification OTP Card */}
                  <div className="p-3 bg-black/60 rounded-xl border border-amber-500/30 text-center shrink-0">
                    <span className="text-[10px] text-muted-foreground block flex items-center justify-center gap-1">
                      <KeyRound className="size-3 text-amber-400" />
                      Closure OTP:
                    </span>
                    <span className="text-base font-mono font-bold text-amber-300 block tracking-widest">
                      {selectedTicket.resolutionOtp || "4829"}
                    </span>
                    <span className="text-[9px] text-muted-foreground">Share after work is done</span>
                  </div>
                </div>

                {/* Mark as Resolved verification */}
                {selectedTicket.status !== "RESOLVED" && (
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <span className="text-xs font-semibold text-muted-foreground block">
                      Verify & Close Ticket
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={resolveOtpInput}
                        onChange={(e) => setResolveOtpInput(e.target.value)}
                        placeholder={`Enter OTP (${selectedTicket.resolutionOtp || "4829"})`}
                        className="bg-black/60 border border-white/15 rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none focus:border-emerald-500 font-mono w-44"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleResolveWithOtp(selectedTicket.id)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8"
                      >
                        Confirm Resolution
                      </Button>
                    </div>
                    {resolveError && (
                      <p className="text-xs text-rose-400 font-medium">{resolveError}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="p-12 text-center bg-card/40 border border-white/10 rounded-2xl">
              <p className="text-xs text-muted-foreground">Select a ticket from the left to view complete details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Raise Complaint */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-card border border-white/15 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquareWarning className="size-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-foreground">File Maintenance Complaint</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                >
                  <option value="ELECTRICAL">Electrical (Fan, Geyser, Lights, Socket)</option>
                  <option value="PLUMBING">Plumbing (Water Tap, Flush, Shower Leak)</option>
                  <option value="WIFI">Wi-Fi & LAN (KIIT Internet, High Ping, Router)</option>
                  <option value="CARPENTRY">Carpentry (Bed Frame, Chair, Cupboard Lock)</option>
                  <option value="HOUSEKEEPING">Housekeeping & Washroom Cleaning</option>
                  <option value="PEST">Pest Control & Fumigation</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Issue Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Geyser tripping circuit breaker"
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Detailed Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe the exact symptom and when it started..."
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                  >
                    <option value="LOW">Low (Within 48h)</option>
                    <option value="MEDIUM">Medium (Within 24h)</option>
                    <option value="HIGH">High (Within 6h)</option>
                    <option value="EMERGENCY">Emergency (Immediate)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Room 412, Bed B"
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
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
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-9 px-5"
                >
                  {isSubmitting ? "Submitting..." : "Generate Ticket & OTP"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
