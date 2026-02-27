
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ShieldCheck, LayoutDashboard, ParkingCircle, ArrowRight, CheckCircle2, UserCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const router = useRouter();

  const roles = [
    {
      role: "owner",
      title: "Property Owner",
      description: "Manage your parking lands, track revenue, and recruit guards.",
      icon: LayoutDashboard,
      color: "text-blue-600",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      path: "/dashboard/owner",
      features: ["Add Parking Lands", "View Analytics", "Recruit Guards"]
    },
    {
      role: "guard",
      title: "Security Guard",
      description: "Live patrol, automated check-in/out, and duty reporting.",
      icon: ShieldCheck,
      color: "text-emerald-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      path: "/dashboard/guard",
      features: ["Live Slot Map", "Vehicle Verification", "Shift Logs"]
    },
    {
      role: "customer",
      title: "Customer / Driver",
      description: "Find, book, and pay for parking spots in seconds.",
      icon: UserCircle,
      color: "text-orange-600",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      path: "/dashboard/customer",
      features: ["Real-time Availability", "Instant Booking", "Digital Tickets"]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-6 py-4 flex items-center justify-between border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <ParkingCircle className="text-white h-6 w-6" />
          </div>
          <span className="text-2xl font-black text-primary font-headline tracking-tighter">ParkWise</span>
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center p-6 space-y-12 max-w-7xl mx-auto w-full py-16">
        <div className="text-center space-y-4 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-foreground font-headline leading-[1.1]">
            Select Your <span className="text-primary">Role</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Experience the future of parking management. Enter the system directly to explore specialized dashboards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {roles.map((role) => (
            <Card 
              key={role.title} 
              className="hover:shadow-2xl transition-all duration-300 border-none bg-card/50 backdrop-blur-sm group flex flex-col overflow-hidden"
            >
              <CardHeader className="text-center pb-2">
                <div className={`mx-auto p-5 rounded-2xl ${role.bg} transition-colors shadow-inner mb-4`}>
                  <role.icon className={`h-10 w-10 ${role.color}`} />
                </div>
                <CardTitle className="text-2xl font-bold">{role.title}</CardTitle>
                <CardDescription className="text-base min-h-[60px]">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-2 mb-8">
                  {role.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                <Button 
                  className="w-full h-12 text-lg font-bold rounded-xl gap-2" 
                  onClick={() => router.push(`/login?role=${role.role}`)}
                >
                  Enter as {role.title.split(' ')[0]} <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 w-full border-t pt-16 mt-8">
          {[
            { title: "24/7 Security", desc: "Live monitoring and AI suggestions" },
            { title: "Instant Booking", desc: "Reserve spots with zero friction" },
            { title: "Revenue Tools", desc: "Deep analytics for property owners" },
            { title: "Smart Patrol", desc: "Efficient slot management for guards" }
          ].map((feat, i) => (
            <div key={i} className="space-y-2">
              <div className="h-1 w-10 bg-primary rounded-full mb-4" />
              <h4 className="font-bold text-lg">{feat.title}</h4>
              <p className="text-sm text-muted-foreground">{feat.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-12 border-t bg-background mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground text-sm font-medium">
          © 2024 ParkWise Smart Systems. Prototyping Mode Active.
        </div>
      </footer>
    </div>
  );
}
