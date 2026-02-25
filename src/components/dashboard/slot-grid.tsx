
"use client";

import { ParkingSlot } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Car, User, Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SlotGridProps {
  slots: ParkingSlot[];
  onSlotClick?: (slot: ParkingSlot) => void;
  showDetails?: boolean;
}

export function SlotGrid({ slots, onSlotClick, showDetails = false }: SlotGridProps) {
  const getStatusColor = (status: ParkingSlot['status']) => {
    switch (status) {
      case 'available': return 'bg-emerald-500 hover:bg-emerald-600';
      case 'booked': return 'bg-amber-500 hover:bg-amber-600';
      case 'occupied': return 'bg-rose-500 hover:bg-rose-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
      <TooltipProvider>
        {slots.map((slot) => (
          <Tooltip key={slot.id}>
            <TooltipTrigger asChild>
              <Card 
                className={cn(
                  "cursor-pointer transition-all duration-200 transform hover:scale-105 border-none shadow-sm h-24 flex flex-col items-center justify-center text-white",
                  getStatusColor(slot.status)
                )}
                onClick={() => onSlotClick?.(slot)}
              >
                <CardContent className="p-2 flex flex-col items-center gap-1">
                  <span className="font-bold text-lg">{slot.slotNumber}</span>
                  {slot.status === 'occupied' && <Car className="h-4 w-4" />}
                  {slot.status === 'booked' && <User className="h-4 w-4" />}
                </CardContent>
              </Card>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-xs">
                <p><strong>Slot:</strong> {slot.slotNumber}</p>
                <p className="capitalize"><strong>Status:</strong> {slot.status}</p>
                {slot.currentVehicle && <p><strong>Plate:</strong> {slot.currentVehicle}</p>}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
