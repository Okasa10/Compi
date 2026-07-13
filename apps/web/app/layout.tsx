import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compi",
  description: "A modern, open-source code editor built with web technologies.",};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
