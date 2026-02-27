
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ParkingCircle, Mail, Lock, LogIn, Home } from "lucide-react";
import { useParkStore } from "@/hooks/use-park-store";
import Link from "next/link";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get('role') || 'customer';
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const router = useRouter();
  const login = useParkStore(state => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Bypass all verification as requested
    login(requestedRole);
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
          <CardDescription>Sign in to your ParkWise account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" className="pl-10" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" className="pl-10" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-lg font-bold gap-2">
              <LogIn className="h-5 w-5" /> Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground w-full">
            Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Sign up</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
