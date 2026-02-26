"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (db && user) {
      initSync(db);
    }
  }, [initSync, db, user]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    const checkRole = async () => {
      if (user && db) {
        try {
          // Explicitly fetch the user profile to confirm role and permissions
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.role;
            
            // If the user is on the wrong dashboard for their role, redirect them
            if (!pathname.includes(`/dashboard/${role}`)) {
              console.log(`Redirecting to correct dashboard for role: ${role}`);
              router.replace(`/dashboard/${role}`);
            }
          } else {
            console.warn("User document not found in Firestore.");
            toast({
              variant: "destructive",
              title: "Profile Missing",
              description: "We couldn't find your user profile. Please try signing up again.",
            });
            // If the profile document is missing, we might need to send them to a profile setup or back to login
          }
        } catch (e: any) {
          console.error("Error checking user role in layout:", e);
          if (e.code === 'permission-denied') {
            toast({
              variant: "destructive",
              title: "Access Denied",
              description: "You don't have permission to access this data. Check Firestore rules.",
            });
          }
        } finally {
          setRoleLoading(false);
        }
      }
    };

    checkRole();
  }, [user, authLoading, router, pathname, db, toast]);

  // Loading screen for initial auth or role verification
  if (authLoading || (user && roleLoading)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium">Verifying account access...</p>
      </div>
    );
  }

  // Final check to prevent unauthorized render
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
