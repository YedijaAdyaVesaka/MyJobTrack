import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://my-job-track.vercel.app"),
  title: {
    default: "MyJobTrack — Lacak Lamaran Kerja",
    template: "%s | MyJobTrack",
  },
  description: "Catat, pantau, dan analisis progres lamaran kerja kamu di satu tempat.",
  openGraph: {
    title: "MyJobTrack — Lacak Lamaran Kerja",
    description: "Catat, pantau, dan analisis progres lamaran kerja kamu di satu tempat.",
    url: "https://my-job-track.vercel.app",
    siteName: "MyJobTrack",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

