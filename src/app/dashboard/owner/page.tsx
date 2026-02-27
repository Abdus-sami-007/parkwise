"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParkStore } from "@/hooks/use-park-store";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Database, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";

const data = [
  { name: "Mon", revenue: 4200 },
  { name: "Tue", revenue: 3800 },
  { name: "Wed", revenue: 2500 },
  { name: "Thu", revenue: 3100 },
  { name: "Fri", revenue: 5200 },
  { name: "Sat", revenue: 6800 },
  { name: "Sun", revenue: 7400 },
];

export default function OwnerDashboard() {
  const { lands, slots, seedSampleData } = useParkStore();
  
  const totalRevenue = 33000;
  const totalSlots = Object.values(slots).flat();
  const activeBookings = totalSlots.filter(s => s.status === 'booked').length;
  const availableSlots = totalSlots.filter(s => s.status === 'available').length;
  const totalCount = totalSlots.length || 1;
  const occupancyRate = `${Math.round(((totalCount - availableSlots) / totalCount) * 100)}%`;

  const pieData = [
    { name: 'Available', value: availableSlots, color: 'hsl(var(--primary))' },
    { name: 'Reserved', value: activeBookings, color: '#f59e0b' },
    { name: 'Occupied', value: Math.max(0, totalCount - availableSlots - activeBookings), color: '#f43f5e' },
  ];

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tight">Portfolio Overview</h1>
          <p className="text-muted-foreground font-medium">Managing {lands.length} active parking properties.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={seedSampleData} variant="outline" className="gap-2 rounded-xl font-bold h-11">
            <Database className="h-4 w-4" /> Reset Mock Data
          </Button>
          <Button asChild className="gap-2 rounded-xl font-black h-11 px-6 shadow-lg shadow-primary/20">
            <Link href="/dashboard/owner/lands">
              <Plus className="h-5 w-5" /> Add Property
            </Link>
          </Button>
        </div>
      </div>

      <StatsCards 
        totalRevenue={totalRevenue}
        activeBookings={activeBookings}
        availableSlots={availableSlots}
        occupancyRate={occupancyRate}
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-none shadow-xl bg-card/40 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Revenue Insights</CardTitle>
              <CardDescription className="font-medium">Weekly performance tracker</CardDescription>
            </div>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +18.4%
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} tick={{fontSize: 12, fontWeight: 'bold'}} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--primary))', opacity: 0.1}} 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-none shadow-xl bg-card/40 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Live Occupancy</CardTitle>
            <CardDescription className="font-medium">Real-time slot distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {pieData.map((item) => (
                <div key={item.name} className="text-center p-3 bg-muted/50 rounded-2xl border">
                  <div className="text-[10px] text-muted-foreground uppercase font-black mb-1">{item.name}</div>
                  <div className="text-xl font-black" style={{ color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-xl bg-card/40 backdrop-blur-md overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Property Performance</CardTitle>
          <CardDescription className="font-medium">Detailed breakdown of active lands</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="font-black uppercase text-[10px] tracking-widest pl-6">Location</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Total Slots</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Live Occupancy</TableHead>
                <TableHead className="font-black uppercase text-[10px] tracking-widest">Pricing</TableHead>
                <TableHead className="text-right pr-6 font-black uppercase text-[10px] tracking-widest">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lands.map((land) => {
                const landSlots = slots[land.id] || [];
                const occupiedCount = landSlots.filter(s => s.status !== 'available').length;
                const percent = Math.round((occupiedCount / land.totalSlots) * 100);
                return (
                  <TableRow key={land.id} className="border-muted/20 hover:bg-primary/5 transition-colors">
                    <TableCell className="font-bold pl-6 text-base">{land.name}</TableCell>
                    <TableCell className="font-medium">{land.totalSlots} Slots</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-1000 ease-out" 
                            style={{ width: `${percent}%` }} 
                          />
                        </div>
                        <span className="text-xs font-black text-primary">{percent}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-black">₹{land.pricePerHour}/hr</TableCell>
                    <TableCell className="text-right pr-6">
                      <Button variant="ghost" size="sm" className="font-bold rounded-xl hover:bg-primary hover:text-white transition-all">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
