"use client";

import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, IndianRupee, Clock, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { updateFeeStatus } from "@/app/actions/fees";

export default function FeesClient({ fees, role }: { fees: any[], role: string }) {
  const [isPending, startTransition] = useTransition();
  const isAdmin = role === "ADMIN";

  function handleUpdate(id: string, status: "PAID" | "PENDING" | "OVERDUE") {
    startTransition(async () => {
      await updateFeeStatus(id, status);
    });
  }

  const totalDues = fees.filter(f => f.status !== "PAID").reduce((acc, f) => acc + f.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments & Fees</h1>
          <p className="text-muted-foreground mt-1">Manage hostel dues and transaction history.</p>
        </div>
        
        {!isAdmin && (
            <Card className="bg-primary/10 border-primary/20 backdrop-blur-md px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <IndianRupee className="size-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Total Outstanding</p>
                        <p className="text-xl font-black text-primary">₹{totalDues.toLocaleString()}</p>
                    </div>
                </div>
            </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Card className="bg-black/20 border-white/10 md:col-span-2">
            <CardHeader>
               <CardTitle>Recent Ledger</CardTitle>
               <CardDescription>Monthly billing breakdown</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {fees.length === 0 && <p className="text-muted-foreground text-sm">No billing records found.</p>}
                  {fees.map((f) => (
                    <div key={f.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 gap-4 group">
                       <div className="flex gap-4">
                          <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${f.status === 'PAID' ? 'bg-green-500/10' : 'bg-orange-500/10'}`}>
                             {f.status === 'PAID' ? <CheckCircle className="size-5 text-green-400" /> : <Clock className="size-5 text-orange-400" />}
                          </div>
                          <div>
                             <h4 className="font-bold flex items-center gap-2">
                                {f.type} FEE - {f.month} 
                                {isAdmin && f.user && <Badge variant="secondary" className="text-[10px]">{f.user.name}</Badge>}
                             </h4>
                             <p className="text-xs text-muted-foreground mt-1">
                                Due by: {new Date(f.dueDate).toLocaleDateString()}
                             </p>
                          </div>
                       </div>

                       <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right">
                             <p className="font-black text-lg">₹{f.amount.toLocaleString()}</p>
                             <Badge variant="outline" className={`text-[10px] uppercase ${
                                f.status === 'PAID' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                                f.status === 'OVERDUE' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                'bg-orange-500/10 text-orange-400 border-orange-500/20'
                             }`}>
                                {f.status}
                             </Badge>
                          </div>
                          
                          {isAdmin && (
                             <div className="flex gap-1">
                                {f.status !== "PAID" && (
                                    <Button size="sm" variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/20" onClick={() => handleUpdate(f.id, "PAID")} disabled={isPending}>
                                        <CheckCircle className="size-3" />
                                    </Button>
                                )}
                                {f.status === "PENDING" && (
                                    <Button size="sm" variant="outline" className="border-red-500/30 text-red-400 hover:bg-red-500/20" onClick={() => handleUpdate(f.id, "OVERDUE")} disabled={isPending}>
                                        <AlertCircle className="size-3" />
                                    </Button>
                                )}
                             </div>
                          )}
                       </div>
                    </div>
                  ))}
               </div>
            </CardContent>
         </Card>

         <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/20 to-blue-600/20 border-primary/20 backdrop-blur-xl">
               <CardHeader>
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                     <TrendingUp className="size-4" /> Smart Insights
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                     <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Savings Tip</p>
                     <p className="text-xs mt-1">Pay before the 5th of every month to avoid the ₹200 late fee surcharge.</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                     <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Support</p>
                     <p className="text-xs mt-1">Discrepancy in bill? Contact the Accounts Office with your Digital ID.</p>
                  </div>
               </CardContent>
            </Card>

            <Card className="bg-black/20 border-white/10 p-6 flex flex-col items-center text-center space-y-4">
               <div className="size-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <CreditCard className="size-6 text-orange-400" />
               </div>
               <div>
                  <h3 className="font-bold">Next Billing Cycle</h3>
                  <p className="text-xs text-muted-foreground mt-1">May 2026 bills will be generated on 01/05/2026.</p>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}
