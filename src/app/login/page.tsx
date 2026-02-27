
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ParkingCircle, Mail, Lock, Loader2, AlertCircle, Home, RefreshCcw } from "lucide-react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth, useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{title: string, message: string} | null>(null);
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Immediately verify profile exists in Firestore (Direct DB Check)
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        toast({ title: "Welcome back!", description: "Accessing your dashboard..." });
        router.replace(`/dashboard/${userData.role}`);
      } else {
        // Auth succeeded but no profile doc yet - redirect to layout for sync handling
        toast({ 
          title: "Profile Syncing", 
          description: "Authenticated successfully. Syncing profile data...",
          variant: "default"
        });
        router.replace(`/dashboard/customer`);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let title = "Sign-in Failed";
      let message = "Invalid email or password.";
      
      if (error.code === 'auth/unauthorized-domain') {
        message = "This domain is not authorized. Please add it to Authorized Domains in Firebase Console.";
      } else if (error.code === 'auth/network-request-failed') {
        message = "Network error. Firebase is unable to reach the server. Ensure long-polling is enabled.";
      } else if (error.code === 'auth/too-many-requests') {
        message = "Too many failed attempts. Please try again later.";
      }
      
      setErrorMessage({ title, message });
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!auth || !db) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, "users", result.user.uid));

      if (!userDoc.exists()) {
        router.push("/signup"); 
      } else {
        router.replace(`/dashboard/${userDoc.data().role}`);
      }
    } catch (error: any) {
      console.error("Google Auth error:", error);
      let message = error.message;
      if (error.code === 'auth/unauthorized-domain') {
        message = "Domain not authorized in Firebase Console.";
      }
      setErrorMessage({
        title: "Google Auth Failed",
        message
      });
      setLoading(false);
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
          <CardTitle className="text-3xl font-bold font-headline">Sign In</CardTitle>
          <CardDescription>Directly verifying with ParkWise Database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{errorMessage.title}</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>{errorMessage.message}</p>
                <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="h-7 text-[10px] uppercase font-bold border-destructive/20 hover:bg-destructive/10 text-destructive">
                  <RefreshCcw className="mr-1 h-3 w-3" /> Refresh Page
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" className="pl-10" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" className="pl-10" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-lg font-bold" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Sign In"}
            </Button>
          </form>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
          </div>

          <Button variant="outline" className="w-full h-11" onClick={loginWithGoogle} disabled={loading}>
            Continue with Google
          </Button>
        </CardContent>
        <CardFooter className="text-center">
          <p className="text-sm text-muted-foreground w-full">
            New here? <Link href="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
