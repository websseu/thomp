import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Main from "@/components/Main";
import { YouTubePlayerProvider } from "@/context/YouTubePlayerContext";
import YouTubePlayer from "@/components/YouTubePlayer";

export const metadata: Metadata = {
  title: "KKKONG - Global Music Rankings",
  description:
    "KKoong is a website that provides real-time global music rankings. Discover the latest global music trends and popular tracks at a glance.",
  keywords: [
    "KKoong",
    "Global Music Rankings",
    "Music Charts",
    "Popular Music",
    "Latest Music Trends",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <YouTubePlayerProvider>
          <Header />
          <Main>{children}</Main>
          <Footer />
          <YouTubePlayer />
        </YouTubePlayerProvider>
      </body>
    </html>
  );
}
