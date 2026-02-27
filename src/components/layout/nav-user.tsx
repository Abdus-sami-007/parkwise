
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useParkStore } from "@/hooks/use-park-store";

export function NavUser() {
  const { currentUser } = useParkStore();
  const router = useRouter();

  if (!currentUser) return null;

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 border-t">
      <Avatar>
        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.uid}`} />
        <AvatarFallback>{currentUser.displayName?.[0] || currentUser.email?.[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{currentUser.displayName || "User"}</p>
        <p className="text-xs text-muted-foreground capitalize">{currentUser.role}</p>
      </div>
      <Button variant="ghost" size="icon" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
