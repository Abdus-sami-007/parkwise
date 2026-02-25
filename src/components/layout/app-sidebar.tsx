
"use client";

import { useParkStore } from "@/hooks/use-park-store";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  History, 
  CreditCard, 
  Settings, 
  ShieldCheck, 
  BarChart3,
  ParkingCircle,
  PlusCircle,
  Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  const { currentUser } = useParkStore();
  const pathname = usePathname();

  const getMenuItems = () => {
    switch (currentUser?.role) {
      case 'owner':
        return [
          { title: "Overview", icon: LayoutDashboard, url: "/dashboard/owner" },
          { title: "My Lands", icon: MapIcon, url: "/dashboard/owner/lands" },
          { title: "Analytics", icon: BarChart3, url: "/dashboard/owner/analytics" },
          { title: "Guards", icon: Users, url: "/dashboard/owner/guards" },
        ];
      case 'guard':
        return [
          { title: "Live Map", icon: MapIcon, url: "/dashboard/guard" },
          { title: "Check-in/Out", icon: ShieldCheck, url: "/dashboard/guard/patrol" },
          { title: "Reports", icon: BarChart3, url: "/dashboard/guard/reports" },
        ];
      case 'customer':
        return [
          { title: "Explore", icon: MapIcon, url: "/dashboard/customer" },
          { title: "My Bookings", icon: History, url: "/dashboard/customer/bookings" },
          { title: "Payments", icon: CreditCard, url: "/dashboard/customer/payments" },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <ParkingCircle className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold font-headline">ParkWise</span>
                  <span className="text-xs text-muted-foreground">Smart Systems</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.url}
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
