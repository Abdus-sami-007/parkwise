"use client";

import { useState } from "react";
import { useParkStore } from "@/hooks/use-park-store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Calendar, CreditCard, CheckCircle2, Info } from "lucide-react";
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
  const { lands, slots, currentUser, createBooking } = useParkStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLand, setSelectedLand] = useState<ParkingLand | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const filteredLands = lands.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBook = () => {
    if (currentUser && selectedLand && selectedSlot) {
      setIsBooking(true);
      // Simulate payment delay
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
        setIsBooking(false);
        setSelectedSlot(null);
        setSelectedLand(null);
        toast({
          title: "Booking Confirmed!",
          description: "Your spot is reserved. Show the QR code to the guard on arrival.",
        });
      }, 1500);
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative h-[200px] rounded-2xl overflow-hidden mb-8">
        <Image 
          src="https://picsum.photos/seed/customer-hero/1200/400" 
          alt="Banner" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-6 text-white text-center">
          <h1 className="text-3xl font-bold mb-4 font-headline">Where are you going today?</h1>
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              className="pl-10 h-12 text-black bg-white rounded-full" 
              placeholder="Search by city, mall or area name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLands.map((land) => {
          const landSlots = slots[land.id] || [];
          const availableCount = landSlots.filter(s => s.status === 'available').length;

          return (
            <Card key={land.id} className="overflow-hidden hover:shadow-lg transition-shadow border-none shadow-sm">
              <div className="relative aspect-video">
                <Image 
                  src={land.image || "https://picsum.photos/seed/parking/600/400"} 
                  alt={land.name} 
                  fill 
                  className="object-cover"
                />
                <Badge className="absolute top-3 right-3 bg-white/90 text-primary font-bold">
                  ₹{land.pricePerHour}/hr
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl line-clamp-1">{land.name}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Near Hitech City, Hyderabad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-emerald-600">
                    {availableCount} slots available
                  </span>
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                        <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" width={24} height={24} />
                      </div>
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-primary text-[8px] flex items-center justify-center text-white">+5</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full rounded-full" onClick={() => setSelectedLand(land)}>
                  Check Availability
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedLand} onOpenChange={() => setSelectedLand(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedLand?.name}</DialogTitle>
            <DialogDescription>Select an available slot to reserve your space.</DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <SlotGrid 
              slots={slots[selectedLand?.id || ""] || []} 
              onSlotClick={(slot) => slot.status === 'available' && setSelectedSlot(slot)}
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-4 sm:justify-between items-center">
            <div className="text-sm">
              {selectedSlot ? (
                <p>Selected Slot: <span className="font-bold text-primary">{selectedSlot.slotNumber}</span></p>
              ) : (
                <p className="text-muted-foreground">Please select an emerald green slot</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedLand(null)}>Cancel</Button>
              <Button disabled={!selectedSlot} onClick={() => {}}>Continue to Payment</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedSlot && !!selectedLand} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>Summary for your reservation</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Location</span>
                <span className="font-medium">{selectedLand?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Slot Number</span>
                <span className="font-medium">{selectedSlot?.slotNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration</span>
                <span className="font-medium">2 Hours (Approx)</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span>₹{(selectedLand?.pricePerHour || 0) * 2}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
              <Info className="h-4 w-4" />
              Free cancellation up to 30 mins before arrival.
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full gap-2" 
              disabled={isBooking}
              onClick={handleBook}
            >
              {isBooking ? "Processing..." : <><CreditCard className="h-4 w-4" /> Pay & Confirm</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
