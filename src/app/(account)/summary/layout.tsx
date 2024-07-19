import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard – Pharmzing",
    description: "Pharmazing dashboard",
    keywords: ["pharmazing tutorial", "pharmazing"],
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

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
