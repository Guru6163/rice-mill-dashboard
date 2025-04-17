import { Inter } from "next/font/google"
import "./globals.css"

export const metadata = {
  title: "Sathya Rice Mill Dashboard",
  description: "Financial dashboard for Sathya Rice Mill",
};

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
