import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: {
    default: "Tangkhul AI — Preserve. Teach. Evolve.",
    template: "%s | Tangkhul AI",
  },
  description:
    "A community-powered pre-training dataset platform to preserve the Tangkhul language. Contribute words, train AI, and keep a culture alive.",
  keywords: [
    "Tangkhul", "Tangkhul language", "Naga language", "Manipur", "Nagaland",
    "language preservation", "indigenous AI", "Tibeto-Burman", "Ukhrul",
    "Tangkhulic", "language dataset", "AI training", "Naga people",
  ],
  authors: [{ name: "Jihal Shimray", url: "https://instagram.com/itsnextgenfounder" }],
  creator: "Jihal Shimray — eX Holding",
  publisher: "Hashtagdropee",
  metadataBase: new URL("https://tangkhul-ai.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tangkhul-ai.vercel.app",
    siteName: "Tangkhul AI",
    title: "Tangkhul AI — Preserve. Teach. Evolve.",
    description:
      "A community-powered platform to preserve the Tangkhul language through AI. Contribute words, correct the AI, and keep a culture alive.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tangkhul AI — Community Language Preservation Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tangkhul AI — Preserve. Teach. Evolve.",
    description: "Community-powered AI platform to preserve the Tangkhul language of Manipur & Nagaland.",
    images: ["/og-image.png"],
    creator: "@itsnextgenfounder",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/icon-180x180.png", sizes: "180x180" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://tangkhul-ai.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0f1a12] text-[#f0ead8] font-sans">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#2d4a33] bg-[#0f1a12] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-[#a89f85] italic">
                &ldquo;A language lives as long as it is spoken, taught, and remembered.&rdquo;
              </p>
              <p className="text-sm text-center" style={{ color: "#a89f85" }}>
                Built with love for the Tangkhul people &middot; by{" "}
                <a
                  href="https://www.instagram.com/itsnextgenfounder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ color: "#c9a84c", textDecoration: "none" }}
                >
                  @itsnextgenfounder
                </a>
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}