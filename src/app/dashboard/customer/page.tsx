
"use client";

import { useState } from "react";
import { useParkStore } from "@/hooks/use-park-store";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Calendar, CreditCard, CheckCircle2, Info, Map as MapIcon, Grid } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapView } from "@/components/dashboard/map-view";
import { useUser } from "@/firebase";

export default function CustomerDashboard() {
  const { lands, slots, createBooking } = useParkStore();
  const { user } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLand, setSelectedLand] = useState<ParkingLand | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const { toast } = useToast();

  const filteredLands = lands.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBook = () => {
    if (user && selectedLand && selectedSlot) {
      setIsBooking(true);
      setTimeout(() => {
        createBooking({
          userId: user.uid,
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
      <div className="relative h-[240px] rounded-2xl overflow-hidden mb-8 shadow-xl">
        <Image 
          src="https://picsum.photos/seed/customer-hero/1200/400" 
          alt="Banner" 
          fill 
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-white text-center">
          <h1 className="text-4xl font-extrabold mb-6 font-headline drop-shadow-md">Where are you going today?</h1>
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input 
              className="pl-12 h-14 text-lg border-none bg-white/95 dark:bg-slate-900/95 text-foreground rounded-full shadow-2xl focus:ring-4 ring-primary/20" 
              placeholder="Search by city, mall or area name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-headline">Available Properties</h2>
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="grid" className="gap-2"><Grid className="h-4 w-4" /> Grid</TabsTrigger>
            <TabsTrigger value="map" className="gap-2"><MapIcon className="h-4 w-4" /> Map</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="grid">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredLands.map((land) => {
              const landSlots = slots[land.id] || [];
              const availableCount = landSlots.filter(s => s.status === 'available').length;

              return (
                <Card key={land.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-none bg-card/50 backdrop-blur-sm group">
                  <div className="relative aspect-video">
                    <Image 
                      src={land.image || "https://picsum.photos/seed/parking/600/400"} 
                      alt={land.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Badge className="absolute top-3 right-3 bg-white/90 text-primary font-bold shadow-lg">
                      ₹{land.pricePerHour}/hr
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl line-clamp-1">{land.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> Hitech City, Hyderabad
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded">
                        {availableCount} slots available
                      </span>
                      <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-muted overflow-hidden">
                            <Image src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i+10}`} alt="user" width={32} height={32} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full rounded-full gap-2 font-bold" onClick={() => setSelectedLand(land)}>
                      Check Availability
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="map">
          <MapView 
            locations={filteredLands.map(l => ({ name: l.name, lat: l.location.lat, lng: l.location.lng }))} 
            className="h-[600px]"
          />
        </TabsContent>
      </Tabs>

      {/* Availability Dialog */}
      <Dialog open={!!selectedLand} onOpenChange={() => setSelectedLand(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedLand?.name}</DialogTitle>
            <DialogDescription>Select an available slot to reserve your space.</DialogDescription>
          </DialogHeader>
          
          <div className="py-8">
            <SlotGrid 
              slots={slots[selectedLand?.id || ""] || []} 
              onSlotClick={(slot) => slot.status === 'available' && setSelectedSlot(slot)}
            />
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-4 sm:justify-between items-center border-t pt-6">
            <div className="text-sm flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              {selectedSlot ? (
                <p>Selected Slot: <span className="font-bold text-primary">{selectedSlot.slotNumber}</span></p>
              ) : (
                <p className="text-muted-foreground">Please select an emerald green slot</p>
              )}
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => setSelectedLand(null)}>Cancel</Button>
              <Button 
                disabled={!selectedSlot} 
                className="flex-1 sm:flex-none"
                onClick={() => {}} // Proceed to summary
              >
                Continue
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Booking Confirmation */}
      <Dialog open={!!selectedSlot && !!selectedLand} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent className="border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Confirm Booking</DialogTitle>
            <DialogDescription>Summary for your reservation</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted/50 p-6 rounded-2xl space-y-4 border border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Location</span>
                <span className="font-bold">{selectedLand?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Slot Number</span>
                <Badge variant="secondary" className="font-bold text-lg px-4">{selectedSlot?.slotNumber}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-bold flex items-center gap-1"><Calendar className="h-4 w-4" /> 2 Hours</span>
              </div>
              <div className="border-t border-dashed pt-4 flex justify-between items-center font-bold text-2xl text-primary">
                <span>Total</span>
                <span>₹{(selectedLand?.pricePerHour || 0) * 2}</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-primary/5 text-primary rounded-xl text-xs">
              <Info className="h-5 w-5 shrink-0" />
              <p>Free cancellation up to 30 mins before arrival. Parking rates are subject to slight changes during peak hours.</p>
            </div>
          </div>
          <DialogFooter>
            <Button 
              className="w-full h-12 text-lg font-bold gap-3 rounded-xl shadow-lg" 
              disabled={isBooking}
              onClick={handleBook}
            >
              {isBooking ? <Loader2 className="animate-spin" /> : <><CreditCard className="h-5 w-5" /> Pay & Confirm</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
