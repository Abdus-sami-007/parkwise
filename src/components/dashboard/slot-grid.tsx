
"use client";

import { ParkingSlot } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Car, User } from "lucide-react";

interface SlotGridProps {
  slots: ParkingSlot[];
  onSlotClick?: (slot: ParkingSlot) => void;
}

export function SlotGrid({ slots, onSlotClick }: SlotGridProps) {
  const getStatusColor = (status: ParkingSlot['status']) => {
    switch (status) {
      case 'available': return 'bg-emerald-500 hover:bg-emerald-600';
      case 'booked': return 'bg-amber-500 hover:bg-amber-600';
      case 'occupied': return 'bg-rose-500 hover:bg-rose-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2">
      {slots.map((slot) => (
        <Card 
          key={slot.id}
          className={cn(
            "cursor-pointer transition-transform duration-100 transform active:scale-95 border-none shadow-sm h-20 flex flex-col items-center justify-center text-white",
            getStatusColor(slot.status)
          )}
          onClick={() => onSlotClick?.(slot)}
        >
          <CardContent className="p-0 flex flex-col items-center justify-center">
            <span className="font-bold text-sm">{slot.slotNumber}</span>
            {slot.status === 'occupied' && <Car className="h-3 w-3 mt-1" />}
            {slot.status === 'booked' && <User className="h-3 w-3 mt-1" />}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
