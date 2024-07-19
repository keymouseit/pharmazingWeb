import type { Metadata } from "next";

import "./styles.css";

export const metadata: Metadata = {
  title: "Voice AI – Pharmazing",
  description: "Pharmazing Voice AI",
  keywords: ["pharmazing voice ai", "pharmazing"],
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

export default async function VoiceAiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
