"use client";

import { useState, useTransition } from "react";
import { 
  WashingMachine as WashingIcon, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  KeyRound, 
  User, 
  Sparkles,
  ShieldCheck,
  Calendar,
  Lock,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { bookMachineSlot, updateMachineStatus, addWashingMachine } from "@/app/actions/washing-machine";

interface WashingMachineData {
  id: string;
  machineNumber: string;
  floor: string;
  status: string; // VACANT, OCCUPIED, MAINTENANCE
  currentStudent?: string | null;
  currentRollNo?: string | null;
  bookings?: any[];
}

export default function WashingMachineClient({
  initialMachines,
  userRole = "STUDENT",
}: {
  initialMachines: WashingMachineData[];
  userRole?: string;
}) {
  const [machines, setMachines] = useState<WashingMachineData[]>(initialMachines);
  const [isPending, startTransition] = useTransition();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedMachineId, setSelectedMachineId] = useState(
    initialMachines.find((m) => m.status === "VACANT")?.id || initialMachines[0]?.id || ""
  );

  // Student details
  const [studentName, setStudentName] = useState("Vivek Yadav");
  const [rollNo, setRollNo] = useState("22051934");
  const [slotTime, setSlotTime] = useState("Today, 04:00 PM – 05:00 PM (1 Hr Advance)");
  const [activeBooking, setActiveBooking] = useState<{
    machineName: string;
    slotTime: string;
    pin: string;
    studentName: string;
    rollNo: string;
  } | null>(null);

  // Warden controls: Add machine
  const [newMachineNo, setNewMachineNo] = useState("");
  const [newFloor, setNewFloor] = useState("Ground Floor Laundry Wing");
  const [showAddModal, setShowAddModal] = useState(false);

  const availableSlots = [
    "Today, 04:00 PM – 05:00 PM (1 Hr Advance)",
    "Today, 05:00 PM – 06:00 PM (2 Hr Advance)",
    "Today, 06:00 PM – 07:00 PM (3 Hr Advance)",
    "Today, 07:00 PM – 08:00 PM (Curfew Window)",
    "Tomorrow, 08:00 AM – 09:00 AM (Morning Slot)",
  ];

  const handleBook = () => {
    startTransition(async () => {
      const res = await bookMachineSlot({
        machineId: selectedMachineId,
        studentName,
        rollNo,
        slotTime,
      });

      if (res?.success && res.booking) {
        const targetMachine = machines.find((m) => m.id === selectedMachineId);
        setActiveBooking({
          machineName: targetMachine?.machineNumber || "WM-01",
          slotTime,
          pin: res.booking.accessPin,
          studentName,
          rollNo,
        });
        setShowBookingModal(false);
      }
    });
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    startTransition(async () => {
      const nextStatus = currentStatus === "VACANT" ? "OCCUPIED" : "VACANT";
      const res = await updateMachineStatus(
        id,
        nextStatus as any,
        nextStatus === "OCCUPIED" ? "Student in Progress" : undefined,
        nextStatus === "OCCUPIED" ? "2205xxxx" : undefined
      );

      if (res?.success) {
        setMachines((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: nextStatus } : m))
        );
      }
    });
  };

  const handleAddMachine = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await addWashingMachine(newMachineNo, newFloor);
      if (res?.success && res.machine) {
        setMachines([...machines, res.machine as any]);
        setShowAddModal(false);
        setNewMachineNo("");
      }
    });
  };

  const vacantCount = machines.filter((m) => m.status === "VACANT").length;
  const occupiedCount = machines.filter((m) => m.status === "OCCUPIED").length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <WashingIcon className="size-5" />
            </div>
            <h2 className="text-xl font-extrabold text-blue-950">Washing Machine Live Availability</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Check real-time laundry machine occupancy from your room. Pre-book your slot 1-hour early for exclusive access.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => setShowBookingModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 px-5 rounded-xl shadow-md shadow-blue-600/20"
          >
            Pre-Book 1-Hour Slot
          </Button>

          <Button
            onClick={() => setShowAddModal(true)}
            variant="outline"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 text-xs h-10 rounded-xl"
          >
            <Plus className="size-3.5 mr-1" />
            Add Machine
          </Button>
        </div>
      </div>

      {/* Live Availability Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Total Machines</span>
          <span className="text-2xl font-black text-slate-800">{machines.length} Units</span>
        </div>
        <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 shadow-xs">
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide block">Vacant (Available)</span>
          <span className="text-2xl font-black text-blue-900">{vacantCount} Ready</span>
        </div>
        <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 shadow-xs">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wide block">In Use (Occupied)</span>
          <span className="text-2xl font-black text-amber-900">{occupiedCount} Running</span>
        </div>
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Rule</span>
          <span className="text-xs font-bold text-slate-700 mt-1 block">Pre-book ≥ 1h early</span>
        </div>
      </div>

      {/* Active Booking Ticket Banner (if student booked) */}
      {activeBooking && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-blue-300" />
              <h3 className="font-extrabold text-base">Your Machine Slot is Reserved & Confirmed!</h3>
            </div>
            <Badge className="bg-blue-500 text-white text-xs font-bold font-mono">
              PIN: {activeBooking.pin}
            </Badge>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white/10 p-3 rounded-xl backdrop-blur-md">
            <div>
              <span className="text-[10px] text-blue-200 uppercase block font-semibold">Allocated Machine</span>
              <span className="font-bold text-white text-sm">{activeBooking.machineName}</span>
            </div>
            <div>
              <span className="text-[10px] text-blue-200 uppercase block font-semibold">Reserved Slot</span>
              <span className="font-bold text-white">{activeBooking.slotTime.split("(")[0]}</span>
            </div>
            <div>
              <span className="text-[10px] text-blue-200 uppercase block font-semibold">Student Name</span>
              <span className="font-bold text-white">{activeBooking.studentName}</span>
            </div>
            <div>
              <span className="text-[10px] text-blue-200 uppercase block font-semibold">Roll Number</span>
              <span className="font-mono font-bold text-white">{activeBooking.rollNo}</span>
            </div>
          </div>
          <p className="text-[11px] text-blue-200">
            🔒 Exclusive Access Guarantee: Only roll number <strong>{activeBooking.rollNo}</strong> is authorized to use {activeBooking.machineName} during this slot. Enter PIN <strong>{activeBooking.pin}</strong> on the laundry room terminal.
          </p>
        </div>
      )}

      {/* Live Washing Machine Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-sm text-slate-800">
            KP-7 Laundry Room Machines
          </h3>
          <span className="text-xs text-slate-500">
            Real-time status managed by Warden Desk
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {machines.map((machine) => {
            const isVacant = machine.status === "VACANT";
            const isOccupied = machine.status === "OCCUPIED";

            return (
              <Card
                key={machine.id}
                className={`bg-white border transition-all ${
                  isVacant
                    ? "border-blue-200 hover:border-blue-400 shadow-xs"
                    : isOccupied
                    ? "border-amber-200 shadow-xs"
                    : "border-slate-200 opacity-80"
                }`}
              >
                <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-extrabold text-slate-900">
                      {machine.machineNumber}
                    </CardTitle>
                    <p className="text-[11px] text-slate-500">{machine.floor}</p>
                  </div>
                  <Badge
                    className={`text-xs font-bold ${
                      isVacant
                        ? "bg-blue-100 text-blue-800 border-blue-300"
                        : isOccupied
                        ? "bg-amber-100 text-amber-800 border-amber-300"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {machine.status}
                  </Badge>
                </CardHeader>

                <CardContent className="pt-4 space-y-3 text-xs">
                  {isVacant ? (
                    <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-950 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-blue-800">
                        <CheckCircle2 className="size-4 text-blue-600" />
                        <span>Available for Wash</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Ready for immediate cycle or pre-booked reservation.
                      </p>
                    </div>
                  ) : isOccupied ? (
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-amber-950 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-800">
                        <Clock className="size-4 text-amber-600" />
                        <span>Currently in Use</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Student: {machine.currentStudent || "Resident Active"}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-100 text-slate-700 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <AlertTriangle className="size-4 text-slate-500" />
                        <span>Under Maintenance</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Technician service in progress.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(machine.id, machine.status)}
                      disabled={isPending}
                      className="text-[11px] text-blue-700 hover:text-blue-900 font-semibold hover:underline"
                    >
                      Warden: Set to {isVacant ? "Occupied" : "Vacant"}
                    </button>

                    {isVacant && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedMachineId(machine.id);
                          setShowBookingModal(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7 font-semibold px-3"
                      >
                        Book Slot
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <WashingIcon className="size-5 text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Pre-Book Washing Machine</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowBookingModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Select Machine</label>
                <select
                  value={selectedMachineId}
                  onChange={(e) => setSelectedMachineId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  {machines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.machineNumber} ({m.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Pre-Booking Slot (≥ 1 Hour Advance)</label>
                <select
                  value={slotTime}
                  onChange={(e) => setSlotTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                >
                  {availableSlots.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Student Name</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 space-y-1">
                <span className="font-bold block text-[11px]">Notice:</span>
                <p className="text-[11px] text-slate-600">
                  Only student with Roll <strong>{rollNo}</strong> will be allowed access to this machine during the allocated time.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowBookingModal(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBook}
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-5 rounded-lg"
                >
                  {isPending ? "Reserving..." : "Confirm & Generate Access PIN"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Machine Modal (Warden) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">Add Washing Machine Unit</h3>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMachine} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Machine Identifier</label>
                <input
                  type="text"
                  value={newMachineNo}
                  onChange={(e) => setNewMachineNo(e.target.value)}
                  placeholder="e.g. WM-07 (3rd Floor East Wing)"
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">Hostel Wing / Floor</label>
                <input
                  type="text"
                  value={newFloor}
                  onChange={(e) => setNewFloor(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowAddModal(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-5 rounded-lg"
                >
                  {isPending ? "Adding..." : "Add to Laundry Room"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
