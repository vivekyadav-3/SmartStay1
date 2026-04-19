"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserSquare2, Plus, Loader2, Check, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { requestVisitorPass, updateVisitorStatus } from "@/app/actions/visitor";

export default function VisitorPassClient({ passes, role }: { passes: any[], role: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    setLoading(true);
    await requestVisitorPass(formData);
    setLoading(false);
    setOpen(false);
  }

  function handleStatus(id: string, status: "APPROVED" | "REJECTED") {
    startTransition(async () => {
      await updateVisitorStatus(id, status);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visitor Pass</h1>
          <p className="text-muted-foreground mt-1">Request approval for guests digitally.</p>
        </div>
        
        {role !== "ADMIN" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="size-4" />
                Request Pass
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/10">
              <form action={handleAction}>
                <DialogHeader>
                  <DialogTitle>New Visitor Request</DialogTitle>
                  <DialogDescription>
                    Fill in the details. Admin approval is required.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="visitorName">Visitor Full Name</Label>
                    <Input id="visitorName" name="visitorName" placeholder="e.g., John Doe" className="bg-white/5" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date of Visit</Label>
                    <Input id="date" name="date" type="date" className="bg-white/5" required />
                  </div>
                </div>
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin size-4" /> : "Submit Request"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="bg-black/20 border-white/10">
        <CardHeader>
          <CardTitle>{role === "ADMIN" ? "All Requested Passes" : "Requested Passes"}</CardTitle>
          <CardDescription>Status of visitor requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {passes.length === 0 && <p className="text-muted-foreground text-sm">No visitor passes requested.</p>}
            {passes.map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 gap-4">
                <div className="flex gap-4">
                  <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <UserSquare2 className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">{p.visitorName}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role === "ADMIN" && p.user ? <strong>Requested by: {p.user.name} • </strong> : ""}
                      Visiting on: {new Date(p.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`shrink-0 ${p.status === "APPROVED" ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : p.status === "REJECTED" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-orange-500/10 text-orange-400 border-orange-500/20"}`}>
                    {p.status}
                  </Badge>
                  {role === "ADMIN" && p.status === "PENDING" && (
                    <div className="flex gap-2">
                       <Button variant="outline" size="icon" onClick={() => handleStatus(p.id, "APPROVED")} disabled={isPending} className="border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20 hover:text-green-300">
                         <Check className="size-4" />
                       </Button>
                       <Button variant="outline" size="icon" onClick={() => handleStatus(p.id, "REJECTED")} disabled={isPending} className="border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300">
                         <X className="size-4" />
                       </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
