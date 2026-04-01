"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ParkingCircle, ArrowRight, Home, Mail, Lock } from "lucide-react";
import { useParkStore } from "@/hooks/use-park-store";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'customer';
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(defaultRole);
  
  const router = useRouter();
  const login = useParkStore(state => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(role, email, "Demo User");
    router.replace(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 space-y-6">
      <Button variant="ghost" asChild className="gap-2 self-start md:absolute md:top-8 md:left-8">
        <Link href="/">
          <Home className="h-4 w-4" /> Back to Home
        </Link>
      </Button>
      
      <Card className="w-full max-w-md shadow-2xl border-none bg-card/50 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary p-4 rounded-3xl shadow-xl shadow-primary/20 mb-6 w-fit">
            <ParkingCircle className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-black font-headline tracking-tight">Sign In</CardTitle>
          <CardDescription>Enter your credentials to access ParkWise</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label>Account Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                  <SelectItem value="customer">Driver (Customer)</SelectItem>
                  <SelectItem value="owner">Property Owner</SelectItem>
                  <SelectItem value="guard">Security Guard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="email"
                  className="pl-12 h-12 rounded-xl" 
                  placeholder="name@example.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  type="password"
                  className="pl-12 h-12 rounded-xl" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-lg font-black rounded-2xl shadow-lg mt-4 transition-all hover:scale-[1.02]">
              Sign In <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Sign up for free</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
