"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, IndianRupee } from 'lucide-react';

const COLORS = ['#F97316', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444'];

export default function AdminCharts({ data }: { data: any }) {
  if (!data || !data.categoryData || data.categoryData.length === 0) {
    return null;
  }

  const collected = data.revenue?.collected || 0;
  const pending = data.revenue?.pending || 0;
  const total = collected + pending;
  const progress = total > 0 ? (collected / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/20 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Issue Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.categoryData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-black/20 border-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Weekly Load</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} />
                  <YAxis stroke="#94a3b8" fontSize={10} />
                  <Tooltip 
                      cursor={{ fill: '#ffffff05' }}
                      contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }}
                      itemStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black/20 border-white/10 backdrop-blur-md overflow-hidden">
         <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
               <div className="p-6 flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                     <TrendingUp className="size-4 text-green-400" />
                     <h3 className="text-sm font-bold uppercase tracking-tight text-muted-foreground">Accounts Receivable</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Collected</p>
                        <p className="text-2xl font-black text-green-400">₹{collected.toLocaleString()}</p>
                     </div>
                     <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Outstanding</p>
                        <p className="text-2xl font-black text-orange-400">₹{pending.toLocaleString()}</p>
                     </div>
                  </div>
                  <div className="space-y-1">
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-green-400 transition-all duration-1000" 
                            style={{ width: `${progress}%` }}
                          />
                      </div>
                      <p className="text-[10px] text-right text-muted-foreground font-bold">{progress.toFixed(1)}% Revenue Goal Achieved</p>
                  </div>
               </div>
               <div className="bg-white/5 p-6 md:w-64 flex flex-col justify-center items-center border-l border-white/10">
                  <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                     <IndianRupee className="size-6 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground font-medium">Auto-Billing Status</p>
                  <Badge className="mt-1 bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>
               </div>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}
