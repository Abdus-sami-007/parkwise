
"use client";

import { useEffect, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { useFirestore } from "@/firebase";
import { useParkStore } from "@/hooks/use-park-store";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const db = useFirestore();
  const pathname = usePathname();
  const initSync = useParkStore(state => state.initSync);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!db) return;

    // Start background data sync for the store immediately
    initSync(db);
    
    // In prototype mode, we bypass strict auth checks to allow immediate role exploration
    setIsReady(true);
  }, [db, initSync]);

  if (!isReady) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-muted-foreground">Initializing Live Environment...</p>
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
