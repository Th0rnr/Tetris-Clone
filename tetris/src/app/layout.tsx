import type { Metadata } from "next";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import { getUserFromToken } from "@/app/controllers/loginController";
import Navbar from "@/components/ui/Navbar";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Tetris Clone",
  description: "A modern Tetris clone built with Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");
  let user = null;

  if (token) {
    try {
      user = await getUserFromToken(token.value);
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-900`}
      >
        <Navbar user={user} />
        <main className="max-w-7xl mx-auto py-6 px-4">{children}</main>
      </body>
    </html>
  );
}
