// These styles apply to every route in the application
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { Metadata } from "next";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import AuthStatus from "@/components/auth-status";

import { Suspense } from "react";
import NavBar from "@/components/navBar";
import AuthProvider from "./context/AuthProvider";
import { getServerSession } from "next-auth";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const title = "Simple Nutrition";
const description = "An app to keep track of your daily nutritional intake.";

export const metadata: Metadata = {
  title,
  description,
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  metadataBase: new URL("https://simple-nutrition.vercel.app"),
};

export const viewport: Viewport = {
  themeColor: "#334155",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  return (
    <html lang="en" className="bg-primary text-white">
      <body className={inter.variable}>
        <AuthProvider>
          <Toaster />
          {/* <Suspense fallback="Loading..."> */}
          {/* <AuthStatus /> */}
          <main>
            <NavBar />
          </main>
          {/* </Suspense> */}
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  );
}
