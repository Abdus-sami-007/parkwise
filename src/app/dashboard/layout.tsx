
"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useFirestore, useUser } from "@/firebase";
import { useParkStore } from "@/hooks/use-park-store";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = useFirestore();
  const { user, loading: authLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const initSync = useParkStore(state => state.initSync);
  const [isReady, setIsReady] = useState(false);
  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    if (!db) return;

    // Start background data sync immediately
    initSync(db);
    
    // In prototype mode, we prioritize access. 
    // We'll show a retry if authentication or database takes too long.
    const timer = setTimeout(() => {
      if (!isReady) setShowRetry(true);
    }, 5000);

    if (!authLoading) {
      setIsReady(true);
    }

    return () => clearTimeout(timer);
  }, [db, initSync, authLoading]);

  if (!isReady) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4 p-6 text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-sm font-medium text-muted-foreground">Checking Database Connection...</p>
        {showRetry && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <p className="text-xs text-muted-foreground max-w-xs">
              This environment might have restricted WebSocket access. Bypassing and using Long Polling...
            </p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="gap-2">
              <RefreshCcw className="h-3 w-3" /> Retry Connection
            </Button>
          </div>
        )}
      </div>
    );
  }

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
