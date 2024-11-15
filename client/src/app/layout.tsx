import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./redux";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TAS Project Management",
  description: "Projetada para gerenciar qualquer tipo de trabalho",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <StoreProvider>
          {children}
          <Toaster
            toastOptions={{
              style: { background: "#333", color: "#fff", fontSize: "14px" },
              duration: 3000,
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
