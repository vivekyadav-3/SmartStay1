"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, MessageSquareWarning, Loader2, CheckCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { submitComplaint, updateComplaintStatus } from "@/app/actions/complaints";

export default function ComplaintsClient({ complaints, role }: { complaints: any[], role: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleAction(formData: FormData) {
    setLoading(true);
    await submitComplaint(formData);
    setLoading(false);
    setOpen(false);
  }

  function handleResolve(id: string) {
    startTransition(async () => {
      await updateComplaintStatus(id, "RESOLVED");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaints</h1>
          <p className="text-muted-foreground mt-1">Manage and track your hostel issues.</p>
        </div>
        
        {role !== "ADMIN" && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" />
                New Complaint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/10">
              <form action={handleAction}>
                <DialogHeader>
                  <DialogTitle>Submit Complaint</DialogTitle>
                  <DialogDescription>
                    Describe the issue clearly.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" placeholder="e.g., Fan not working" className="bg-white/5" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desc">Description</Label>
                    <textarea 
                      id="desc" 
                      name="desc"
                      className="flex min-h-[80px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Provide more details..."
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? <Loader2 className="animate-spin size-4" /> : "Submit"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card className="bg-black/20 border-white/10">
        <CardHeader>
          <CardTitle>{role === "ADMIN" ? "All Complaints" : "Your History"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complaints.length === 0 && <p className="text-muted-foreground text-sm">No complaints found.</p>}
            {complaints.map((c) => (
              <div key={c.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 gap-4">
                <div className="flex gap-4">
                  <div className="size-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <MessageSquareWarning className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-medium">{c.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role === "ADMIN" && c.user ? <strong>{c.user.name} • </strong> : ""}
                      {c.desc} • {new Date(c.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className={`shrink-0 ${c.status === "PENDING" ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-green-500/10 text-green-400 border-green-500/20"}`}>
                    {c.status}
                  </Badge>
                  {role === "ADMIN" && c.status === "PENDING" && (
                    <Button variant="outline" size="sm" onClick={() => handleResolve(c.id)} disabled={isPending} className="border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20 hover:text-green-300">
                       <CheckCircle className="size-4 mr-1" /> Resolve
                    </Button>
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
