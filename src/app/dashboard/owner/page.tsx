
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
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Database, Plus } from "lucide-react";
import Link from "next/link";

const data = [
  { name: "Mon", revenue: 4000 },
  { name: "Tue", revenue: 3000 },
  { name: "Wed", revenue: 2000 },
  { name: "Thu", revenue: 2780 },
  { name: "Fri", revenue: 1890 },
  { name: "Sat", revenue: 2390 },
  { name: "Sun", revenue: 3490 },
];

export default function OwnerDashboard() {
  const { lands, slots, seedSampleData } = useParkStore();
  
  const totalRevenue = 12450;
  const totalSlots = Object.values(slots).flat();
  const activeBookings = totalSlots.filter(s => s.status === 'booked').length;
  const availableSlots = totalSlots.filter(s => s.status === 'available').length;
  const totalCount = totalSlots.length || 1;
  const occupancyRate = `${Math.round(((totalCount - availableSlots) / totalCount) * 100)}%`;

  const pieData = [
    { name: 'Available', value: availableSlots, color: '#10b981' },
    { name: 'Booked', value: activeBookings, color: '#f59e0b' },
    { name: 'Occupied', value: Math.max(0, totalCount - availableSlots - activeBookings), color: '#f43f5e' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Owner Portfolio</h1>
          <p className="text-muted-foreground">Managing {lands.length} parking properties.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={seedSampleData} variant="outline" className="gap-2">
            <Database className="h-4 w-4" /> Reset Data
          </Button>
          <Button asChild className="gap-2">
            <Link href="/dashboard/owner/lands">
              <Plus className="h-4 w-4" /> Add Land
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Insights</CardTitle>
            <CardDescription>Daily performance overview</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `₹${value}`} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Global Occupancy</CardTitle>
            <CardDescription>Slot distribution across all lands</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {pieData.map((item) => (
                <div key={item.name} className="text-center p-2 bg-muted rounded-lg">
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">{item.name}</div>
                  <div className="text-lg font-bold" style={{ color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Property Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Total Slots</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lands.map((land) => {
                const landSlots = slots[land.id] || [];
                const occupiedCount = landSlots.filter(s => s.status !== 'available').length;
                const percent = Math.round((occupiedCount / land.totalSlots) * 100);
                return (
                  <TableRow key={land.id}>
                    <TableCell className="font-medium">{land.name}</TableCell>
                    <TableCell>{land.totalSlots}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: `${percent}%` }} />
                        </div>
                        <span className="text-xs font-bold">{percent}%</span>
                      </div>
                    </TableCell>
                    <TableCell>₹{land.pricePerHour}/hr</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">Manage</Button>
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
