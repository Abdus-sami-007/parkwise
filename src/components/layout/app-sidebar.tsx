
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
  ShieldCheck, 
  BarChart3,
  ParkingCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavUser } from "./nav-user";

export function AppSidebar() {
  const { currentUser } = useParkStore();
  const pathname = usePathname();

  const role = currentUser?.role || 'customer';

  const getMenuItems = () => {
    switch (role) {
      case 'owner':
        return [
          { title: "Portfolio", icon: LayoutDashboard, url: "/dashboard/owner" },
          { title: "Manage Lands", icon: MapIcon, url: "/dashboard/owner/lands" },
          { title: "Analytics", icon: BarChart3, url: "/dashboard/owner/analytics" },
          { title: "Recruit Guards", icon: Users, url: "/dashboard/owner/guards" },
        ];
      case 'guard':
        return [
          { title: "Live Patrol", icon: MapIcon, url: "/dashboard/guard" },
          { title: "Duty Logs", icon: ShieldCheck, url: "/dashboard/guard/patrol" },
          { title: "Reports", icon: BarChart3, url: "/dashboard/guard/reports" },
        ];
      case 'customer':
        return [
          { title: "Find Parking", icon: MapIcon, url: "/dashboard/customer" },
          { title: "My Bookings", icon: History, url: "/dashboard/customer/bookings" },
          { title: "Wallet", icon: CreditCard, url: "/dashboard/customer/payments" },
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
            <div className="flex items-center justify-between p-2">
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg">
                    <ParkingCircle className="size-5" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-bold font-headline">ParkWise</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-black">{role} Control</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] font-bold uppercase tracking-widest opacity-50">Main Menu</SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.url}
                  tooltip={item.title}
                  className="rounded-xl mx-2"
                >
                  <Link href={item.url}>
                    <item.icon className="size-4" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-2">
          <NavUser />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
