
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserPlus, Phone, MapPin } from "lucide-react";

export default function OwnerGuardsPage() {
  const guards = [
    { id: 1, name: "Ramesh Kumar", land: "Hyderabad Central Mall", status: "on-duty", phone: "+91 98XXX XXX01" },
    { id: 2, name: "Suresh Singh", land: "Hitech City Corp", status: "on-duty", phone: "+91 98XXX XXX02" },
    { id: 3, name: "Vikram Rathore", land: "Gachibowli Square", status: "off-duty", phone: "+91 98XXX XXX03" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">Guard Management</h1>
          <p className="text-muted-foreground">Monitor and assign security personnel to your properties.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" /> Recruit Guard
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {guards.map((guard) => (
          <Card key={guard.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${guard.name}`} />
                <AvatarFallback>{guard.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg">{guard.name}</CardTitle>
                <Badge variant={guard.status === 'on-duty' ? 'default' : 'secondary'}>
                  {guard.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Assigned: <span className="font-semibold">{guard.land}</span></span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{guard.phone}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1 text-xs">Assign Shift</Button>
                <Button variant="outline" className="flex-1 text-xs">View Performance</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
