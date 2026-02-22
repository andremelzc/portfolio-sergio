import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sergio Melendez Cava",
  description: "Fotógrafo y artista visual",
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
