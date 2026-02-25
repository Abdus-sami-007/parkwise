
"use client";

import { useState, useEffect } from "react";
import { useParkStore } from "@/hooks/use-park-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SlotGrid } from "@/components/dashboard/slot-grid";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ParkingSlot } from "@/lib/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Zap, AlertCircle } from "lucide-react";
import { guardAssistantRecommendations, GuardAssistantRecommendationsOutput } from "@/ai/flows/guard-assistant-recommendations-flow";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export default function GuardDashboard() {
  const { lands, slots, updateSlotStatus } = useParkStore();
  const [selectedLandId, setSelectedLandId] = useState<string>(lands[0]?.id || "");
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const currentSlots = slots[selectedLandId] || [];

  const handleSlotClick = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setVehiclePlate(slot.currentVehicle || "");
  };

  const handleUpdateStatus = (status: ParkingSlot['status']) => {
    if (selectedSlot) {
      updateSlotStatus(selectedLandId, selectedSlot.id, status, status === 'occupied' ? vehiclePlate : undefined);
      setSelectedSlot(null);
    }
  };

  const getAIRecommendations = async () => {
    setLoadingAI(true);
    try {
      const result = await guardAssistantRecommendations({
        parkingLandId: selectedLandId,
        currentSlotStatuses: currentSlots.map(s => ({ slotNumber: s.slotNumber, status: s.status })),
        activeBookings: currentSlots.filter(s => s.status === 'booked').map(s => ({
          slotNumber: s.slotNumber,
          bookedBy: s.bookedBy || 'Unknown User'
        })),
        recentEvents: "Morning rush starting. High turnover in Section A. One vehicle reported sensor malfunction in B5."
      });
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error("AI recommendation failed", error);
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    if (selectedLandId) {
      getAIRecommendations();
    }
  }, [selectedLandId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Live Patrol</h1>
          <p className="text-muted-foreground">Monitor and manage real-time occupancy</p>
        </div>
        <div className="flex items-center gap-3">
          <Label htmlFor="land-select">Assigned Land:</Label>
          <Select value={selectedLandId} onValueChange={setSelectedLandId}>
            <SelectTrigger id="land-select" className="w-[280px]">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {lands.map((land) => (
                <SelectItem key={land.id} value={land.id}>{land.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="grid gap-3 md:grid-cols-3">
          {recommendations.map((rec, i) => (
            <Alert key={i} className="bg-primary/5 border-primary/20">
              <Zap className="h-4 w-4 text-primary" />
              <AlertTitle className="text-xs uppercase tracking-wider font-bold">AI Suggestion</AlertTitle>
              <AlertDescription className="text-sm font-medium">
                {rec}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Slot Management</CardTitle>
                <CardDescription>Click a slot to update status</CardDescription>
              </div>
              <div className="flex gap-4 text-xs font-medium">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Available</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500" /> Booked</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-rose-500" /> Occupied</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <SlotGrid slots={currentSlots} onSlotClick={handleSlotClick} />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Total Slots</span>
                <span className="font-bold">{currentSlots.length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Available</span>
                <span className="font-bold text-emerald-600">{currentSlots.filter(s => s.status === 'available').length}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Occupied</span>
                <span className="font-bold text-rose-600">{currentSlots.filter(s => s.status === 'occupied').length}</span>
              </div>
              <Button onClick={getAIRecommendations} variant="outline" className="w-full gap-2" disabled={loadingAI}>
                <Zap className={loadingAI ? "animate-pulse" : ""} /> Refresh AI Insights
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Slot {selectedSlot?.slotNumber}</DialogTitle>
            <DialogDescription>Manually update slot status or check-in vehicle.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Vehicle License Plate</Label>
              <Input 
                placeholder="e.g. TS-09-AB-1234" 
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant={selectedSlot?.status === 'available' ? 'default' : 'outline'}
                onClick={() => handleUpdateStatus('available')}
                className="bg-emerald-500 hover:bg-emerald-600 border-none"
              >
                Available
              </Button>
              <Button 
                variant={selectedSlot?.status === 'booked' ? 'default' : 'outline'}
                onClick={() => handleUpdateStatus('booked')}
                className="bg-amber-500 hover:bg-amber-600 border-none"
              >
                Booked
              </Button>
              <Button 
                variant={selectedSlot?.status === 'occupied' ? 'default' : 'outline'}
                onClick={() => handleUpdateStatus('occupied')}
                className="bg-rose-500 hover:bg-rose-600 border-none"
              >
                Occupied
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setSelectedSlot(null)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
