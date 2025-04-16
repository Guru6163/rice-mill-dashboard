"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { redirect } from "next/navigation";

export default function Page() {
  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Redirect to the reports page if user is authenticated
        redirect("/reports");
      } else {
        // Redirect to login if user is not authenticated
        redirect("/login");
      }
    });

    // Cleanup the listener
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Loading...</p>
    </div>
  );
}
