"use client";

import { useState } from "react";
import { 
  Plus, 
  Wrench, 
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
  Filter,
  User,
  Building2
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
  studentName?: string | null;
  rollNo?: string | null;
  hostelName?: string | null;
  roomNo?: string | null;
  location?: string | null;
  assignedTo?: string | null;
  assignedContact?: string | null;
  resolutionOtp?: string | null;
  createdAt: string | Date;
}

const categoryIcons: Record<string, any> = {
  ELECTRICAL: Zap,
  PLUMBING: Droplet,
  WIFI: Wifi,
  CARPENTRY: Hammer,
  HOUSEKEEPING: Sparkles,
  FURNITURE: Hammer,
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

  // Form states with the required fields
  const [studentName, setStudentName] = useState("Vivek Yadav");
  const [rollNo, setRollNo] = useState("22051934");
  const [hostelName, setHostelName] = useState("King's Palace 7 (KP-7)");
  const [roomNo, setRoomNo] = useState("412");
  const [category, setCategory] = useState("ELECTRICAL");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resolveOtpInput, setResolveOtpInput] = useState("");
  const [resolveError, setResolveError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await submitComplaint({
      studentName,
      rollNo,
      hostelName,
      roomNo,
      title: title || `${category} Issue in Room ${roomNo}`,
      description: desc,
      category,
      priority,
      location: `${hostelName}, Room ${roomNo}`,
    });

    if (res.success && res.complaint) {
      const formatted = {
        ...res.complaint,
        desc: (res.complaint as any).description || desc,
        priority: priority || "MEDIUM",
      } as unknown as ComplaintItem;

      const newItems = [formatted, ...complaints];
      setComplaints(newItems);
      setSelectedTicket(formatted);
      setShowModal(false);
      setTitle("");
      setDesc("");
    }
    setIsSubmitting(false);
  };

  const handleResolveWithOtp = async (ticketId: string) => {
    setResolveError("");
    const res = await updateComplaintStatus(ticketId, "RESOLVED", resolveOtpInput);
    if (res.success) {
      setComplaints((prev) =>
        prev.map((c) => (c.id === ticketId ? { ...c, status: "RESOLVED" } : c))
      );
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: "RESOLVED" });
      }
      setResolveOtpInput("");
    } else {
      setResolveError(res.error || "Incorrect OTP");
    }
  };

  const filtered = filterCategory === "ALL" 
    ? complaints 
    : complaints.filter((c) => c.category === filterCategory);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Top Banner: Blue & White Palette */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Wrench className="size-5" />
            </div>
            <h2 className="text-xl font-extrabold text-blue-950">Student Complaints & Maintenance</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            File electrical, plumbing, Wi-Fi or room maintenance issues. Track real-time progress and verify completion via OTP.
          </p>
        </div>

        <Button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md shadow-blue-600/20 shrink-0"
        >
          <Plus className="size-4 mr-1.5" />
          File New Complaint
        </Button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-1">Filter:</span>
        {["ALL", "ELECTRICAL", "PLUMBING", "WIFI", "FURNITURE", "HOUSEKEEPING"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              filterCategory === cat
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content: Left List, Right Detailed Ticket */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Complaints List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700">
              Registered Issues ({filtered.length})
            </span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filtered.length === 0 ? (
              <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl">
                <p className="text-xs text-slate-500">No complaints registered in this category.</p>
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = selectedTicket?.id === item.id;
                const IconComp = categoryIcons[item.category] || Wrench;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedTicket(item)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? "bg-blue-50/80 border-blue-400 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                        {item.ticketId}
                      </span>
                      <Badge
                        className={`text-[10px] font-bold ${
                          item.status === "RESOLVED"
                            ? "bg-blue-100 text-blue-800 border-blue-300"
                            : item.status === "IN_PROGRESS"
                            ? "bg-indigo-100 text-indigo-800 border-indigo-300"
                            : "bg-amber-100 text-amber-800 border-amber-300"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{item.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{item.desc}</p>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <IconComp className="size-3 text-blue-600" />
                        {item.category}
                      </span>
                      <span>Room {item.roomNo || "412"}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Detailed Ticket View */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="border-b border-slate-100 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                        {selectedTicket.ticketId}
                      </span>
                      <Badge className="bg-slate-100 text-slate-700 border-slate-200 text-xs">
                        {selectedTicket.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900 mt-2">
                      {selectedTicket.title}
                    </CardTitle>
                  </div>

                  <Badge
                    className={`text-xs font-bold px-3 py-1 ${
                      selectedTicket.status === "RESOLVED"
                        ? "bg-blue-600 text-white"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}
                  >
                    {selectedTicket.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-5 space-y-5">
                {/* Student Registration Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Student</span>
                    <span className="font-bold text-slate-800">{selectedTicket.studentName || "Vivek Yadav"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Roll No</span>
                    <span className="font-mono font-bold text-slate-800">{selectedTicket.rollNo || "22051934"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Hostel</span>
                    <span className="font-bold text-slate-800">{selectedTicket.hostelName || "King's Palace 7"}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Room No</span>
                    <span className="font-bold text-slate-800">{selectedTicket.roomNo || "412"}</span>
                  </div>
                </div>

                {/* Complaint Description */}
                <div className="space-y-1.5 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wide block">
                    Detailed Complaint Description:
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedTicket.desc}
                  </p>
                </div>

                {/* Assigned Maintenance Technician Card */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest block">
                      Assigned Field Technician
                    </span>
                    <h5 className="text-sm font-bold text-slate-900">
                      {selectedTicket.assignedTo || "Ramesh Behera (KP-7 Maintenance Lead)"}
                    </h5>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5">
                      <Phone className="size-3 text-blue-600" />
                      <span>{selectedTicket.assignedContact || "+91 98612 34567"}</span>
                    </p>
                  </div>

                  {/* Closure Verification OTP Card */}
                  <div className="p-3 bg-white rounded-xl border border-blue-200 text-center shrink-0 shadow-xs">
                    <span className="text-[10px] text-slate-500 block flex items-center justify-center gap-1 font-semibold">
                      <KeyRound className="size-3 text-blue-600" />
                      Closure OTP:
                    </span>
                    <span className="text-base font-mono font-black text-blue-950 block tracking-widest">
                      {selectedTicket.resolutionOtp || "4829"}
                    </span>
                    <span className="text-[9px] text-slate-400">Share after work is completed</span>
                  </div>
                </div>

                {/* Verify & Close Ticket Form */}
                {selectedTicket.status !== "RESOLVED" && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-semibold text-slate-700 block">
                      Verify Completion with OTP:
                    </span>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={resolveOtpInput}
                        onChange={(e) => setResolveOtpInput(e.target.value)}
                        placeholder={`Enter OTP (${selectedTicket.resolutionOtp || "4829"})`}
                        className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono w-44 focus:ring-2 focus:ring-blue-600 outline-none"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleResolveWithOtp(selectedTicket.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 font-semibold"
                      >
                        Confirm Resolution
                      </Button>
                    </div>
                    {resolveError && (
                      <p className="text-xs text-red-600 font-medium">{resolveError}</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
              <p className="text-xs text-slate-500">Select a ticket from the left to view complete details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Raise Complaint with explicit Student fields */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Wrench className="size-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">File Student Complaint</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              {/* Requested Essential Fields: Student Name, Roll No, Hostel, Room No */}
              <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-2.5">
                <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wide block">
                  Student Verification Details:
                </span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Student Name</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Roll Number</label>
                    <input
                      type="text"
                      value={rollNo}
                      onChange={(e) => setRollNo(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Hostel Name</label>
                    <input
                      type="text"
                      value={hostelName}
                      onChange={(e) => setHostelName(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Room No</label>
                    <input
                      type="text"
                      value={roomNo}
                      onChange={(e) => setRoomNo(e.target.value)}
                      required
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Complaint Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  <option value="ELECTRICAL">Electrical (Fan, Lights, Switchboard, Geyser)</option>
                  <option value="PLUMBING">Plumbing (Water Tap, Washbasin, Flush)</option>
                  <option value="WIFI">Wi-Fi & Internet (Hostel LAN, Access Point)</option>
                  <option value="FURNITURE">Room Furniture (Bed Frame, Chair, Cupboard)</option>
                  <option value="HOUSEKEEPING">Housekeeping & Washroom Sanitation</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Complaint Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ceiling fan rotating slowly / Geyser not heating"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Detailed Complaint Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe the exact fault in detail..."
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none resize-none"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-5 rounded-lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit Complaint to Warden"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
