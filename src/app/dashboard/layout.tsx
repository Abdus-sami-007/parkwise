"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useUser, useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Loader2, WifiOff } from "lucide-react";
import { useParkStore } from "@/hooks/use-park-store";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
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
  const { toast } = useToast();
  const [roleLoading, setRoleLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const initSync = useParkStore(state => state.initSync);
  const checkAttempts = useRef(0);

  const checkRole = useCallback(async () => {
    if (!user || !db) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      
      // Attempt with timeout
      const docPromise = getDoc(userDocRef);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("timeout")), 8000)
      );

      const userDoc = await Promise.race([docPromise, timeoutPromise]) as any;
      
      if (userDoc && userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;
        setIsOffline(false);
        
        if (!pathname.includes(`/dashboard/${role}`)) {
          router.replace(`/dashboard/${role}`);
        } else {
          setRoleLoading(false);
        }
      } else {
        router.replace("/signup");
      }
    } catch (e: any) {
      console.error("Dashboard role check error:", e);
      if (e.message === "timeout" || e.code === 'unavailable') {
        setIsOffline(true);
        checkAttempts.current += 1;
        if (checkAttempts.current < 3) {
          setTimeout(checkRole, 3000);
        }
      } else {
        setRoleLoading(false);
      }
    }
  }, [user, db, pathname, router]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/login");
      } else if (db) {
        checkRole();
        initSync(db);
      }
    }
  }, [user, authLoading, db, checkRole, initSync, router]);

  if (authLoading || (user && roleLoading && !isOffline)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Connecting to secure services...</p>
      </div>
    );
  }

  if (isOffline) {
    return (
      <div className="h-screen w-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="bg-muted p-6 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
            <WifiOff className="h-10 w-10 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Connection Sluggish</h1>
            <p className="text-muted-foreground">
              We're having trouble reaching the database. This usually happens on restricted networks or during initial setup.
            </p>
          </div>
          <Button onClick={() => window.location.reload()} className="w-full">
            Retry Connection
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
