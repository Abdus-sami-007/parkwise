"use client";

import { useState } from "react";
import { useParkStore } from "@/hooks/use-park-store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Calendar, CreditCard, Info, Loader2, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { ParkingLand, ParkingSlot } from "@/lib/types";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { SlotGrid } from "@/components/dashboard/slot-grid";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function CustomerDashboard() {
  const { lands, slots, createBooking, currentUser } = useParkStore();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLand, setSelectedLand] = useState<ParkingLand | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);

  const filteredLands = lands.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBook = () => {
    if (currentUser && selectedLand && selectedSlot) {
      setIsBooking(true);
      
      // Artificial delay for realism
      setTimeout(() => {
        createBooking({
          userId: currentUser.uid,
          landId: selectedLand.id,
          slotId: selectedSlot.id,
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          amount: selectedLand.pricePerHour * 2,
          status: 'confirmed'
        });

        toast({
          title: "Booking Confirmed!",
          description: `Slot ${selectedSlot.slotNumber} reserved at ${selectedLand.name}.`,
        });
        
        setIsBooking(false);
        setSelectedSlot(null);
        setSelectedLand(null);
      }, 800);
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative h-[240px] rounded-3xl overflow-hidden shadow-2xl">
        <Image 
          src="https://picsum.photos/seed/parking-hero-new/1200/400" 
          alt="Banner" 
          fill 
          className="object-cover brightness-50"
          data-ai-hint="parking lot"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
          <h1 className="text-4xl font-black mb-6 font-headline tracking-tight">Find Your Perfect Spot</h1>
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              className="pl-14 h-14 text-lg border-none bg-white text-foreground rounded-full shadow-2xl focus-visible:ring-primary" 
              placeholder="Where are you heading today?" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black font-headline tracking-tight">Nearby Locations</h2>
          <p className="text-muted-foreground text-sm">Real-time availability in your area</p>
        </div>
        <Badge variant="secondary" className="gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border-none">
          <Navigation className="h-3 w-3" /> Hyderabad, TS
        </Badge>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredLands.map((land) => {
          const landSlots = slots[land.id] || [];
          const availableCount = landSlots.filter(s => s.status === 'available').length;

          return (
            <Card key={land.id} className="overflow-hidden border-none shadow-xl group hover:ring-2 ring-primary/50 transition-all duration-300 bg-card/50 backdrop-blur-sm">
              <div className="relative aspect-video">
                <Image 
                  src={land.image || `https://picsum.photos/seed/${land.id}/600/400`} 
                  alt={land.name} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  data-ai-hint="parking lot"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-bold">
                  ₹{land.pricePerHour}/hr
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">{land.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" /> Hitech City Area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    availableCount > 0 ? "bg-emerald-500" : "bg-rose-500"
                  )} />
                  <span className="text-sm font-bold text-muted-foreground">
                    {availableCount} slots available now
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full rounded-2xl font-bold py-6 text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow" 
                  onClick={() => setSelectedLand(land)}
                  disabled={availableCount === 0}
                >
                  {availableCount > 0 ? "Select a Spot" : "Fully Occupied"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedLand && !selectedSlot} onOpenChange={() => setSelectedLand(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-none shadow-3xl rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black">{selectedLand?.name}</DialogTitle>
            <DialogDescription className="text-lg">Pick an available <span className="text-emerald-500 font-bold">green</span> slot to book.</DialogDescription>
          </DialogHeader>
          <div className="py-10">
            <SlotGrid 
              slots={slots[selectedLand?.id || ""] || []} 
              onSlotClick={(slot) => slot.status === 'available' && setSelectedSlot(slot)}
            />
          </div>
          <div className="flex justify-center gap-6 text-sm font-bold text-muted-foreground border-t pt-6">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500" /> Available</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500" /> Booked</div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500" /> Occupied</div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedSlot && !!selectedLand} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent className="border-none shadow-3xl rounded-3xl p-0 overflow-hidden max-w-md">
          <div className="bg-primary p-8 text-primary-foreground text-center">
            <h2 className="text-3xl font-black mb-1">Confirmation</h2>
            <p className="opacity-80">Slot {selectedSlot?.slotNumber}</p>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-dashed pb-3">
                <span className="text-muted-foreground font-medium">Location</span>
                <span className="font-bold">{selectedLand?.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-dashed pb-3">
                <span className="text-muted-foreground font-medium">Duration</span>
                <span className="font-bold">2 Hours (Fixed)</span>
              </div>
              <div className="flex justify-between items-center text-2xl font-black text-primary">
                <span>Total Amount</span>
                <span>₹{(selectedLand?.pricePerHour || 0) * 2}</span>
              </div>
            </div>
            
            <Alert className="border-none bg-primary/10 rounded-2xl">
              <Info className="h-5 w-5 text-primary" />
              <AlertDescription className="text-xs font-bold text-primary">
                Your reservation is held for 15 minutes. Show the QR code on arrival.
              </AlertDescription>
            </Alert>

            <Button 
              className="w-full h-14 text-xl font-black gap-3 rounded-2xl shadow-xl shadow-primary/20" 
              disabled={isBooking}
              onClick={handleBook}
            >
              {isBooking ? <Loader2 className="animate-spin" /> : <><CreditCard className="h-6 w-6" /> Confirm & Pay</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { cn } from "@/lib/utils";
