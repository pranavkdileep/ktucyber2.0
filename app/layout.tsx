import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/Footer";
import Providers from "@/components/ProgressBarProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'KtuCyber - Share and Discover Study Materials',
    template: '%s | KtuCyber',
  },
  description: 'A platform for students to share and discover notes, question papers, and other study materials. for or students of b tech computer science engineering (cyber security) in KTU university or any other university.',
  keywords: ['study notes', 'ktu', 'university', 'question papers', 'assignments','cyber security', 'students', 'education'],
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
        
        
        <Providers>
          {children}
        </Providers>
        <Footer/>
      </body>
    </html>
  );
}
