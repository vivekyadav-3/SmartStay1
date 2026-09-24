"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Trash2, Plus, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createNotice, deleteNotice } from "@/app/actions/notices";

export default function NoticeBoard({ notices, role }: { notices: any[], role: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isAdmin = role === "ADMIN";

  async function handleCreate(formData: FormData) {
    setLoading(true);
    const title = formData.get("title")?.toString() || "";
    const content = formData.get("content")?.toString() || "";
    const priority = formData.get("priority")?.toString() || "NORMAL";
    await createNotice({ title, content, priority });
    setLoading(false);
    setOpen(false);
  }

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
           <Megaphone className="size-4 text-primary" />
           <CardTitle className="text-lg">Notice Board</CardTitle>
        </div>
        {isAdmin && (
           <Dialog open={open} onOpenChange={setOpen}>
           <DialogTrigger asChild>
             <Button size="sm" className="h-8 gap-1">
               <Plus className="size-3" /> Post
             </Button>
           </DialogTrigger>
           <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-xl border-white/10">
             <form action={handleCreate}>
               <DialogHeader>
                 <DialogTitle>New Announcement</DialogTitle>
                 <DialogDescription>Broadcast a message to all students.</DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                 <Input name="title" placeholder="Notice Title" className="bg-white/5" required />
                 <textarea 
                   name="content" 
                   className="flex min-h-[100px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm"
                   placeholder="Important details..."
                   required
                 />
                 <select name="priority" className="bg-white/5 border border-white/10 rounded-md p-2 text-sm">
                    <option value="NORMAL">Normal Priority</option>
                    <option value="URGENT">Urgent Priority</option>
                 </select>
               </div>
               <Button type="submit" className="w-full" disabled={loading}>
                 {loading ? <Loader2 className="animate-spin size-4" /> : "Post Notice"}
               </Button>
             </form>
           </DialogContent>
         </Dialog>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
          {notices.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No notices posted yet.</p>}
          {notices.map((n) => (
            <div key={n.id} className={`p-4 rounded-xl border ${n.priority === 'URGENT' ? 'bg-red-500/5 border-red-500/20' : 'bg-white/5 border-white/5'} relative group`}>
              <div className="flex justify-between items-start mb-1">
                <h4 className={`font-bold text-sm ${n.priority === 'URGENT' ? 'text-red-400' : 'text-primary'}`}>
                    {n.priority === 'URGENT' && "🚨 "}{n.title}
                </h4>
                {isAdmin && (
                    <button onClick={() => deleteNotice(n.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500">
                        <Trash2 className="size-3" />
                    </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{n.content}</p>
              <p className="text-[10px] text-muted-foreground/50 mt-2 italic">{new Date(n.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
