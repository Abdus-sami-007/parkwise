
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ParkingCircle, Mail, Lock, Loader2, AlertCircle, Home, RefreshCcw, Sparkles } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth, useFirestore } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get('role') || 'customer';
  
  const [email, setEmail] = useState(`${requestedRole}@parkwise.com`);
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<{title: string, message: string} | null>(null);
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleNameSakeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;

    setLoading(true);
    setErrorMessage(null);
    setStatus("Connecting to Database...");

    try {
      // 1. Name sake auth - usually fixed credentials for demo
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      
      setStatus("Verifying Profile...");
      const userDocRef = doc(db, "users", uid);
      const userSnap = await getDoc(userDocRef);
      
      if (!userSnap.exists()) {
        setStatus("Creating Name Sake Profile...");
        await setDoc(userDocRef, {
          uid,
          email,
          displayName: requestedRole.charAt(0).toUpperCase() + requestedRole.slice(1) + " Demo",
          role: requestedRole,
          createdAt: new Date().toISOString()
        });
      }

      toast({ title: "Welcome!", description: `Entering as ${requestedRole}...` });
      router.replace(`/dashboard/${requestedRole}`);
    } catch (error: any) {
      console.error("Login error:", error);
      setErrorMessage({ 
        title: "Connection Issue", 
        message: "Unable to verify credentials. Please try signing up if this is your first time or check domain authorization." 
      });
      setLoading(false);
      setStatus(null);
    }
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
          <CardTitle className="text-3xl font-bold font-headline">Name Sake Login</CardTitle>
          <CardDescription>Demo mode active for <strong>{requestedRole}</strong></CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{errorMessage.title}</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>{errorMessage.message}</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="h-7 text-[10px] uppercase font-bold border-destructive/20 hover:bg-destructive/10 text-destructive mt-2">
                  <RefreshCcw className="mr-1 h-3 w-3" /> Refresh
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {status && (
            <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg text-sm text-primary animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" />
              {status}
            </div>
          )}

          <form onSubmit={handleNameSakeLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" className="pl-10" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-lg font-bold gap-2" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <><Sparkles className="h-5 w-5" /> Quick Access</>}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground w-full">
            Want to use a different account? <Link href="/signup" className="text-primary font-bold hover:underline">Create One</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
