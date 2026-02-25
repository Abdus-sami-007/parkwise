
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { MapPin, ShieldCheck, LayoutDashboard, ParkingCircle, ArrowRight, Star, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUser } from "@/firebase";
import { cn } from "@/lib/utils";

export default function Home() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <ParkingCircle className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-black text-primary font-headline tracking-tighter">ParkWise</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <Button onClick={() => router.push('/dashboard/customer')}>Go to Dashboard</Button>
          ) : (
            <Button onClick={() => router.push('/login')}>Sign In</Button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-6 space-y-24 max-w-7xl mx-auto w-full py-20">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1 rounded-full text-sm font-bold">
            Trusted by 50,000+ drivers weekly
          </Badge>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground font-headline leading-[0.9]">
            Smart Parking, <br />
            <span className="text-primary italic">Simpler</span> Life
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Revolutionizing urban mobility with AI-powered slot management, real-time tracking, 
            and seamless digital payments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="h-14 px-8 text-lg font-bold rounded-2xl shadow-xl shadow-primary/30 gap-2" onClick={() => router.push('/login')}>
              Get Started for Free <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold rounded-2xl border-2">
              How it works
            </Button>
          </div>
        </div>

        {/* Roles Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-none bg-card/50 backdrop-blur-sm group relative overflow-hidden" onClick={() => router.push('/login')}>
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <LayoutDashboard className="h-32 w-32 -mr-8 -mt-8" />
            </div>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-5 rounded-2xl group-hover:bg-primary/20 transition-colors shadow-inner">
                <LayoutDashboard className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="mt-6 text-2xl font-bold">Land Owner</CardTitle>
              <CardDescription className="text-base">
                Digitize your property. Track occupancy in real-time and maximize revenue with smart pricing.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-none bg-card/50 backdrop-blur-sm group relative overflow-hidden" onClick={() => router.push('/login')}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-accent/10 p-5 rounded-2xl group-hover:bg-accent/20 transition-colors shadow-inner">
                <ShieldCheck className="h-10 w-10 text-accent" />
              </div>
              <CardTitle className="mt-6 text-2xl font-bold">Parking Guard</CardTitle>
              <CardDescription className="text-base">
                AI-assisted patrol. Automated check-in/out and license plate recognition at your fingertips.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-none bg-card/50 backdrop-blur-sm group relative overflow-hidden" onClick={() => router.push('/login')}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-5 rounded-2xl group-hover:bg-primary/20 transition-colors shadow-inner">
                <MapPin className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="mt-6 text-2xl font-bold">Customer</CardTitle>
              <CardDescription className="text-base">
                Find, book, and pay for parking in seconds. Never waste time searching for a spot again.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 w-full border-t pt-24">
          {[
            { title: "24/7 Security", desc: "Live monitoring and guard support" },
            { title: "Instant Booking", desc: "Reserve spots 30 days in advance" },
            { title: "Smart Payments", desc: "UPI, Cards, and Wallet support" },
            { title: "AI Analytics", desc: "Revenue forecasting for owners" }
          ].map((feat, i) => (
            <div key={i} className="space-y-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <h4 className="font-bold text-xl">{feat.title}</h4>
              <p className="text-muted-foreground">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-20 border-t bg-background">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <ParkingCircle className="text-primary h-8 w-8" />
              <span className="text-3xl font-black text-primary tracking-tighter">ParkWise</span>
            </div>
            <p className="text-muted-foreground text-lg max-w-md">
              Making urban environments smarter, one parking spot at a time.
            </p>
          </div>
          <div className="space-y-4">
            <h5 className="font-bold uppercase tracking-widest text-sm text-primary">Platform</h5>
            <ul className="space-y-2 text-muted-foreground">
              <li className="hover:text-primary cursor-pointer transition-colors">Find Parking</li>
              <li className="hover:text-primary cursor-pointer transition-colors">List your Land</li>
              <li className="hover:text-primary cursor-pointer transition-colors">Guard Portal</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t text-center text-muted-foreground text-sm font-medium">
          © 2024 ParkWise Smart Systems. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center justify-center font-bold", className)}>
      {children}
    </span>
  );
}
