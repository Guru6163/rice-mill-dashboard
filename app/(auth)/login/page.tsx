"use client";

import { auth, provider } from "@/lib/firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in user:", user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      console.log("Logged in user:", user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging in with email:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
      <Card className="w-[360px] shadow-xl rounded-xl bg-white text-black">
        <CardHeader className="text-center py-4">
          <CardTitle className="text-2xl font-semibold">Login</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Google Sign-In Button */}
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3 p-3 text-sm font-medium border-2 rounded-lg bg-gray-50 hover:bg-gray-200"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <LogIn className="h-5 w-5 text-black" />
            {loading ? "Signing in..." : "Sign in with Google"}
          </Button>

          {/* OR divider */}
          <div className="flex items-center justify-between text-sm text-gray-400">
            <hr className="flex-1 border-gray-300" />
            <span className="mx-2">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Email and Password Fields */}
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <Button

            className="w-full p-3 text-sm font-medium bg-black text-white hover:bg-gray-800"
            onClick={handleEmailLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in with Email"}
          </Button>

          {/* Forgot Password Link */}
          <div className="text-center text-sm text-gray-500 mt-4">
            <Link href="/forgot-password" className="text-black hover:underline">
              Forgot your password?
            </Link>
          </div>

          <div className="text-center text-sm text-gray-500 mt-2">
            Don't have an account?{" "}
            <Link href="/signup" className="text-black hover:underline">
              Sign up here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
