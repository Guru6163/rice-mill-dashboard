import "./globals.css"

export const metadata = {
  title: 'Sathya MillBoard',
  description: 'Developed by GuruF',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
