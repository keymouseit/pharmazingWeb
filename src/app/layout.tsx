import type { Metadata } from "next";
import {
  ReduxProvider,
  MobileProvider,
  FirebaseProvider,
  TabletProvider,
} from "@/providers";
import "./globals.css";
// import Script from "next/script";

export const metadata: Metadata = {
  title: "Pharmazing",
  description: "Pharmazing",
  keywords: ["pharmazing"],
  icons: [
    {
      rel: "shortcut icon",
      type: "image/x-icon",
      url: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      type: "image/png",
      sizes: "76x76",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "mask-icon",
      type: "image/svg",
      color: "#5bbad5",
      url: "/safari-pinned-tab.svg",
    },
  ],
  manifest: "/site.webmanifest",
  creator: "pharmazing.ai",
  publisher: "pharmazing.ai",
  metadataBase: new URL("https://pharmazing.ai"),
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://pharmazing.ai",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        {/* <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=G-YOURS_TAG`}
        />
        <Script id="" strategy="lazyOnload">
          {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-YOURS_TAG', {
              page_path: window.location.pathname,
              });
          `}
        </Script> */}
        <FirebaseProvider>
          <ReduxProvider>
            <TabletProvider>
              <MobileProvider>{children}</MobileProvider>
            </TabletProvider>
          </ReduxProvider>
        </FirebaseProvider>
      </body>
    </html>
  );
}
