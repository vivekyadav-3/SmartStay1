"use client";

import { useState } from "react";
import { 
  CalendarClock, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Shirt, 
  KeyRound, 
  Building2, 
  AlertCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bookLaundry } from "@/app/actions/laundry";

interface Booking {
  id: string;
  tokenNumber: string;
  date: string | Date;
  slot: string;
  itemCount: number;
  clothesDetails?: string | null;
  status: string;
  pickupOtp: string;
  createdAt: string | Date;
}

export default function LaundryClient({ bookings: initialBookings }: { bookings: any[] }) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [dateStr, setDateStr] = useState(new Date().toISOString().split("T")[0]);
  const [slot, setSlot] = useState("09:00 AM - 11:00 AM (Slot 1)");
  const [itemCount, setItemCount] = useState(6);
  const [clothesDetails, setClothesDetails] = useState("3 Shirts, 2 Trousers, 1 Bedsheet");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate monthly quota used
  const totalPiecesUsed = bookings.reduce((acc, b) => acc + (b.itemCount || 5), 0);
  const monthlyAllowance = 30;
  const remainingAllowance = Math.max(0, monthlyAllowance - totalPiecesUsed);
  const quotaPercent = Math.min(100, Math.round((totalPiecesUsed / monthlyAllowance) * 100));

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await bookLaundry({
      dateStr,
      slot,
      itemCount: Number(itemCount),
      clothesDetails,
    });

    if (res.success && res.booking) {
      setBookings([res.booking as any, ...bookings]);
      setShowModal(false);
    }
    setIsSubmitting(false);
  };

  const activeBooking = bookings.find(b => b.status !== "DELIVERED") || bookings[0];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              KP-7 Basement Laundry Facility
            </Badge>
            <Badge variant="outline" className="text-xs">
              30 Clothes Free/Month
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Hostel Laundry Service
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Book automated washing slots, track real-time machine stage, and get pickup OTP.
          </p>
        </div>

        <Button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 shadow-lg shadow-emerald-600/20 text-xs"
        >
          <Plus className="size-4" />
          <span>Book Laundry Slot</span>
        </Button>
      </div>

      {/* Quota Meter & Active Token Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Monthly Quota Meter */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Monthly Washing Quota
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-foreground font-mono">
                {totalPiecesUsed} / {monthlyAllowance}
              </span>
              <span className="text-xs text-emerald-400 font-semibold">
                {remainingAllowance} pieces remaining
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden p-0.5 border border-white/5">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500" 
                style={{ width: `${quotaPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-muted-foreground">
              Allowance resets on the 1st of every month. Additional clothes charged at ₹10/piece.
            </p>
          </CardContent>
        </Card>

        {/* Active Token & Pickup OTP */}
        <Card className="md:col-span-2 bg-gradient-to-r from-emerald-950/40 via-card/70 to-card/90 border border-emerald-500/30 backdrop-blur-xl">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-emerald-400 animate-ping" />
              <CardTitle className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Current Active Token
              </CardTitle>
            </div>
            <Badge className="bg-emerald-600 text-white font-bold text-[10px]">
              {activeBooking ? activeBooking.status : "NO ACTIVE TOKEN"}
            </Badge>
          </CardHeader>
          <CardContent>
            {activeBooking ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono text-foreground">
                      {activeBooking.tokenNumber}
                    </span>
                    <span className="text-xs text-muted-foreground">({activeBooking.itemCount} items)</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Items: <strong className="text-foreground">{activeBooking.clothesDetails || "Regular daily wear"}</strong>
                  </p>
                  <p className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1 mt-1">
                    <Building2 className="size-3" />
                    <span>Location: KP-7 Basement Laundry Counter (Near Block B Lift)</span>
                  </p>
                </div>

                <div className="p-3 bg-black/60 rounded-xl border border-amber-500/30 text-center shrink-0">
                  <span className="text-[10px] text-muted-foreground block flex items-center justify-center gap-1">
                    <KeyRound className="size-3 text-amber-400" />
                    Pickup OTP:
                  </span>
                  <span className="text-lg font-mono font-bold text-amber-300 block tracking-widest">
                    {activeBooking.pickupOtp}
                  </span>
                  <span className="text-[9px] text-muted-foreground">Show to laundry staff</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground py-2">
                No clothes currently in washing. Book a slot below to drop off clothes.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Laundry Stages Pipeline Tracker */}
      <Card className="bg-card/70 border-white/10 backdrop-blur-md">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-sm font-bold text-foreground">
            Washing & Ironing Pipeline Stages
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300">
              <Clock className="size-5 mx-auto text-emerald-400 mb-1.5" />
              <span className="font-bold block text-xs">1. Slot Booked</span>
              <span className="text-[10px] text-muted-foreground">Drop at counter</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300">
              <Shirt className="size-5 mx-auto text-emerald-400 mb-1.5" />
              <span className="font-bold block text-xs">2. Industrial Wash</span>
              <span className="text-[10px] text-muted-foreground">Eco detergent cycle</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300">
              <Sparkles className="size-5 mx-auto text-emerald-400 mb-1.5" />
              <span className="font-bold block text-xs">3. Steam Ironing</span>
              <span className="text-[10px] text-muted-foreground">Folded & packed</span>
            </div>
            <div className="p-3 rounded-xl bg-emerald-600 text-white border border-emerald-500 shadow-md shadow-emerald-600/20">
              <CheckCircle2 className="size-5 mx-auto mb-1.5" />
              <span className="font-bold block text-xs">4. Ready for Pickup</span>
              <span className="text-[10px] text-emerald-100">Collect with OTP</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Laundry Bookings History */}
      <Card className="bg-card/70 border-white/10 backdrop-blur-md">
        <CardHeader className="pb-3 border-b border-white/5">
          <CardTitle className="text-sm font-bold text-foreground">
            Laundry History & Tokens ({bookings.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {bookings.map((b) => (
            <div 
              key={b.id} 
              className="p-3.5 rounded-xl bg-black/20 border border-white/5 hover:border-white/15 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Shirt className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">{b.tokenNumber}</span>
                    <span className="text-xs font-semibold text-foreground">• {new Date(b.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {b.slot} • <strong className="text-foreground">{b.itemCount} pieces</strong> ({b.clothesDetails || "Regular daily wear"})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="text-xs font-mono text-muted-foreground">
                  OTP: <strong className="text-amber-300 font-bold">{b.pickupOtp}</strong>
                </span>
                <Badge 
                  variant="outline"
                  className={`text-xs ${
                    b.status === "READY" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                    b.status === "DELIVERED" ? "bg-white/5 text-muted-foreground border-white/10" :
                    "bg-blue-500/10 text-blue-400 border-blue-500/30"
                  }`}
                >
                  {b.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Modal: Book Laundry Slot */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-card border border-white/15 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="size-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-foreground">Book Laundry Slot</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBook} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Drop-off Date</label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Time Slot</label>
                <select
                  value={slot}
                  onChange={(e) => setSlot(e.target.value)}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                >
                  <option value="09:00 AM - 11:00 AM (Morning Slot 1)">09:00 AM - 11:00 AM (Morning Slot 1)</option>
                  <option value="11:30 AM - 01:30 PM (Morning Slot 2)">11:30 AM - 01:30 PM (Morning Slot 2)</option>
                  <option value="02:30 PM - 04:30 PM (Afternoon Slot)">02:30 PM - 04:30 PM (Afternoon Slot)</option>
                  <option value="05:00 PM - 07:00 PM (Evening Slot)">05:00 PM - 07:00 PM (Evening Slot)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Total Pieces of Clothing</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={itemCount}
                  onChange={(e) => setItemCount(Number(e.target.value))}
                  required
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Item Breakdown</label>
                <input
                  type="text"
                  value={clothesDetails}
                  onChange={(e) => setClothesDetails(e.target.value)}
                  placeholder="e.g. 3 Shirts, 2 Jeans, 1 Bedsheet"
                  required
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
                  {isSubmitting ? "Reserving..." : "Confirm & Get Token"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
