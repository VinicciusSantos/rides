"use client";

import "./globals.css";

import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { store } from "@/store";
import { Libraries, LoadScript } from "@react-google-maps/api";
import localFont from "next/font/local";
import { Provider as ReduxProvider } from "react-redux";
import { env, PublicEnvScript } from "next-runtime-env";

const googleImportedLibraries: Libraries = ["places"];

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PublicEnvScript />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider store={store}>
            <LoadScript
              googleMapsApiKey={env("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY")!}
              libraries={googleImportedLibraries}
            >
              {children}
              <Toaster />
            </LoadScript>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
