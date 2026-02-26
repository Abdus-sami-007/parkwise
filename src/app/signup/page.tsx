"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ParkingCircle, Mail, Lock, User, Loader2, Phone, ArrowRight, AlertCircle } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuth, useFirestore } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<string>("customer");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{title: string, message: string} | null>(null);
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: name });

      // Create profile document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: role,
        phone: phone,
        createdAt: new Date().toISOString()
      });

      toast({
        title: "Account Created!",
        description: "Welcome to ParkWise. Getting things ready...",
      });

      // Navigate to correct dashboard
      router.replace(`/dashboard/${role}`);

    } catch (error: any) {
      console.error("Signup error:", error);
      let title = "Signup Failed";
      let message = "We couldn't create your account.";
      
      if (error.code === 'auth/email-already-in-use') {
        message = "This email is already registered.";
      } else if (error.code === 'auth/weak-password') {
        message = "Password must be at least 6 characters.";
      } else if (error.code === 'auth/network-request-failed' || error.message?.includes('offline')) {
        title = "Connection Timeout";
        message = "The request is taking too long. Please ensure your Firebase settings allow this domain.";
      } else {
        message = error.message || "An unexpected error occurred.";
      }
      
      setErrorMessage({ title, message });
    } finally {
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
          <CardTitle className="text-3xl font-bold font-headline">Join ParkWise</CardTitle>
          <CardDescription>
            Create an account to start managing your parking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{errorMessage.title}</AlertTitle>
                <AlertDescription>{errorMessage.message}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="role">User Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer">Driver (Book Parking)</SelectItem>
                  <SelectItem value="owner">Land Owner (List Property)</SelectItem>
                  <SelectItem value="guard">Security (Manage Patrols)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  className="pl-10 h-11"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required 
                />
              </div>
            </div>

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
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="phone" 
                  placeholder="+91 XXXXX XXXXX" 
                  className="pl-10 h-11"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  placeholder="••••••••"
                  className="pl-10 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required 
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-lg font-bold mt-4 gap-2" disabled={loading}>
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <>Create Account <ArrowRight className="h-5 w-5" /></>}
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
