"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, IndianRupee, PieChart as PieIcon, BarChart3 } from "lucide-react";

const COLORS = ['#10B981', '#3B82F6', '#F97316', '#8B5CF6', '#EF4444'];

export default function AdminCharts({ data }: { data: any }) {
  if (!data || !data.categoryData || data.categoryData.length === 0) {
    return null;
  }

  const collected = data.revenue?.collected || 0;
  const pending = data.revenue?.pending || 0;
  const total = collected + pending;
  const progress = total > 0 ? Math.round((collected / total) * 100) : 0;

  const totalComplaints = data.categoryData.reduce((acc: number, c: any) => acc + (c.value || 0), 0) || 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Issue Distribution by Category */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <PieIcon className="size-4 text-emerald-400" />
              <CardTitle className="text-sm font-bold text-foreground">Complaint Category Breakdown</CardTitle>
            </div>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
              Total {totalComplaints} Tickets
            </Badge>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-3">
              {data.categoryData.map((item: any, idx: number) => {
                const pct = Math.round((item.value / totalComplaints) * 100);
                const color = COLORS[idx % COLORS.length];
                return (
                  <div key={item.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground flex items-center gap-2">
                        <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
                        {item.name}
                      </span>
                      <span className="text-muted-foreground font-mono">
                        {item.value} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden border border-white/5">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ width: `${pct}%`, backgroundColor: color }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Revenue & Fee Status */}
        <Card className="bg-card/70 border-white/10 backdrop-blur-md">
          <CardHeader className="pb-3 border-b border-white/5 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <IndianRupee className="size-4 text-emerald-400" />
              <CardTitle className="text-sm font-bold text-foreground">Hostel & Mess Fee Realization</CardTitle>
            </div>
            <Badge className="bg-emerald-600 text-white text-[10px]">
              {progress}% Realized
            </Badge>
          </CardHeader>
          <CardContent className="pt-4 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Collected (₹)</span>
                <span className="text-xl font-bold font-mono text-emerald-400">
                  ₹{collected.toLocaleString()}
                </span>
                <p className="text-[10px] text-emerald-500/80 mt-1">Directly into KIIT Accounts</p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">Pending (₹)</span>
                <span className="text-xl font-bold font-mono text-amber-400">
                  ₹{pending.toLocaleString()}
                </span>
                <p className="text-[10px] text-amber-500/80 mt-1">Due before late fine</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Collection Target:</span>
                <span className="font-mono text-foreground font-bold">{progress}% Completed</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-black/40 overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
