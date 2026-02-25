"use client";

import { useParkStore } from "@/hooks/use-park-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MapPin, Edit3, Trash2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export default function OwnerLandsPage() {
  const { lands } = useParkStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Properties</h1>
          <p className="text-muted-foreground">Manage your parking lands and slot configurations.</p>
        </div>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" /> Add New Land
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lands.map((land) => (
          <Card key={land.id} className="overflow-hidden">
            <div className="relative aspect-video">
              <Image 
                src={land.image || "https://picsum.photos/seed/parking/600/400"} 
                alt={land.name} 
                fill 
                className="object-cover"
              />
              <Badge className="absolute top-3 right-3">
                {land.totalSlots} Slots
              </Badge>
            </div>
            <CardHeader>
              <CardTitle>{land.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Hyderabad, India
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{land.pricePerHour}/hr</div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" className="flex-1 gap-2">
                <Edit3 className="h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
