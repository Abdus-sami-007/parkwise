"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useUser, useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useParkStore } from "@/hooks/use-park-store";
import { useToast } from "@/hooks/use-toast";

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
  const initSync = useParkStore(state => state.initSync);

  // Memoized checkRole function to prevent unnecessary re-runs
  const checkRole = useCallback(async () => {
    if (!user || !db) return;

    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const role = userData.role;
        
        // Redirect if on the wrong dashboard for their role
        if (!pathname.includes(`/dashboard/${role}`)) {
          console.log(`Redirecting to /dashboard/${role}`);
          router.replace(`/dashboard/${role}`);
        } else {
          setRoleLoading(false);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Profile Missing",
          description: "We couldn't find your profile. Please sign up.",
        });
        router.replace("/signup");
      }
    } catch (e: any) {
      console.error("Dashboard check error:", e);
      if (e.message?.includes('offline') || e.code === 'unavailable') {
        toast({
          variant: "destructive",
          title: "Connection Issue",
          description: "Retrying connection to profile server...",
        });
        // Retry once after a delay
        setTimeout(checkRole, 3000);
      } else {
        setRoleLoading(false);
      }
    }
  }, [user, db, pathname, router, toast]);

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

  if (authLoading || (user && roleLoading)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Verifying account access...</p>
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
