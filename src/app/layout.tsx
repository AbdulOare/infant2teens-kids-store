import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | KidStore",
    default: "KidStore — Children's Fashion Nigeria",
  },
  description: "Premium kids fashion for infants, toddlers, and teens. Fast delivery across Nigeria.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
