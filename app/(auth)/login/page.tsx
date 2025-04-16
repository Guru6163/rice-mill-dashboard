"use client";

import { auth, provider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in user:", user);
      router.push("/dashboard"); // or any authenticated page
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[340px] shadow-lg border">
        <CardHeader>
          <CardTitle className="text-xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <LogIn className="h-4 w-4" />
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
