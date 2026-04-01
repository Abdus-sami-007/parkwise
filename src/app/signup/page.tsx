"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ParkingCircle, ArrowRight, Home, User, Mail, Lock } from "lucide-react";
import { useParkStore } from "@/hooks/use-park-store";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("customer");
  
  const router = useRouter();
  const login = useParkStore(state => state.login);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate signup by logging in directly
    login(role, email, name);
    router.replace(`/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 space-y-4">
      <Button variant="ghost" asChild className="gap-2 self-start md:absolute md:top-8 md:left-8">
        <Link href="/">
          <Home className="h-4 w-4" /> Back to Home
        </Link>
      </Button>

      <Card className="w-full max-w-md shadow-2xl border-none bg-card/50 backdrop-blur-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary p-4 rounded-3xl shadow-xl shadow-primary/20 w-fit">
              <ParkingCircle className="h-10 w-10 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black font-headline tracking-tight">Join ParkWise</CardTitle>
          <CardDescription>Start managing or booking parking today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label>I want to join as a...</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-none shadow-2xl">
                  <SelectItem value="customer">Driver (Looking for parking)</SelectItem>
                  <SelectItem value="owner">Owner (Listing properties)</SelectItem>
                  <SelectItem value="guard">Guard (Monitoring traffic)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-12 h-12 rounded-xl" 
                  placeholder="John Doe" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
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
                  placeholder="Create a password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 text-lg font-black mt-4 rounded-2xl shadow-lg transition-all hover:scale-[1.02]">
              Create Account <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground w-full">
            Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
