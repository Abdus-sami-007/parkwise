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
  DialogHeader 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Zap, CarFront, Loader2, RefreshCcw } from "lucide-react";
import { guardAssistantRecommendations } from "@/ai/flows/guard-assistant-recommendations-flow";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function GuardDashboard() {
  const { lands, slots, updateSlotStatus } = useParkStore();
  const { toast } = useToast();
  
  const [selectedLandId, setSelectedLandId] = useState<string>(lands[0]?.id || "");
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isAiOffline, setIsAiOffline] = useState(false);

  const currentSlots = slots[selectedLandId] || [];

  const handleSlotClick = (slot: ParkingSlot) => {
    setSelectedSlot(slot);
    setVehiclePlate(slot.currentVehicle || "");
  };

  const handleUpdateStatus = (status: ParkingSlot['status']) => {
    if (selectedSlot) {
      updateSlotStatus(selectedLandId, selectedSlot.id, status, status === 'occupied' ? vehiclePlate : undefined);
      setSelectedSlot(null);
      getAIRecommendations();
    }
  };

  const getAIRecommendations = async () => {
    if (!selectedLandId) return;
    setLoadingAI(true);
    setIsAiOffline(false);
    
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
    } catch (error: any) {
      console.error("AI Assistant unreachable, switching to system logic", error);
      setIsAiOffline(true);
      
      // Fallback: Use simple rule-based recommendations if AI quota is hit (429)
      const occupied = currentSlots.filter(s => s.status === 'occupied').length;
      const booked = currentSlots.filter(s => s.status === 'booked').length;
      
      const systemRecs = [
        `Monitor entry: ${booked} upcoming arrivals expected.`,
        occupied > (currentSlots.length * 0.8) ? "High occupancy alert: Direct traffic to overflow." : "Flow is steady: No immediate congestion.",
        "System Log: Ensure all logged plates are verified on exit."
      ];
      setRecommendations(systemRecs);
      
      toast({
        title: "Intelligence Fallback Active",
        description: "Gemini quota reached. Using local system logic for flow analysis.",
      });
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
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tight">Active Patrol</h1>
          <p className="text-muted-foreground font-medium">Monitoring live slot occupancy and traffic flow.</p>
        </div>
        <div className="flex items-center gap-4 bg-card p-2 rounded-2xl shadow-sm border">
          <Label className="pl-4 font-black uppercase text-[10px] tracking-widest text-muted-foreground">Active Site</Label>
          <Select value={selectedLandId} onValueChange={setSelectedLandId}>
            <SelectTrigger className="w-[280px] h-11 border-none shadow-none font-bold text-base focus:ring-0">
              <SelectValue placeholder="Select site" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-2xl">
              {lands.map((land) => (
                <SelectItem key={land.id} value={land.id} className="font-medium rounded-lg">{land.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="bg-primary border-none shadow-xl text-primary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CarFront className="h-20 w-20" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-black uppercase tracking-widest opacity-80">Site Occupancy</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between items-end">
            <div>
              <div className="text-4xl font-black">{currentSlots.filter(s => s.status === 'occupied').length}</div>
              <p className="text-[10px] font-bold opacity-70">Vehicles Parked</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black">{currentSlots.filter(s => s.status === 'available').length}</div>
              <p className="text-[10px] font-bold opacity-70">Free Slots</p>
            </div>
          </CardContent>
        </Card>
        
        {recommendations.slice(0, 3).map((rec, i) => (
          <Alert key={i} className="bg-card border-none shadow-xl flex flex-col justify-center gap-2 p-5 rounded-2xl group hover:scale-[1.02] transition-transform">
            <div className="flex items-center gap-2">
              <Zap className={cn("h-4 w-4", isAiOffline ? "text-primary" : "text-amber-500 fill-amber-500")} />
              <AlertTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {isAiOffline ? "System Alert" : "AI Intelligence"}
              </AlertTitle>
            </div>
            <AlertDescription className="text-sm font-bold leading-tight line-clamp-2">
              {rec}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-md rounded-3xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b px-8 py-6">
          <div>
            <CardTitle className="text-2xl font-black">Interactive Site Map</CardTitle>
            <CardDescription className="font-medium">Tap any slot to log a vehicle or update status</CardDescription>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={getAIRecommendations} 
            disabled={loadingAI}
            className="rounded-full font-bold gap-2 px-6 h-10 hover:bg-primary/10 text-primary transition-all"
          >
            {loadingAI ? <Loader2 className="animate-spin h-4 w-4" /> : <RefreshCcw className="h-4 w-4" />}
            Analyze Flow
          </Button>
        </CardHeader>
        <CardContent className="p-10">
          <SlotGrid slots={currentSlots} onSlotClick={handleSlotClick} />
        </CardContent>
      </Card>

      <Dialog open={!!selectedSlot} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent className="border-none shadow-3xl rounded-3xl p-0 overflow-hidden max-w-md">
          <div className="bg-slate-900 p-8 text-white">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-primary/20 text-primary border-none font-black px-3 py-1">
                SLOT {selectedSlot?.slotNumber}
              </Badge>
              <div className="flex gap-1">
                <div className={cn(
                  "w-2 h-2 rounded-full", 
                  selectedSlot?.status === 'available' ? 'bg-emerald-500' : 
                  selectedSlot?.status === 'booked' ? 'bg-amber-500' : 'bg-rose-500'
                )} />
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">
                  {selectedSlot?.status}
                </span>
              </div>
            </div>
            <h2 className="text-3xl font-black">Vehicle Logging</h2>
          </div>
          <div className="p-8 space-y-8">
            <div className="space-y-3">
              <Label className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">License Plate Number</Label>
              <Input 
                placeholder="e.g. TS-09-AB-1234" 
                className="h-14 text-2xl font-black uppercase tracking-wider text-center border-2 focus-visible:ring-primary rounded-2xl" 
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
              />
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <Button 
                variant="outline"
                onClick={() => handleUpdateStatus('available')}
                className="h-14 font-black border-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-2xl transition-all"
              >
                Clear
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleUpdateStatus('booked')}
                className="h-14 font-black border-2 border-amber-500/20 text-amber-600 hover:bg-amber-500 hover:text-white rounded-2xl transition-all"
              >
                Reserve
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleUpdateStatus('occupied')}
                className="h-14 font-black border-2 border-rose-500/20 text-rose-600 hover:bg-rose-500 hover:text-white rounded-2xl transition-all"
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