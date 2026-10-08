"use client";

import { useState, useEffect, useTransition } from "react";
import { 
  ShieldAlert, 
  BookOpen, 
  Wrench, 
  WashingMachine as WashingIcon, 
  Megaphone, 
  Check, 
  X, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Calendar, 
  Siren,
  Clock,
  Plus,
  Send,
  UserCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPendingGatePasses, approveGatePass, rejectGatePass } from "@/app/actions/gate-pass";
import { getMedicalAlerts, updateMedicalAlertStatus } from "@/app/actions/medical";
import { getWashingMachines, updateMachineStatus, addWashingMachine } from "@/app/actions/washing-machine";
import { getComplaints, updateComplaintStatus } from "@/app/actions/complaints";
import { createNotice } from "@/app/actions/notices";

interface PendingPass {
  id: string;
  passCode?: string;
  destination: string;
  purpose: string;
  departureTime?: string | Date;
  returnTime?: string | Date;
  status: string;
  user?: {
    name?: string | null;
    studentProfile?: {
      rollNo?: string | null;
      roomNo?: string | null;
      hostel?: { name?: string | null } | null;
    } | null;
  };
}

export default function WardenControlRoomPage() {
  const [activeTab, setActiveTab] = useState<"PASSES" | "EMERGENCY" | "MACHINES" | "COMPLAINTS" | "NOTICES">("PASSES");
  const [isPending, startTransition] = useTransition();

  // Data states
  const [pendingPasses, setPendingPasses] = useState<PendingPass[]>([]);
  const [medicalAlerts, setMedicalAlerts] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);

  // Notice form states
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  const [noticeCategory, setNoticeCategory] = useState("SPECIAL_MESS_MENU");
  const [noticeSuccess, setNoticeSuccess] = useState(false);

  // Add Machine states
  const [newMachineNo, setNewMachineNo] = useState("");
  const [newFloor, setNewFloor] = useState("Ground Floor Laundry Wing");

  // Load all warden datasets
  const loadData = async () => {
    try {
      const passes = await getPendingGatePasses();
      setPendingPasses(passes as any);

      const alerts = await getMedicalAlerts();
      setMedicalAlerts(alerts);

      const wm = await getWashingMachines();
      setMachines(wm);

      const cm = await getComplaints();
      setComplaints(cm);
    } catch (err) {
      console.error("Warden data load error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Library pass actions
  const handleApprovePass = (passId: string) => {
    startTransition(async () => {
      const res = await approveGatePass(passId);
      if (res.success) {
        setPendingPasses((prev) => prev.filter((p) => p.id !== passId));
      }
    });
  };

  const handleRejectPass = (passId: string) => {
    startTransition(async () => {
      const res = await rejectGatePass(passId, "Exceeds standard curfew hours or invalid destination");
      if (res.success) {
        setPendingPasses((prev) => prev.filter((p) => p.id !== passId));
      }
    });
  };

  // Emergency alert action
  const handleDispatchAmbulance = (alertId: string) => {
    startTransition(async () => {
      const res = await updateMedicalAlertStatus(alertId, "DISPATCHED", "Ambulance dispatched to KP-7 gate by Warden.");
      if (res.success) {
        setMedicalAlerts((prev) =>
          prev.map((a) => (a.id === alertId ? { ...a, status: "DISPATCHED" } : a))
        );
      }
    });
  };

  // Machine status toggle
  const handleToggleMachine = (id: string, currentStatus: string) => {
    startTransition(async () => {
      const next = currentStatus === "VACANT" ? "OCCUPIED" : "VACANT";
      const res = await updateMachineStatus(id, next as any);
      if (res.success) {
        setMachines((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: next } : m))
        );
      }
    });
  };

  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMachineNo.trim()) return;
    startTransition(async () => {
      const res = await addWashingMachine(newMachineNo, newFloor);
      if (res.success && res.machine) {
        setMachines([...machines, res.machine]);
        setNewMachineNo("");
      }
    });
  };

  // Complaint resolution
  const handleUpdateComplaint = (id: string, newStatus: string) => {
    startTransition(async () => {
      const res = await updateComplaintStatus(id, newStatus, "BYPASS_WARDEN");
      if (res.success) {
        setComplaints((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
      }
    });
  };

  // Post Notice
  const handlePostNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setNoticeSuccess(false);
    const res = await createNotice({
      title: noticeTitle,
      content: noticeContent,
      category: noticeCategory,
      priority: "IMPORTANT",
      issuedBy: "Chief Warden Prof. S. K. Mohapatra (KP-7)",
    });

    if (res.success) {
      setNoticeSuccess(true);
      setNoticeTitle("");
      setNoticeContent("");
    }
  };

  const activeEmergencies = medicalAlerts.filter((a) => a.status !== "ATTENDED");

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header Banner: Clean Blue & White */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="size-10 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold">
              <ShieldAlert className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-blue-950">Warden Control Room</h2>
              <p className="text-xs text-slate-500 font-medium">
                Chief Warden: Prof. S. K. Mohapatra · King's Palace 7 (Campus 12)
              </p>
            </div>
          </div>
        </div>

        {/* Quick Counts */}
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs px-2.5 py-1">
            {pendingPasses.length} Passes Pending
          </Badge>
          {activeEmergencies.length > 0 && (
            <Badge className="bg-red-600 text-white text-xs px-2.5 py-1 animate-pulse flex items-center gap-1">
              <Siren className="size-3" />
              {activeEmergencies.length} Medical SOS!
            </Badge>
          )}
        </div>
      </div>

      {/* Emergency SOS Banner (If any active alerts) */}
      {activeEmergencies.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-600 text-white shadow-lg space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Siren className="size-6 text-white animate-bounce" />
              <h3 className="font-extrabold text-base">URGENT: Student Medical Emergency Dispatched!</h3>
            </div>
            <span className="text-xs font-bold uppercase bg-white text-red-700 px-2.5 py-0.5 rounded-full">
              Live Alarm
            </span>
          </div>

          <div className="space-y-2">
            {activeEmergencies.map((alert) => (
              <div key={alert.id} className="p-3 bg-white/10 rounded-xl backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-sm block">
                    {alert.studentName} (Roll: {alert.rollNo})
                  </span>
                  <p className="text-red-100 mt-0.5">
                    <strong>Location:</strong> {alert.hostelName}, Room {alert.roomNo} • <strong>Symptoms:</strong> {alert.symptoms}
                  </p>
                  <p className="text-[11px] text-red-200 mt-0.5">
                    Phone: {alert.phone || "+91 98765 43210"}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {alert.status === "DISPATCHED" ? (
                    <span className="bg-white/20 px-3 py-1.5 rounded-lg font-bold text-white">
                      ✓ Ambulance Dispatched
                    </span>
                  ) : (
                    <Button
                      onClick={() => handleDispatchAmbulance(alert.id)}
                      disabled={isPending}
                      className="bg-white text-red-700 hover:bg-red-50 font-extrabold text-xs h-9 px-4 rounded-xl shadow-md"
                    >
                      Dispatch Ambulance to Gate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: "PASSES", label: "Library Pass Approvals", icon: BookOpen, count: pendingPasses.length },
          { id: "MACHINES", label: "Washing Machines", icon: WashingIcon, count: machines.length },
          { id: "COMPLAINTS", label: "Student Complaints", icon: Wrench, count: complaints.filter(c => c.status !== "RESOLVED").length },
          { id: "NOTICES", label: "Post Notice", icon: Megaphone },
          { id: "EMERGENCY", label: "Medical SOS Log", icon: Siren, count: medicalAlerts.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="size-4" />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? "bg-white text-blue-900" : "bg-blue-100 text-blue-800"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: LIBRARY PASS APPROVALS */}
      {activeTab === "PASSES" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-sm text-slate-800">
              Pending Library Passes for Central Library Study (Curfew: 08:30 PM)
            </h3>
            <span className="text-xs text-slate-500">1-Click Approve / Reject</span>
          </div>

          {pendingPasses.length === 0 ? (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-2">
              <CheckCircle2 className="size-10 text-blue-600 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">All Library Passes Processed!</h4>
              <p className="text-xs text-slate-500">No student library passes pending review at this moment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingPasses.map((pass) => (
                <Card key={pass.id} className="bg-white border-slate-200 shadow-sm">
                  <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {pass.passCode || "LIB-2026-4821"}
                        </span>
                        <span className="font-extrabold text-sm text-slate-900">
                          {pass.user?.name || "Vivek Yadav"}
                        </span>
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-[10px]">
                          PENDING
                        </Badge>
                      </div>

                      <p className="text-slate-600">
                        Roll: <strong>{pass.user?.studentProfile?.rollNo || "22051934"}</strong> · Room: <strong>{pass.user?.studentProfile?.roomNo || "412"}</strong> · KP-7
                      </p>

                      <p className="text-slate-500">
                        Destination: <strong className="text-slate-800">{pass.destination}</strong> · Purpose: {pass.purpose}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleApprovePass(pass.id)}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8 px-4 rounded-lg"
                      >
                        <Check className="size-3.5 mr-1" />
                        Approve Pass
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectPass(pass.id)}
                        disabled={isPending}
                        className="border-slate-300 text-slate-700 hover:bg-slate-100 text-xs h-8 px-3 rounded-lg"
                      >
                        <X className="size-3.5 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WASHING MACHINE CONTROLS */}
      {activeTab === "MACHINES" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Laundry Room Machine Status Manager</h3>
              <p className="text-xs text-slate-500">
                Toggle machines between Vacant and Occupied so students can see live availability before walking down.
              </p>
            </div>

            {/* Quick Add Machine form */}
            <form onSubmit={handleAddMachine} className="flex items-center gap-2 text-xs">
              <input
                type="text"
                placeholder="New Machine ID (e.g. WM-07)"
                value={newMachineNo}
                onChange={(e) => setNewMachineNo(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-slate-50 text-slate-900 outline-none w-44"
              />
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3">
                <Plus className="size-3 mr-1" /> Add
              </Button>
            </form>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {machines.map((m) => {
              const isVacant = m.status === "VACANT";
              return (
                <Card key={m.id} className="bg-white border-slate-200 shadow-xs">
                  <CardContent className="p-4 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block text-sm">{m.machineNumber}</span>
                      <span className="text-[11px] text-slate-500">{m.floor}</span>
                      <Badge className={`mt-1 text-[10px] ${
                        isVacant ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {m.status}
                      </Badge>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleToggleMachine(m.id, m.status)}
                      disabled={isPending}
                      variant="outline"
                      className={`text-xs h-8 font-semibold ${
                        isVacant 
                          ? "border-amber-300 text-amber-800 hover:bg-amber-50"
                          : "border-blue-300 text-blue-800 hover:bg-blue-50"
                      }`}
                    >
                      Set to {isVacant ? "Occupied" : "Vacant"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT COMPLAINTS RESOLUTION */}
      {activeTab === "COMPLAINTS" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-sm text-slate-800">
              Student Complaints (Showing Hostel, Room, Name, Roll No)
            </h3>
            <span className="text-xs text-slate-500">1-Click Status Update</span>
          </div>

          <div className="space-y-3">
            {complaints.map((c) => (
              <Card key={c.id} className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {c.ticketId}
                      </span>
                      <span className="font-extrabold text-sm text-slate-900">{c.title}</span>
                      <Badge className="text-[10px] bg-slate-100 text-slate-700">{c.category}</Badge>
                      <Badge className={`text-[10px] ${
                        c.status === "RESOLVED" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {c.status}
                      </Badge>
                    </div>

                    {/* Requested details: Hostel, Room, Name, Roll No */}
                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 block font-semibold uppercase text-[9px]">Student</span>
                        <strong className="text-slate-800">{c.studentName || c.user?.name || "Vivek Yadav"}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold uppercase text-[9px]">Roll No</span>
                        <strong className="text-slate-800">{c.rollNo || c.user?.studentProfile?.rollNo || "22051934"}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold uppercase text-[9px]">Hostel</span>
                        <strong className="text-slate-800">{c.hostelName || "King's Palace 7"}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-semibold uppercase text-[9px]">Room</span>
                        <strong className="text-slate-800">{c.roomNo || "412"}</strong>
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs mt-1">
                      {c.description || c.desc}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {c.status !== "IN_PROGRESS" && c.status !== "RESOLVED" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateComplaint(c.id, "IN_PROGRESS")}
                        disabled={isPending}
                        variant="outline"
                        className="border-slate-300 text-slate-700 text-xs h-8"
                      >
                        Mark In Progress
                      </Button>
                    )}
                    {c.status !== "RESOLVED" && (
                      <Button
                        size="sm"
                        onClick={() => handleUpdateComplaint(c.id, "RESOLVED")}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8 px-3"
                      >
                        <Check className="size-3.5 mr-1" />
                        Resolve
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: POST DIGITAL NOTICE */}
      {activeTab === "NOTICES" && (
        <Card className="bg-white border-slate-200 shadow-sm max-w-2xl">
          <CardHeader className="border-b border-slate-100 pb-3">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Megaphone className="size-4 text-blue-600" />
              Post Official Notice to Digital Notice Board
            </CardTitle>
            <p className="text-xs text-slate-500">
              Students view this instantly on their dashboard without walking down to the reception.
            </p>
          </CardHeader>

          <CardContent className="pt-4">
            <form onSubmit={handlePostNotice} className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Notice Category</label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="SPECIAL_MESS_MENU">Special Mess Menu (Sunday Special, Biryani, Festive Feast)</option>
                  <option value="HOSTEL_EVENT">Hostel Event (Cricket Tournament, Movie Night, Fest)</option>
                  <option value="MAINTENANCE">Maintenance Alert (Wi-Fi, Water, Power)</option>
                  <option value="GENERAL">General Circular & Curfew</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Notice Title</label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Special Sunday Biryani & Ice Cream Feast"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Notice Body / Details</label>
                <textarea
                  rows={4}
                  value={noticeContent}
                  onChange={(e) => setNoticeContent(e.target.value)}
                  placeholder="Type the full announcement for students..."
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                />
              </div>

              {noticeSuccess && (
                <div className="p-3 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-blue-600" />
                  <span>Notice broadcast successfully to student dashboards!</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 rounded-lg"
              >
                <Send className="size-3.5 mr-1.5" />
                Broadcast Notice Now
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* TAB 5: MEDICAL SOS LOG */}
      {activeTab === "EMERGENCY" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-sm text-slate-800">
              Medical Emergency & Ambulance Dispatches
            </h3>
            <span className="text-xs text-slate-500">24x7 KIMS & Dispensary Support</span>
          </div>

          <div className="space-y-3">
            {medicalAlerts.map((a) => (
              <Card key={a.id} className="bg-white border-slate-200 shadow-sm">
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{a.studentName}</span>
                      <span className="font-mono text-slate-500">Roll: {a.rollNo}</span>
                      <Badge className={`text-[10px] ${
                        a.status === "ALERT_SENT" ? "bg-red-600 text-white animate-pulse" : "bg-blue-100 text-blue-800"
                      }`}>
                        {a.status}
                      </Badge>
                    </div>

                    <p className="text-slate-600">
                      <strong>Room:</strong> {a.hostelName}, Room {a.roomNo} · <strong>Phone:</strong> {a.phone || "+91 98765 43210"}
                    </p>

                    <p className="text-slate-500">
                      <strong>Symptoms:</strong> {a.symptoms}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {a.status === "ALERT_SENT" && (
                      <Button
                        size="sm"
                        onClick={() => handleDispatchAmbulance(a.id)}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs h-8 px-3 font-bold"
                      >
                        Dispatch Ambulance
                      </Button>
                    )}
                    {a.status === "DISPATCHED" && (
                      <Button
                        size="sm"
                        onClick={() => {
                          startTransition(async () => {
                            await updateMedicalAlertStatus(a.id, "ATTENDED", "Patient attended by dispensary team.");
                            setMedicalAlerts((prev) =>
                              prev.map((item) => (item.id === a.id ? { ...item, status: "ATTENDED" } : item))
                            );
                          });
                        }}
                        disabled={isPending}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3 font-semibold"
                      >
                        Mark Attended / Resolved
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
