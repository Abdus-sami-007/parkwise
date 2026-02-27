
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ParkingCircle, LogIn, Home, User } from "lucide-react";
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
    // Simple entry: no database verification
    login(requestedRole, identifier || `${requestedRole}@example.com`, identifier || requestedRole);
    router.replace(`/dashboard/${requestedRole}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 space-y-4">
      <div className="w-full max-w-md flex justify-start">
        <Button variant="ghost" asChild className="gap-2 -ml-2">
          <Link href="/">
            <Home className="h-4 w-4" /> Back to Home
          </Link>
        </Button>
      </div>
      
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
              <ParkingCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Welcome Back</CardTitle>
          <CardDescription>Enter as a {requestedRole}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">Email or Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="identifier" 
                  className="pl-10" 
                  placeholder="Enter anything to enter..." 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value)} 
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-lg font-bold gap-2">
              <LogIn className="h-5 w-5" /> Enter Dashboard
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground w-full">
            Want a new profile? <Link href="/signup" className="text-primary font-bold hover:underline">Join now</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
