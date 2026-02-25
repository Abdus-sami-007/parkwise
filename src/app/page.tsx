
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useParkStore } from "@/hooks/use-park-store";
import { useRouter } from "next/navigation";
import { MapPin, ShieldCheck, UserCircle, LayoutDashboard, ParkingCircle } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { login } = useParkStore();
  const router = useRouter();

  const handleRoleSelection = (role: 'owner' | 'guard' | 'customer') => {
    login(role);
    router.push(`/dashboard/${role}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-white">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-lg">
            <ParkingCircle className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-bold text-primary font-headline">ParkWise</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-12 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tighter text-foreground sm:text-6xl font-headline">
            Smart Parking, <span className="text-primary">Simpler</span> Life
          </h1>
          <p className="text-xl text-muted-foreground max-w-[700px] mx-auto">
            The next generation of parking management. Seamless integration for landowners, 
            guards, and drivers in one powerful platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary group" onClick={() => handleRoleSelection('owner')}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                <LayoutDashboard className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="mt-4 text-2xl">Land Owner</CardTitle>
              <CardDescription>
                Manage lands, track revenue, and monitor your parking empire.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button className="w-full">Enter Dashboard</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-accent group" onClick={() => handleRoleSelection('guard')}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-accent/10 p-4 rounded-full group-hover:bg-accent/20 transition-colors">
                <ShieldCheck className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="mt-4 text-2xl">Parking Guard</CardTitle>
              <CardDescription>
                Real-time slot management and vehicle check-in/out services.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-white">Start Patrol</Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all cursor-pointer border-2 hover:border-primary group" onClick={() => handleRoleSelection('customer')}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="mt-4 text-2xl">Customer</CardTitle>
              <CardDescription>
                Find and book parking spaces instantly at the best prices.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button className="w-full">Find Parking</Button>
            </CardContent>
          </Card>
        </div>

        <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
          <Image 
            src="https://picsum.photos/seed/park1/1200/600" 
            alt="Hero Parking" 
            fill 
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
            <p className="text-white text-3xl font-bold max-w-lg">
              Manage your parking spaces with precision using our advanced AI-driven tools.
            </p>
          </div>
        </div>
      </main>

      <footer className="py-8 border-t text-center text-muted-foreground bg-white">
        <p>© 2024 ParkWise Smart Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}
