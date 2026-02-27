
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
import { Zap, ShieldAlert, CarFront } from "lucide-react";
import { guardAssistantRecommendations } from "@/ai/flows/guard-assistant-recommendations-flow";
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
    if (!selectedLandId) return;
    setLoadingAI(true);
    try {
      const result = await guardAssistantRecommendations({
        parkingLandId: selectedLandId,
        currentSlotStatuses: currentSlots.map(s => ({ slotNumber: s.slotNumber, status: s.status })),
        activeBookings: currentSlots.filter(s => s.status === 'booked').map(s => ({
          slotNumber: s.slotNumber,
          bookedBy: s.bookedBy || 'User'
        })),
        recentEvents: "Manual status updates in progress."
      });
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error("AI failed", error);
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
          <h1 className="text-3xl font-bold font-headline">Guard Patrol</h1>
          <p className="text-muted-foreground">Monitoring active traffic and occupancy</p>
        </div>
        <div className="flex items-center gap-3">
          <Label>Property:</Label>
          <Select value={selectedLandId} onValueChange={setSelectedLandId}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select land" />
            </SelectTrigger>
            <SelectContent>
              {lands.map((land) => (
                <SelectItem key={land.id} value={land.id}>{land.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold uppercase text-primary">Live Stats</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-center">
            <div>
              <div className="text-2xl font-bold">{currentSlots.filter(s => s.status === 'available').length}</div>
              <p className="text-[10px] text-muted-foreground">Available Slots</p>
            </div>
            <div>
              <div className="text-2xl font-bold">{currentSlots.filter(s => s.status === 'occupied').length}</div>
              <p className="text-[10px] text-muted-foreground">Vehicles Parked</p>
            </div>
          </CardContent>
        </Card>
        
        {recommendations.slice(0, 2).map((rec, i) => (
          <Alert key={i} className="bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
            <Zap className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-xs font-bold uppercase text-amber-600">AI Alert</AlertTitle>
            <AlertDescription className="text-sm font-medium leading-tight">{rec}</AlertDescription>
          </Alert>
        ))}
      </div>

      <Card className="border-none shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Interactive Map</CardTitle>
            <CardDescription>Click a slot to check-in or update status</CardDescription>
          </div>
          <Button size="sm" variant="outline" onClick={getAIRecommendations} disabled={loadingAI}>
            {loadingAI ? "Analyzing..." : "Refresh Insights"}
          </Button>
        </CardHeader>
        <CardContent>
          <SlotGrid slots={currentSlots} onSlotClick={handleSlotClick} />
        </CardContent>
      </Card>

      <Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent className="border-none">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <CarFront className="h-6 w-6 text-primary" /> Slot {selectedSlot?.slotNumber}
            </DialogTitle>
            <DialogDescription>Quick update for parking status</DialogDescription>
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
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Clear
              </Button>
              <Button 
                variant={selectedSlot?.status === 'booked' ? 'default' : 'outline'}
                onClick={() => handleUpdateStatus('booked')}
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                Reserved
              </Button>
              <Button 
                variant={selectedSlot?.status === 'occupied' ? 'default' : 'outline'}
                onClick={() => handleUpdateStatus('occupied')}
                className="bg-rose-500 hover:bg-rose-600 text-white"
              >
                Parked
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
