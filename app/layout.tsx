import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Seelenplan-Generator",
  description: "Errechnet und visiualisisert den Seelenplan",
};

const Header = () => (
  <header className="flex justify-between items-center p-4 bg-white border-b">
    <Link href="/" className="text-center leading-5">
      <Image src="/images/logo.jpg" alt="Logo" width={100} height={100} />
      {/* Seelenplan <br></br>Generator */}
    </Link>
    <div className="space-x-4">
      <Link href="/input" className="text-blue-500 hover:text-blue-700">
        Eingabe
      </Link>
      <Link href="/soulplan" className="text-blue-500 hover:text-blue-700">
        Seelenplan
      </Link>
    </div>
  </header>
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Header />
        <main className="max-w-[700px] mx-auto">{children}</main>
      </body>
    </html>
  );
}
