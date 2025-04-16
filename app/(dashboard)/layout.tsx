import type { Metadata } from "next";
import "../globals.css";
import { Navbar } from "@/components/navbar";



export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div lang="en">
      <div>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
