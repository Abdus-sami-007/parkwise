"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useUser, useFirestore } from "@/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { Loader2, WifiOff, RefreshCcw } from "lucide-react";
import { useParkStore } from "@/hooks/use-park-store";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading: authLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const pathname = usePathname();
  const [roleChecked, setRoleChecked] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [takingLongTime, setTakingLongTime] = useState(false);
  const initSync = useParkStore(state => state.initSync);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!db) return;

    // Start data sync
    initSync(db);

    // Timeout to detect slow connectivity
    const timer = setTimeout(() => {
      if (!roleChecked) setTakingLongTime(true);
    }, 8000);

    const unsub = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      setIsOffline(false);
      setTakingLongTime(false);
      if (snapshot.exists()) {
        const role = snapshot.data().role;
        if (!pathname.includes(`/dashboard/${role}`)) {
          router.replace(`/dashboard/${role}`);
        } else {
          setRoleChecked(true);
        }
      } else {
        // Fallback for new signups where Firestore might be slow to propagate
        // Wait a bit or assume the signup worked and role is in state
        console.warn("User profile not found in Firestore yet.");
      }
    }, (error) => {
      console.error("Profile listen error:", error);
      setIsOffline(true);
    });

    return () => {
      unsub();
      clearTimeout(timer);
    };
  }, [user, authLoading, db, pathname, router, initSync, roleChecked]);

  if (authLoading || (user && !roleChecked && !isOffline)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4 p-6 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <div className="space-y-2">
          <p className="text-muted-foreground animate-pulse font-medium">Connecting to secure server...</p>
          {takingLongTime && (
            <div className="mt-4 animate-in fade-in slide-in-from-bottom-2">
              <p className="text-xs text-amber-600 font-semibold mb-3">The connection is taking longer than expected.</p>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="gap-2">
                <RefreshCcw className="h-3 w-3" /> Refresh Connection
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isOffline) {
    return (
      <div className="h-screen w-screen flex items-center justify-center p-6 bg-background">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="bg-muted p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-inner">
            <WifiOff className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Network Connection Issue</h1>
            <p className="text-muted-foreground">
              We're having trouble connecting to the real-time database. Please check your internet connection or try again.
            </p>
          </div>
          <Button onClick={() => window.location.reload()} className="w-full gap-2">
            <RefreshCcw className="h-4 w-4" /> Retry Connection
          </Button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <h2 className="text-lg font-semibold capitalize font-headline">
              {pathname.split('/').pop()?.replace(/-/g, ' ') || "Dashboard"}
            </h2>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-8">
          {children}
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
