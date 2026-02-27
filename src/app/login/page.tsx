
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ParkingCircle, ArrowRight, Home, User } from "lucide-react";
import { useParkStore } from "@/hooks/use-park-store";
import Link from "next/link";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get('role') || 'customer';
  
  const [identifier, setIdentifier] = useState("");
  const router = useRouter();
  const login = useParkStore(state => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(requestedRole, identifier || `${requestedRole}@example.com`, identifier || requestedRole);
    router.replace(`/dashboard/${requestedRole}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 space-y-6">
      <Button variant="ghost" asChild className="gap-2 self-start md:absolute md:top-8 md:left-8">
        <Link href="/">
          <Home className="h-4 w-4" /> Back to Home
        </Link>
      </Button>
      
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary p-4 rounded-3xl shadow-xl shadow-primary/20 mb-6">
            <ParkingCircle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-black font-headline tracking-tight">System Entry</CardTitle>
          <CardDescription>Enter as a {requestedRole}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Email or Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-10 h-12" 
                  placeholder="e.g. demo_user" 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-bold rounded-xl shadow-lg">
              Enter Dashboard <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            No password required for prototype access.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
