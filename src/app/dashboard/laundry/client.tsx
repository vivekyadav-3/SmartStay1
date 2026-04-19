"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarClock, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { bookLaundry } from "@/app/actions/laundry";

export default function LaundryClient({ bookings }: { bookings: any[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAction(formData: FormData) {
    setLoading(true);
    await bookLaundry(formData);
    setLoading(false);
    setOpen(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laundry</h1>
          <p className="text-muted-foreground mt-1">Book your slots to avoid the queue.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="size-4" />
              Book Slot
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/10">
            <form action={handleAction}>
              <DialogHeader>
                <DialogTitle>Book a Machine</DialogTitle>
                <DialogDescription>
                  Select a date and available time slot.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" className="bg-white/5" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slot">Available Slots</Label>
                  <select 
                    id="slot" 
                    name="slot"
                    className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option className="bg-black text-white" value="09:00 AM - 10:30 AM (Machine 1)">09:00 AM - 10:30 AM (Machine 1)</option>
                    <option className="bg-black text-white" value="10:30 AM - 12:00 PM (Machine 2)">10:30 AM - 12:00 PM (Machine 2)</option>
                    <option className="bg-black text-white" value="02:00 PM - 03:30 PM (Machine 1)">02:00 PM - 03:30 PM (Machine 1)</option>
                  </select>
                </div>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={loading}>
                {loading ? <Loader2 className="animate-spin size-4" /> : "Confirm Booking"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-black/20 border-white/10">
        <CardHeader>
          <CardTitle>Your Bookings</CardTitle>
          <CardDescription>Upcoming and past laundry reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {bookings.length === 0 && <p className="text-muted-foreground text-sm">No bookings found.</p>}
            {bookings.map((b) => (
              <div key={b.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 gap-4">
                <div className="flex gap-4">
                  <div className="size-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <CalendarClock className="size-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-100">{new Date(b.date).toLocaleDateString()} • {b.slot}</h4>
                    <p className="text-sm text-blue-400/80 mt-1">Booked on {new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-500/20 text-blue-300 border-blue-500/30 shrink-0">Confirmed</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
