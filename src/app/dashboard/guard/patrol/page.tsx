"use client";

import { useParkStore } from "@/hooks/use-park-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShieldCheck, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function GuardPatrolPage() {
  const { lands, slots } = useParkStore();
  const [plateSearch, setPlateSearch] = useState("");

  const allOccupiedSlots = Object.values(slots).flat().filter(s => s.status === 'occupied' || s.status === 'booked');

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Check-in / Out</h1>
          <p className="text-muted-foreground">Verify vehicles and manage entry/exit.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search license plate..." 
            className="pl-10" 
            value={plateSearch}
            onChange={(e) => setPlateSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-emerald-500" /> Recent Check-ins
            </CardTitle>
            <CardDescription>Vehicles that arrived in the last 2 hours</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {allOccupiedSlots.slice(0, 4).map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-bold">{slot.currentVehicle || "PLATE-PENDING"}</div>
                  <div className="text-xs text-muted-foreground">Slot {slot.slotNumber}</div>
                </div>
                <Badge variant="outline">Verified</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-amber-500" /> Pending Arrivals
            </CardTitle>
            <CardDescription>Booked slots waiting for check-in</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {allOccupiedSlots.filter(s => s.status === 'booked').map((slot) => (
              <div key={slot.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-bold">Slot {slot.slotNumber}</div>
                  <div className="text-xs text-muted-foreground">Reserved by {slot.bookedBy || "Guest"}</div>
                </div>
                <Button size="sm">Check-in</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
