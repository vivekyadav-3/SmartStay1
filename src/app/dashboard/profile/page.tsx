import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquareWarning, CalendarClock, UserSquare2, Home, Users, ArrowRight, ShieldCheck, Mail, MapPin, Hash } from "lucide-react";
import { redirect } from "next/navigation";
import { syncUser } from "@/app/actions/user";

export default async function ProfilePage() {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  const user = await syncUser();
  if (!user) redirect("/dashboard");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your student credentials and digital ID.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Info Card */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-black/20 border-white/10 backdrop-blur-xl">
             <CardHeader>
                <CardTitle>Personal Information</CardTitle>
             </CardHeader>
             <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                   <div className="size-16 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-2xl font-bold text-primary">
                      {user.name?.charAt(0) || "S"}
                   </div>
                   <div>
                      <h3 className="text-xl font-bold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.role}</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                   <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="size-3" /> Email Address</p>
                      <p className="text-sm font-medium">{user.email}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="size-3" /> Room Number</p>
                      <p className="text-sm font-medium">{user.roomNo || "Not Assigned"}</p>
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><ShieldCheck className="size-3" /> Account Status</p>
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20">Verified Student</Badge>
                   </div>
                   <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Hash className="size-3" /> Student ID (Clerk)</p>
                      <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[150px]">{user.id}</p>
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card className="bg-black/20 border-white/10 border-dashed">
             <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground italic">"Hostel life is the best life. Make it smarter."</p>
             </CardContent>
          </Card>
        </div>

        {/* Right: Digital ID Card */}
        <div className="space-y-4">
           <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Digital ID Card</p>
           <div className="aspect-[2/3] w-full rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-blue-600 p-[1.5px] shadow-2xl shadow-primary/20">
              <div className="h-full w-full rounded-2xl bg-black/90 backdrop-blur-3xl p-6 flex flex-col items-center text-center relative overflow-hidden">
                 {/* ID Card Decoration */}
                 <div className="absolute top-[-10%] right-[-10%] size-32 rounded-full bg-primary/20 blur-2xl" />
                 
                 <div className="size-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center mb-4">
                    <ShieldCheck className="size-7 text-primary" />
                 </div>
                 
                 <h2 className="text-lg font-black tracking-tighter uppercase mb-6">SmartStay ID</h2>
                 
                 <div className="size-24 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-4 overflow-hidden grayscale">
                    <img 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                        alt="Profile"
                        className="size-full object-cover"
                    />
                 </div>

                 <div className="space-y-1 mb-8">
                    <p className="text-lg font-bold truncate max-w-full">{user.name}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">RM: {user.roomNo || 'N/A'}</p>
                 </div>

                 {/* Seeded "QR" Code (Consistent per user) */}
                 <div className="mt-auto p-2 bg-white rounded-lg opacity-80 hover:opacity-100 transition-opacity cursor-help">
                    <div className="grid grid-cols-4 gap-1 p-1">
                       {[...Array(16)].map((_, i) => {
                           // Use charCode of user.id to create a deterministic pattern
                           const isActive = (user.id.charCodeAt(i % user.id.length) + i) % 2 === 0;
                           return <div key={i} className={`size-3 rounded-[2px] ${isActive ? 'bg-black' : 'bg-transparent'}`} />
                       })}
                    </div>
                 </div>
                 <p className="text-[8px] text-muted-foreground mt-2 font-mono uppercase tracking-widest">Scan for verification</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
