
"use client";

import { StatsCards } from "@/components/dashboard/stats-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParkStore } from "@/hooks/use-park-store";
import { useFirestore } from "@/firebase";
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
import { Database } from "lucide-react";

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
  const db = useFirestore();
  
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
          <h1 className="text-3xl font-bold font-headline">Portfolio Overview</h1>
          <p className="text-muted-foreground">Manage your properties and security personnel.</p>
        </div>
        {lands.length === 0 && db && (
          <Button onClick={() => seedSampleData(db)} className="gap-2" variant="outline">
            <Database className="h-4 w-4" /> Seed Sample Data
          </Button>
        )}
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
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Daily earnings for current week</CardDescription>
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
            <CardTitle>Occupancy Status</CardTitle>
            <CardDescription>Live slot distribution across {lands.length} properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
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
            <div className="mt-4 space-y-2">
              {pieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest bookings and slot updates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Slot</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lands.length > 0 ? (
                <TableRow>
                  <TableCell className="font-medium">{lands[0].name}</TableCell>
                  <TableCell>A-05</TableCell>
                  <TableCell>Rahul Sharma</TableCell>
                  <TableCell><Badge>Active</Badge></TableCell>
                  <TableCell className="text-right">₹40.00</TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground italic">
                    No recent activities recorded. Seed data to begin.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
