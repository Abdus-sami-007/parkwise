
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ParkingCircle, ArrowRight, Home } from "lucide-react";
import { useParkStore } from "@/hooks/use-park-store";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<string>("customer");
  
  const router = useRouter();
  const login = useParkStore(state => state.login);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Bypass all verification as requested
    login(role);
    router.replace(`/dashboard/${role}`);
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
          <CardTitle className="text-3xl font-bold font-headline">Join ParkWise</CardTitle>
          <CardDescription>Select your role and get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">User Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Driver (Customer)</SelectItem>
                  <SelectItem value="owner">Property Owner</SelectItem>
                  <SelectItem value="guard">Security Guard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <Button type="submit" className="w-full h-11 text-lg font-bold mt-4">
              Create Account <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground w-full">
            Already registered? <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
