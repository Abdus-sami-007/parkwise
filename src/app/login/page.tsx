"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ParkingCircle, Mail, Lock, Loader2, AlertCircle } from "lucide-react";
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDocRef = doc(db, "users", userCredential.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        router.replace(`/dashboard/${userData.role}`);
        toast({ title: "Welcome back!", description: "Successfully signed in." });
      } else {
        setErrorMessage({
          title: "Account Incomplete",
          message: "Auth successful, but no user profile found. Please contact support or try signing up."
        });
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let message = "Invalid email or password.";
      if (error.code === 'auth/unauthorized-domain') {
        message = "This domain is not authorized. Please add it to Firebase Auth settings.";
      } else if (error.code === 'auth/network-request-failed') {
        message = "Network error. Please check your connection.";
      }
      setErrorMessage({ title: "Sign-in Failed", message });
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    if (!auth || !db) return;
    setLoading(true);
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
      setErrorMessage({
        title: "Google Error",
        message: error.message || "Could not sign in with Google."
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
          <CardTitle className="text-3xl font-bold font-headline">Sign In</CardTitle>
          <CardDescription>Enter your email to access ParkWise</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{errorMessage.title}</AlertTitle>
              <AlertDescription>{errorMessage.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
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
