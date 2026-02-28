"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ShieldCheck, LayoutDashboard, ParkingCircle, ArrowRight, CheckCircle2, UserCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useParkStore } from "@/hooks/use-park-store";

export default function Home() {
  const router = useRouter();
  const login = useParkStore(state => state.login);

  const roles = [
    {
      role: "owner",
      title: "Property Owner",
      description: "Monetize your space and manage large-scale parking operations.",
      icon: LayoutDashboard,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      features: ["Add Parking Lands", "Revenue Analytics", "Guard Management"]
    },
    {
      role: "guard",
      title: "Security Guard",
      description: "Real-time traffic monitoring and automated vehicle logging.",
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      features: ["Live Patrol View", "Plate Verification", "Incident Reporting"]
    },
    {
      role: "customer",
      title: "Driver / Customer",
      description: "The fastest way to find and book parking in your city.",
      icon: UserCircle,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      features: ["Instant Booking", "Real-time Availability", "Digital Passes"]
    }
  ];

  const handleRoleEntry = (role: string) => {
    login(role, `${role}@example.com`, role.charAt(0).toUpperCase() + role.slice(1));
    router.push(`/dashboard/${role}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-6 py-5 flex items-center justify-between border-b bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2.5 rounded-2xl shadow-xl shadow-primary/20">
            <ParkingCircle className="text-white h-7 w-7" />
          </div>
          <span className="text-2xl font-black text-primary font-headline tracking-tighter">ParkWise</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center p-6 space-y-16 max-w-7xl mx-auto w-full py-20">
        <div className="text-center space-y-6 max-w-4xl">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-black uppercase tracking-widest mb-4">
            Smart City Solutions
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-foreground font-headline leading-[0.9]">
            The Future of <span className="text-primary">Parking</span> is Here.
          </h1>
          <p className="text-2xl text-muted-foreground font-medium">
            Instant entry for property owners, security teams, and drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
          {roles.map((role) => (
            <Card 
              key={role.title} 
              className="hover:shadow-3xl transition-all duration-500 border-none bg-card/40 backdrop-blur-md group flex flex-col overflow-hidden hover:-translate-y-2"
            >
              <CardHeader className="text-center pb-4 pt-10">
                <div className={`mx-auto p-6 rounded-3xl ${role.bg} transition-all group-hover:scale-110 shadow-inner mb-6`}>
                  <role.icon className={`h-12 w-12 ${role.color}`} />
                </div>
                <CardTitle className="text-3xl font-black">{role.title}</CardTitle>
                <CardDescription className="text-lg font-medium mt-2 min-h-[60px]">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 px-8">
                <ul className="space-y-3 mb-10">
                  {role.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-base font-bold text-muted-foreground/80">
                      <CheckCircle2 className="h-5 w-5 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-8 pt-0 mt-auto">
                <Button 
                  className="w-full h-14 text-xl font-black rounded-2xl gap-3 shadow-2xl shadow-primary/20 hover:shadow-primary/40 transition-all" 
                  onClick={() => handleRoleEntry(role.role)}
                >
                  Enter Portal <ArrowRight className="h-6 w-6" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="w-full py-16 border-t mt-12 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div>
            <div className="text-4xl font-black text-primary mb-2">99.9%</div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Uptime</div>
          </div>
          <div>
            <div className="text-4xl font-black text-primary mb-2">15k+</div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Active Slots</div>
          </div>
          <div>
            <div className="text-4xl font-black text-primary mb-2">0.5s</div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Sync Speed</div>
          </div>
          <div>
            <div className="text-4xl font-black text-primary mb-2">24/7</div>
            <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">AI Monitoring</div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t bg-card/30 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 text-muted-foreground text-sm font-bold">
          <div>© 2024 ParkWise Smart Systems. Prototyping Mode.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}