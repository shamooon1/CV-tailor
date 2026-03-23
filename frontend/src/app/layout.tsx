import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CV Tailor Dashboard",
  description: "A premium AI-powered resume and cover letter generator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
          <Navbar />
          {children}
        </main>
      </body>
    </html>
  );
}
