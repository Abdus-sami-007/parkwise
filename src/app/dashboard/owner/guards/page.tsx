
"use client";

import { useParkStore } from "@/hooks/use-park-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserPlus, Phone, MapPin, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function OwnerGuardsPage() {
  const { availableGuards, lands, loading } = useParkStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGuards = availableGuards.filter(guard => 
    guard.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guard.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline">Guard Recruitment</h1>
          <p className="text-muted-foreground">Discover and recruit security personnel for your parking lands.</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search guards by name..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredGuards.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGuards.map((guard) => (
            <Card key={guard.uid} className="hover:shadow-lg transition-shadow border-none bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-primary/10">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${guard.uid}`} />
                  <AvatarFallback>{guard.displayName?.[0] || guard.email?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{guard.displayName || "Unknown Guard"}</CardTitle>
                  <CardDescription className="text-xs truncate">{guard.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-muted/50 p-2 rounded-lg">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Phone</p>
                    <p className="text-xs font-semibold">{guard.phone || "Not provided"}</p>
                  </div>
                  <div className="bg-muted/50 p-2 rounded-lg">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Status</p>
                    <Badge variant="outline" className="text-[10px] h-4 bg-emerald-50 text-emerald-700 border-emerald-200">
                      Verified
                    </Badge>
                  </div>
                </div>
                
                <div className="pt-2 flex gap-2">
                  <Button className="flex-1 gap-2 font-bold" size="sm">
                    <UserPlus className="h-4 w-4" /> Recruit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 font-bold">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20">
          <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-xl font-bold">No guards found</h3>
          <p className="text-muted-foreground">Try adjusting your search or check back later for new applicants.</p>
        </div>
      )}
    </div>
  );
}
