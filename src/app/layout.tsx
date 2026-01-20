import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Niche Discovery Dashboard | Find Your Unique Voice",
  description:
    "Discover underserved content niches on TikTok, YouTube, and Instagram. Find your unique voice fast – no complicated analytics, just clear suggestions you can use today.",
  keywords: [
    "content creator",
    "niche finder",
    "TikTok",
    "YouTube",
    "Instagram",
    "Nigerian creators",
    "content ideas",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
