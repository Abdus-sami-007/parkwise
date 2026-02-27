
"use client";

import { useParkStore } from "@/hooks/use-park-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MapPin, Edit3, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFirestore, useUser } from "@/firebase";
import { useToast } from "@/hooks/use-toast";

export default function OwnerLandsPage() {
  const { lands, addParkingLand } = useParkStore();
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    totalSlots: 20,
    pricePerHour: 40
  });

  const handleAddLand = async () => {
    if (!user || !db) return;
    setIsAdding(true);
    
    try {
      addParkingLand(db, user.uid, {
        name: formData.name,
        totalSlots: Number(formData.totalSlots),
        pricePerHour: Number(formData.pricePerHour)
      });
      
      toast({
        title: "Property Added",
        description: `${formData.name} has been listed successfully.`
      });
      setIsDialogOpen(false);
      setFormData({ name: "", totalSlots: 20, pricePerHour: 40 });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Properties</h1>
          <p className="text-muted-foreground">Manage your parking lands and slot configurations.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <PlusCircle className="h-4 w-4" /> Add New Land
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Parking Property</DialogTitle>
              <DialogDescription>Enter the details to list your new parking land.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Property Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Skyline Mall Parking" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slots">Total Slots</Label>
                  <Input 
                    id="slots" 
                    type="number" 
                    value={formData.totalSlots}
                    onChange={(e) => setFormData({...formData, totalSlots: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹/hr)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    value={formData.pricePerHour}
                    onChange={(e) => setFormData({...formData, pricePerHour: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddLand} disabled={isAdding || !formData.name}>
                {isAdding ? <Loader2 className="animate-spin" /> : "List Property"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lands.map((land) => (
          <Card key={land.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow bg-card/50 backdrop-blur-sm group">
            <div className="relative aspect-video">
              <Image 
                src={land.image || `https://picsum.photos/seed/${land.id}/600/400`} 
                alt={land.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <Badge className="absolute top-3 right-3 bg-primary/90">
                {land.totalSlots} Slots
              </Badge>
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{land.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Hyderabad, India
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹{land.pricePerHour}/hr</div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" className="flex-1 gap-2 rounded-full">
                <Edit3 className="h-4 w-4" /> Edit
              </Button>
              <Button variant="destructive" size="icon" className="rounded-full">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {lands.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed rounded-3xl bg-muted/20">
          <PlusCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold">No properties listed yet</h3>
          <p className="text-muted-foreground">Click the button above to add your first parking land.</p>
        </div>
      )}
    </div>
  );
}
