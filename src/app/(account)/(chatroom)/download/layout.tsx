import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Download App – Pharmazing",
  description: "Pharmazing Download App",
  keywords: ["pharmazing download app", "pharmazing"],
  creator: "pharmazing.ai",
  publisher: "pharmazing.ai",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://pharmazing.ai",
  },
};

export default async function DownloadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
