import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/store/provider";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "IMBONI - AI Talent Intelligence",
  description:
    "An AI recruiter copilot that helps hiring teams move faster, stay fair, and keep every decision explainable.",
  applicationName: "IMBONI",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "IMBONI",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#312E81",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-white text-gray-900 antialiased">
        <AuthProvider>
          <StoreProvider>{children}</StoreProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
