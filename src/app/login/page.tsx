"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ParkingCircle, Mail, Lock, Loader2, AlertCircle, WifiOff } from "lucide-react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth, useFirestore } from "@/firebase";
import { doc, getDoc, enableNetwork, disableNetwork } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
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
    setStatus("Authenticating...");

    try {
      // 1. Authenticate with Auth Service
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Attempt to fetch profile with a timeout
      setStatus("Connecting to profile database...");
      
      const userDocRef = doc(db, "users", userCredential.user.uid);
      
      // Firestore getDoc can hang if network is 'offline'
      // We wrap it in a promise that rejects after 10 seconds
      const profilePromise = getDoc(userDocRef);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("timeout")), 10000)
      );

      try {
        const userDoc = await Promise.race([profilePromise, timeoutPromise]) as any;
        
        if (userDoc && userDoc.exists()) {
          const userData = userDoc.data();
          toast({
            title: "Welcome back!",
            description: `Signed in as ${userData.displayName || 'User'}.`,
          });
          router.replace(`/dashboard/${userData.role}`);
        } else {
          setErrorMessage({
            title: "Profile Not Found",
            message: "Account authenticated, but no profile was found in Firestore. Please sign up again."
          });
          setLoading(false);
        }
      } catch (err: any) {
        if (err.message === "timeout") {
          setErrorMessage({
            title: "Database Timeout",
            message: "The authentication was successful, but the profile server is taking too long to respond. This usually happens in restricted networks. Please refresh and try again."
          });
        } else {
          throw err;
        }
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let title = "Login Failed";
      let message = "An unexpected error occurred.";
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "Invalid email or password. Please try again.";
      } else if (error.code === 'auth/network-request-failed') {
        title = "Network Error";
        message = "Check your internet connection or verify the Firebase API key.";
      } else {
        message = error.message || "Failed to sign in.";
      }
      
      setErrorMessage({ title, message });
      setLoading(false);
    } finally {
      setStatus(null);
    }
  };

  const loginWithGoogle = async () => {
    if (!auth || !db) return;
    setLoading(true);
    setErrorMessage(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userDocRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        router.push("/signup?step=role"); 
      } else {
        router.replace(`/dashboard/${userDoc.data().role}`);
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      setErrorMessage({
        title: "Google Sign-In Error",
        message: error.message || "Authentication failed."
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
              <ParkingCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold font-headline">Welcome back</CardTitle>
          <CardDescription>
            Access your ParkWise dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{errorMessage.title}</AlertTitle>
              <AlertDescription>{errorMessage.message}</AlertDescription>
            </Alert>
          )}

          {status && !errorMessage && (
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg text-sm text-muted-foreground animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" />
              {status}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="password" 
                  type="password" 
                  className="pl-10 h-11"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required 
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-11 text-lg font-bold" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Sign In"}
            </Button>
          </form>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" className="w-full h-11" onClick={loginWithGoogle} disabled={loading}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google Login
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Sign up now</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
