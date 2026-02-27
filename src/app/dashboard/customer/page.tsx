
"use client";

import { useState } from "react";
import { useParkStore } from "@/hooks/use-park-store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Calendar, CreditCard, Info, Grid, Loader2, Navigation } from "lucide-react";
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
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative h-[200px] rounded-2xl overflow-hidden shadow-2xl">
        <Image 
          src="https://picsum.photos/seed/parking-hero/1200/400" 
          alt="Banner" 
          fill 
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
          <h1 className="text-3xl font-extrabold mb-4 font-headline">Find Your Spot</h1>
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              className="pl-12 h-12 text-lg border-none bg-white text-foreground rounded-full shadow-lg" 
              placeholder="Search by area or mall..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-headline">Nearby Locations</h2>
        <Badge variant="secondary" className="gap-1"><Navigation className="h-3 w-3" /> Hyderabad</Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLands.map((land) => {
          const landSlots = slots[land.id] || [];
          const availableCount = landSlots.filter(s => s.status === 'available').length;

          return (
            <Card key={land.id} className="overflow-hidden border-none shadow-lg group hover:ring-2 ring-primary transition-all">
              <div className="relative aspect-video">
                <Image 
                  src={land.image || `https://picsum.photos/seed/${land.id}/600/400`} 
                  alt={land.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform"
                />
                <Badge className="absolute top-3 right-3 bg-white/90 text-primary font-bold">
                  ₹{land.pricePerHour}/hr
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{land.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Hitech City Area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  {availableCount} slots available
                </span>
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-xl font-bold" onClick={() => setSelectedLand(land)}>
                  Select Slot
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Availability Dialog */}
      <Dialog open={!!selectedLand && !selectedSlot} onOpenChange={() => setSelectedLand(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedLand?.name}</DialogTitle>
            <DialogDescription>Pick an available (green) slot to book.</DialogDescription>
          </DialogHeader>
          <div className="py-8">
            <SlotGrid 
              slots={slots[selectedLand?.id || ""] || []} 
              onSlotClick={(slot) => slot.status === 'available' && setSelectedSlot(slot)}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation */}
      <Dialog open={!!selectedSlot && !!selectedLand} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent className="border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Confirm Reservation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-6 rounded-2xl space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="font-bold">{selectedLand?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Slot Number</span>
                <Badge variant="secondary" className="font-bold">{selectedSlot?.slotNumber}</Badge>
              </div>
              <div className="border-t border-dashed pt-3 flex justify-between font-bold text-xl text-primary">
                <span>Total (2h)</span>
                <span>₹{(selectedLand?.pricePerHour || 0) * 2}</span>
              </div>
            </div>
            <Alert className="border-primary/20 bg-primary/5">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-xs">
                Show your digital ticket to the guard on arrival. Free cancellation for 15 mins.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button 
              className="w-full h-12 text-lg font-bold gap-2 rounded-xl" 
              disabled={isBooking}
              onClick={handleBook}
            >
              {isBooking ? <Loader2 className="animate-spin" /> : <><CreditCard className="h-5 w-5" /> Book Now</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
