import type { Metadata } from "next";
import "../globals.css";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 p-4 md:p-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
