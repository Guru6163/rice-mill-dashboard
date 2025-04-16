"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Import your Firebase auth object
import {
  Menu,
  Home,
  BarChart2,
  FileText,
  Settings,
  HelpCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Navigation items
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Reports", href: "/reports", icon: BarChart2 },
    // { name: "Settings", href: "/settings", icon: Settings },
    { name: "Logout", href: "#", icon: HelpCircle }, // Logout link
  ];

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase Authentication
      window.location.href = "/login"; // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white text-black shadow-md dark:bg-black dark:text-white">
      <div className="flex h-16 items-center justify-between px-4 md:px-10">
        {/* Brand */}
        <div className="w-full flex justify-between">
          <Link
            href="/"
            className="flex items-center space-x-3 text-lg tracking-tight text-primary dark:text-white"
          >
            <BarChart2 className="h-6 w-6" />
            <span className="mt-1">Mill Board</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center space-x-6">
            {navItems.map((item) =>
              item.name === "Logout" ? (
                <Button
                  key={item.name}
                  onClick={handleLogout}
                  variant="link"
                  className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors dark:text-zinc-400 dark:hover:text-white"
                >
                  {item.name}
                </Button>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors dark:text-zinc-400 dark:hover:text-white"
                >
                  {item.name}
                </Link>
              )
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md dark:text-white"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 sm:w-72 p-6 bg-white dark:bg-zinc-900 text-foreground dark:text-white"
            >
              <div className="flex flex-col gap-6">
                <Link
                  href="/"
                  className="flex items-center space-x-3 text-lg tracking-tight text-primary dark:text-white"
                >
                  <BarChart2 className="h-6 w-6" />
                  <span className="mt-1">Mill Board</span>
                </Link>
                <div className="flex flex-col gap-4">
                  {navItems.map((item) =>
                    item.name === "Logout" ? (
                      <Button
                        key={item.name}
                        onClick={handleLogout}
                        variant="link"
                        className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition dark:text-zinc-400 dark:hover:text-white"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    ) : (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-primary transition dark:text-zinc-400 dark:hover:text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
