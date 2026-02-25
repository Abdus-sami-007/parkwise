"use client";

import { useParkStore } from "@/hooks/use-park-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CustomerBookingsPage() {
  const { bookings, lands } = useParkStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline">My Bookings</h1>
        <p className="text-muted-foreground">Manage your active and past reservations.</p>
      </div>

      <div className="grid gap-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => {
            const land = lands.find(l => l.id === booking.landId);
            return (
              <Card key={booking.id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>{land?.name || "Parking Spot"}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" /> Near Hitech City
                    </CardDescription>
                  </div>
                  <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                    {booking.status}
                  </Badge>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{new Date(booking.startTime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">2 Hours Duration</span>
                  </div>
                  <div className="text-lg font-bold">₹{booking.amount}</div>
                </CardContent>
                <div className="p-6 pt-0 flex gap-2">
                  <Button variant="outline" className="gap-2">
                    <QrCode className="h-4 w-4" /> View Ticket
                  </Button>
                  {booking.status === 'confirmed' && (
                    <Button variant="ghost" className="text-destructive hover:bg-destructive/10">
                      Cancel Booking
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg">No bookings yet</h3>
            <p className="text-muted-foreground">Your parking history will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
