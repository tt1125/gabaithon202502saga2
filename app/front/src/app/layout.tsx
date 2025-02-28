import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LayoutProvider } from "@/context/LayoutContext";
import { GoogleMapProvider } from "@/context/GoogleMapContext";
import { AuthProvider } from "@/context/AuthContext";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WalkBuddy",
  description: "WalkBuddy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppRouterCacheProvider>
          <AuthProvider>
            <LayoutProvider>
              <GoogleMapProvider>{children}</GoogleMapProvider>
            </LayoutProvider>
          </AuthProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
