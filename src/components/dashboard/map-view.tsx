
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapViewProps {
  locations?: { name: string; lat: number; lng: number }[];
  className?: string;
  center?: { lat: number; lng: number };
}

export function MapView({ locations, className, center }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className={cn("bg-muted animate-pulse rounded-xl", className)} />;

  return (
    <Card className={cn("relative overflow-hidden bg-slate-100 dark:bg-slate-900 border-none shadow-inner group", className)}>
      {/* Decorative Grid Patterns representing a map */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '40px 40px' 
        }} />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      </div>

      {/* Mock Map Features */}
      <div className="absolute top-1/2 left-1/4 w-32 h-16 bg-white dark:bg-slate-800 rounded-lg rotate-12 flex items-center justify-center shadow-sm">
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Main Street</span>
      </div>
      <div className="absolute bottom-1/4 right-1/3 w-40 h-12 bg-white dark:bg-slate-800 rounded-lg -rotate-6 flex items-center justify-center shadow-sm">
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Park Avenue</span>
      </div>

      {/* Location Markers */}
      {locations?.map((loc, i) => (
        <div 
          key={i} 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110"
          style={{ 
            top: `${30 + (i * 20)}%`, 
            left: `${40 + (i * 15)}%` 
          }}
        >
          <div className="relative group/pin">
            <div className="bg-primary text-white p-1.5 rounded-full shadow-lg relative z-10">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rotate-45 z-0" />
            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap bg-background px-2 py-1 rounded text-[10px] font-bold shadow-md opacity-0 group-hover/pin:opacity-100 transition-opacity">
              {loc.name}
            </div>
          </div>
        </div>
      ))}

      {/* User Current Position Mock */}
      <div className="absolute bottom-8 right-8 bg-blue-500 p-2 rounded-full shadow-xl animate-bounce">
        <Navigation className="h-5 w-5 text-white fill-white" />
      </div>

      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-medium border flex items-center gap-2 shadow-sm">
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        GPS Signal: High Accuracy
      </div>
    </Card>
  );
}
